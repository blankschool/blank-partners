

# Adicionar Botao "Abrir Relatorio" no Dialog

## Problema

Quando o usuario edita um relatorio que ja tem link, nao ha como abrir o link diretamente pelo dialog.

## Mudanca

Arquivo: `src/components/reports/ReportLinkDialog.tsx`

Adicionar um botao "Abrir Relatorio" com icone `ExternalLink` no footer do dialog, visivel apenas quando estiver editando (quando `initialLink` existe). O botao abre o link em nova aba via `window.open`.

## Detalhes

- Posicionar entre o botao "Remover" e "Cancelar"
- Estilo: `variant="outline"` com icone `ExternalLink`
- Texto: "Abrir"
- Acao: `window.open(link, "_blank")`
- Visivel apenas no modo edicao (`isEditing = true`)

