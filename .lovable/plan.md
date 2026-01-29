
# Design System Adaptation Plan

## Overview
Transform the ERP panel to match the Giga AI reference design, featuring a sophisticated dark/light modern aesthetic with serif headings, pill-shaped buttons, and refined visual hierarchy.

---

## Design Analysis from Reference

### Typography
- **Headings**: Modern serif font (DM Serif Display - free Google Font similar to reference)
- **Body text**: Clean sans-serif (Inter for body, keeping complementary feel)
- **Font weights**: 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Heading sizes**: Large display headings for key metrics, smaller for labels
- **Letter spacing**: Slightly loose for headings (-0.02em)

### Color Palette
- **Background (light)**: White (#FFFFFF) and off-white (#F8F9FA)
- **Background (dark)**: Rich black (#000000, #0A0A0A)
- **Accent orange**: #FF5722 (for badges, highlights, stats indicators)
- **Text on dark**: White (#FFFFFF)
- **Text on light**: Dark gray (#1A1A1A to #333333)
- **Muted text**: #666666 to #888888

### Border Radius System
- **Cards**: 16px to 24px (much larger than current 10px)
- **Buttons**: 9999px (pill-shaped)
- **Small elements/badges**: 9999px (pill-shaped)
- **Inputs**: 12px

### Shadows
- **Light mode**: Very subtle (0 2px 8px rgba(0,0,0,0.08))
- **Dark mode**: Deeper (0 4px 24px rgba(0,0,0,0.4))

### Button Styles
- **Primary**: White background, black text, pill-shaped
- **Secondary**: Black background, white text, pill-shaped
- **Hover**: Scale 1.02 with increased shadow

### Special Elements
- **Section badges**: Orange dot + uppercase text
- **Stats display**: Large serif numbers with small labels
- **Smooth transitions**: 0.3s ease for interactions

---

## Files to Modify

### 1. src/index.css
**Changes:**
- Add Google Fonts import for DM Serif Display and Inter
- Update CSS variables with new color palette
- Add orange accent color
- Update shadow variables
- Increase border-radius values
- Add dark mode with true black background

### 2. tailwind.config.ts
**Changes:**
- Add serif font family (DM Serif Display)
- Update sans font to Inter
- Add new border-radius variants (xl, 2xl, full)
- Add accent-orange color
- Update shadow scale
- Add custom transition utilities

### 3. src/components/ui/button.tsx
**Changes:**
- Update to pill-shaped (rounded-full)
- Add hover scale transform
- Update primary variant (white bg, black text)
- Update secondary variant (black bg, white text)
- Add smooth transition effects

### 4. src/components/ui/card.tsx
**Changes:**
- Increase border-radius to rounded-2xl
- Update shadow styles
- Add subtle border

### 5. src/components/ui/badge.tsx
**Changes:**
- Make pill-shaped (rounded-full)
- Add orange accent variant

### 6. src/components/ui/input.tsx
**Changes:**
- Update border-radius
- Refine focus states

### 7. src/components/dashboard/StatCard.tsx
**Changes:**
- Use serif font for values
- Increase value font size
- Add subtle hover effect
- Update icon container styling

### 8. src/components/layout/AppSidebar.tsx
**Changes:**
- Update to dark sidebar matching reference
- Refine navigation item styling
- Update logo container
- Add smooth transitions

### 9. src/components/layout/AppHeader.tsx
**Changes:**
- Update search input styling
- Refine button and avatar styles
- Add subtle border treatment

### 10. src/pages/Dashboard.tsx
**Changes:**
- Update welcome banner styling
- Add section badge style (orange dot + uppercase)
- Refine quick actions buttons

### 11. All other pages (Clients, Contents, Team, Healthscore)
**Changes:**
- Apply new card styling
- Update typography hierarchy
- Refine badge and button usage

---

## Technical Implementation Details

### CSS Variables Update

```css
:root {
  /* Updated color palette */
  --background: oklch(0.9950 0 0); /* Off-white */
  --foreground: oklch(0.1500 0 0); /* Near black */
  --primary: oklch(0.9800 0 0); /* White for buttons */
  --primary-foreground: oklch(0.0500 0 0); /* Black text */
  --accent-orange: oklch(0.6500 0.2000 30); /* #FF5722 equivalent */
  
  /* Larger radius */
  --radius: 1rem; /* 16px base */
  --radius-xl: 1.5rem; /* 24px for cards */
}

.dark {
  --background: oklch(0.0500 0 0); /* True black */
  --card: oklch(0.0800 0 0); /* Slightly lighter */
}
```

### Font Configuration

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap');
```

### Button Transform

```tsx
const buttonVariants = cva(
  "... rounded-full transition-all duration-300 hover:scale-[1.02] ...",
  {
    variants: {
      variant: {
        default: "bg-white text-black shadow-sm hover:shadow-md",
        secondary: "bg-black text-white hover:bg-black/90",
      }
    }
  }
);
```

---

## Visual Preview of Changes

### Before vs After

| Element | Current | Updated |
|---------|---------|---------|
| Card radius | 10px | 24px |
| Button shape | Rounded corners | Pill-shaped |
| Heading font | Arimo (sans-serif) | DM Serif Display |
| Primary button | Dark gray bg | White bg, black text |
| Accent color | Blue chart colors | Orange (#FF5722) |
| Shadows | Moderate | Subtle and refined |

---

## Implementation Order

1. Update fonts and CSS variables in index.css
2. Update tailwind.config.ts with new design tokens
3. Modify core UI components (button, card, badge, input)
4. Update layout components (sidebar, header)
5. Update dashboard components (StatCard, charts)
6. Apply changes across all pages
7. Test in both light and dark modes

---

## Summary

This update transforms the ERP panel from a standard enterprise look to a sophisticated, modern design matching the Giga AI reference. Key changes include serif headings for elegance, pill-shaped buttons for a softer feel, larger card border-radius, an orange accent color for highlights, and refined shadows for depth without heaviness.
