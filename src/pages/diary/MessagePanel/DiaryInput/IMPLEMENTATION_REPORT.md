# DiaryInput Charm System — Implementation Report

**Date:** July 3, 2026  
**Scope:** Charm infrastructure, `DiaryInput` composer shell, Ticket decorator, Countdown decorator (compose + feed parity)  
**Architecture reference:** [`../_architecture.md`](../_architecture.md)

---

## Executive Summary

The message composer was rebuilt from a wrapper-based model (`DecoratedEditor` nesting `TicketDecorator` / `CountdownDecorator`) to the **Charm pipeline** described in the architecture document. Decorators no longer wrap each other; they contribute independent charms that merge into a single `ComposerSurface`.

Two decorators were implemented end-to-end:

| Decorator | Charms | Status |
|-----------|--------|--------|
| **Ticket** | `TicketBorderCharm`, `TicketTearCharm` | Visual + click-to-complete |
| **Countdown** | `DisplayCharm`, `ModeCharm`, `ControlsCharm`, `RuntimeCharm` | Three modes, Mantine pickers, centralized ticking |

The same rendering pipeline is used in **compose mode** (`DiaryInput`) and **feed mode** (`MessageDecoratorShell` → `DecoratedSurface`).

---

## What Changed (Before → After)

### Before

```text
MessageComposer
└── DecoratedEditor (wrapper hell)
    ├── CountdownDecorator (wraps children)
    └── TicketDecorator (wraps children)
        └── TextEditor / TodoEditor / AIEditor
```

- Decorators nested via sequential React wrappers
- Countdown owned its own `setInterval` inside the display component
- String-based or inline event handlers
- Ticket stub on the **right**, purple styling
- Countdown used a 4-segment Days/Hrs/Mins/Secs grid with `title` field

### After

```text
DiaryInput
├── AttachmentTray
├── DecoratedSurface
│   ├── useCharmPipeline → merge contributions
│   ├── useDecoratorRuntime → single tick loop
│   └── ComposerSurface (one surface, many regions)
│       ├── overlay | header | top | left | right | bottom | footer
│       └── VariantEditor (TextEditor / TodoEditor / AIEditor)
└── ActionDock
```

- Decorators register charms via `decoratorRegistry`
- Timer ticking centralized in `useDecoratorRuntime`
- Structured events: `emit({ decorator, action, payload? })`
- Ticket stub on the **left**, orange dashed mockup styling
- Countdown split into display / mode / controls / runtime responsibilities

---

## Architecture Decisions Implemented

| # | Decision | Implementation |
|---|----------|----------------|
| 1 | **Overlay region** | `CharmRegion` includes `overlay`; `ComposerSurface` renders `OverlayRegion` (absolute, `pointer-events: none` by default) |
| 2 | **Countdown charm split** | Four charms: display, mode selector, controls, runtime — no monolithic display component |
| 3 | **Structured events** | `ComposerEvent = { decorator, action, payload? }` routed through `decoratorRegistry.handleEvent` |
| 4 | **Expanded ComposerContext** | Exposes `variant`, `decorators`, `attachments`, `relationships` plus `draft`, `updateDecorator`, `updateDraft`, `emit` |
| 5 | **Centralized runtime** | `useDecoratorRuntime` aggregates `RuntimeContribution` from charms; `DisplayCharm` never creates intervals |
| 6 | **Style merge priority** | Lower `priority` merged first; higher priority wins; equal priority preserves charm array order |

---

## File Structure

```text
src/pages/diary/MessagePanel/DiaryInput/
├── DiaryInput.tsx                    # Composer entry (replaces MessageComposer orchestration)
├── ActionDock/
│   └── index.ts                      # Re-exports ActionBar as ActionDock
├── DecoratedSurface/
│   └── DecoratedSurface.tsx          # Shared compose + feed wrapper
├── ComposerSurface/
│   ├── ComposerSurface.tsx           # Region layout renderer
│   └── ComposerSurface.module.css
├── charms/
│   ├── charm.types.ts                # Charm, regions, contributions, context, events
│   ├── collectCharms.ts              # Flatten decorator charms from registry
│   ├── mergeContributions.ts         # Sort regions, merge styles with priority
│   ├── useCharmPipeline.ts           # React hook → MergedPipeline
│   ├── useDecoratorRuntime.ts        # Centralized 1s tick loop
│   └── buildComposerContext.ts       # Context builder + useComposerContext hook
└── decorators/
    ├── decoratorRegistry.ts          # ticket + countdown definitions + event router
    ├── ticket/
    │   ├── ticket.decorator.ts
    │   ├── ticketBorderCharm.ts
    │   ├── ticketTearCharm.tsx
    │   ├── TicketTear.tsx
    │   └── ticketCharms.module.css
    └── countdown/
        ├── countdown.decorator.ts
        ├── countdown.utils.ts        # Duration math, play/pause/reset, normalization
        ├── displayCharm.tsx
        ├── countdownModeCharm.tsx
        ├── countdownControlsCharm.tsx
        ├── RuntimeCharm.ts
        ├── CountdownDisplay.tsx
        ├── CountdownModeSelect.tsx
        ├── CountdownControls.tsx
        └── countdownCharms.module.css

src/packages/base/
├── AdDurationPicker/                 # Mantine TimePicker wrapper (h:m:s)
└── AdDateTimePicker/                 # Mantine DateTimePicker wrapper
```

### Integration / Modified Files

| File | Change |
|------|--------|
| [`Composer/MessageComposer.tsx`](../Composer/MessageComposer.tsx) | Thin re-export of `DiaryInput` |
| [`MessageFeed/messageRender/MessageDecoratorShell.tsx`](../MessageFeed/messageRender/MessageDecoratorShell.tsx) | Uses `DecoratedSurface` instead of legacy wrappers |
| [`Composer/useComposerDraft.ts`](../Composer/useComposerDraft.ts) | Added `updateDraft` export |
| [`Composer/composer.utils.ts`](../Composer/composer.utils.ts) | Updated `createTicketDecorator` / `createCountdownDecorator` |
| [`store/diary/type.ts`](../../../../store/diary/type.ts) | Extended decoration types |
| [`store/diary/constants.ts`](../../../../store/diary/constants.ts) | Updated seed countdown decoration |
| [`ChatboxSidebar/Chatbox/chatbox.utils.ts`](../../ChatboxSidebar/Chatbox/chatbox.utils.ts) | Preview uses formatted timer, not `title` |
| [`main.tsx`](../../../../main.tsx) | `@mantine/dates/styles.css` + `DatesProvider` |
| [`packages/base/index.ts`](../../../../packages/base/index.ts) | Export new pickers |

### Removed

| Path | Reason |
|------|--------|
| `Composer/DecoratedEditor/` | Replaced by `DecoratedSurface` + `ComposerSurface` |
| `Composer/decorations/TicketDecorator/` | Replaced by ticket charms |
| `Composer/decorations/CountdownDecorator/` | Replaced by countdown charms |
| `InputFooter/` | Unused stub |

---

## Charm System

### Charm Shape

```ts
type Charm = {
  id: string;
  region: CharmRegion;
  order: number;
  styles?: StyleContribution[];
  elements?: ElementContribution[];
  interactions?: InteractionContribution[];
  runtime?: RuntimeContribution;
};
```

### Regions

```text
header | top | left | right | bottom | footer | overlay | container
```

### Rendering Pipeline

```text
ComposerDraft.decorations
      ↓
decoratorRegistry (per type)
      ↓
Charm[]
      ↓
collectCharms + mergeContributions
      ↓
MergedPipeline { containerStyles, regionStyles, regionElements, interactions, runtimes }
      ↓
ComposerSurface render
      ‖
useDecoratorRuntime (parallel tick loop)
```

### Style Merge Algorithm

1. Collect all `StyleContribution` entries for a target
2. Sort by `priority` ascending (default `0`)
3. Equal priority → preserve original charm order
4. Merge left-to-right; later values override earlier ones

Example: ticket `priority: 100` vs a future priority decorator at `200` → higher wins on conflicts.

### ComposerContext

```ts
type ComposerContext = {
  draft: ComposerDraft;
  variant: MessageVariant;
  decorators: MessageDecorator[];
  attachments: Attachment[];
  relationships: ComposerRelationship[];
  composing: boolean;
  updateDecorator: (index, decoration) => void;
  updateDraft: (updater) => void;
  emit: (event: ComposerEvent) => void;
};
```

### Structured Events

```ts
emit({ decorator: 'ticket', action: 'complete' });
emit({ decorator: 'countdown', action: 'play' });
emit({ decorator: 'countdown', action: 'pause' });
emit({ decorator: 'countdown', action: 'reset' });
```

Events are dispatched by `handleDecoratorEvent` in `decoratorRegistry.ts` to each decorator's `handleEvent` map.

---

## Data Model

### TicketDecorator

```ts
type TicketDecorator = {
  type: 'ticket';
  state: 'todo' | 'doing' | 'done';
  ticked: boolean;
};
```

Removed unused `title` field.

### CountdownDecorator

```ts
type CountdownMode = 'countdown' | 'countup' | 'datetime';

type CountdownDecorator = {
  type: 'countdown';
  mode: CountdownMode;
  pause: boolean;
  running: boolean;
  durationMs: number;        // countdown: configured/remaining duration
  startedAt: string | null;  // countup: anchor when running
  targetDate: string;        // datetime: absolute target
  deadlineAt: string | null; // countdown/datetime: end time when running
};
```

### Legacy Migration

`normalizeCountdownDecorator()` in `countdown.utils.ts` converts old messages `{ title, targetDate, pause }` to `mode: 'datetime'` with inferred fields. Applied at read time in `DecoratedSurface` and display logic.

### Default Values (new countdown)

- `mode: 'countdown'`
- `durationMs: 25 * 60 * 1000` (25:00 mockup default)
- `running: false`, `pause: false`

---

## Ticket Decorator

### TicketBorderCharm

- **Region:** `container`
- **Priority:** 100
- **Styles:** Orange dashed border (`2px dashed`), rounded corners, warm tinted background

### TicketTearCharm

- **Region:** `left` (stub on left per mockup)
- **Visual:** Scalloped left edge via CSS mask, check icon + "Tear to complete" label
- **Interaction:** Click → `emit({ decorator: 'ticket', action: 'complete' })`
- **Compose mode:** Button disabled/greyed while `composing === true`
- **Feed mode:** Click toggles `state` between `todo` and `done`

### Deferred (v1)

- Drag/swipe tear gesture
- `InteractionContribution` pointer capture beyond click

---

## Countdown Decorator

### DisplayCharm (`top`, order 1)

**Display only — no intervals, no play/pause/reset dispatch.**

| Mode | Composing | Running / Feed |
|------|-----------|----------------|
| **countdown** | Days number input + `AdDurationPicker` (h:m:s) | Formatted remaining time (read-only) |
| **countup** | Static `00:00` | Formatted elapsed (hidden zero segments) |
| **datetime** | `AdDateTimePicker` | Formatted time-until-target or datetime label |

Picker changes call `updateDecorator` directly (authoring edits).

### ModeCharm (`top`, order 2)

- `AdSelect` dropdown: Countdown / Countup / Datetime
- On change: `setCountdownMode()` resets mode-specific fields and stops running

### ControlsCharm (`top`, order 3)

- Circular **Play**, **Pause**, **Reset** buttons
- Each emits structured event only; reducers live in `countdown.decorator.ts` + `countdown.utils.ts`

### RuntimeCharm (non-visual)

Registers `RuntimeContribution`:

```ts
shouldTick: running && !pause && !composing
tick: tickCountdownDecorator(decoration, now)
```

Consumed by `useDecoratorRuntime` — single shared interval for all timer decorators.

### Countdown Utilities (`countdown.utils.ts`)

| Function | Purpose |
|----------|---------|
| `durationMsToParts` / `partsToDurationMs` | Split/combine days + `hh:mm:ss` |
| `formatCountdownDisplay` | e.g. `25:00` or `1d 02:30:15` |
| `formatCountupDisplay` | Omits leading zero segments |
| `getCountdownRemainingMs` | Remaining/elapsed calculation per mode |
| `playCountdownDecorator` | Start running, set anchors |
| `pauseCountdownDecorator` | Snapshot remaining into `durationMs` |
| `resetCountdownDecorator` | Restore defaults per mode |
| `normalizeCountdownDecorator` | Legacy → new shape |

---

## Mantine Pickers

### Dependencies Added

- `@mantine/dates@8.3.16` (matches `@mantine/core` v8)
- `dayjs`

### AdDurationPicker

- Wraps Mantine `TimePicker` with `withSeconds` + `withDropdown`
- Paired with a separate **days** number input in `CountdownDisplay` (Mantine v8.3 does not expose `type="duration"`)
- Compact styling for countdown header bar

### AdDateTimePicker

- Wraps Mantine `DateTimePicker`
- ISO string in/out
- Used in datetime mode while composing

### App Setup

`main.tsx` imports `@mantine/dates/styles.css` and wraps the app with `DatesProvider`.

---

## UI Layout (Mockup Mapping)

```text
╭~~stub~~╮║  [⏱] [days] d [hh:mm:ss] [Countdown ▾]  [▶] [⏸] [↺]
│ ✓ Tear │║  ┌─────────────────────────────────────────────┐
│complete│║  │ Write something...                          │
╰~~~~~~~~╯║  └─────────────────────────────────────────────┘
  Ticket   ║  Countdown header (blue tint) + editor
```

| Mockup element | Charm | Region |
|----------------|-------|--------|
| Dashed orange border | TicketBorderCharm | container |
| Left stub + "Tear to complete" | TicketTearCharm | left |
| Blue header bar | Display + Mode + Controls shared `top` styles | top |
| Days + duration pickers | DisplayCharm | top |
| Date/time picker | DisplayCharm (datetime mode) | top |
| Mode dropdown | ModeCharm | top |
| Play / Pause / Reset | ControlsCharm | top |
| Timer ticking | RuntimeCharm → `useDecoratorRuntime` | runtime (no UI) |

---

## Compose vs Feed Parity

Both paths use **`DecoratedSurface`**:

| Context | `composing` | `updateDecorator` source |
|---------|-------------|---------------------------|
| `DiaryInput` | `true` | `useComposerDraft` local state |
| `MessageDecoratorShell` | `false` | `useDiaryStore('updateMessage')` |

Same charms, same merge pipeline, same visual output.

---

## Verification

| Check | Result |
|-------|--------|
| `npm run build` | Passes |
| ESLint (implementation files) | 0 errors on all new/modified feature files |
| ESLint (full repo) | Fails due to ~21k pre-existing issues in `iconRegistryData.ts` and other legacy files — unrelated to this work |

---

## Out of Scope (Future Work)

- Ticket drag/swipe tear gesture
- Additional decorators (reminder, priority, scheduled, overlay stickers/sparkles)
- Full variant/attachment/relationship layer renames from architecture doc
- Month/year in duration picker
- `InteractionContribution` beyond click handlers
- Plugin/decorator registration at runtime

---

## How to Extend

### Add a new decorator

1. Define decoration type in `store/diary/type.ts`
2. Create `decorators/myDecorator/` with charm factories
3. Register in `decoratorRegistry.ts` with `createCharms` + optional `handleEvent`
4. Add toggle/creation in `composer.utils.ts` and `ActionDock`
5. If timer-based: add `RuntimeContribution` — do **not** create local intervals

### Add a floating overlay visual

1. Create a charm with `region: 'overlay'`
2. Contribute `elements` with `pointer-events: auto` on interactive parts if needed
3. Default overlay region uses `pointer-events: none`

---

## Related Documentation

- [`../_architecture.md`](../_architecture.md) — Target architecture (updated to match this implementation)
- Plan artifact: `decorator_charm_system` (Cursor plans)
