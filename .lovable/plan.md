

# Relatório de Controle de Escopo

## Objetivo

Adicionar um painel de estatísticas na página de Controle de Escopo que exiba:
1. **Taxa de conclusão geral** - Percentual global de entregas realizadas vs. planejadas
2. **Taxa de conclusão por canal** - Percentual de cada canal (IG, TikTok, LinkedIn, YT Shorts, YT Videos, Gravações)

## Visualização Proposta

```text
┌────────────────────────────────────────────────────────────────────────────────┐
│  📊 Controle de Escopo                                       [Mês/Ano ▼]       │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  ┌────────────────────────────────────────────────────────────────────────┐    │
│  │  📈 RELATÓRIO DE ESCOPO                                                │    │
│  │                                                                        │    │
│  │  ┌──────────────────────┐                                              │    │
│  │  │   Taxa Geral: 78%    │  ████████████████░░░░░                       │    │
│  │  │   152/195 entregas   │                                              │    │
│  │  └──────────────────────┘                                              │    │
│  │                                                                        │    │
│  │  Por Canal:                                                            │    │
│  │  ┌───────┬───────┬───────┬───────┬───────┬───────┐                     │    │
│  │  │  IG   │  TT   │  LI   │  YTS  │  YTV  │ Grav  │                     │    │
│  │  │  85%  │  72%  │  90%  │  65%  │  80%  │  70%  │                     │    │
│  │  │ 34/40 │ 18/25 │ 27/30 │ 13/20 │ 40/50 │ 21/30 │                     │    │
│  │  └───────┴───────┴───────┴───────┴───────┴───────┘                     │    │
│  └────────────────────────────────────────────────────────────────────────┘    │
│                                                                                │
│  ┌─ Tabela de Clientes (existente) ─────────────────────────────────────────┐  │
│  │ ...                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────┘
```

## Implementação Técnica

### 1. Novo Componente: ScopeStatsPanel

Criar `src/components/scope/ScopeStatsPanel.tsx`:

- Recebe os dados do `useScopeControl`
- Calcula as métricas de forma derivada (sem novas queries)
- Exibe cards com estatísticas visuais

### 2. Lógica de Cálculo

```typescript
// Para cada canal
const calculateChannelStats = (data: ScopeControlData[], channel: ScopeField) => {
  const totalPlanned = data.reduce((sum, item) => sum + (item.client.scope?.[channel] || 0), 0);
  const totalActual = data.reduce((sum, item) => sum + (item.actual?.[channel] || 0), 0);
  const percentage = totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 0;
  return { planned: totalPlanned, actual: totalActual, percentage };
};

// Taxa geral (soma de todos os canais)
const calculateOverallStats = (data: ScopeControlData[]) => {
  const channels = ["instagram", "tiktok_posts", "linkedin_posts", "youtube_shorts", "youtube_videos", "recordings"];
  let totalPlanned = 0;
  let totalActual = 0;
  
  channels.forEach(channel => {
    data.forEach(item => {
      totalPlanned += item.client.scope?.[channel] || 0;
      totalActual += item.actual?.[channel] || 0;
    });
  });
  
  const percentage = totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 0;
  return { planned: totalPlanned, actual: totalActual, percentage };
};
```

### 3. Componentes Visuais

| Elemento | Descrição |
|----------|-----------|
| Card principal | Exibe taxa geral com barra de progresso grande |
| Grid de canais | 6 mini-cards, um para cada canal |
| Barra de progresso | Usa componente `Progress` existente |
| Cores dinâmicas | Verde (>=100%), Amarelo (50-99%), Vermelho (<50%) |

### 4. Integração na Página

Atualizar `src/pages/ScopeControl.tsx`:
- Importar novo componente `ScopeStatsPanel`
- Renderizar acima da tabela existente
- Passar os mesmos dados do hook `useScopeControl`

## Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/scope/ScopeStatsPanel.tsx` | Criar componente de estatísticas |
| `src/pages/ScopeControl.tsx` | Adicionar painel de estatísticas |

## Detalhes do Design

### Card de Taxa Geral
- Ícone: `TrendingUp` ou `PieChart`
- Valor grande: "78%"
- Subtexto: "152 de 195 entregas"
- Barra de progresso visual

### Cards por Canal
- Layout em grid responsivo (2 colunas mobile, 3 tablet, 6 desktop)
- Ícone do canal (Instagram, Video, etc.)
- Percentual em destaque
- Proporção (ex: "34/40")
- Mini barra de progresso

### Cores de Status
- **Verde**: >= 100% (meta atingida ou superada)
- **Amarelo**: 50% - 99% (em andamento)
- **Vermelho**: < 50% (atenção necessária)

