

# Popup de Clientes Pendentes por Canal

## Objetivo

Permitir que o usuário clique em cada card de canal no painel de estatísticas e visualize um popup (Dialog) listando os clientes que possuem entregas pendentes naquele canal específico.

## Critério de "Pendente"

Um cliente é considerado pendente quando:
- `actual[channel] < planned[channel]` (realizado menor que planejado)

## Visualização Proposta

```text
┌─────────────────────────────────────────────────────────┐
│  Clientes Pendentes - Instagram                    [X]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Cliente A              Faltam 3 de 10           │    │
│  │ ████████████████████░░░░░░░░░░  70%             │    │
│  ├─────────────────────────────────────────────────┤    │
│  │ Cliente B              Faltam 5 de 8            │    │
│  │ ██████████░░░░░░░░░░░░░░░░░░░░  38%             │    │
│  ├─────────────────────────────────────────────────┤    │
│  │ Cliente C              Faltam 2 de 5            │    │
│  │ █████████████████░░░░░░░░░░░░░  60%             │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  Total: 3 clientes pendentes                            │
└─────────────────────────────────────────────────────────┘
```

## Implementação Técnica

### 1. Novo Componente: ChannelPendingDialog

Criar `src/components/scope/ChannelPendingDialog.tsx`:

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `open` | boolean | Controla visibilidade do dialog |
| `onOpenChange` | (open: boolean) => void | Callback para fechar |
| `channel` | ScopeField | Canal selecionado |
| `channelLabel` | string | Nome do canal para exibição |
| `channelIcon` | ReactNode | Ícone do canal |
| `data` | ScopeControlData[] | Dados completos de escopo |

### 2. Lógica de Filtragem

```typescript
const pendingClients = useMemo(() => {
  return data
    .filter((item) => {
      const planned = item.client.scope?.[channel] || 0;
      const actual = item.actual?.[channel] || 0;
      return planned > 0 && actual < planned;
    })
    .map((item) => ({
      name: item.client.name,
      planned: item.client.scope?.[channel] || 0,
      actual: item.actual?.[channel] || 0,
      missing: (item.client.scope?.[channel] || 0) - (item.actual?.[channel] || 0),
      percentage: Math.round(((item.actual?.[channel] || 0) / (item.client.scope?.[channel] || 1)) * 100),
    }))
    .sort((a, b) => a.percentage - b.percentage); // Ordena do mais atrasado ao menos
}, [data, channel]);
```

### 3. Atualizar ScopeStatsPanel

Modificar `src/components/scope/ScopeStatsPanel.tsx`:

- Adicionar estado para controlar o dialog aberto
- Tornar os cards de canal clicáveis (cursor-pointer, hover effect)
- Ao clicar, abrir o dialog passando o canal selecionado

```typescript
const [selectedChannel, setSelectedChannel] = useState<ScopeField | null>(null);

// No card do canal:
<div
  onClick={() => setSelectedChannel(channelStat.channel)}
  className="cursor-pointer hover:border-primary/50 transition-colors ..."
>
  ...
</div>

// No final do componente:
<ChannelPendingDialog
  open={selectedChannel !== null}
  onOpenChange={(open) => !open && setSelectedChannel(null)}
  channel={selectedChannel}
  data={data}
  ...
/>
```

## Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/scope/ChannelPendingDialog.tsx` | Criar componente de dialog |
| `src/components/scope/ScopeStatsPanel.tsx` | Adicionar interatividade aos cards |

## Detalhes do Dialog

### Cabeçalho
- Ícone do canal + título "Clientes Pendentes - [Nome do Canal]"
- Botão de fechar (X)

### Lista de Clientes
- Ordenados do mais atrasado (menor %) ao menos atrasado
- Para cada cliente:
  - Nome do cliente
  - Texto: "Faltam X de Y"
  - Barra de progresso colorida
  - Percentual de conclusão

### Rodapé
- Total de clientes pendentes
- Caso não haja pendências: mensagem "Todos os clientes estão em dia!"

## Interação UX

- Cards ganham `cursor-pointer` e efeito de hover
- Dialog usa animação suave de entrada/saída
- ScrollArea para listas longas de clientes
- Cores consistentes com o restante do sistema

