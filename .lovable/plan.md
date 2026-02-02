

# Separar Escopo por Canal na Tabela de Clientes

## Objetivo

Substituir a coluna única "Escopo" (que mostra `IG: 12 | LI: 8`) por colunas individuais para cada canal de entrega.

## Situação Atual

Atualmente a coluna "Escopo" exibe todos os canais em uma única célula condensada:

```
IG: 30 | LI: 8 | YT: 4 | Grav: 2
```

## Nova Estrutura

Criar 5 colunas separadas para cada canal:

| Canal | Ícone | Largura |
|-------|-------|---------|
| IG (Instagram) | Instagram icon (rosa) | w-12 |
| TT (TikTok) | Video icon | w-12 |
| LI (LinkedIn) | Linkedin icon (azul) | w-12 |
| YT (YouTube) | Youtube icon (vermelho) | w-12 |
| Grav (Gravações) | Camera icon (roxo) | w-12 |

## Layout Final da Tabela

```text
| Avatar | Cliente | Membros | IG | TT | LI | YT | Grav | SM | Editor | Designer | Ações |
```

## Implementação

### Arquivo a Modificar

`src/components/admin/ClientsTab.tsx`

### Alterações

1. **Importar ícones** - Adicionar `Instagram, Video, Linkedin, Youtube, Camera` do lucide-react

2. **Atualizar Header** - Substituir a coluna "Escopo" por 5 colunas com ícones coloridos:

```typescript
<span className="w-12 text-center hidden lg:flex items-center justify-center">
  <Instagram className="h-3.5 w-3.5 text-pink-500" />
</span>
<span className="w-12 text-center hidden lg:flex items-center justify-center">
  <Video className="h-3.5 w-3.5" />
</span>
<span className="w-12 text-center hidden lg:flex items-center justify-center">
  <Linkedin className="h-3.5 w-3.5 text-blue-600" />
</span>
<span className="w-12 text-center hidden lg:flex items-center justify-center">
  <Youtube className="h-3.5 w-3.5 text-red-500" />
</span>
<span className="w-12 text-center hidden lg:flex items-center justify-center">
  <Camera className="h-3.5 w-3.5 text-purple-500" />
</span>
```

3. **Atualizar Linhas** - Para cada cliente, mostrar os valores individuais:

```typescript
<span className="w-12 text-center text-sm hidden lg:block">
  {client.scope?.instagram || <span className="text-muted-foreground">—</span>}
</span>
<span className="w-12 text-center text-sm hidden lg:block">
  {client.scope?.tiktok_posts || <span className="text-muted-foreground">—</span>}
</span>
<span className="w-12 text-center text-sm hidden lg:block">
  {client.scope?.linkedin_posts || <span className="text-muted-foreground">—</span>}
</span>
<span className="w-12 text-center text-sm hidden lg:block">
  {client.scope?.youtube || <span className="text-muted-foreground">—</span>}
</span>
<span className="w-12 text-center text-sm hidden lg:block">
  {client.scope?.recordings || <span className="text-muted-foreground">—</span>}
</span>
```

4. **Remover função `formatScope`** - Não será mais necessária

## Resultado Visual

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│     │ Cliente        │ Memb │ 📸  │ 🎬  │ 💼  │ ▶️  │ 📷  │ SM      │ Editor  │ Designer │ Ações │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ RB  │ Reinaldo Boess │  3   │ 30  │  —  │  —  │  —  │  —  │ Giovana │ Luiz    │ Henrique │  ✏️🗑️ │
│ NB  │ Natalia Beauty │  4   │ 60  │ 30  │  —  │  4  │  —  │ Maria   │ Daniel  │ Lucas    │  ✏️🗑️ │
│ CU  │ Cubo Itaú      │  5   │ 60  │  —  │ 21  │  —  │  —  │ Paulo   │ Willian │ Ana      │  ✏️🗑️ │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## Benefícios

- Visualização mais clara e rápida do escopo de cada cliente
- Ícones coloridos facilitam identificação dos canais
- Valores numéricos alinhados para fácil comparação
- Consistência com as cores já usadas no `ClientScopeInput`

