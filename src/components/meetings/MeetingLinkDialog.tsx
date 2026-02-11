import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink } from "lucide-react";

interface MeetingLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { meeting_link: string; title: string }) => void;
  onDelete?: () => void;
  isSaving: boolean;
  initialLink?: string;
  initialTitle?: string;
  clientName: string;
  periodLabel: string;
}

export function MeetingLinkDialog({
  open, onOpenChange, onSave, onDelete, isSaving,
  initialLink = "", initialTitle = "", clientName, periodLabel,
}: MeetingLinkDialogProps) {
  const [link, setLink] = useState(initialLink);
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    setLink(initialLink);
    setTitle(initialTitle);
  }, [initialLink, initialTitle, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!link.trim()) return;
    onSave({ meeting_link: link.trim(), title: title.trim() });
  };

  const isEditing = !!initialLink;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white text-gray-900 border-gray-200 [&>button]:text-gray-500 [&>button]:hover:text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900">{isEditing ? "Editar Reunião" : "Adicionar Reunião"}</DialogTitle>
          <p className="text-sm text-gray-500">{clientName} — {periodLabel}</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-700">Link da Reunião *</Label>
            <Input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://meet.google.com/..."
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700">Título / Observação</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Opcional"
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <DialogFooter className="flex gap-2">
            {isEditing && onDelete && (
              <Button type="button" variant="destructive" size="sm" onClick={onDelete} className="mr-auto">
                Remover
              </Button>
            )}
            {isEditing && (
              <Button type="button" variant="outline" size="sm" onClick={() => window.open(link, "_blank")} className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50">
                <ExternalLink className="mr-1 h-4 w-4" />
                Abrir
              </Button>
            )}
            <Button type="submit" disabled={isSaving || !link.trim()} className="bg-gray-900 text-white hover:bg-gray-800">
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
