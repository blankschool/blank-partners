import { useRef } from "react";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface AvatarUploadProps {
  avatarUrl: string | null;
  fullName: string;
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

export function AvatarUpload({ avatarUrl, fullName, onUpload, isUploading }: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return;
    }

    await onUpload(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <Avatar className="h-24 w-24 ring-4 ring-border">
          <AvatarImage src={avatarUrl || ""} alt={fullName} />
          <AvatarFallback className="bg-secondary text-secondary-foreground text-2xl font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-accent-orange text-accent-orange-foreground shadow-md transition-transform hover:scale-105 disabled:opacity-50"
        >
          <Camera className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Photo"}
        </Button>
        <p className="text-xs text-muted-foreground">
          JPG, PNG or WEBP. Max 2MB.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
