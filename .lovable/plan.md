

# Pagina de Controle de Producao (Kanban)

## Resumo

Nova pagina "/production" com visualizacao Kanban para organizar demandas de criacao por editor/designer. Os conteudos da tabela `painel_de_conteudos` aparecem aqui, mas com uma camada de dados separada que controla: qual editor esta atribuido, em qual dia da semana, e qual o status de producao -- sem alterar o status original do conteudo.

## Estrutura de Dados

Uma nova tabela `production_assignments` armazena a atribuicao de cada conteudo a um membro da equipe de criacao, com dia da semana e semana de referencia:

```text
production_assignments
- id (uuid, PK)
- content_id (text, FK -> painel_de_conteudos."id do conteudo")
- team_member_id (uuid, FK -> team_members.id)
- week_start (date) -- segunda-feira da semana de referencia
- day_of_week (integer) -- 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex
- production_status (text) -- status opcional interno (ex: "a fazer", "em andamento", "concluido")
- sort_order (integer) -- posicao do card na coluna
- created_at, updated_at
- UNIQUE(content_id, week_start) -- um conteudo so aparece uma vez por semana
```

Politicas RLS: admin e agency podem ler/escrever; clientes nao veem esta tabela.

## Membros da Equipe de Criacao

A query usara `team_members WHERE area = 'Criacao'`, que ja possui 13 membros (editores de video, designers, coordenadores). Um dropdown no topo da pagina permite selecionar o membro.

## Layout da Pagina

```text
+-------------------------------------------------------------+
| [icon] Controle de Producao                                  |
| Organize as demandas de criacao por editor e dia da semana   |
|                                                               |
| [Membro: Gabriel de Oliveira v] [< Sem 10-14 Fev 2026 >]   |
| [Filtro de etapas: v]                                        |
+-------------------------------------------------------------+
|  Nao alocado  |  Segunda  |  Terca  |  Quarta  | Quinta | Sexta |
|  (backlog)    |   10/02   |  11/02  |  12/02   | 13/02  | 14/02 |
| +----------+  | +------+  |         |          |        |       |
| | Card     |  | | Card |  |         |          |        |       |
| | Cliente  |  | +------+  |         |          |        |       |
| | Estagio  |  |            |         |          |        |       |
| +----------+  |            |         |          |        |       |
+-------------------------------------------------------------+
```

- **Coluna "Nao alocado"**: conteudos que ainda nao foram atribuidos a nenhum dia (backlog)
- **Colunas Seg-Sex**: conteudos atribuidos para cada dia
- **Cards**: mostram cliente, titulo/formato, estagio atual (do conteudo original), e badge de plataforma
- **Drag & drop**: arrastar cards entre colunas para atribuir/realocar

## Cards de Conteudo

Cada card mostra:
- Nome do cliente (bold)
- Formato (ex: Reels, Carrossel)
- Estagio atual do conteudo (badge colorido usando o sistema de stages existente)
- Plataforma (badge pequeno)

## Fluxo de Interacao

1. Usuario seleciona um membro da equipe de Criacao
2. Sistema busca conteudos em etapas de criacao (ou todos, via filtro)
3. Conteudos sem atribuicao para aquele membro aparecem na coluna "Nao alocado"
4. SM arrasta card para a coluna do dia desejado -- isso cria/atualiza um registro em `production_assignments`
5. O estagio original do conteudo (em `painel_de_conteudos`) nao e alterado

## Arquivos

| Arquivo | Acao |
|---------|------|
| **Migracao SQL** | Criar tabela `production_assignments` com RLS |
| `src/pages/Production.tsx` | Criar - pagina principal com Kanban |
| `src/hooks/useProductionBoard.tsx` | Criar - hook para buscar e gerenciar assignments |
| `src/components/production/ProductionKanbanColumn.tsx` | Criar - coluna do Kanban |
| `src/components/production/ProductionCard.tsx` | Criar - card de conteudo |
| `src/components/production/ProductionFilters.tsx` | Criar - filtros (membro, semana, etapas) |
| `src/components/production/WeekSelector.tsx` | Criar - navegacao de semanas |
| `src/App.tsx` | Editar - adicionar rota /production |
| `src/components/layout/AppSidebar.tsx` | Editar - adicionar link "Producao" no menu |

## Drag and Drop

Implementacao nativa com HTML5 Drag and Drop API (sem biblioteca extra):
- `draggable` nos cards
- `onDragStart` / `onDragOver` / `onDrop` nas colunas
- Ao soltar, faz upsert em `production_assignments` com o novo `day_of_week`
- Atualiza o cache do React Query otimisticamente

## Detalhes Tecnicos

- Os conteudos virao da tabela `painel_de_conteudos` (ja tem RLS para leitura autenticada)
- O filtro de etapas usa as mesmas etapas definidas em `contentStages.ts`
- Seletor de semana calcula segunda a sexta da semana selecionada
- Acesso restrito a admin (AdminRoute), seguindo o padrao da pagina Contents
- A tabela `production_assignments` nao altera nenhum dado em `painel_de_conteudos`

