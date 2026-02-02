export type ClientStatus =
  | "kickoff"
  | "diagnostico"
  | "apresentacao_planejamento"
  | "30d"
  | "60d"
  | "90d"
  | "ongoing"
  | "cancelado";

export interface ClientStatusConfig {
  value: ClientStatus;
  label: string;
  color: string;
}

export const clientStatusOptions: ClientStatusConfig[] = [
  { value: "kickoff", label: "Kickoff", color: "bg-blue-500" },
  { value: "diagnostico", label: "Diagnóstico", color: "bg-orange-500" },
  { value: "apresentacao_planejamento", label: "Apresentação de planejamento", color: "bg-purple-500" },
  { value: "30d", label: "30D", color: "bg-yellow-500" },
  { value: "60d", label: "60D", color: "bg-yellow-500" },
  { value: "90d", label: "90D", color: "bg-yellow-500" },
  { value: "ongoing", label: "Ongoing", color: "bg-green-500" },
  { value: "cancelado", label: "Cancelado", color: "bg-red-500" },
];

export const getStatusConfig = (status: ClientStatus | null | undefined): ClientStatusConfig => {
  return clientStatusOptions.find((s) => s.value === status) || clientStatusOptions[0];
};
