import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Instagram, Video, Linkedin, Youtube, Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CHANNEL_CONFIG, type ClientScope, type ChannelCode } from "@/lib/scopeCalculations";

interface EditActualsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: ClientScope | null;
  month: Date;
  onSave: (clientId: string, values: Record<ChannelCode, number>) => Promise<void>;
  isLoading: boolean;
}

const channelIcons: Record<ChannelCode, React.ReactNode> = {
  instagram: <Instagram className="h-4 w-4 text-pink-500" />,
  tiktok_posts: <Video className="h-4 w-4" />,
  linkedin_posts: <Linkedin className="h-4 w-4 text-blue-600" />,
  youtube_shorts: <Youtube className="h-4 w-4 text-red-500" />,
  youtube_videos: <Youtube className="h-4 w-4 text-red-500" />,
  recordings: <Camera className="h-4 w-4 text-purple-500" />,
};

export function EditActualsDialog({
  open,
  onOpenChange,
  client,
  month,
  onSave,
  isLoading,
}: EditActualsDialogProps) {
  const [values, setValues] = useState<Record<ChannelCode, number>>({
    instagram: 0,
    tiktok_posts: 0,
    linkedin_posts: 0,
    youtube_shorts: 0,
    youtube_videos: 0,
    recordings: 0,
  });

  // Sync values when dialog opens with client data
  useEffect(() => {
    if (client && open) {
      const initialValues: Record<ChannelCode, number> = {
        instagram: 0,
        tiktok_posts: 0,
        linkedin_posts: 0,
        youtube_shorts: 0,
        youtube_videos: 0,
        recordings: 0,
      };
      client.by_channel.forEach((channel) => {
        initialValues[channel.code] = channel.actual;
      });
      setValues(initialValues);
    }
  }, [client, open]);

  const handleValueChange = (code: ChannelCode, value: string) => {
    const numValue = parseInt(value) || 0;
    setValues((prev) => ({ ...prev, [code]: Math.max(0, numValue) }));
  };

  const handleSave = async () => {
    if (!client) return;
    await onSave(client.client_id, values);
    onOpenChange(false);
  };

  if (!client) return null;

  const monthLabel = format(month, "MMMM yyyy", { locale: ptBR });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white text-gray-900 border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Editar Realizado</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            {client.client_name} • <span className="capitalize">{monthLabel}</span>
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-[1fr_80px_100px] gap-3 items-center text-sm font-medium text-gray-500 border-b border-gray-200 pb-2">
            <span>Canal</span>
            <span className="text-center">Planejado</span>
            <span className="text-center">Realizado</span>
          </div>

          {CHANNEL_CONFIG.map((config) => {
            const channelData = client.by_channel.find((c) => c.code === config.code);
            const planned = channelData?.planned || 0;

            return (
              <div
                key={config.code}
                className="grid grid-cols-[1fr_80px_100px] gap-3 items-center"
              >
                <div className="flex items-center gap-2">
                  {channelIcons[config.code]}
                  <span className="text-sm font-medium text-gray-900">{config.name}</span>
                </div>
                <div className="text-center text-sm text-gray-500 tabular-nums">
                  {planned}
                </div>
                <div>
                  <Label htmlFor={`input-${config.code}`} className="sr-only">
                    {config.name} realizado
                  </Label>
                  <Input
                    id={`input-${config.code}`}
                    type="number"
                    min="0"
                    value={values[config.code] || ""}
                    onChange={(e) => handleValueChange(config.code, e.target.value)}
                    placeholder="0"
                    className="h-9 text-center bg-white border-gray-300 text-gray-900"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-gray-900 text-white hover:bg-gray-800"
          >
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
