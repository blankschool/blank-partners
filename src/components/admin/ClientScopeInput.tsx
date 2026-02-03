import { Instagram, Video, Linkedin, Youtube, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface ClientScopeData {
  instagram: number;
  tiktok_posts: number;
  linkedin_posts: number;
  youtube_shorts: number;
  youtube_videos: number;
  recordings: number;
}

export const defaultScopeData: ClientScopeData = {
  instagram: 0,
  tiktok_posts: 0,
  linkedin_posts: 0,
  youtube_shorts: 0,
  youtube_videos: 0,
  recordings: 0,
};

interface ClientScopeInputProps {
  value: ClientScopeData;
  onChange: (value: ClientScopeData) => void;
}

export function ClientScopeInput({ value, onChange }: ClientScopeInputProps) {
  const handleChange = (field: keyof ClientScopeData, newValue: string) => {
    const numValue = parseInt(newValue) || 0;
    onChange({ ...value, [field]: Math.max(0, numValue) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        <span>Escopo de Entregas</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {/* Row 1: Instagram + TikTok */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Instagram className="h-4 w-4 text-pink-500" />
            <span>Instagram</span>
          </div>
          <div className="space-y-1">
            <Label htmlFor="instagram" className="text-xs text-muted-foreground">
              Conteúdos
            </Label>
            <Input
              id="instagram"
              type="number"
              min="0"
              value={value.instagram || ""}
              onChange={(e) => handleChange("instagram", e.target.value)}
              placeholder="0"
              className="h-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Video className="h-4 w-4" />
            <span>TikTok</span>
          </div>
          <div className="space-y-1">
            <Label htmlFor="tiktok_posts" className="text-xs text-muted-foreground">
              Posts
            </Label>
            <Input
              id="tiktok_posts"
              type="number"
              min="0"
              value={value.tiktok_posts || ""}
              onChange={(e) => handleChange("tiktok_posts", e.target.value)}
              placeholder="0"
              className="h-9"
            />
          </div>
        </div>
      </div>

      {/* Row 2: LinkedIn + YouTube Shorts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Linkedin className="h-4 w-4 text-blue-600" />
            <span>LinkedIn</span>
          </div>
          <div className="space-y-1">
            <Label htmlFor="linkedin_posts" className="text-xs text-muted-foreground">
              Posts
            </Label>
            <Input
              id="linkedin_posts"
              type="number"
              min="0"
              value={value.linkedin_posts || ""}
              onChange={(e) => handleChange("linkedin_posts", e.target.value)}
              placeholder="0"
              className="h-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Youtube className="h-4 w-4 text-red-500" />
            <span>YouTube Shorts</span>
          </div>
          <div className="space-y-1">
            <Label htmlFor="youtube_shorts" className="text-xs text-muted-foreground">
              Conteúdos
            </Label>
            <Input
              id="youtube_shorts"
              type="number"
              min="0"
              value={value.youtube_shorts || ""}
              onChange={(e) => handleChange("youtube_shorts", e.target.value)}
              placeholder="0"
              className="h-9"
            />
          </div>
        </div>
      </div>

      {/* Row 3: YouTube Videos + Gravações */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Youtube className="h-4 w-4 text-red-500" />
            <span>YouTube Videos</span>
          </div>
          <div className="space-y-1">
            <Label htmlFor="youtube_videos" className="text-xs text-muted-foreground">
              Conteúdos
            </Label>
            <Input
              id="youtube_videos"
              type="number"
              min="0"
              value={value.youtube_videos || ""}
              onChange={(e) => handleChange("youtube_videos", e.target.value)}
              placeholder="0"
              className="h-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Camera className="h-4 w-4 text-purple-500" />
            <span>Gravações</span>
          </div>
          <div className="space-y-1">
            <Label htmlFor="recordings" className="text-xs text-muted-foreground">
              Quantidade
            </Label>
            <Input
              id="recordings"
              type="number"
              min="0"
              value={value.recordings || ""}
              onChange={(e) => handleChange("recordings", e.target.value)}
              placeholder="0"
              className="h-9"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
