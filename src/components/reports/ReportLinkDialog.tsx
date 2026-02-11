import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ReportLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { report_link: string; title: string }) => void;
  onDelete?: () => void;
  isSaving: boolean;
  initialLink?: string;
  initialTitle?: string;
  clientName: string;
  periodLabel: string;
}

export function ReportLinkDialog({
  open, onOpenChange, onSave, onDelete, isSaving,
  initialLink = "", initialTitle = "", clientName, periodLabel,
}: ReportLinkDialogProps) {
  const [link, setLink] = useState(initialLink);
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    setLink(initialLink);
    setTitle(initialTitle);
  }, [initialLink, initialTitle, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!link.trim()) return;
    onSave({ report_link: link.trim(), title: title.trim() });
  };

  const isEditing = !!initialLink;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Relatório" : "Adicionar Relatório"}</DialogTitle>
          <p className="text-sm text-muted-foreground">{clientName} — {periodLabel}</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Link do Relatório *</Label>
            <Input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label>Título / Observação</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Opcional"
            />
          </div>
          <DialogFooter className="flex gap-2">
            {isEditing && onDelete && (
              <Button type="button" variant="destructive" size="sm" onClick={onDelete} className="mr-auto">
                Remover
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSaving || !link.trim()}>
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
