

# Indicador "Dias de Protecao" na aba Analise

## O que e

Um ranking de clientes mostrando quantos dias de conteudo cada um tem "cobertos" no pipeline. Clientes com poucos dias de protecao precisam de atencao imediata.

## Como funciona o calculo

Para cada cliente:

1. **Itens vencidos** (higiene): data anterior a hoje e status diferente de "publicado", "cancelado" ou "reagendado". Esses sao sinalizados e excluidos do calculo.

2. **Conteudos encaminhados (CE)**: itens com data entre hoje e hoje+14 dias, status em ["pronto para postar", "edicao de video", "ajustes edicao de video", "criacao design", "ajustes criacao design", "em briefing"], e que nao sejam vencidos. Cada item recebe um peso interno (nao visivel na UI):
   - Pronto para postar = 1.0
   - Edicao de Video / Criacao Design (e ajustes) = 0.7
   - Em Briefing = 0.5
   - CE = soma dos pesos

3. **Ritmo (posts por dia)**: total de conteudos agendados nos ultimos 28 dias / 28.

4. **Dias de Protecao**: CE / posts_por_dia. Se posts_por_dia = 0, mostra "Sem calendario".

5. **Classificacao**:
   - Excelente (verde): >= 7 dias
   - Ok (amarelo): >= 3 e < 7
   - Ruim (vermelho): < 3

## Mudancas

### 1. Novo componente: `src/components/contents/ProtectionDaysPanel.tsx`

- Recebe `items: ContentItem[]` (todos os items, sem filtro de data, para poder calcular o ritmo dos ultimos 28 dias)
- Calcula internamente para cada cliente: CE, posts_por_dia, dias_protecao, classificacao, contagem de vencidos
- UI:
  - Toggle/filtro rapido: "Mostrar apenas Ruim"
  - KPI resumo no topo: total de clientes, quantidade por classificacao (Excelente/Ok/Ruim)
  - Aviso discreto com quantidade total de itens "Vencido (revisar)"
  - Tabela ranking:
    - Cliente | Dias de Protecao (numero grande) | Status (badge colorido) | Detalhe pequeno ("Prontos: X | Em producao: Y")
  - Ordenado por dias de protecao crescente (piores primeiro)

### 2. Atualizar `src/components/contents/ContentAnalysisPanel.tsx`

- Importar e renderizar `ProtectionDaysPanel` como uma nova secao ao final do componente, **antes** da tabela de detalhamento
- Passar `items` (prop original, sem filtro de activeStages) para que o calculo de ritmo use o historico completo

### 3. Atualizar `src/pages/Contents.tsx`

- Nenhuma mudanca estrutural. O `ContentAnalysisPanel` ja recebe `itemsForStats`, que nao filtra por data quando `periodType === "all"`. Porem, para o calculo de ritmo (ultimos 28 dias) precisamos dos items **sem filtro de periodo**.
- Passar uma nova prop `allItems` (todos os items, filtrados apenas por cliente/pessoa/busca, sem filtro de data) para o `ContentAnalysisPanel`, que repassara ao `ProtectionDaysPanel`.

## Layout na aba Analise

```text
+------------------------------------------+
|  [KPI Cards: Video | Design | Briefing   |
|   | Pronto para Postar]  (toggles)       |
+------------------------------------------+
|  Calendario ou Lista (filtrado)          |
+------------------------------------------+
|  DIAS DE PROTECAO                        |
|  [Resumo: X Excelente | Y Ok | Z Ruim]  |
|  [Toggle: Mostrar apenas Ruim]           |
|  [Aviso: N itens vencidos]               |
|  +--------------------------------------+|
|  | Cliente | Dias | Status | Detalhe    ||
|  | ...     | 2.1  | Ruim   | P:1 Prod:3||
|  +--------------------------------------+|
+------------------------------------------+
|  Detalhamento por cliente (tabela atual) |
+------------------------------------------+
```

## Detalhes tecnicos do componente ProtectionDaysPanel

- Usa `date-fns` para comparacoes de data (`startOfToday`, `addDays`, `subDays`, `isBefore`, `isWithinInterval`)
- Reutiliza `normalizeStatus` de `contentStages.ts`
- Status que contam como "encaminhado": `pronto para postar`, `edicao de video`, `ajustes edicao de video`, `criacao design`, `ajustes criacao design`, `em briefing`
- Status finais (ignorados para vencido): `publicado`, `cancelado`, `reagendado`
- Badge de classificacao usa as mesmas cores do design system: verde para Excelente, amarelo para Ok, vermelho para Ruim
- Numeros de "Dias de Protecao" mostrados com 1 casa decimal
- Tabela ordena por dias_protecao crescente (clientes em pior situacao no topo)

