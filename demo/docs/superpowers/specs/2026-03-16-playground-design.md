# Playground — Tailwind Super Corners

## Overview

Interactive playground in the demo app (`App.tsx`) where users can tweak all three plugin features simultaneously and see the result in real time on a single element.

## Features Covered

1. **Concentric borders** — auto-calculated inner border-radius for nested elements
2. **Outer corners** — concave (inverse) rounded corners via pseudo-elements
3. **Corner shapes** — CSS `corner-shape` with multiple shape keywords

## State

Single flat state object, all values persist across interactions:

```ts
interface PlaygroundState {
  padding: number        // px (0–64), controls padding + --sc-gap
  borderRadius: number   // px (0–64), controls border-radius + --sc-radius
  outRadius: number      // px (0–64), controls --sc-out-radius-base
  cornerShape: string    // 'round' | 'squircle' | 'smooth' | 'scoop' | 'bevel' | 'notch' | 'square'
}
```

## Layout

The existing layout structure is preserved:

- **Header** — "Tailwind Super Corners" headline with Docs/Github links
- **Main div** — the preview element with all plugin classes applied
  - Contains a **child element** with `sc-concentric` to demonstrate auto-calculated inner radius
  - Contains a **ScrollArea** with all controls

## Main Div — Class & Style Strategy

Since Tailwind requires static class analysis at build time, numeric values are applied via inline `style` setting both native CSS properties and the plugin's CSS custom variables:

```tsx
style={{
  borderRadius: `${borderRadius}px`,
  padding: `${padding}px`,
  '--sc-radius': `${borderRadius}px`,
  '--sc-gap': `${padding}px`,
  '--sc-out-radius-base': `${outRadius}px`,
}}
```

Static keyword classes are applied normally:

- `sc-out` — activates outer corners (reads `--sc-out-radius-base` for size)
- `sc-${cornerShape}` — corner shape (static string, e.g. `sc-squircle`)
- `sc-concentric` — on the child element

Corner shape is the only class that changes dynamically, but since it's a finite set of static strings, it can be conditionally applied without interpolation issues.

## Controls

All controls are visible simultaneously inside the ScrollArea, using the existing `Slider` and `ToggleGroup` components:

1. **Slider "Padding"** — min: 0, max: 64, controls `padding`
2. **Slider "Border Radius"** — min: 0, max: 64, controls `borderRadius`
3. **Slider "Outer Corners"** — min: 0, max: 64, controls `outRadius`
4. **Toggle Group "Corner Shape"** — 7 options: round, squircle, smooth, scoop, bevel, notch, square

## Concentric Child Element

A visible child element inside the main div that:

- Has `sc-concentric` class applied
- Has its own background color (to visually distinguish from parent)
- Demonstrates the auto-calculated inner border-radius based on parent's radius minus padding

## Dependencies

- Existing components: `Slider`, `ToggleGroup`, `ScrollArea` from `@/components`
- No new dependencies required

## Out of Scope

- Per-corner controls (e.g. sc-out-tl, sc-t-squircle)
- Superellipse custom exponent slider
- Border width/color controls for outer corners
- Code generation / copy-to-clipboard
