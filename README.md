# tailwind-super-corners

Tailwind CSS v4 plugin with three corner utilities:

- **Concentric** — auto-calculated inner border-radius for nested elements
- **Outer corners** — inverse (concave) rounded corners via pseudo-elements
- **Corner shape** — CSS `corner-shape` property (`squircle`, `superellipse`, etc.)

## Install

```bash
bun add tailwind-super-corners
```

```css
/* globals.css */
@import "tailwind-super-corners";
```

### tailwind-merge

If you use `tailwind-merge`, the package exports a plugin that registers all `sc-*` class groups automatically:

```ts
import { withSuperCorners } from "tailwind-super-corners"
import { extendTailwindMerge } from "tailwind-merge"

const twMerge = extendTailwindMerge(withSuperCorners)
```

This ensures `sc-concentric` classes conflict correctly with `rounded-*`, shape keywords override each other, etc.

---

## 1. Concentric borders (`sc-concentric`)

Automatically computes `inner_radius = outer_radius - padding - border` for nested elements. Supports unlimited nesting depth via CSS container style queries with even/odd parity toggle.

### How it works

1. **Parent** uses standard Tailwind `rounded-*`, `p-*` and `border` classes — the plugin shadows these to also set `--sc-radius`, `--sc-gap` and `--sc-border`.
2. **Child** uses `sc-concentric` to read the propagated values and apply the correct inner radius.
3. Each nesting level takes off its own padding and border width. A wrapper with neither (`flex gap-2`, a positioned `div`) takes nothing off, and the nearest `rounded-*` ancestor is the reference.
4. Only uniform `p-*` and `border` / `border-{n}` count: a concentric curve needs the same gap on both sides of a corner, so `px-*`, `pt-*`, `border-t` and the like are ignored.

### Publisher classes (parent)

These shadow core Tailwind utilities. You don't need special classes — just use normal `rounded-*`, `p-*` and `border`:

| Class | Sets |
|---|---|
| `rounded-{token}` | `border-radius` + `--sc-radius`; the element becomes the reference |
| `rounded-t-{token}` | top corners + `--sc-radius` |
| `rounded-r-{token}` | right corners + `--sc-radius` |
| `rounded-b-{token}` | bottom corners + `--sc-radius` |
| `rounded-l-{token}` | left corners + `--sc-radius` |
| `p-{token}` | `padding` + `--sc-gap` |
| `border`, `border-{n}` | `border-width` + `--sc-border` |

### Consumer classes (child)

| Class | Corners affected | Fallback |
|---|---|---|
| `sc-concentric` | all | `inherit` |
| `sc-concentric-{token}` | all | `{token}` value |
| `sc-t-concentric[-{token}]` | top-left, top-right | |
| `sc-r-concentric[-{token}]` | top-right, bottom-right | |
| `sc-b-concentric[-{token}]` | bottom-right, bottom-left | |
| `sc-l-concentric[-{token}]` | top-left, bottom-left | |
| `sc-tl-concentric[-{token}]` | top-left | |
| `sc-tr-concentric[-{token}]` | top-right | |
| `sc-bl-concentric[-{token}]` | bottom-left | |
| `sc-br-concentric[-{token}]` | bottom-right | |

The `{token}` is any `borderRadius` theme value (e.g. `lg`, `xl`, `3xl`). When omitted, falls back to `inherit`.

### Example

```html
<!-- Parent: 3xl radius, 4 padding -->
<div class="rounded-3xl p-4 bg-gray-100">
  <!-- Child: auto-calculated radius (3xl - 4 = concentric) -->
  <div class="sc-concentric bg-white">
    <!-- Grandchild: works at any depth -->
    <div class="p-2">
      <div class="sc-concentric bg-gray-50">...</div>
    </div>
  </div>
</div>
```

### With explicit fallback

```html
<!-- If no parent propagates, falls back to rounded-lg -->
<div class="sc-concentric-lg bg-white">...</div>
```

### Minimum radius

Deep nesting can take the radius down to zero. `sc-min-{token}` (or `--sc-min`) sets a floor for every `sc-concentric` inside it, never rounder than the reference it nests in:

```html
<div class="rounded-3xl p-3 sc-min-[4px]">
  <div class="sc-concentric p-3">
    <!-- 24 - 12 - 12 = 0, raised to 4px -->
    <div class="sc-concentric">...</div>
  </div>
</div>
```

Set it once for a whole app with `:root { --sc-min: 4px; }`.

### Inside out (`sc-fit`)

A pill's radius is always half its height, so a pill in a corner can't follow the corner. The gap around it can. `sc-fit-{h}` goes on the element whose padding holds pills of height `h`, and sets that padding to the radius left at the corner minus half the pill:

```html
<!-- 24 - 18 - border 1 = 5px: the 36px tabs share the card's corner center -->
<div class="rounded-3xl border sc-fit-9">
  <div class="flex">
    <button class="h-9 rounded-full px-3">Preview</button>
    <button class="h-9 rounded-full px-3">Code</button>
  </div>
</div>
```

- `{h}` is any spacing token (`sc-fit-9` = 36px, `sc-fit-7` = 28px) or a length (`sc-fit-[40px]`).
- On a `rounded-*` element the corner is its own radius. On a bar inside a rounded surface (a header, a toolbar), it's the radius left at that level, so the class works there too.
- The gap never drops below `--sc-fit-min` (default `0.25rem`): a pill rounder than the corner can't sit on its center.
- The gap publishes like a `p-*`, so `sc-concentric` blocks inside still nest. With `tailwind-merge`, `sc-fit-*` and `p-*` replace each other.

---

## 2. Outer corners (`sc-out`)

Creates inverse (concave) rounded corners using `::before` and `::after` pseudo-elements. The element must be `position: relative` for correct placement.

Automatically upgrades to native `corner-shape: superellipse()` with negative values when supported.

### All-corners variants

| Class | Description |
|---|---|
| `sc-out` | Both bottom corners, default radius |
| `sc-out-{size}` | Both bottom corners, custom radius |

### Side variants (two corners)

| Class | Corners | Pseudo-elements |
|---|---|---|
| `sc-out-t[-{size}]` | top-left + top-right | `::before` + `::after` |
| `sc-out-b[-{size}]` | bottom-left + bottom-right | `::before` + `::after` |
| `sc-out-l[-{size}]` | left-top + left-bottom | `::before` + `::after` |
| `sc-out-r[-{size}]` | right-top + right-bottom | `::before` + `::after` |

### Individual corner variants

| Class | Corner | Pseudo-element |
|---|---|---|
| `sc-out-tl[-{size}]` | top-left | `::before` |
| `sc-out-tr[-{size}]` | top-right | `::after` |
| `sc-out-bl[-{size}]` | bottom-left | `::before` |
| `sc-out-br[-{size}]` | bottom-right | `::after` |
| `sc-out-lt[-{size}]` | left-top | `::before` |
| `sc-out-lb[-{size}]` | left-bottom | `::after` |
| `sc-out-rt[-{size}]` | right-top | `::before` |
| `sc-out-rb[-{size}]` | right-bottom | `::after` |

> **Note on naming:** `sc-out-bl` = bottom-left (horizontal edge), `sc-out-lb` = left-bottom (vertical edge). The first letter indicates the edge, the second indicates which end of that edge.

### Sizing

- Without suffix: uses `--sc-out-radius-base` (default `1rem`)
- With suffix: accepts any length (`sc-out-2xl`, `sc-out-[12px]`) or `--radius-*` theme tokens

### Example

```html
<!-- Tab-like element with outer corners at the bottom -->
<div class="relative bg-blue-500 sc-out">
  Tab content
</div>

<!-- Custom size -->
<div class="relative bg-blue-500 sc-out-xl">
  Tab content
</div>

<!-- Only bottom-left corner -->
<div class="relative bg-blue-500 sc-out-bl">
  Tab content
</div>
```

### Requirements

- The element needs `position: relative` (add `relative` class)
- The element needs a background (`bg-*`), as pseudo-elements inherit it
- Pseudo-elements are positioned absolutely outside the element bounds — ensure the parent has `overflow: visible` (default)

---

## 3. Corner shape (`sc-{shape}`)

Sets the CSS `corner-shape` property on individual or grouped corners.

### Static keywords

| Class prefix | CSS output | `--corner-superellipse` |
|---|---|---|
| `sc-round` | `corner-shape: round` | `1` |
| `sc-scoop` | `corner-shape: scoop` | `-1` |
| `sc-bevel` | `corner-shape: bevel` | `0` |
| `sc-notch` | `corner-shape: notch` | `-infinity` |
| `sc-square` | `corner-shape: square` | `infinity` |
| `sc-squircle` | `corner-shape: squircle` | `2` |
| `sc-smooth` | `corner-shape: superellipse(1.6)` | `1.6` |

### Superellipse with custom exponent

Use `sc-superellipse/{value}` for arbitrary superellipse values:

```html
<div class="rounded-xl sc-superellipse/2">...</div>   <!-- squircle -->
<div class="rounded-xl sc-superellipse/1.6">...</div>  <!-- smooth -->
<div class="rounded-xl sc-superellipse/4">...</div>    <!-- more squared -->
```

Accepts numbers, `e`, `pi`, `infinity`, and their negatives.

### Per-corner and per-side

All shape classes support side/corner prefixes:

| Prefix | Corners affected |
|---|---|
| `sc-` | all corners |
| `sc-t-` | top-left + top-right |
| `sc-r-` | top-right + bottom-right |
| `sc-b-` | bottom-right + bottom-left |
| `sc-l-` | top-left + bottom-left |
| `sc-s-` | start-start + end-start (logical) |
| `sc-e-` | start-end + end-end (logical) |
| `sc-tl-` | top-left |
| `sc-tr-` | top-right |
| `sc-br-` | bottom-right |
| `sc-bl-` | bottom-left |
| `sc-ss-` | start-start (logical) |
| `sc-se-` | start-end (logical) |
| `sc-ee-` | end-end (logical) |
| `sc-es-` | end-start (logical) |

### Examples

```html
<!-- Squircle all corners -->
<div class="rounded-2xl sc-squircle">...</div>

<!-- Smooth top, bevel bottom -->
<div class="rounded-2xl sc-t-smooth sc-b-bevel">...</div>

<!-- Custom superellipse on one corner -->
<div class="rounded-2xl sc-tl-superellipse/3">...</div>

<!-- Notch only bottom-right -->
<div class="rounded-xl sc-br-notch">...</div>
```

### Browser support

`corner-shape` is a new CSS property. Currently supported in Chrome 138+ behind a flag. The `--corner-superellipse` custom property is always set for use by other utilities (like `sc-out`'s progressive enhancement).

---

## Combined usage

All three features compose together:

```html
<!-- Outer card with squircle shape + concentric inner card -->
<div class="rounded-3xl p-6 bg-gray-100 sc-squircle">
  <div class="sc-concentric bg-white p-4">
    <div class="sc-concentric bg-gray-50">
      Unlimited nesting, auto-calculated radius
    </div>
  </div>
</div>

<!-- Tab bar with outer corners and smooth shape -->
<div class="relative bg-white rounded-t-xl sc-out-bl sc-out-br sc-smooth">
  Active tab
</div>
```

## CSS custom properties

| Variable | Set by | Description |
|---|---|---|
| `--sc-radius` | `rounded-*` publishers | Propagated border-radius value |
| `--sc-gap` | `p-*` publishers | The element's own padding (registered, not inherited) |
| `--sc-border` | `border` / `border-{n}` publishers | The element's own border width (registered, not inherited) |
| `--sc-min` | `sc-min-*`, or set by you | Minimum concentric radius (default `0px`) |
| `--sc-fit-min` | Set by you | Smallest gap `sc-fit-*` leaves around a pill (default `0.25rem`) |
| `--sc-odd` / `--sc-even` | Parity system | Accumulated radius at each depth |
| `--_sc-parity` | Parity system | Current parity (`odd` / `even`) |
| `--_sc-active` | `rounded-*` publishers | Marks element as concentric root |
| `--sc-out-radius-base` | Theme | Default outer corner radius (`1rem`) |
| `--sc-out-mask` | Theme | Radial gradient mask for outer corners |
| `--corner-superellipse` | `sc-{shape}` | Superellipse exponent for progressive enhancement |

## License

MIT
