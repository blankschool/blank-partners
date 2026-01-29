import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MoreHorizontal, Users, Calendar, Briefcase } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TeamMember } from "@/hooks/useTeamMembers";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TeamMemberCardProps {
  member: TeamMember;
  onEdit?: (member: TeamMember) => void;
  onDelete?: (member: TeamMember) => void;
  isAdmin?: boolean;
}

export function TeamMemberCard({ member, onEdit, onDelete, isAdmin }: TeamMemberCardProps) {
  const initials = member.full_name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const getSeniorityColor = (seniority: string | null) => {
    switch (seniority) {
      case "Sênior":
        return "bg-success/10 text-success border-success/20";
      case "Pleno":
        return "bg-accent-orange/10 text-accent-orange border-accent-orange/20";
      case "Júnior":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "";
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      return format(parseISO(dateStr), "dd MMM yyyy", { locale: ptBR });
    } catch {
      return null;
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="" />
              <AvatarFallback className="bg-chart-3 text-primary-foreground font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-foreground">{member.full_name}</h3>
              <p className="text-sm text-muted-foreground">{member.position || "Sem cargo"}</p>
            </div>
          </div>
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(member)}>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete?.(member)}
                  className="text-destructive focus:text-destructive"
                >
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            {member.email}
          </div>
          {member.leader && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              Líder: {member.leader.full_name}
            </div>
          )}
          {member.start_date && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Início: {formatDate(member.start_date)}
            </div>
          )}
          {member.squad && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              Squad: {member.squad}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {member.area && (
            <Badge variant="secondary">{member.area}</Badge>
          )}
          {member.seniority && (
            <Badge variant="outline" className={getSeniorityColor(member.seniority)}>
              {member.seniority}
            </Badge>
          )}
        </div>

        {member.clients.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">Clientes:</p>
            <div className="flex flex-wrap gap-1">
              {member.clients.slice(0, 3).map((client) => (
                <Badge key={client.id} variant="outline" className="text-xs">
                  {client.name}
                </Badge>
              ))}
              {member.clients.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{member.clients.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
