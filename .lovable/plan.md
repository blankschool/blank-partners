

# Subpagina dedicada "Dias de Protecao"

## Objetivo

Extrair o painel de Dias de Protecao da aba Analise e transforma-lo numa pagina propria em `/contents/protection`, com indicadores maiores e filtragem por clientes ativos (status diferente de "cancelado" na tabela `clients` do Supabase).

## Mudancas

### 1. Nova pagina: `src/pages/ProtectionDays.tsx`

- Rota: `/contents/protection`
- Usa `AppLayout` com titulo "Dias de Protecao" e um botao de voltar para `/contents`
- Busca dados de conteudo via `useGoogleSheetsContent` (mesmo hook usado na pagina Contents)
- Busca clientes do Supabase via `useClients` para saber quais estao ativos (status != "cancelado")
- Filtra os items do Google Sheets para incluir apenas clientes cujo nome corresponde a um cliente ativo no Supabase
- Renderiza uma versao ampliada do `ProtectionDaysPanel`

### 2. Novo componente: `src/components/contents/ProtectionDaysFullPage.tsx`

Versao "full page" do painel, com layout mais generoso:

- **KPI cards grandes** no topo (grid de 4 colunas):
  - Excelente (verde) -- numero grande + label
  - Ok (amarelo) -- numero grande + label
  - Ruim (vermelho) -- numero grande + label
  - Sem calendario (cinza) -- numero grande + label
- Cada card funciona como toggle para filtrar a tabela abaixo
- Aviso de itens vencidos (discreto, abaixo dos KPIs)
- Toggle "Mostrar apenas Ruim"
- Tabela ranking igual a atual, mas com mais espaco

A logica de calculo sera reutilizada do `ProtectionDaysPanel` existente (extraida para um hook ou mantida inline).

### 3. Atualizar `src/App.tsx`

- Importar `ProtectionDays` (lazy ou direto)
- Adicionar rota `/contents/protection` dentro de `AdminRoute`

### 4. Atualizar `src/components/contents/ContentAnalysisPanel.tsx`

- Substituir o `ProtectionDaysPanel` embutido por um card-link que leva a `/contents/protection`
- Card com icone de Shield e texto "Dias de Protecao -- Ver painel completo"

### 5. Filtragem por cliente ativo

- O hook `useClients` retorna todos os clientes com seu campo `status`
- Clientes com `status === "cancelado"` serao excluidos
- A filtragem acontece na pagina `ProtectionDays.tsx`: cruza o nome do cliente nos items do Sheets com os nomes dos clientes ativos do Supabase
- Clientes que aparecem no Sheets mas nao existem no Supabase continuam visiveis (nao ha como saber se estao cancelados)

## Layout da pagina

```text
+--------------------------------------------------+
|  <- Voltar   |   Dias de Protecao                |
+--------------------------------------------------+
|  +----------+ +----------+ +----------+ +------+ |
|  |          | |          | |          | |      | |
|  |    12    | |     5    | |     3    | |   2  | |
|  | Excelente| |    Ok    | |   Ruim   | | S/Cal| |
|  +----------+ +----------+ +----------+ +------+ |
+--------------------------------------------------+
|  [!] 8 itens vencidos (excluidos do calculo)     |
|  [x] Mostrar apenas Ruim                        |
+--------------------------------------------------+
|  Cliente    | Dias de Protecao | Status | Detalhe|
|  Acme       |      1.2         | Ruim   | P:0 E:2|
|  Beta Co    |      4.5         | Ok     | P:2 E:3|
|  ...        |      ...         | ...    | ...    |
+--------------------------------------------------+
```

## Detalhes tecnicos

- Os KPIs usam o mesmo estilo visual dos cards da aba Analise (font-serif, texto grande 5xl, cores de fundo leves)
- O cruzamento de nomes entre Sheets e Supabase usa comparacao case-insensitive com `.toLowerCase().trim()`
- Nenhuma mudanca no sidebar -- o acesso e via link dentro de `/contents`
