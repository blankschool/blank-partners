

# Pagina de Relatorios

## Contexto

A tabela `client_reports` ja existe no Supabase com as colunas solicitadas e RLS configurado (admin/agency gerencia tudo, clientes veem apenas os seus). Nenhuma migration e necessaria.

## Arquivos a Criar

| Arquivo | Descricao |
|---------|-----------|
| `src/pages/Reports.tsx` | Pagina principal de relatorios |
| `src/hooks/useReports.tsx` | Hook para CRUD de relatorios |
| `src/components/reports/ReportCard.tsx` | Card de exibicao de cada relatorio |
| `src/components/reports/ReportFilters.tsx` | Filtros (busca, periodo, cliente) |
| `src/components/reports/CreateReportDialog.tsx` | Dialog para criar/editar relatorio |
| `src/components/reports/ReportDetailDialog.tsx` | Dialog para visualizar relatorio completo |

## Arquivos a Modificar

| Arquivo | Mudanca |
|---------|---------|
| `src/App.tsx` | Adicionar rota `/reports` com `AdminRoute` |
| `src/components/layout/AppSidebar.tsx` | Adicionar "Relatorios" no menu admin com icone `ClipboardList` |

## Detalhes Tecnicos

### 1. useReports.tsx

Hook com react-query para:
- **Listar** relatorios com join no nome do cliente (`clients.name`)
- **Criar** relatorio (title, content, report_period = "weekly" | "monthly", client_id, created_by = auth.uid)
- **Atualizar** relatorio
- **Excluir** relatorio
- Invalidar queries apos mutations

### 2. Reports.tsx (Pagina)

Layout seguindo o padrao existente (como ScopeControl):
- Header com icone + titulo "Relatorios" + subtitulo
- Botao "Novo Relatorio" no header
- Filtros: busca por titulo, filtro por periodo (Todos/Semanal/Mensal), filtro por cliente
- Grid de cards dos relatorios
- Estados: loading spinner, empty state, lista

### 3. ReportCard.tsx

Card mostrando:
- Titulo do relatorio
- Nome do cliente
- Badge de periodo (Weekly = "Semanal", Monthly = "Mensal")
- Data de criacao formatada
- Preview do conteudo (truncado)
- Botoes: Ver, Editar, Excluir

### 4. CreateReportDialog.tsx

Dialog com formulario:
- Select de cliente (busca da tabela `clients`)
- Input de titulo
- Textarea de conteudo
- RadioGroup para periodo: "weekly" ou "monthly"
- Botoes Cancelar / Salvar

### 5. ReportDetailDialog.tsx

Dialog de leitura mostrando o relatorio completo:
- Titulo, cliente, periodo, data
- Conteudo completo renderizado

### 6. ReportFilters.tsx

Barra de filtros:
- Input de busca por titulo
- Select de periodo (Todos / Semanal / Mensal)
- Select de cliente (Todos / lista de clientes)

### 7. Rota e Navegacao

- Rota: `/reports` protegida com `AdminRoute`
- Sidebar: item "Relatorios" no array `adminNavigationItems` com icone `ClipboardList`

## Fluxo do Usuario

```text
1. Admin acessa "Relatorios" no menu lateral
2. Ve lista de relatorios com filtros
3. Clica "Novo Relatorio" -> dialog de criacao
4. Seleciona cliente, preenche titulo/conteudo, escolhe periodo
5. Salva -> card aparece na lista
6. Pode clicar para ver, editar ou excluir
```

