import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MeetingCell } from "./MeetingCell";
import { MeetingLinkDialog } from "./MeetingLinkDialog";
import type { Meeting } from "@/hooks/useMeetings";

interface Client {
  id: string;
  name: string;
}

interface WeekDef {
  label: string;
  referenceDate: string;
}

interface MeetingTrackingTableProps {
  clients: Client[];
  meetings: Meeting[];
  weeks: WeekDef[];
  monthReferenceDate: string;
  onUpsert: (data: { client_id: string; meeting_period: "weekly" | "monthly"; meeting_date: string; meeting_link: string; title: string; description: string }) => void;
  onDelete: (id: string) => void;
  isSaving: boolean;
}

interface DialogState {
  clientId: string;
  clientName: string;
  period: "weekly" | "monthly";
  meetingDate: string;
  periodLabel: string;
  existing?: Meeting;
}

export function MeetingTrackingTable({ clients, meetings, weeks, monthReferenceDate, onUpsert, onDelete, isSaving }: MeetingTrackingTableProps) {
  const [dialog, setDialog] = useState<DialogState | null>(null);

  const meetingMap = useMemo(() => {
    const map = new Map<string, Meeting>();
    for (const m of meetings) {
      const dateStr = m.meeting_date?.split("T")[0] || "";
      const key = `${m.client_id}__${m.meeting_period}__${dateStr}`;
      map.set(key, m);
    }
    return map;
  }, [meetings]);

  const getMeeting = (clientId: string, period: string, refDate: string) => {
    return meetingMap.get(`${clientId}__${period}__${refDate}`);
  };

  const openDialog = (client: Client, period: "weekly" | "monthly", refDate: string, label: string) => {
    const existing = getMeeting(client.id, period, refDate);
    setDialog({
      clientId: client.id,
      clientName: client.name,
      period,
      meetingDate: refDate,
      periodLabel: label,
      existing,
    });
  };

  return (
    <>
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[180px]">Cliente</TableHead>
              {weeks.map((w) => (
                <TableHead key={w.referenceDate} className="text-center w-[80px]">{w.label}</TableHead>
              ))}
              <TableHead className="text-center w-[80px]">Mensal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={weeks.length + 2} className="text-center text-muted-foreground py-8">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  {weeks.map((w) => {
                    const meeting = getMeeting(client.id, "weekly", w.referenceDate);
                    return (
                      <TableCell key={w.referenceDate} className="text-center">
                        <div className="flex justify-center">
                          <MeetingCell
                            meeting={meeting}
                            onClick={() => openDialog(client, "weekly", w.referenceDate, w.label)}
                          />
                        </div>
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <MeetingCell
                        meeting={getMeeting(client.id, "monthly", monthReferenceDate)}
                        onClick={() => openDialog(client, "monthly", monthReferenceDate, "Mensal")}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {dialog && (
        <MeetingLinkDialog
          open={!!dialog}
          onOpenChange={(open) => !open && setDialog(null)}
          onSave={(data) => {
            onUpsert({
              client_id: dialog.clientId,
              meeting_period: dialog.period,
              meeting_date: data.meeting_date || dialog.meetingDate,
              meeting_link: data.meeting_link,
              title: data.title,
              description: data.description,
            });
            setDialog(null);
          }}
          onDelete={dialog.existing ? () => {
            onDelete(dialog.existing!.id);
            setDialog(null);
          } : undefined}
          isSaving={isSaving}
          initialLink={dialog.existing?.meeting_link || ""}
          initialTitle={dialog.existing?.title || ""}
          initialDescription={dialog.existing?.description || ""}
          initialMeetingDate={dialog.existing?.meeting_date?.split("T")[0] || dialog.meetingDate}
          clientName={dialog.clientName}
          periodLabel={dialog.periodLabel}
        />
      )}
    </>
  );
}
