

# Visao de Adiantamento de Conteudo na aba Analise

## Resumo

Adicionar uma secao de "Adiantamento de Conteudo" abaixo dos KPIs atuais na aba Analise. Essa secao traz indicadores acionaveis sobre cobertura futura, gargalos e confiabilidade dos dados, usando tanto os dados da Google Sheets (para tiers e cobertura) quanto a tabela `painel_de_conteudos` do Supabase (para aging via `updated_at`).

## O que sera implementado (e o que nao)

### Implementavel com os dados atuais

| Bloco | Fonte de dados | Motivo |
|---|---|---|
| A) Readiness Tiers (A/B/C) | Google Sheets | Usa apenas status + data |
| B) Cobertura 7/14 dias | Google Sheets | Usa apenas status + data |
| C) Ready-Equivalent (RE) | Google Sheets | Derivado dos tiers |
| F) Higiene do dado | Google Sheets | Usa status + data (logica ja existe no tab Pendentes) |
| E) Gargalos (aging) | Supabase `painel_de_conteudos` | Usa `updated_at` como proxy de `last_status_change_at` |

### NAO implementavel agora (proposta futura)

| Bloco | Motivo |
|---|---|
| D) Fluxo semanal (throughput) | Nao existe historico de transicoes. Seria necessario criar uma tabela `status_history` com trigger no `painel_de_conteudos`. Isso pode ser uma fase 2. |

## Arquitetura

### Novo hook: `src/hooks/useContentReadiness.tsx`

Busca dados da tabela `painel_de_conteudos` do Supabase para o calculo de aging (precisa de `updated_at`). Os demais calculos (tiers, RE, cobertura) usam os items ja disponiveis via Google Sheets.

### Novo componente: `src/components/contents/ReadinessDashboard.tsx`

Componente principal que recebe `items: ContentItem[]` (da Sheets) e renderiza os 4 blocos. Internamente busca dados do Supabase para aging.

## Layout dos blocos

```text
+============================================+
|  SECAO EXISTENTE: KPIs (Video, Design,     |
|  Briefing, Pronto) + Calendario + Tabela   |
+============================================+

+============================================+
|  NOVA SECAO: Adiantamento de Conteudo      |
+--------------------------------------------+
|                                            |
|  BLOCO 1: Protecao proximos 7/14 dias      |
|  +--------+--------+--------+--------+    |
|  | Tier A | Tier B | Tier C | RE     |    |
|  | 7d/14d | 7d/14d | 7d/14d | 7d/14d |    |
|  +--------+--------+--------+--------+    |
|  + "Dias cobertos so com Tier A"           |
|                                            |
+--------------------------------------------+
|                                            |
|  BLOCO 2: Gargalos                         |
|  Tabela: Etapa | Aging medio | P90         |
|  + Ranking clientes com maior aging        |
|                                            |
+--------------------------------------------+
|                                            |
|  BLOCO 3: Higiene do dado                  |
|  Taxa de higiene (% itens passados ok)     |
|  Lista de itens "Vencido (revisar)"        |
|                                            |
+--------------------------------------------+
|                                            |
|  BLOCO 4: Como interpretar (ajuda)         |
|  Explicacao do racional: tiers, RE,        |
|  janelas 7/14, por que higiene importa     |
|                                            |
+============================================+
```

## Detalhes tecnicos

### 1. Classificacao de Tiers

Usando `normalizeStatus()` ja existente:

- **Tier A (Excelente)**: `["pronto para postar"]`
- **Tier B (Bom)**: `["edicao de video", "ajustes edicao de video", "criacao design", "ajustes criacao design"]`
- **Tier C (Ok)**: `["em briefing"]`

### 2. Regra de Higiene (hygiene_state)

Para cada item:
- Se `normalizeStatus(status)` e `"publicado"` ou `"cancelado"` -> **Final** (ignorar)
- Se `date < hoje` e nao e Final -> **Vencido (revisar)** (NAO conta nos tiers)
- Se `date >= hoje` -> **Ok** (conta nos tiers)

Isso garante que conteudos com datas passadas e status antigo nao "inflam" o adiantamento.

### 3. Cobertura por janela

Para cada janela (7d e 14d), contar items com `date` dentro da janela, `hygiene_state === "Ok"`, agrupados por tier. Mostrar por cliente com filtro.

### 4. Ready-Equivalent (RE)

```
RE = 1.0 * countTierA + 0.7 * countTierB + 0.5 * countTierC
```

Calculado para janelas de 7 e 14 dias.

### 5. "Dias cobertos so com Tier A"

Contar quantos dias consecutivos a partir de hoje possuem pelo menos 1 item Tier A (pronto para postar) com `hygiene_state === "Ok"`.

### 6. Aging (Gargalos)

Fonte: tabela `painel_de_conteudos` (Supabase).

```
aging = hoje - updated_at (em dias)
```

Filtrar apenas itens com status em Tier B ou C (etapas de producao ativas). Calcular aging medio e P90 por etapa e por cliente.

Alertas configurados com defaults:
- Briefing parado > 3 dias
- Design parado > 5 dias
- Edicao parada > 5 dias

### 7. Secao de ajuda (Collapsible)

Um bloco "Como interpretar" usando o componente Collapsible ja existente, explicando:
- Por que tiers existem (priorizar o que esta mais adiantado)
- Por que janela 7/14 e mais util que "no mes" (evita falsa sensacao de seguranca)
- Por que RE funciona (indice unico ponderado para comparar clientes)
- Por que higiene e requisito (dados sujos = decisoes erradas)

## Arquivos alterados

| Arquivo | Acao |
|---|---|
| `src/hooks/useContentReadiness.tsx` | **Criar** - Hook para buscar aging do Supabase |
| `src/components/contents/ReadinessDashboard.tsx` | **Criar** - Componente principal com os 4 blocos |
| `src/components/contents/ContentAnalysisPanel.tsx` | **Editar** - Importar e renderizar `ReadinessDashboard` abaixo da tabela existente |

## Sobre o Fluxo Semanal (Fase 2 - nao implementado agora)

Para implementar as metricas de throughput (itens que viraram "Pronto" na semana, publicados, cancelados, reagendados), seria necessario:

1. Criar uma tabela `content_status_history` com trigger no `painel_de_conteudos` que registra cada mudanca de status
2. Com esse historico, calcular transicoes semanais

Isso pode ser adicionado depois sem impacto na estrutura atual.

