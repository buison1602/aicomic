# AIComic Design System

## 🎨 Style Overview

**Design Philosophy:** Minimalism & Swiss Style  
**Approach:** Clean, simple, spacious, functional, high contrast, geometric

---

## 📐 Core Design Principles

1. **Simplicity First** - Remove unnecessary elements
2. **White Space** - Generous spacing for breathing room
3. **High Contrast** - Ensure excellent readability (WCAG AAA)
4. **Consistency** - Uniform spacing, sizing, and styling
5. **Subtle Animations** - 200-250ms transitions only
6. **Performance** - Fast loading, optimized assets

---

## 🎨 Color Palette

### Primary Colors

| Token | Color | Hex | Usage |
|-------|-------|-----|-------|
| `background` | Pure White | `#ffffff` | Page background |
| `foreground` | Dark Gray | `#1f2937` (gray-800) | Body text (7:1 contrast) |
| `primary` | Blue | `#2563eb` (blue-600) | CTA buttons, links, accents |
| `primary-foreground` | White | `#ffffff` | Text on blue background |

### Secondary Colors

| Token | Color | Hex | Usage |
|-------|-------|-----|-------|
| `secondary` | Light Gray | `#f3f4f6` (gray-100) | Secondary buttons, backgrounds |
| `secondary-foreground` | Dark Gray | `#1f2937` | Text on gray background |

### Utility Colors

| Token | Color | Hex | Usage |
|-------|-------|-----|-------|
| `muted` | Very Light Gray | `#f9fafb` (gray-50) | Subtle backgrounds |
| `muted-foreground` | Medium Gray | `#6b7280` (gray-500) | Muted text, captions |
| `accent` | Light Blue | `#eff6ff` (blue-50) | Hover states, highlights |
| `accent-foreground` | Dark Blue | `#1e40af` (blue-800) | Text on blue backgrounds |
| `destructive` | Red | `#dc2626` (red-600) | Error messages, delete actions |
| `border` | Border Gray | `#e5e7eb` (gray-200) | Borders, dividers |
| `ring` | Blue | `#2563eb` (blue-600) | Focus rings |

### Accessibility

- ✅ **Body text contrast:** 7:1 (WCAG AAA)
- ✅ **Muted text contrast:** 4.5:1 (WCAG AA)
- ✅ **All interactive elements:** Minimum 4.5:1

---

## 🔤 Typography

### Font Family

**Primary Font:** Inter (Sans-serif)
- Imported from Google Fonts
- Supports Latin & Vietnamese characters
- Variable font with weights: 300-900

```css
font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
```

### Type Scale

| Element | Class | Size (Mobile) | Size (Desktop) | Weight | Line Height |
|---------|-------|---------------|----------------|--------|-------------|
| H1 | `text-4xl md:text-5xl` | 36px | 48px | 600 | 1.2 |
| H2 | `text-3xl md:text-4xl` | 30px | 36px | 600 | 1.3 |
| H3 | `text-2xl md:text-3xl` | 24px | 30px | 600 | 1.4 |
| H4 | `text-xl md:text-2xl` | 20px | 24px | 600 | 1.4 |
| Body | `text-base` | 16px | 16px | 400 | 1.75 |
| Small | `text-sm` | 14px | 14px | 400 | 1.5 |
| Tiny | `text-xs` | 12px | 12px | 400 | 1.5 |

### Typography Guidelines

- **Letter Spacing:** -0.02em for headings (tighter tracking)
- **Font Smoothing:** Antialiased for crisp rendering
- **Leading:** Relaxed (1.75) for body text
- **Hierarchy:** Clear visual distinction between levels

---

## 📏 Spacing System

### Scale

Tailwind's default spacing scale (4px base):

| Token | Size | Usage |
|-------|------|-------|
| `0` | 0px | No spacing |
| `1` | 4px | Tight spacing |
| `2` | 8px | Small spacing |
| `3` | 12px | Compact |
| `4` | 16px | Default spacing |
| `6` | 24px | Medium spacing |
| `8` | 32px | Large spacing |
| `12` | 48px | Extra large |
| `16` | 64px | Section spacing |
| `24` | 96px | Hero spacing |

### Responsive Padding

**Container Padding:** `px-4 sm:px-6 lg:px-8`
- Mobile: 16px
- Tablet: 24px
- Desktop: 32px

---

## 🎯 Border Radius

### Scale

| Token | Size | Usage | Class |
|-------|------|-------|-------|
| `radius-sm` | 4px | Small elements (badges, tags) | `rounded-sm` |
| `radius-md` | 6px | Medium elements (inputs) | `rounded-md` |
| `radius-lg` | 8px | **Default** (buttons, cards) | `rounded-lg` |
| `radius-xl` | 12px | Large containers | `rounded-xl` |

**Default:** Use `rounded-lg` (8px) for consistency unless there's a specific reason to deviate.

---

## 🎴 Card Styles

### Default Card

```tsx
<div className="bg-card text-card-foreground rounded-lg shadow-sm p-6">
  {/* Card content */}
</div>
```

### Shadow Tokens

| Class | Shadow | Usage |
|-------|--------|-------|
| `shadow-sm` | Subtle | Default cards |
| `shadow` | Medium | Elevated cards |
| `shadow-md` | Prominent | Modals, dialogs |
| `shadow-lg` | Strong | Floating elements |

### Card Hover State

```tsx
<div className="card hover:shadow-md transition-smooth cursor-pointer">
  {/* Interactive card */}
</div>
```

**Rules:**
- Use `cursor-pointer` on all clickable cards
- Smooth shadow transition (200ms)
- Don't use scale transforms (causes layout shift)

---

## 🔘 Button Styles

### Primary Button

```tsx
<button className="bg-primary text-primary-foreground rounded-lg px-4 py-2 font-medium 
  transition-colors duration-200 cursor-pointer hover:opacity-90">
  Button Text
</button>
```

### Secondary Button

```tsx
<button className="bg-secondary text-secondary-foreground rounded-lg px-4 py-2 font-medium 
  transition-colors duration-200 cursor-pointer hover:bg-gray-200">
  Button Text
</button>
```

### Button Guidelines

- **Padding:** `px-4 py-2` (16px × 8px)
- **Font:** Medium weight (500)
- **Transitions:** 200ms color changes
- **Hover:** Opacity 90% (primary) or color shift (secondary)
- **Focus:** Show focus ring for accessibility

---

## 🎭 Interactions & Animations

### Transition Durations

| Duration | Usage |
|----------|-------|
| `150ms` | Quick feedback (button press) |
| `200ms` | **Standard** (hover, color changes) |
| `250ms` | Smooth transitions (shadows) |
| `300ms` | Relaxed (modals, drawers) |

**Never exceed 500ms** - Keeps UI feeling snappy.

### Hover States

```css
/* Color transition */
.element {
  @apply transition-colors duration-200;
}

/* Shadow elevation */
.card:hover {
  @apply shadow-md;
  transition: box-shadow 200ms ease-in-out;
}
```

### Focus States

All interactive elements must have visible focus states:

```tsx
<button className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
  Accessible Button
</button>
```

---

## 📱 Responsive Design

### Breakpoints

| Breakpoint | Size | Usage |
|------------|------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Mobile-First Approach

Always design for mobile first, then enhance for larger screens:

```tsx
<div className="text-2xl md:text-3xl lg:text-4xl">
  {/* Scales up on larger screens */}
</div>
```

### Responsive Patterns

```tsx
{/* Stack on mobile, grid on desktop */}
<div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Content */}
</div>

{/* Hide on mobile, show on desktop */}
<div className="hidden md:block">
  {/* Desktop-only content */}
</div>

{/* Show on mobile, hide on desktop */}
<div className="block md:hidden">
  {/* Mobile-only content */}
</div>
```

---

## ♿ Accessibility Guidelines

### Contrast Requirements

- ✅ **Normal text:** Minimum 4.5:1 contrast ratio
- ✅ **Large text:** Minimum 3:1 contrast ratio
- ✅ **Interactive elements:** Minimum 4.5:1

### Focus Indicators

All interactive elements must have visible focus states for keyboard navigation.

```tsx
<button className="focus-ring">
  {/* Accessible button */}
</button>
```

### Alt Text

All images must have descriptive alt text:

```tsx
<img src="/comic-cover.jpg" alt="One Piece Chapter 1000 Cover" />
```

### Semantic HTML

Use proper HTML elements for accessibility:

```tsx
{/* Good */}
<button onClick={handleClick}>Submit</button>

{/* Bad */}
<div onClick={handleClick}>Submit</div>
```

---

## 🚀 Performance Guidelines

### Image Optimization

- Use Next.js `<Image>` component
- Provide `width` and `height` attributes
- Use modern formats (WebP, AVIF)
- Lazy load below-the-fold images

### CSS Best Practices

- Minimize custom CSS (use Tailwind utilities)
- Avoid deep nesting
- Use CSS variables for theming
- Leverage Tailwind's JIT compiler

### Animation Performance

- Prefer `transform` and `opacity` (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly

---

## 🛠️ Utility Classes

### Pre-defined Utilities

```css
/* Container with responsive padding */
.container-padding {
  @apply px-4 sm:px-6 lg:px-8;
}

/* Smooth transitions */
.transition-smooth {
  @apply transition-all duration-200 ease-in-out;
}

/* Focus ring */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2;
}
```

---

## 📋 Component Checklist

Before creating any new component, ensure:

- [ ] Uses `rounded-lg` for corners (unless specific requirement)
- [ ] Has `cursor-pointer` on interactive elements
- [ ] Includes hover states with 200ms transitions
- [ ] Has visible focus states for accessibility
- [ ] Uses design system colors (no hardcoded values)
- [ ] Responsive on mobile (320px), tablet (768px), desktop (1024px+)
- [ ] Text has minimum 4.5:1 contrast ratio
- [ ] No emojis as icons (use Lucide icons instead)
- [ ] Images have alt text
- [ ] Uses Inter font (no font overrides)

---

## 🎯 Common Patterns

### Page Container

```tsx
<div className="container-padding max-w-7xl mx-auto py-8">
  {/* Page content */}
</div>
```

### Section Spacing

```tsx
<section className="py-12 md:py-16 lg:py-24">
  {/* Section content */}
</section>
```

### Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Grid items */}
</div>
```

### Card Grid

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {comics.map((comic) => (
    <div key={comic.id} className="bg-card rounded-lg shadow-sm hover:shadow-md 
      transition-smooth cursor-pointer">
      {/* Comic card */}
    </div>
  ))}
</div>
```

---

## 🎨 Icon System

**Library:** Lucide React  
**Size:** `w-6 h-6` (24×24px) for consistency

```tsx
import { Home, Book, User } from 'lucide-react';

<Home className="w-6 h-6 text-foreground" />
```

**Rules:**
- ❌ Never use emojis as UI icons
- ✅ Use Lucide icons for consistency
- ✅ Maintain consistent sizing (`w-6 h-6`)
- ✅ Use text colors for icon colors

---

## 📝 Usage in Code

### Accessing Design Tokens

```tsx
// Background
<div className="bg-background text-foreground">

// Primary accent
<button className="bg-primary text-primary-foreground">

// Cards
<div className="bg-card text-card-foreground rounded-lg shadow-sm">

// Borders
<div className="border border-border">
```

### Custom CSS with Tokens

```css
.custom-element {
  background-color: var(--background);
  color: var(--foreground);
  border-radius: var(--radius-lg);
}
```

---

## 🔄 Future Considerations

### Dark Mode (Not Currently Implemented)

The design system is prepared for dark mode but currently only uses light mode:
- Pure white background (#ffffff)
- Dark gray text (#1f2937)
- Blue primary accent (#2563eb)

To implement dark mode in the future:
1. Add dark mode variants to CSS variables
2. Implement theme toggle in UI
3. Test all components in both modes
4. Ensure WCAG AA contrast in dark mode

---

## 📚 References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Inter Font](https://fonts.google.com/specimen/Inter)

---

**Last Updated:** December 4, 2025  
**Version:** 1.0.0  
**Maintained by:** AIComic Development Team
