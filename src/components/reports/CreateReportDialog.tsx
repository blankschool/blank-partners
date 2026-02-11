import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Report } from "@/hooks/useReports";

interface Client {
  id: string;
  name: string;
}

interface CreateReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { client_id: string; title: string; content: string; report_period: "weekly" | "monthly"; id?: string }) => void;
  isSaving: boolean;
  clients: Client[];
  editingReport?: Report | null;
}

export function CreateReportDialog({ open, onOpenChange, onSave, isSaving, clients, editingReport }: CreateReportDialogProps) {
  const [clientId, setClientId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");

  useEffect(() => {
    if (editingReport) {
      setClientId(editingReport.client_id);
      setTitle(editingReport.title);
      setContent(editingReport.content);
      setPeriod((editingReport.report_period as "weekly" | "monthly") || "weekly");
    } else {
      setClientId("");
      setTitle("");
      setContent("");
      setPeriod("weekly");
    }
  }, [editingReport, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !title.trim() || !content.trim()) return;
    onSave({
      client_id: clientId,
      title: title.trim(),
      content: content.trim(),
      report_period: period,
      ...(editingReport ? { id: editingReport.id } : {}),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingReport ? "Editar Relatório" : "Novo Relatório"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Cliente</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título do relatório" />
          </div>
          <div className="space-y-2">
            <Label>Conteúdo</Label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Escreva o conteúdo..." rows={6} />
          </div>
          <div className="space-y-2">
            <Label>Período</Label>
            <RadioGroup value={period} onValueChange={(v) => setPeriod(v as "weekly" | "monthly")} className="flex gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly" className="cursor-pointer">Semanal</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly" className="cursor-pointer">Mensal</Label>
              </div>
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSaving || !clientId || !title.trim() || !content.trim()}>
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
