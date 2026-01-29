

# Glassmorphism Effect Implementation Plan

## Overview
Add the frosted glass effect (backdrop blur + semi-transparent background + gradient accents) from the Giga AI reference to key UI components across the app.

---

## Design Elements from Reference

From the screenshots, the glassmorphism effect includes:
- **Background:** Semi-transparent dark (`rgba(0,0,0,0.6)` or similar)
- **Backdrop blur:** `backdrop-blur-[20px]` to `backdrop-blur-[30px]`
- **Border:** Subtle white border at 10% opacity (`border-white/10`)
- **Border radius:** Rounded corners (`rounded-2xl`)
- **Shadow:** Soft shadow for depth

**Key insight:** For blur to be visible, there must be a colorful/gradient background behind the element. Otherwise it just looks like a dark card.

---

## Implementation Strategy

### 1. Add a Gradient Background to the Main Layout

Create a subtle gradient or decorative background behind the entire app content area so the blur effect has something to show through.

**File:** `src/components/layout/AppLayout.tsx`

Add a gradient overlay or decorative background:
```tsx
<main className="flex-1 overflow-auto p-6 relative">
  {/* Gradient background for glassmorphism */}
  <div className="absolute inset-0 bg-gradient-to-br from-accent-orange/5 via-transparent to-chart-3/5 pointer-events-none" />
  <div className="relative z-10">
    {children}
  </div>
</main>
```

---

### 2. Update Cards to Use Glassmorphism

**File:** `src/components/ui/card.tsx`

Update the base Card component:
```tsx
// Current
className="rounded-2xl border border-border bg-card..."

// Updated
className="rounded-2xl border border-white/10 bg-card/80 backdrop-blur-sm..."
```

This makes all cards slightly transparent with blur, showing the gradient behind.

---

### 3. Update Dialog/Modal for Glassmorphism

**File:** `src/components/ui/dialog.tsx`

Update DialogContent styling:
```tsx
// Add glassmorphism to modal
className="... bg-card/90 backdrop-blur-xl border border-white/10 shadow-2xl ..."
```

---

### 4. Enhance the Header with Blur

**File:** `src/components/layout/AppHeader.tsx`

The header already has some blur (`backdrop-blur-sm`). Enhance it:
```tsx
// Current
className="... bg-background/80 backdrop-blur-sm"

// Updated  
className="... bg-background/60 backdrop-blur-xl border-b border-white/5"
```

---

### 5. Create Reusable Glassmorphism CSS Classes

**File:** `src/index.css`

Add utility classes for consistent glassmorphism:
```css
@layer utilities {
  .glass {
    @apply bg-card/80 backdrop-blur-xl border border-white/10 shadow-lg;
  }
  
  .glass-dark {
    @apply bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg;
  }
  
  .glass-subtle {
    @apply bg-card/60 backdrop-blur-sm border border-white/5;
  }
}
```

---

## Files to Modify

| File | Change |
|------|--------|
| `src/index.css` | Add `.glass`, `.glass-dark`, `.glass-subtle` utility classes |
| `src/components/layout/AppLayout.tsx` | Add gradient background to main content area |
| `src/components/ui/card.tsx` | Update Card with glassmorphism (transparent bg + blur) |
| `src/components/ui/dialog.tsx` | Update DialogContent with blur effect |
| `src/components/layout/AppHeader.tsx` | Enhance header blur effect |

---

## Visual Result

| Component | Before | After |
|-----------|--------|-------|
| Cards | Solid white/dark background | Semi-transparent with blur |
| Header | Light blur | Strong blur, more transparency |
| Dialogs | Solid background | Frosted glass effect |
| Main area | Flat muted background | Subtle gradient that shows through blurred cards |

---

## Dark Mode Considerations

The effect works especially well in dark mode. The implementation will:
- Use relative opacity values that adapt to both themes
- Add CSS variables for glass backgrounds if needed
- Ensure sufficient contrast for text readability

---

## Summary

1. Add gradient background to main layout area
2. Create reusable `.glass` utility classes
3. Apply glassmorphism to Card component
4. Enhance Dialog and Header with blur
5. Test across all pages to ensure consistent appearance

