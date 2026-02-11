import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, FileText } from "lucide-react";
import type { Report } from "@/hooks/useReports";

interface MeetingLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { meeting_link: string; title: string; description: string; meeting_date: string; report_id: string | null }) => void;
  onDelete?: () => void;
  isSaving: boolean;
  initialLink?: string;
  initialTitle?: string;
  initialDescription?: string;
  initialMeetingDate?: string;
  initialReportId?: string | null;
  clientName: string;
  periodLabel: string;
  clientReports?: Report[];
}

export function MeetingLinkDialog({
  open, onOpenChange, onSave, onDelete, isSaving,
  initialLink = "", initialTitle = "", initialDescription = "", initialMeetingDate = "",
  initialReportId = null,
  clientName, periodLabel, clientReports = [],
}: MeetingLinkDialogProps) {
  const [link, setLink] = useState(initialLink);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [meetingDate, setMeetingDate] = useState(initialMeetingDate);
  const [reportId, setReportId] = useState<string | null>(initialReportId);

  useEffect(() => {
    setLink(initialLink);
    setTitle(initialTitle);
    setDescription(initialDescription);
    setMeetingDate(initialMeetingDate);
    setReportId(initialReportId);
  }, [initialLink, initialTitle, initialDescription, initialMeetingDate, initialReportId, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      meeting_date: meetingDate,
      meeting_link: link.trim(),
      report_id: reportId || null,
    });
  };

  const isEditing = !!initialTitle;
  const selectedReport = clientReports.find(r => r.id === reportId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white text-gray-900 border-gray-200 [&>button]:text-gray-500 [&>button]:hover:text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900">{isEditing ? "Editar Reunião" : "Adicionar Reunião"}</DialogTitle>
          <p className="text-sm text-gray-500">{clientName} — {periodLabel}</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-700">Título *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Reunião de alinhamento"
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700">Descrição</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Observações sobre a reunião (opcional)"
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700">Data da Reunião</Label>
            <Input
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              className="bg-gray-50 border-gray-300 text-gray-900"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700">Link da Reunião</Label>
            <Input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://meet.google.com/... (opcional)"
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700">Relatório vinculado</Label>
            <Select
              value={reportId || "none"}
              onValueChange={(val) => setReportId(val === "none" ? null : val)}
            >
              <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900">
                <SelectValue placeholder="Nenhum" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="none" className="text-gray-500">Nenhum</SelectItem>
                {clientReports.map((r) => (
                  <SelectItem key={r.id} value={r.id} className="text-gray-900">
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-3 w-3 text-gray-400" />
                      {r.title || (r.report_link ? r.report_link.substring(0, 40) + '...' : 'Relatório sem título')}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedReport?.report_link && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1 border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => window.open(selectedReport.report_link!, "_blank")}
              >
                <ExternalLink className="mr-1 h-3.5 w-3.5" />
                Abrir relatório
              </Button>
            )}
          </div>
          <DialogFooter className="flex gap-2">
            {isEditing && onDelete && (
              <Button type="button" variant="destructive" size="sm" onClick={onDelete} className="mr-auto">
                Remover
              </Button>
            )}
            {isEditing && link.trim() && (
              <Button type="button" variant="outline" size="sm" onClick={() => window.open(link, "_blank")} className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50">
                <ExternalLink className="mr-1 h-4 w-4" />
                Abrir
              </Button>
            )}
            <Button type="submit" disabled={isSaving || !title.trim()} className="bg-gray-900 text-white hover:bg-gray-800">
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
