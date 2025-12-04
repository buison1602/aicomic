# Design System Quick Reference

## 🎨 Colors

```tsx
// Backgrounds
bg-background        // #ffffff (white)
bg-card             // #ffffff (white)
bg-muted            // #f9fafb (gray-50)
bg-secondary        // #f3f4f6 (gray-100)
bg-accent           // #eff6ff (blue-50)

// Text
text-foreground     // #1f2937 (gray-800) - main text
text-muted-foreground // #6b7280 (gray-500) - secondary text

// Primary Accent
bg-primary          // #2563eb (blue-600)
text-primary-foreground // #ffffff (white)

// Borders
border-border       // #e5e7eb (gray-200)
```

## 🔘 Buttons

```tsx
// Primary Button
<button className="bg-primary text-primary-foreground rounded-lg px-4 py-2 
  font-medium transition-colors duration-200 cursor-pointer hover:opacity-90">
  Primary Action
</button>

// Secondary Button
<button className="bg-secondary text-secondary-foreground rounded-lg px-4 py-2 
  font-medium transition-colors duration-200 cursor-pointer hover:bg-gray-200">
  Secondary Action
</button>
```

## 🎴 Cards

```tsx
// Basic Card
<div className="bg-card text-card-foreground rounded-lg shadow-sm p-6">
  Card Content
</div>

// Interactive Card
<div className="bg-card rounded-lg shadow-sm hover:shadow-md transition-smooth 
  cursor-pointer p-6">
  Clickable Card
</div>
```

## 📏 Spacing

```tsx
// Section spacing
<section className="py-12 md:py-16 lg:py-24">

// Container padding
<div className="px-4 sm:px-6 lg:px-8">

// Content gaps
<div className="space-y-6">  // Vertical spacing
<div className="gap-6">      // Grid/flex gap
```

## 🔤 Typography

```tsx
<h1 className="text-4xl md:text-5xl font-semibold">Heading 1</h1>
<h2 className="text-3xl md:text-4xl font-semibold">Heading 2</h2>
<h3 className="text-2xl md:text-3xl font-semibold">Heading 3</h3>
<p className="text-base leading-relaxed">Body text</p>
<p className="text-sm text-muted-foreground">Small text</p>
```

## 📱 Responsive Grid

```tsx
// 1 col mobile, 2 col tablet, 3 col desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// 1 col mobile, 2 col tablet, 3 col laptop, 4 col desktop
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
```

## 🎯 Border Radius

```tsx
rounded-sm  // 4px - small elements
rounded-md  // 6px - medium elements
rounded-lg  // 8px - DEFAULT (buttons, cards)
rounded-xl  // 12px - large containers
```

## 🔍 Common Patterns

```tsx
// Page container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

// Centered content
<div className="flex items-center justify-center min-h-screen">

// Card with image
<div className="bg-card rounded-lg shadow-sm overflow-hidden">
  <img className="w-full h-48 object-cover" />
  <div className="p-6">
    <h3 className="font-semibold">Title</h3>
    <p className="text-muted-foreground">Description</p>
  </div>
</div>
```

## 🎨 Icons (Lucide)

```tsx
import { Home, Book, User, Search } from 'lucide-react';

<Home className="w-6 h-6 text-foreground" />
<Search className="w-5 h-5 text-muted-foreground" />
```

## ♿ Accessibility

```tsx
// Focus ring
<button className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">

// Alt text for images
<img src="/image.jpg" alt="Descriptive text" />

// Semantic HTML
<button> not <div> for clickable elements
<nav>, <main>, <article>, <section> for structure
```

## ⚡ Performance

```tsx
// Next.js Image
import Image from 'next/image';
<Image src="/image.jpg" alt="..." width={400} height={300} />

// Lazy loading
<div className="..." loading="lazy">
```

## 🎭 Transitions

```tsx
// Standard transition (200ms)
<div className="transition-colors duration-200">

// Smooth transition (all properties)
<div className="transition-smooth">  // 200ms ease-in-out

// Custom transition
<div className="transition-all duration-300 ease-in-out">
```

## ✅ Component Checklist

Before committing any component:
- [ ] `rounded-lg` for corners
- [ ] `cursor-pointer` on interactive elements
- [ ] Hover states with 200ms transitions
- [ ] Visible focus states
- [ ] Design system colors (no hardcoded hex)
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Text contrast ≥ 4.5:1
- [ ] Lucide icons (not emojis)
- [ ] Alt text on images
- [ ] Inter font (via design system)

---

**Full documentation:** See `DESIGN_SYSTEM.md`
