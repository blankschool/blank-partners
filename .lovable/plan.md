

# Ajuste Estetico do Dialog de Relatorio - Fundo Claro

## Problema

O dialog "Adicionar Relatorio" esta usando o tema escuro padrao (glassmorphism com `bg-card/90` e `backdrop-blur`), o que dificulta a leitura. Conforme o padrao do projeto, dialogs administrativos devem usar fundo claro para contraste.

## Mudanca

Aplicar o mesmo padrao de tema claro usado nos dialogs administrativos (Admin, Clients, Team) ao `ReportLinkDialog.tsx`.

## Arquivo a Modificar

`src/components/reports/ReportLinkDialog.tsx`

## Detalhes Tecnicos

Adicionar classes de override no `DialogContent` para forcar fundo branco, texto escuro, bordas cinza e inputs com estilo claro:

- **Fundo**: `bg-white text-gray-900`
- **Subtitulo**: `text-gray-500`
- **Labels**: `text-gray-700`
- **Inputs**: `bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400`
- **Botao fechar (X)**: `text-gray-500 hover:text-gray-900`
- **Botao Cancelar**: `border-gray-300 text-gray-700 bg-white hover:bg-gray-50`
- **Botao Salvar**: `bg-gray-900 text-white hover:bg-gray-800`
- **Botao Remover**: manter `variant="destructive"`

Nenhum arquivo novo necessario, apenas ajuste de classes CSS no componente existente.

