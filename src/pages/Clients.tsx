import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, MoreHorizontal, Users } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { Skeleton } from "@/components/ui/skeleton";

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: clients, isLoading, error } = useClients();

  const filteredClients = clients?.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const totalClients = clients?.length || 0;
  const clientsWithMembers = clients?.filter((c) => c.member_count > 0).length || 0;
  const clientsWithoutMembers = clients?.filter((c) => c.member_count === 0).length || 0;

  if (error) {
    return (
      <AppLayout title="Clientes">
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">Erro ao carregar clientes: {error.message}</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Clientes">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar clientes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Cliente
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Total de Clientes</p>
              {isLoading ? (
                <Skeleton className="h-12 w-16 mt-2" />
              ) : (
                <p className="mt-2 font-serif text-5xl font-normal tracking-tight text-foreground">{totalClients}</p>
              )}
              <p className="mt-2 text-sm text-muted-foreground">Cadastrados no sistema</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Com Equipe</p>
              {isLoading ? (
                <Skeleton className="h-12 w-16 mt-2" />
              ) : (
                <p className="mt-2 font-serif text-5xl font-normal tracking-tight text-success">{clientsWithMembers}</p>
              )}
              <p className="mt-2 text-sm text-muted-foreground">Clientes com membros atribuídos</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Sem Equipe</p>
              {isLoading ? (
                <Skeleton className="h-12 w-16 mt-2" />
              ) : (
                <p className="mt-2 font-serif text-5xl font-normal tracking-tight text-warning">{clientsWithoutMembers}</p>
              )}
              <p className="mt-2 text-sm text-muted-foreground">Aguardando atribuição</p>
            </CardContent>
          </Card>
        </div>

        {/* Clients List */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Todos os Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-lg border border-border p-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-48 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-foreground text-background font-medium">
                        {getInitials(client.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{client.name}</h3>
                      <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {client.member_count > 0 ? (
                          <span className="truncate">
                            {client.members.map((m) => m.full_name.split(" ")[0]).join(", ")}
                          </span>
                        ) : (
                          <span className="italic">Sem membros atribuídos</span>
                        )}
                      </div>
                    </div>

                    <div className="text-right hidden sm:block">
                      <p className="text-lg font-semibold text-foreground">{client.member_count}</p>
                      <p className="text-xs text-muted-foreground">
                        {client.member_count === 1 ? "membro" : "membros"}
                      </p>
                    </div>

                    <Button variant="ghost" size="icon" className="shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {filteredClients.length === 0 && !isLoading && (
                  <div className="py-8 text-center text-muted-foreground">
                    Nenhum cliente encontrado
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Clients;
