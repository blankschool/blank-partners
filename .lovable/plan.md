
# Nova aba "Pendente de Status" na pagina de Conteudos

## Objetivo

Criar uma terceira aba chamada "Pendente de Status" que lista todos os conteudos cuja data ja passou (anterior a hoje) e cujo status nao e "publicado" nem "cancelado". Esses sao conteudos que precisam ter seu status atualizado.

## Logica de filtragem

Um conteudo e "pendente de status" quando:
1. Tem uma data definida
2. A data e **anterior a hoje** (estritamente antes do inicio do dia atual)
3. O status normalizado **nao e** `publicado` nem `cancelado`

## Mudancas

### 1. Novo componente: `src/components/contents/PendingStatusPanel.tsx`

- Recebe `items: ContentItem[]` (ja pre-filtrados pelos filtros globais de cliente, pessoa e busca), `viewMode` e `onDayClick`
- Internamente filtra os items pela logica de pendencia descrita acima
- Mostra um KPI card com a contagem total de pendentes e um breakdown por cliente (tabela simples)
- Abaixo, renderiza calendario ou lista conforme o `viewMode`, reutilizando `ContentCalendar`, `ContentCard` e `ContentPagination`

### 2. Atualizar `src/pages/Contents.tsx`

- Importar o novo componente e o icone `AlertTriangle` do lucide-react
- Adicionar um terceiro `TabsTrigger` com valor `"pendentes"` e label "Pendente de Status"
- Adicionar o `TabsContent` correspondente renderizando `PendingStatusPanel`
- Passar `itemsForStats` (que ja tem filtros de busca, cliente, pessoa e data) para o painel
- Ocultar o filtro de etapa quando `activeTab === "pendentes"` (ja existe a prop `showStageFilter`)
- Incluir `DayContentDialog` para interacao com o calendario nessa aba

### 3. Atualizar `src/components/contents/ContentFilters.tsx`

- Nenhuma mudanca estrutural necessaria; a prop `showStageFilter` ja existe e sera reutilizada

## Detalhes do componente PendingStatusPanel

```text
+------------------------------------------+
|  [KPI: X conteudos pendentes]            |
+------------------------------------------+
|  Calendario ou Lista (conforme viewMode) |
+------------------------------------------+
|  Tabela: Detalhamento por cliente        |
|  Cliente | Qtd Pendente                  |
+------------------------------------------+
```

- O KPI card tera estilo amarelo/amber para indicar alerta
- A tabela ordena clientes por quantidade de pendentes (maior primeiro)
- Na lista, cada item mostra cliente, formato, etapa atual, data e link

## Fluxo

1. Usuario clica na aba "Pendente de Status"
2. Os filtros globais (cliente, pessoa, busca, periodo) continuam funcionando
3. O filtro de etapa fica oculto (nao faz sentido nesse contexto)
4. O painel mostra apenas conteudos com data passada e status diferente de publicado/cancelado
5. O usuario pode alternar entre calendario e lista para visualizar os pendentes
