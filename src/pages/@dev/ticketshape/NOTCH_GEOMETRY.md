# Ticket Left-Edge Scallop Geometry

Reference for configuring the notebook-hole pattern on the ticket shape dev page.

**Main file:** [`notch.utils.ts`](./notch.utils.ts)  
**Renderer:** [`TicketShapePreview.tsx`](./TicketShapePreview.tsx)  
**Config:** [`config.ts`](./config.ts)

---

## Overview

The left edge is built in three layers:

| Layer | Function | Role |
|-------|----------|------|
| Layout math | `computeNotchLayout()` | Computes Y positions for middle full bumps only |
| Path stitching | `buildLeftEdgePath()` | Orders SVG commands bottom → top |
| Arc helpers | `outwardNotchArc`, `outwardHalfArcTop`, `outwardHalfArcBottom` | Draw one segment each |

Playground knobs (from `TicketShapeConfig`):

| Config | Symbol | Meaning |
|--------|--------|---------|
| `notchRadius` | `r` | Radius of each scallop |
| `notchSpacing` | — | Center-to-center distance between **full** middle bumps |

---

## Layout math — `computeNotchLayout`

Does **not** draw anything. Returns `fullCenters[]` — Y positions of **middle full bumps only**.

```ts
const gap = Math.max(0, notchSpacing - 2 * r);
const firstCenter = 2 * r + gap;
const lastCenter = height - 2 * r - gap;

for (let cy = firstCenter; cy <= lastCenter; cy += notchSpacing) {
  fullCenters.push(cy);
}
```

### Derived values (defaults `r = 12`, `notchSpacing = 32`)

```
gap         = 32 - 24 = 8px    // straight vertical between full bumps
firstCenter = 24 + 8  = 32px   // Y of first middle bump center
lastCenter  = height - 32      // Y of last middle bump center
```

### Y-axis map (left edge, Y increases downward)

```
y = 0           top corner (0, 0)
y = 0 … r       TOP TERMINAL (quarter arc) — not in fullCenters
y = r … r+gap   straight gap before first full bump
y = firstCenter first fullCenters[0]  (spans y = r+gap … r+gap+2r)
y = …           more fullCenters[i]
y = H - r … H   BOTTOM TERMINAL (quarter arc)
y = H           bottom corner (0, height)
```

**First and last scallops are different** because they are **not** in `fullCenters`.  
Terminals are hard-coded in `buildLeftEdgePath`.

---

## Three arc types

### Middle — full 180° scallop

```ts
// outwardNotchArc(cy, r)
`L 0 ${cy + r} A ${r} ${r} 0 0 0 0 ${cy - r}`
```

- Bump center at `y = cy`
- Vertical span: **`2r`** (from `cy - r` to `cy + r`)
- Bulges outward to the left
- Same command for every middle bump in the loop

### Bottom terminal — quarter arc (LAST — different)

```ts
// outwardHalfArcBottom(height, r)
`A ${r} ${r} 0 0 0 0 ${height - r}`
```

- From `(0, height)` → `(0, height - r)`
- **90°** only (half the vertical size of a full bump)

### Top terminal — quarter arc (FIRST — different)

```ts
// outwardHalfArcTop(r)
`A ${r} ${r} 0 0 0 0 0`
```

- From `(0, r)` → `(0, 0)`
- **90°** only

---

## Path stitching — `buildLeftEdgePath`

Walks **bottom → top** (path already at `(0, height)` from the bottom horizontal edge):

```ts
parts.push(outwardHalfArcBottom(height, r));   // ① bottom terminal

for (i = fullCenters.length - 1; i >= 0; i--) {
  parts.push(outwardNotchArc(fullCenters[i], r));  // ② all middle full bumps
}

parts.push(`L 0 ${r}`);                        // ③ straight before top terminal
parts.push(outwardHalfArcTop(r));              // ④ top terminal
```

### Sequence diagram

```
(0, H) ── outwardHalfArcBottom ──► (0, H-r)
         outwardNotchArc(last)   ──► ...
         outwardNotchArc(first)  ──► ~(0, r+gap)
         L 0 r                     ──► (0, r)     ← explicit straight
         outwardHalfArcTop         ──► (0, 0)
```

| Segment | Function | Special? |
|---------|----------|----------|
| Bottom end | `outwardHalfArcBottom` | Yes — quarter arc |
| Middle | `outwardNotchArc` (loop) | No — all identical |
| Before top | `L 0 ${r}` | Yes — one straight line |
| Top end | `outwardHalfArcTop` | Yes — quarter arc |

---

## Where straights come from

### Between middle bumps (implicit)

Not separate path commands. Built into spacing:

Each bump ends at `(0, cy - r)`, next starts at `(0, nextCy + r)`.

```
straight length = (nextCy + r) - (cy - r) = notchSpacing - 2r = gap
```

- `notchSpacing = 2 * r` (e.g. 24) → `gap = 0` → bumps touch, no straight between
- `notchSpacing = 32`, `r = 12` → `gap = 8px` straight between each full bump

### Around terminals (from layout formulas)

| Straight | Controlled by |
|----------|----------------|
| After top quarter, before first full | `firstCenter = 2*r + gap` |
| After last full, before bottom quarter | `lastCenter = height - 2*r - gap` |
| Right before top quarter | `L 0 ${r}` in `buildLeftEdgePath` |

---

## Side profile (ASCII)

```
        TOP CORNER (0,0)
           │
    ┌──────┴────── outwardHalfArcTop()      ← FIRST (different)
    │             spans y: 0 → r
    │
    │  straight (from firstCenter math)
    │
    ├───────────── outwardNotchArc(cy)        ← MIDDLE (loop)
    │  straight (gap = spacing - 2r)
    ├───────────── outwardNotchArc(cy)
    │  ...
    │
    │  straight
    └──────┬────── outwardHalfArcBottom()    ← LAST (different)
           │
        BOTTOM CORNER (0,H)
```

---

## What to edit for custom config

### Middle bumps only

**File:** `computeNotchLayout` in `notch.utils.ts`

| Change | Edit |
|--------|------|
| First full bump height | `firstCenter = 2*r + gap` |
| Last full bump height | `lastCenter = height - 2*r - gap` |
| Step between full bumps | `cy += notchSpacing` |
| Straight between bumps | `gap = notchSpacing - 2*r` or add separate config |

### Top / bottom terminal shape

**File:** `outwardHalfArcTop`, `outwardHalfArcBottom`

Currently **quarter circles (90°)**. To change:

- **Full semicircle at top:** replace with something like `outwardNotchArc(r, r)` or a custom arc span
- **No curve at corner:** remove the `A` command, use only `L` (straight shoulder)
- **Different radius at terminals:** use a separate `terminalRadius` config

### Straight before top quarter

**File:** `buildLeftEdgePath`

```ts
parts.push(`L 0 ${r}`);  // change target Y or remove this line
```

### Add dedicated config fields (suggested)

In `config.ts`, you could split today’s derived values:

```ts
type TicketShapeConfig = {
  notchRadius: number;
  notchSpacing: number;      // middle full bump center step
  terminalGap?: number;      // straight after/before quarter arcs (default: spacing - 2r)
  terminalArcSpan?: number;  // 90 | 180 degrees
  // ...
};
```

Then wire those into `computeNotchLayout` and `buildLeftEdgePath`.

---

## Related files

| File | Purpose |
|------|---------|
| [`notch.utils.ts`](./notch.utils.ts) | Path geometry (`buildTicketPath`, layout math) |
| [`config.ts`](./config.ts) | Default numbers and colors |
| [`TicketShapePreview.tsx`](./TicketShapePreview.tsx) | SVG renderer (single dynamic path) |
| [`TicketShapeStage.tsx`](./TicketShapeStage.tsx) | Resizable preview stage + debug readout |
| [`TicketContent.tsx`](./TicketContent.tsx) | Checkmark + label overlay |
| [`index.tsx`](./index.tsx) | Dev page + controls |

Test page: `/dev?test=ticketshape`
 