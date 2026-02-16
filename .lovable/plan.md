

# Analise de Conteudos (dentro da pagina Contents)

## Abordagem

Adicionar uma secao de analise dentro da pagina de Conteudos existente, usando o componente `Tabs` para separar a visualizacao atual ("Painel") da nova visualizacao ("Analise"). Isso evita criar uma nova pagina e mantém tudo no mesmo contexto, com os mesmos filtros ja aplicados.

## Layout

A pagina de Conteudos ganha duas abas:
- **Painel**: conteudo atual (stats panel + filtros + calendario/grid/list)
- **Analise**: nova secao com indicadores focados

Na aba Analise, o usuario vera:

```text
+-----------------------------------------------------------+
| [Painel]  [Analise]                                        |
+-----------------------------------------------------------+
| Filtros (mesmos: responsavel, cliente, periodo, busca)     |
+-----------------------------------------------------------+
|  Edicao de Video          |  Criacao Design                |
|  [numero grande]          |  [numero grande]               |
|  conteudos nesta etapa    |  conteudos nesta etapa         |
+-----------------------------------------------------------+
| Detalhamento por cliente                                   |
| +-------------------------------------------------------+ |
| | Cliente      | Ed. Video | Cr. Design | Total Prod.   | |
| | Cliente A    |     3     |     2      |      5        | |
| | Cliente B    |     1     |     4      |      5        | |
| | ...          |           |            |               | |
| +-------------------------------------------------------+ |
+-----------------------------------------------------------+
```

Os dois cards principais contam conteudos cujo status normalizado e `edicao de video` ou `criacao design` (incluindo ajustes: `ajustes edicao de video` e `ajustes criacao design`).

A tabela abaixo detalha por cliente quantos conteudos estao em cada uma dessas etapas, permitindo identificar gargalos.

## Detalhes Tecnicos

### Arquivos

| Arquivo | Acao |
|---------|------|
| `src/components/contents/ContentAnalysisPanel.tsx` | Criar -- painel com 2 KPI cards + tabela por cliente |
| `src/pages/Contents.tsx` | Editar -- envolver conteudo em Tabs ("Painel" / "Analise"), mover filtros para fora das tabs para que se apliquem a ambas |

### Logica

- Os filtros (responsavel, cliente, periodo, busca) ficam acima das abas e se aplicam tanto ao Painel quanto a Analise
- O `ContentAnalysisPanel` recebe `itemsForStats` (ja filtrados) e calcula:
  - Count de items com `normalizeStatus(status)` em `['edicao de video', 'ajustes edicao de video']`
  - Count de items com `normalizeStatus(status)` em `['criacao design', 'ajustes criacao design']`
  - Agrupamento por `item.client` para a tabela detalhada
- Cards seguem o mesmo estilo do `StageStatsPanel`: label uppercase + numero serif grande + cores purple (video) e orange (design)
- Tabela usa o componente `Table` existente, com linhas ordenadas pelo total de producao (decrescente)

### Estilo

- KPI cards: `rounded-2xl border p-5`, grid de 2 colunas
- Card Edicao de Video: borda/fundo purple (coerente com o stage existente)
- Card Criacao Design: borda/fundo orange
- Tabela: `Card` com `Table` dentro, sem paginacao (lista de clientes e curta)

