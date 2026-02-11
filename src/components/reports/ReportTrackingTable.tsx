import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReportCell } from "./ReportCell";
import { ReportLinkDialog } from "./ReportLinkDialog";
import type { Report } from "@/hooks/useReports";

interface Client {
  id: string;
  name: string;
}

interface WeekDef {
  label: string;
  referenceDate: string; // YYYY-MM-DD (first day of that week range)
}

interface ReportTrackingTableProps {
  clients: Client[];
  reports: Report[];
  weeks: WeekDef[];
  monthReferenceDate: string; // YYYY-MM-DD (1st of month)
  onUpsert: (data: { client_id: string; report_period: "weekly" | "monthly"; reference_date: string; report_link: string; title: string }) => void;
  onDelete: (id: string) => void;
  isSaving: boolean;
}

interface DialogState {
  clientId: string;
  clientName: string;
  period: "weekly" | "monthly";
  referenceDate: string;
  periodLabel: string;
  existing?: Report;
}

export function ReportTrackingTable({ clients, reports, weeks, monthReferenceDate, onUpsert, onDelete, isSaving }: ReportTrackingTableProps) {
  const [dialog, setDialog] = useState<DialogState | null>(null);

  // Index reports by key for fast lookup
  const reportMap = useMemo(() => {
    const map = new Map<string, Report>();
    for (const r of reports) {
      const key = `${r.client_id}__${r.report_period}__${r.reference_date}`;
      map.set(key, r);
    }
    return map;
  }, [reports]);

  const getReport = (clientId: string, period: string, refDate: string) => {
    return reportMap.get(`${clientId}__${period}__${refDate}`);
  };

  const openDialog = (client: Client, period: "weekly" | "monthly", refDate: string, label: string) => {
    const existing = getReport(client.id, period, refDate);
    setDialog({
      clientId: client.id,
      clientName: client.name,
      period,
      referenceDate: refDate,
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
                    const report = getReport(client.id, "weekly", w.referenceDate);
                    return (
                      <TableCell key={w.referenceDate} className="text-center">
                        <div className="flex justify-center">
                          <ReportCell
                            report={report}
                            onClick={() => openDialog(client, "weekly", w.referenceDate, w.label)}
                          />
                        </div>
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <ReportCell
                        report={getReport(client.id, "monthly", monthReferenceDate)}
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
        <ReportLinkDialog
          open={!!dialog}
          onOpenChange={(open) => !open && setDialog(null)}
          onSave={(data) => {
            onUpsert({
              client_id: dialog.clientId,
              report_period: dialog.period,
              reference_date: dialog.referenceDate,
              report_link: data.report_link,
              title: data.title,
            });
            setDialog(null);
          }}
          onDelete={dialog.existing ? () => {
            onDelete(dialog.existing!.id);
            setDialog(null);
          } : undefined}
          isSaving={isSaving}
          initialLink={dialog.existing?.report_link || ""}
          initialTitle={dialog.existing?.title || ""}
          clientName={dialog.clientName}
          periodLabel={dialog.periodLabel}
        />
      )}
    </>
  );
}
