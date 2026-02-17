
# Filtro de horizonte de tempo na pagina Dias de Protecao

## O que muda

Atualmente o horizonte de calculo e fixo em 14 dias. Sera adicionado um seletor de periodo que permite escolher quantos dias a frente considerar no calculo do CE (Conteudos Encaminhados), permitindo analises como "quantos dias de protecao tenho se considerar apenas os proximos 7 dias?".

## Opcoes de periodo

O seletor oferecera as seguintes opcoes:

- **7 dias** -- visao curta, urgencia imediata
- **14 dias** -- padrao atual
- **21 dias**
- **30 dias** -- visao ampla do pipeline

## Onde aparece na UI

O seletor ficara na barra de controles, ao lado do toggle "Mostrar apenas Ruim", como um grupo de botoes (toggle group) com as opcoes "7d", "14d", "21d", "30d". O valor padrao sera 14 dias.

```text
+--------------------------------------------------+
|  [KPI Cards]                                     |
+--------------------------------------------------+
|  [!] itens vencidos  |  Horizonte: [7d][14d*][21d][30d]  |  [x] Apenas Ruim |
+--------------------------------------------------+
|  Tabela ranking                                  |
+--------------------------------------------------+
```

## Detalhes tecnicos

### Arquivo alterado: `src/components/contents/ProtectionDaysFullPage.tsx`

1. Adicionar estado `horizonDays` com valor padrao 14
2. No `useMemo` de calculo, substituir `addDays(today, 14)` por `addDays(today, horizonDays)` e adicionar `horizonDays` nas dependencias
3. Adicionar um grupo de botoes (usando os componentes `Button` ja existentes com variante outline/default) na barra de controles entre o aviso de vencidos e o toggle "Mostrar apenas Ruim"
4. Cada botao mostra o label curto ("7d", "14d", "21d", "30d") e destaca o selecionado com variante `default` vs `outline`

### Nenhuma mudanca em outros arquivos

O calculo e autocontido no componente. A prop `allItems` permanece a mesma.
