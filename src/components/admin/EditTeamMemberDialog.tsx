import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import type { TeamType, SeniorityLevel } from "@/hooks/useUsers";
import type { Client, TeamMember } from "@/hooks/useTeamMembers";
import { TEAMS } from "@/hooks/useUsers";
import { SENIORITY_LEVELS } from "@/hooks/useTeamMembers";

interface EditTeamMemberDialogProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    id: string;
    full_name: string;
    email: string;
    birth_date?: string | null;
    start_date?: string | null;
    area?: TeamType | null;
    position?: string | null;
    seniority?: SeniorityLevel | null;
    leader_id?: string | null;
    squad?: string | null;
    client_ids?: string[];
  }) => void;
  clients: Client[];
  leaders: TeamMember[];
  isLoading: boolean;
}

export function EditTeamMemberDialog({
  member,
  open,
  onOpenChange,
  onSave,
  clients,
  leaders,
  isLoading,
}: EditTeamMemberDialogProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [area, setArea] = useState<TeamType | null>(null);
  const [position, setPosition] = useState("");
  const [seniority, setSeniority] = useState<SeniorityLevel | null>(null);
  const [leaderId, setLeaderId] = useState<string | null>(null);
  const [squad, setSquad] = useState("");
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);

  useEffect(() => {
    if (member) {
      setFullName(member.full_name);
      setEmail(member.email);
      setBirthDate(member.birth_date || "");
      setStartDate(member.start_date || "");
      setArea(member.area);
      setPosition(member.position || "");
      setSeniority(member.seniority);
      setLeaderId(member.leader_id);
      setSquad(member.squad || "");
      setSelectedClientIds(member.clients.map((c) => c.id));
    }
  }, [member]);

  const handleSave = () => {
    if (member && fullName.trim() && email.trim()) {
      onSave({
        id: member.id,
        full_name: fullName.trim(),
        email: email.trim(),
        birth_date: birthDate || null,
        start_date: startDate || null,
        area,
        position: position.trim() || null,
        seniority,
        leader_id: leaderId,
        squad: squad.trim() || null,
        client_ids: selectedClientIds,
      });
      onOpenChange(false);
    }
  };

  const toggleClient = (clientId: string) => {
    setSelectedClientIds((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  // Filter out the current member from leaders list
  const availableLeaders = leaders.filter((l) => l.id !== member?.id);

  const inputClassName = "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400";
  const labelClassName = "text-gray-700";
  const selectTriggerClassName = "bg-white border-gray-300 text-gray-900";
  const selectContentClassName = "bg-white border-gray-200 text-gray-900 z-50";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] bg-white text-gray-900 border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Editar Membro da Equipe</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className={labelClassName}>Nome Completo *</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nome completo"
                  className={inputClassName}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className={labelClassName}>Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate" className={labelClassName}>Data de Nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className={inputClassName}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate" className={labelClassName}>Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="area" className={labelClassName}>Área</Label>
                <Select
                  value={area ?? "none"}
                  onValueChange={(value) =>
                    setArea(value === "none" ? null : (value as TeamType))
                  }
                >
                  <SelectTrigger className={selectTriggerClassName}>
                    <SelectValue placeholder="Selecionar área" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClassName}>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    {TEAMS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seniority" className={labelClassName}>Senioridade</Label>
                <Select
                  value={seniority ?? "none"}
                  onValueChange={(value) =>
                    setSeniority(value === "none" ? null : (value as SeniorityLevel))
                  }
                >
                  <SelectTrigger className={selectTriggerClassName}>
                    <SelectValue placeholder="Selecionar senioridade" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClassName}>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    {SENIORITY_LEVELS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position" className={labelClassName}>Cargo</Label>
                <Input
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Ex: Designer, Desenvolvedor"
                  className={inputClassName}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="squad" className={labelClassName}>Squad</Label>
                <Input
                  id="squad"
                  value={squad}
                  onChange={(e) => setSquad(e.target.value)}
                  placeholder="Nome do squad"
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leader" className={labelClassName}>Líder</Label>
              <Select
                value={leaderId ?? "none"}
                onValueChange={(value) =>
                  setLeaderId(value === "none" ? null : value)
                }
              >
                <SelectTrigger className={selectTriggerClassName}>
                  <SelectValue placeholder="Selecionar líder" />
                </SelectTrigger>
                <SelectContent className={selectContentClassName}>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {availableLeaders.map((leader) => (
                    <SelectItem key={leader.id} value={leader.id}>
                      {leader.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Clientes</Label>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 max-h-40 overflow-y-auto">
                {clients.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhum cliente disponível</p>
                ) : (
                  <div className="space-y-2">
                    {clients.map((client) => (
                      <div key={client.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-client-${client.id}`}
                          checked={selectedClientIds.includes(client.id)}
                          onCheckedChange={() => toggleClient(client.id)}
                        />
                        <label
                          htmlFor={`edit-client-${client.id}`}
                          className="text-sm text-gray-700 cursor-pointer"
                        >
                          {client.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !fullName.trim() || !email.trim()}
            className="bg-gray-900 text-white hover:bg-gray-800"
          >
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
