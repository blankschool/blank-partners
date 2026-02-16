

# Correcao: Seletor de Visualizacao (Calendario/Grid/Lista)

## Problema

O toggle de visualizacao (calendario, grid, lista) esta dentro do componente `ContentFilters`, que e renderizado fora das abas. Quando o usuario esta na aba "Analise", clicar nos botoes de visualizacao muda o estado interno mas nao tem efeito visivel, dando a impressao de que esta "travado" na lista.

## Solucao

Controlar a aba ativa com estado e so mostrar o toggle de visualizacao quando a aba "Painel" estiver selecionada.

### Arquivo: `src/pages/Contents.tsx`

1. Adicionar estado para a aba ativa:
```text
const [activeTab, setActiveTab] = useState("painel");
```

2. Tornar o `Tabs` controlado:
```text
<Tabs value={activeTab} onValueChange={setActiveTab}>
```

3. Passar `activeTab` para `ContentFilters` para esconder o toggle na aba "Analise"

### Arquivo: `src/components/contents/ContentFilters.tsx`

1. Adicionar prop `showViewToggle?: boolean` (default `true`)
2. Renderizar o bloco do toggle de visualizacao apenas quando `showViewToggle` for `true`

## Escopo

- 2 arquivos editados
- Adicao de 1 estado e 1 prop booleana
- Sem mudanca de layout ou comportamento nos filtros existentes

