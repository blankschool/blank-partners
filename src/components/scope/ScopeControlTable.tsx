import { useState, useCallback } from "react";
import { Instagram, Video, Linkedin, Youtube, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ScopeControlData, ScopeActual } from "@/hooks/useScopeControl";

interface ScopeControlTableProps {
  data: ScopeControlData[];
  onUpdateActual: (params: {
    clientId: string;
    field: keyof Omit<ScopeActual, "id" | "client_id" | "month">;
    value: number;
  }) => void;
  isUpdating: boolean;
}

type ScopeField = "instagram" | "tiktok_posts" | "linkedin_posts" | "youtube_shorts" | "youtube_videos" | "recordings";

const scopeFields: { key: ScopeField; label: string; icon: React.ReactNode }[] = [
  { key: "instagram", label: "IG", icon: <Instagram className="h-3.5 w-3.5 text-pink-500" /> },
  { key: "tiktok_posts", label: "TT", icon: <Video className="h-3.5 w-3.5" /> },
  { key: "linkedin_posts", label: "LI", icon: <Linkedin className="h-3.5 w-3.5 text-blue-600" /> },
  { key: "youtube_shorts", label: "YTS", icon: <Youtube className="h-3.5 w-3.5 text-red-500" /> },
  { key: "youtube_videos", label: "YTV", icon: <Youtube className="h-3.5 w-3.5 text-red-500" /> },
  { key: "recordings", label: "Grav", icon: <Camera className="h-3.5 w-3.5 text-purple-500" /> },
];

export function ScopeControlTable({
  data,
  onUpdateActual,
  isUpdating,
}: ScopeControlTableProps) {
  const [pendingValues, setPendingValues] = useState<Record<string, Record<string, string>>>({});

  const getLocalValue = (clientId: string, field: string) => {
    return pendingValues[clientId]?.[field];
  };

  const handleChange = useCallback(
    (clientId: string, field: ScopeField, value: string) => {
      setPendingValues((prev) => ({
        ...prev,
        [clientId]: {
          ...prev[clientId],
          [field]: value,
        },
      }));
    },
    []
  );

  const handleBlur = useCallback(
    (clientId: string, field: ScopeField) => {
      const value = pendingValues[clientId]?.[field];
      if (value !== undefined) {
        const numValue = parseInt(value) || 0;
        onUpdateActual({ clientId, field, value: Math.max(0, numValue) });
        // Clear local value after save
        setPendingValues((prev) => {
          const { [clientId]: clientValues, ...rest } = prev;
          if (clientValues) {
            const { [field]: _, ...restFields } = clientValues;
            if (Object.keys(restFields).length > 0) {
              return { ...rest, [clientId]: restFields };
            }
          }
          return rest;
        });
      }
    },
    [pendingValues, onUpdateActual]
  );

  const getStatusColor = (planned: number, actual: number) => {
    if (actual === 0 && planned === 0) return "";
    if (actual === planned) return "bg-green-100 dark:bg-green-900/30";
    if (actual < planned) return "bg-yellow-100 dark:bg-yellow-900/30";
    return "bg-blue-100 dark:bg-blue-900/30";
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="sticky left-0 bg-muted/30 px-4 py-3 text-left font-medium text-muted-foreground">
                Cliente
              </th>
              {scopeFields.map((field) => (
                <th key={field.key} colSpan={2} className="px-2 py-3 text-center font-medium text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    {field.icon}
                    <span className="hidden sm:inline">{field.label}</span>
                  </div>
                </th>
              ))}
            </tr>
            <tr className="border-b border-border bg-muted/20">
              <th className="sticky left-0 bg-muted/20 px-4 py-2"></th>
              {scopeFields.map((field) => (
                <th key={`${field.key}-headers`} colSpan={2} className="px-1 py-2 text-center">
                  <div className="flex">
                    <span className="flex-1 text-xs text-muted-foreground">Plan</span>
                    <span className="flex-1 text-xs text-muted-foreground">Real</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item) => (
              <tr key={item.client.id} className="hover:bg-muted/30 transition-colors">
                <td className="sticky left-0 bg-card px-4 py-3 font-medium whitespace-nowrap">
                  {item.client.name}
                </td>
                {scopeFields.map((field) => {
                  const planned = item.client.scope?.[field.key] || 0;
                  const actual = item.actual?.[field.key] || 0;
                  const localValue = getLocalValue(item.client.id, field.key);
                  const displayValue = localValue !== undefined ? localValue : (actual ?? "");

                  return (
                    <td key={field.key} colSpan={2} className="px-1 py-2">
                      <div className="flex items-center gap-1">
                        <span className="w-8 text-center text-muted-foreground">
                          {planned}
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={displayValue}
                          onChange={(e) => handleChange(item.client.id, field.key, e.target.value)}
                          onBlur={() => handleBlur(item.client.id, field.key)}
                          disabled={isUpdating}
                          className={`h-8 w-14 text-center px-1 ${getStatusColor(planned, actual)}`}
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={1 + scopeFields.length * 2}
                  className="text-center py-12 text-muted-foreground"
                >
                  Nenhum cliente cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
