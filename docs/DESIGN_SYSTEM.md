# Design System — Blank Agency ERP

> **Versão:** 1.0.0  
> **Última atualização:** Fevereiro 2025  
> **Filosofia:** Monochromatic elegance com glassmorphism

---

## 1. Visão Geral

Blank Agency ERP é uma plataforma de gestão para agências de marketing digital. O design segue uma estética **monocromática (preto/branco)** com efeitos de **glassmorphism**, tipografia **DM Serif Display** para headlines e **Inter** para corpo de texto.

### Identidade Visual

| Aspecto | Definição |
|---------|-----------|
| **Paleta** | Monocromática (tons de preto, branco e cinza) |
| **Efeitos** | Glassmorphism, backdrop-blur |
| **Tipografia** | DM Serif Display (headlines) + Inter (corpo) |
| **Border Radius** | 24px para cards (rounded-2xl) |
| **Ícones** | Lucide React |

---

## 2. Cores

### 2.1 Mapeamento de Tokens

#### Texto

| Token Semântico | Token Tailwind | Descrição |
|-----------------|----------------|-----------|
| `text-primary` | `text-foreground` | Cor principal de títulos e texto importante |
| `text-secondary` | `text-muted-foreground` | Texto de apoio, legendas, descrições |
| `text-muted` | `text-muted-foreground/60` | Placeholders, hints, texto desabilitado |
| `text-on-dark` | `text-white` | Texto sobre fundos escuros (sidebar) |
| `text-on-brand` | `text-accent-orange-foreground` | Texto sobre botões primários |

#### Superfícies (Fundos)

| Token Semântico | Token Tailwind | Descrição |
|-----------------|----------------|-----------|
| `surface-page` | `bg-background` | Fundo principal da página |
| `surface-section` | `bg-muted/30` | Seções alternadas, áreas de conteúdo |
| `surface-card` | `bg-card` | Fundo de cards |
| `surface-subtle` | `bg-muted` | Fundos sutis, áreas de destaque leve |
| `surface-elevated` | `bg-popover` | Elementos elevados (modais, dropdowns) |

#### Ações (Botões, Links)

| Token Semântico | Token Tailwind | Descrição |
|-----------------|----------------|-----------|
| `action-primary` | `bg-primary` | Botões principais (branco no light) |
| `action-primary-hover` | `bg-primary/90` | Hover de action-primary |
| `action-strong` | `bg-accent-orange` | CTAs de alta conversão (preto no light) |
| `action-strong-hover` | `bg-accent-orange/90` | Hover de action-strong |
| `action-secondary` | `bg-secondary` | Botões secundários |

#### Bordas

| Token Semântico | Token Tailwind | Descrição |
|-----------------|----------------|-----------|
| `border-default` | `border-border` | Bordas padrão |
| `border-subtle` | `border-white/10` | Bordas muito sutis (glassmorphism) |
| `border-focus` | `ring-ring` | Focus ring |

#### Status

| Token Semântico | Token Tailwind | Descrição |
|-----------------|----------------|-----------|
| `status-success` | `bg-success` | Sucesso, confirmação (verde) |
| `status-warning` | `bg-warning` | Alertas, atenção (âmbar) |
| `status-error` | `bg-destructive` | Erros, problemas (vermelho) |

---

### 2.2 Valores Reais das Cores

#### Light Mode

```css
/* Bases */
--background: oklch(0.99 0 0);     /* Branco suave #FCFCFC */
--foreground: oklch(0.15 0 0);     /* Preto profundo #1A1A1A */
--card: oklch(1.00 0 0);           /* Branco puro #FFFFFF */

/* Interativos */
--primary: oklch(0.98 0 0);        /* Branco off-white */
--secondary: oklch(0.08 0 0);      /* Preto intenso */
--accent-orange: oklch(0.15 0 0);  /* Preto (CTA) */

/* Neutros */
--muted: oklch(0.96 0 0);          /* Cinza muito claro */
--muted-foreground: oklch(0.45 0 0); /* Cinza médio */
--border: oklch(0.91 0 0);         /* Cinza claro */

/* Status */
--success: oklch(0.65 0.18 145);   /* Verde */
--warning: oklch(0.75 0.15 85);    /* Âmbar */
--destructive: oklch(0.54 0.22 26); /* Vermelho */
```

#### Dark Mode

```css
/* Bases */
--background: oklch(0.05 0 0);     /* Preto profundo */
--foreground: oklch(0.95 0 0);     /* Branco suave */
--card: oklch(0.12 0 0);           /* Preto elevado */

/* Interativos */
--primary: oklch(0.95 0 0);        /* Branco */
--secondary: oklch(0.15 0 0);      /* Preto elevado */
--accent-orange: oklch(0.95 0 0);  /* Branco (CTA) */

/* Neutros */
--muted: oklch(0.15 0 0);          /* Preto elevado */
--muted-foreground: oklch(0.55 0 0); /* Cinza */
--border: oklch(0.18 0 0);         /* Preto sutil */
```

---

## 3. Tipografia

### 3.1 Famílias

| Uso | Família | Token Tailwind |
|-----|---------|----------------|
| **Headlines** | DM Serif Display | `font-serif` |
| **Corpo** | Inter | `font-sans` |

### 3.2 Escala de Tamanhos

| Token | Tamanho | Uso | Classes Tailwind |
|-------|---------|-----|------------------|
| `text-xs` | 12px | Badges, labels pequenos | `text-xs` |
| `text-sm` | 14px | Texto secundário, captions | `text-sm` |
| `text-base` | 16px | Corpo de texto | `text-base` |
| `text-lg` | 18px | Texto destacado | `text-lg` |
| `text-xl` | 20px | Subtítulos | `text-xl` |
| `text-2xl` | 24px | Títulos de cards | `text-2xl` |
| `text-3xl` | 30px | Títulos de seção | `text-3xl` |
| `text-4xl` | 36px | Títulos principais | `text-4xl` |
| `text-5xl` | 48px | Headlines hero, métricas grandes | `text-5xl` |

### 3.3 Pesos

| Token | Valor | Uso |
|-------|-------|-----|
| `font-normal` | 400 | Corpo de texto |
| `font-medium` | 500 | Ênfase leve, labels |
| `font-semibold` | 600 | Títulos, botões |
| `font-bold` | 700 | Headlines |

### 3.4 Padrões Tipográficos

#### Headline de Página
```html
<h1 class="font-serif text-4xl font-normal tracking-tight text-foreground">
  Título da Página
</h1>
```

#### Métrica Grande (KPIs)
```html
<p class="font-serif text-5xl font-normal tracking-tight text-foreground">
  1.408
</p>
```

#### Label Uppercase (Padrão do Projeto)
```html
<p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
  PLANEJADO
</p>
```

#### Corpo de Texto
```html
<p class="font-sans text-base text-foreground">
  Texto do corpo...
</p>
```

---

## 4. Espaçamento

### 4.1 Escala

| Token | Valor | Tailwind | Uso |
|-------|-------|----------|-----|
| `space-1` | 4px | `p-1`, `gap-1` | Mínimo, ícones inline |
| `space-2` | 8px | `p-2`, `gap-2` | Gaps pequenos |
| `space-3` | 12px | `p-3`, `gap-3` | Gaps médios internos |
| `space-4` | 16px | `p-4`, `gap-4` | Padding padrão |
| `space-6` | 24px | `p-6`, `gap-6` | Padding de cards |
| `space-8` | 32px | `p-8`, `gap-8` | Gaps entre seções |
| `space-12` | 48px | `p-12`, `gap-12` | Padding de seções |
| `space-16` | 64px | `p-16`, `gap-16` | Padding vertical grande |
| `space-20` | 80px | `p-20`, `gap-20` | Seções hero |

---

## 5. Bordas e Sombras

### 5.1 Border Radius

| Token | Valor | Tailwind | Uso |
|-------|-------|----------|-----|
| `radius-sm` | 8px | `rounded-sm` | Inputs, badges |
| `radius-md` | 12px | `rounded-md` | Botões |
| `radius-lg` | 16px | `rounded-lg` | Cards pequenos |
| `radius-xl` | 24px | `rounded-xl` | Cards grandes |
| `radius-2xl` | 32px | `rounded-2xl` | Cards hero, modais |
| `radius-full` | 9999px | `rounded-full` | Avatares, pills, badges |

### 5.2 Sombras

| Token | Tailwind | Uso |
|-------|----------|-----|
| `shadow-2xs` | `shadow-2xs` | Sombra mínima |
| `shadow-xs` | `shadow-xs` | Inputs |
| `shadow-sm` | `shadow-sm` | Hover states sutis |
| `shadow-md` | `shadow-md` | Cards, dropdowns |
| `shadow-lg` | `shadow-lg` | Modais, popovers |
| `shadow-xl` | `shadow-xl` | Elementos muito elevados |
| `shadow-2xl` | `shadow-2xl` | Hero elements |

---

## 6. Componentes

### 6.1 Botões

#### Primary Button
```html
<button class="
  bg-primary 
  text-primary-foreground 
  px-4 py-2 
  rounded-md 
  font-medium 
  shadow-sm
  hover:bg-primary/90 
  transition-colors
">
  Botão Primário
</button>
```

#### Secondary Button
```html
<button class="
  bg-secondary 
  text-secondary-foreground 
  px-4 py-2 
  rounded-md 
  font-medium 
  hover:bg-secondary/80 
  transition-colors
">
  Botão Secundário
</button>
```

#### Strong CTA Button
```html
<button class="
  bg-accent-orange 
  text-accent-orange-foreground 
  px-6 py-3 
  rounded-lg 
  font-semibold 
  shadow-md
  hover:bg-accent-orange/90 
  transition-all
">
  Call to Action
</button>
```

#### Ghost Button
```html
<button class="
  bg-transparent 
  text-foreground 
  px-4 py-2 
  rounded-md 
  font-medium 
  hover:bg-muted 
  transition-colors
">
  Botão Ghost
</button>
```

#### Outline Button
```html
<button class="
  bg-transparent 
  text-foreground 
  px-4 py-2 
  rounded-md 
  font-medium 
  border border-border
  hover:bg-muted 
  transition-colors
">
  Botão Outline
</button>
```

### 6.2 Cards

#### Card Padrão
```html
<div class="
  bg-card 
  border border-border 
  rounded-2xl 
  p-6 
  shadow-sm
  hover:shadow-md 
  transition-all duration-300
">
  <h3 class="font-serif text-2xl font-normal">Título do Card</h3>
  <p class="mt-2 text-muted-foreground">Descrição do card...</p>
</div>
```

#### Card Glassmorphism
```html
<div class="
  bg-card/80 
  backdrop-blur-sm 
  border border-white/10 
  rounded-2xl 
  p-6 
  shadow-lg
">
  <h3 class="font-serif text-2xl font-normal text-card-foreground">
    Título do Card
  </h3>
</div>
```

#### Stat Card (KPI)
```html
<div class="bg-card rounded-2xl border border-border p-6 shadow-sm">
  <div class="flex items-start justify-between">
    <div>
      <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        PLANEJADO
      </p>
      <p class="mt-2 font-serif text-5xl font-normal tracking-tight text-foreground">
        1.408
      </p>
      <p class="mt-3 text-sm text-muted-foreground">
        Descrição opcional
      </p>
    </div>
    <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
      <!-- Icon -->
    </div>
  </div>
</div>
```

### 6.3 Inputs

#### Input Padrão
```html
<input 
  type="text" 
  class="
    w-full 
    bg-background 
    border border-input 
    rounded-sm 
    px-3 py-2 
    text-foreground 
    placeholder:text-muted-foreground
    focus:outline-none 
    focus:ring-2 
    focus:ring-ring 
    focus:ring-offset-2
    transition-colors
  "
  placeholder="Placeholder..."
/>
```

#### Input com Label
```html
<div class="space-y-2">
  <label class="text-sm font-medium text-foreground">
    Label
  </label>
  <input 
    type="text" 
    class="
      w-full 
      bg-background 
      border border-input 
      rounded-sm 
      px-3 py-2 
      text-foreground
      focus:ring-2 focus:ring-ring
    "
  />
</div>
```

### 6.4 Badges

#### Badge Padrão
```html
<span class="
  inline-flex items-center 
  px-3 py-1 
  text-xs font-medium 
  rounded-full 
  bg-secondary 
  text-secondary-foreground
">
  Badge
</span>
```

#### Status Badges
```html
<!-- Success -->
<span class="px-3 py-1 text-xs font-medium rounded-full bg-success text-success-foreground">
  No prazo
</span>

<!-- Warning -->
<span class="px-3 py-1 text-xs font-medium rounded-full bg-warning text-warning-foreground">
  Excedido
</span>

<!-- Error -->
<span class="px-3 py-1 text-xs font-medium rounded-full bg-destructive text-destructive-foreground">
  Atrasado
</span>

<!-- Neutral -->
<span class="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground">
  Fora do escopo
</span>
```

### 6.5 Avatares

```html
<div class="
  h-10 w-10 
  rounded-full 
  bg-primary/10 
  flex items-center justify-center
">
  <span class="text-sm font-medium text-primary">AB</span>
</div>
```

### 6.6 Tables

```html
<div class="rounded-xl border border-border bg-card overflow-hidden">
  <!-- Header -->
  <div class="flex items-center gap-4 px-4 py-3 bg-muted/30 border-b border-border text-xs font-medium uppercase tracking-wider text-muted-foreground">
    <span class="flex-1">Coluna 1</span>
    <span class="w-24 text-center">Coluna 2</span>
  </div>
  
  <!-- Body -->
  <div class="divide-y divide-border">
    <div class="flex items-center gap-4 px-4 py-3 hover:bg-muted/30 transition-colors">
      <span class="flex-1 font-medium text-foreground">Conteúdo</span>
      <span class="w-24 text-center text-muted-foreground">Valor</span>
    </div>
  </div>
</div>
```

---

## 7. Padrões Especiais

### 7.1 Header de Seção (Padrão Signature)

O padrão do projeto para headers de seção inclui um ponto laranja decorativo:

```html
<div class="space-y-1">
  <div class="flex items-center gap-2">
    <span class="h-2 w-2 rounded-full bg-accent-orange" />
    <span class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
      LABEL DA SEÇÃO
    </span>
  </div>
  <h1 class="font-serif text-4xl font-normal tracking-tight text-foreground">
    Título da Seção
  </h1>
  <p class="text-muted-foreground">
    Descrição opcional da seção
  </p>
</div>
```

### 7.2 Glassmorphism

```html
<!-- Utility Class -->
<div class="glass">
  Conteúdo com glassmorphism
</div>

<!-- Equivalente manual -->
<div class="bg-card/80 backdrop-blur-xl border border-white/10 shadow-lg">
  Conteúdo com glassmorphism
</div>
```

### 7.3 Sidebar

```html
<aside class="bg-sidebar text-sidebar-foreground">
  <div class="p-5">
    <!-- Logo -->
    <div class="flex items-center gap-3">
      <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-foreground to-muted-foreground flex items-center justify-center">
        <span class="font-serif text-lg text-white">B</span>
      </div>
      <div>
        <span class="font-serif text-base text-white">Blank</span>
        <span class="text-[10px] uppercase tracking-widest text-white/50">Agency ERP</span>
      </div>
    </div>
    
    <!-- Navigation -->
    <nav class="mt-8 space-y-1">
      <a href="/" class="flex items-center gap-3 h-12 px-4 rounded-lg hover:bg-white/10 transition-colors">
        <Icon class="h-5 w-5 text-white/70" />
        <span class="text-[15px] font-medium text-white">Dashboard</span>
      </a>
    </nav>
  </div>
</aside>
```

---

## 8. Estados Obrigatórios

Todo componente interativo DEVE implementar:

### 8.1 Estados de Botão

```html
<button class="
  /* Default */
  bg-primary text-primary-foreground
  
  /* Hover */
  hover:bg-primary/90
  
  /* Active/Pressed */
  active:scale-[0.98]
  
  /* Focus */
  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
  
  /* Disabled */
  disabled:opacity-50 disabled:cursor-not-allowed
  
  /* Transition */
  transition-all duration-300
">
```

### 8.2 Estados de Input

```html
<input class="
  /* Default */
  border-input bg-background
  
  /* Hover */
  hover:border-muted-foreground/50
  
  /* Focus */
  focus:ring-2 focus:ring-ring focus:ring-offset-2
  
  /* Disabled */
  disabled:opacity-50 disabled:cursor-not-allowed
  
  /* Error */
  aria-invalid:border-destructive
"/>
```

### 8.3 Estados de Card Interativo

```html
<div class="
  /* Default */
  bg-card border-border shadow-sm
  
  /* Hover */
  hover:shadow-md hover:border-primary/50
  
  /* Active (selected) */
  data-[selected=true]:ring-2 data-[selected=true]:ring-primary
  
  /* Transition */
  transition-all duration-300
">
```

---

## 9. Responsividade

### 9.1 Breakpoints

| Token | Valor | Uso |
|-------|-------|-----|
| `sm` | 640px | Tablets pequenos |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Desktop grande |
| `2xl` | 1536px | Telas muito grandes |

### 9.2 Padrões Mobile-First

```html
<!-- Grid responsivo -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

<!-- Padding responsivo -->
<section class="px-4 md:px-6 lg:px-8">

<!-- Tipografia responsiva -->
<h1 class="text-3xl md:text-4xl lg:text-5xl">
```

---

## 10. Acessibilidade

### 10.1 Regras Obrigatórias

1. **Contraste**: Mínimo de 4.5:1 para texto normal, 3:1 para texto grande
2. **Focus visível**: Sempre usar `focus:ring-2 focus:ring-ring`
3. **Cor + Texto**: Nunca comunicar informação apenas por cor
4. **Labels**: Todo input deve ter label associado
5. **Alt text**: Toda imagem deve ter atributo alt

### 10.2 Exemplos de Status com Texto

```html
<!-- Correto: Cor + Texto -->
<span class="bg-success text-success-foreground px-3 py-1 rounded-full text-xs font-medium">
  ✓ No prazo
</span>

<!-- Incorreto: Apenas cor -->
<span class="bg-green-500 h-3 w-3 rounded-full" />
```

---

## 11. Checklist de Implementação

Antes de entregar qualquer componente, verifique:

- [ ] Usa apenas tokens semânticos (nenhum valor hardcoded)
- [ ] Implementa todos os 5 estados (default, hover, active, focus, disabled)
- [ ] Funciona em light e dark mode
- [ ] É responsivo (mobile-first)
- [ ] Segue as regras de acessibilidade
- [ ] Usa a tipografia correta (serif para headlines, sans para corpo)
- [ ] Tem border-radius consistente (2xl para cards)
- [ ] Transições suaves (duration-300)

---

## 12. Referência Rápida

### Cores Mais Usadas

| Uso | Light Mode | Dark Mode | Tailwind |
|-----|------------|-----------|----------|
| Texto principal | Preto | Branco | `text-foreground` |
| Texto secundário | Cinza | Cinza | `text-muted-foreground` |
| Fundo página | Branco suave | Preto | `bg-background` |
| Fundo card | Branco | Preto elevado | `bg-card` |
| Bordas | Cinza claro | Cinza escuro | `border-border` |
| CTA | Preto | Branco | `bg-accent-orange` |

### Classes Utilitárias do Projeto

| Classe | Efeito |
|--------|--------|
| `.glass` | Glassmorphism padrão |
| `.glass-dark` | Glassmorphism escuro |
| `.glass-subtle` | Glassmorphism sutil |
| `.font-serif` | DM Serif Display |
| `.font-sans` | Inter |
| `.tabular-nums` | Números tabulares (alinhados) |

---

**Mantido por:** Blank Agency  
**Última revisão:** Fevereiro 2025
