

# Redesign da Pagina de Relatorios - Tracking Semanal e Mensal

## Contexto

Atualmente a pagina de Relatorios funciona como um CRUD generico de relatorios. O usuario precisa de algo diferente: um **painel de acompanhamento** onde ele veja, para cada cliente, se os relatorios semanal e mensal de cada periodo ja foram feitos, e possa **anexar um link** ao relatorio correspondente.

## Mudanca no Banco de Dados (Migration)

A tabela `client_reports` precisa de duas novas colunas:

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| `report_link` | text (nullable) | URL/link do relatorio externo |
| `reference_date` | date (not null) | Data de referencia do periodo (inicio da semana ou primeiro dia do mes) |

Tambem adicionar uma constraint UNIQUE em `(client_id, report_period, reference_date)` para evitar duplicatas (apenas 1 relatorio semanal por semana por cliente, e 1 mensal por mes por cliente).

```text
ALTER TABLE client_reports ADD COLUMN report_link text;
ALTER TABLE client_reports ADD COLUMN reference_date date;

-- Para registros existentes, preencher com created_at
UPDATE client_reports SET reference_date = created_at::date WHERE reference_date IS NULL;

ALTER TABLE client_reports ALTER COLUMN reference_date SET NOT NULL;

-- Evitar duplicatas
ALTER TABLE client_reports ADD CONSTRAINT client_reports_unique_period 
  UNIQUE (client_id, report_period, reference_date);
```

## Nova Interface - Painel de Tracking

A pagina vai mudar de um grid de cards para uma **tabela de acompanhamento** organizada por periodo.

### Layout Principal

1. **Header** - Titulo "Relatorios" + subtitulo
2. **Seletor de Periodo** - Navegacao por mes (similar ao ScopeControl), mostrando as semanas do mes selecionado
3. **Tabela de Tracking** com:
   - **Linhas** = Clientes (todos os clientes ativos)
   - **Colunas** = Semanas do mes (Sem 1, Sem 2, Sem 3, Sem 4/5) + coluna "Mensal"
   - **Celulas** = Status do relatorio (pendente / feito com link)

### Interacao nas Celulas

- **Celula vazia (pendente)**: icone cinza de "pendente", ao clicar abre dialog para adicionar link
- **Celula preenchida (feito)**: icone verde de "check" com link clicavel, ao clicar abre opcoes (editar link, abrir link, remover)

### Dialog de Adicionar/Editar Link

- Campo: URL do relatorio (input type url)
- Campo opcional: Titulo/observacao
- Botoes: Cancelar / Salvar

## Arquivos a Modificar

| Arquivo | Mudanca |
|---------|---------|
| `src/hooks/useReports.tsx` | Adaptar para novo schema (report_link, reference_date), criar/atualizar com link |
| `src/pages/Reports.tsx` | Redesign completo - tabela de tracking por mes |
| `src/components/reports/CreateReportDialog.tsx` | Simplificar - agora e apenas campo de link + titulo opcional |
| `src/components/reports/ReportDetailDialog.tsx` | Remover (nao necessario no novo formato) |
| `src/components/reports/ReportCard.tsx` | Remover (substituido pela tabela) |
| `src/components/reports/ReportFilters.tsx` | Remover (substituido pelo seletor de mes) |

## Arquivos a Criar

| Arquivo | Descricao |
|---------|-----------|
| `src/components/reports/ReportTrackingTable.tsx` | Tabela principal com clientes x semanas/mes |
| `src/components/reports/ReportCell.tsx` | Celula individual mostrando status (pendente/feito) |
| `src/components/reports/ReportLinkDialog.tsx` | Dialog para adicionar/editar link do relatorio |
| `src/components/reports/ReportMonthSelector.tsx` | Seletor de mes (reutilizando padrao do ScopeControl) |

## Detalhes Tecnicos

### Calculo das Semanas

Para cada mes selecionado, calcular as semanas usando `date-fns`:
- Semana 1: dias 1-7
- Semana 2: dias 8-14
- Semana 3: dias 15-21
- Semana 4+: dias 22-fim do mes

A `reference_date` para semanais sera a segunda-feira da semana (`startOfWeek`). Para mensais sera o primeiro dia do mes (`startOfMonth`).

### ReportTrackingTable

Busca todos os clientes e todos os reports do mes selecionado. Cruza os dados para mostrar quais celulas estao preenchidas e quais estao pendentes.

### Fluxo do Usuario

```text
1. Admin abre "Relatorios"
2. Ve tabela com todos os clientes nas linhas
3. Colunas mostram Sem1, Sem2, Sem3, Sem4, Mensal
4. Celulas verdes = relatorio feito (com link)
5. Celulas cinzas = pendente
6. Clica numa celula pendente -> dialog para colar o link
7. Salva -> celula fica verde, link acessivel
8. Clica numa celula preenchida -> opcao de abrir link ou editar
```

## Resumo Visual

```text
+------------------+--------+--------+--------+--------+---------+
|     Cliente      | Sem 1  | Sem 2  | Sem 3  | Sem 4  | Mensal  |
+------------------+--------+--------+--------+--------+---------+
| Cliente Alpha    |   OK   |   OK   |   --   |   --   |   OK    |
| Cliente Beta     |   OK   |   --   |   --   |   --   |   --    |
| Cliente Gamma    |   OK   |   OK   |   OK   |   --   |   --    |
+------------------+--------+--------+--------+--------+---------+
```

