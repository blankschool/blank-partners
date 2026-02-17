
# Ajuste na coluna Detalhe: separar em Prontos, Em Criacao e Em Briefing

## O que muda

A coluna "Detalhe" da tabela de ranking atualmente mostra "Prontos: X | Em prod: Y". Sera alterada para mostrar tres contadores separados:

- **Prontos**: itens com status "pronto para postar"
- **Em criacao**: itens com status "edicao de video", "ajustes edicao de video", "criacao design" ou "ajustes criacao design"
- **Em briefing**: itens com status "em briefing"

## Detalhes tecnicos

### Arquivos alterados

**`src/components/contents/ProtectionDaysFullPage.tsx`**

1. Na interface `ClientProtection`, substituir `inProductionCount` por dois campos: `creationCount` e `briefingCount`
2. No `useMemo`, ao iterar os items do pipeline, contar separadamente:
   - `readyCount` (pronto para postar) -- ja existe
   - `creationCount` (edicao de video + ajustes edicao de video + criacao design + ajustes criacao design)
   - `briefingCount` (em briefing)
3. Na celula de detalhe da tabela (linha 316), mudar de `Prontos: X | Em prod: Y` para `Prontos: X | Em criacao: Y | Briefing: Z`

**`src/components/contents/ProtectionDaysPanel.tsx`**

Mesmo ajuste aplicado ao painel embutido (usado na aba Analise):
1. Substituir `inProductionCount` por `creationCount` e `briefingCount`
2. Atualizar contagem no useMemo
3. Atualizar texto da celula de detalhe
