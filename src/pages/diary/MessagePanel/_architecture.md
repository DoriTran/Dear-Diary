# Dear Diary - DiaryInput Composer Architecture

## Philosophy

DiaryInput is **NOT** a textarea with plugins.

DiaryInput is a **Message Composer System**.

A message is constructed from multiple independent axes:

```text
Message
├── Variant
├── Decorators[]
├── Attachments[]
└── Relationships
```

Each axis has a different responsibility and must be able to scale independently.

The architecture must support:

- rich note editing
- task management
- AI interaction
- future workspace integration
- future plugin/decorator systems

without creating wrapper hell.

---

# Core Principles

## Principle 1

A message has exactly **ONE Variant**.

```text
ONE Message
      =
ONE Variant
```

Examples:

- text
- todo
- ai
- chart (future)
- kanban (future)
- poll (future)

---

## Principle 2

A message may have **MULTIPLE Decorators**.

```text
Message
├── Variant
└── Decorators[]
```

Examples:

```text
text
+ ticket
+ countdown
+ priority
+ reminder
```

Decorators are stackable.

---

## Principle 3

Attachments are independent resources.

Attachments are unrelated to:

- Variant
- Decorator

Examples:

- image
- video
- file
- audio (future)
- workspace reference (future)
- calendar event (future)
- AI artifact (future)

---

## Principle 4

Relationships are independent message references.

Examples:

- reply
- forward

Future:

- mention
- quote
- reference

---

# Message Architecture

```text
Message
├── Variant
├── Decorators[]
├── Attachments[]
└── Relationships
```

# Variant

Variant controls how the user edits content.

## Text

- auto grow
- multiline
- scroll after max height

## Todo

```text
☐ item 1
☐ item 2
☐ item 3
```

- multiple rows
- attachment per row
- reorder row
- add/remove row

## AI

```text
Ask AI...
```

## Future Variants

- chart
- timeline
- kanban
- poll

# Decorator

Decorators control how the composer behaves and visually renders.

Examples:

- ticket
- countdown
- reminder
- priority
- scheduled
- bookmark

## Important Rule

Decorators **DO NOT wrap each other**.

### Wrong

```text
Countdown
 └ Ticket
 └ Reminder
 └ Input
```

### Correct

```text
Decorators
      ↓
   Charm[]
      ↓
    Merge
      ↓
ONE composer surface
```

# Charm System

Decorators do not render directly.

```text
Ticket
├── TicketBorderCharm
└── TicketTearCharm

Countdown
├── DisplayCharm
├── ModeCharm
├── ControlsCharm
└── RuntimeCharm
```

# Charm

```ts
type CharmRegion =
  | "header"
  | "top"
  | "left"
  | "right"
  | "bottom"
  | "footer"
  | "overlay"
  | "container";

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

## Charm Regions

```text
header | top | left | right | bottom | footer | overlay | container
```

- **overlay** — floating visual elements that do not affect layout (flowers, sparkles, particles, badges, stickers, notifications). Rendered above the composer surface.
- **container** — merged box styles and container-level interaction mounts.

# Style Contribution

```ts
{
  target: "container",
  priority: 100,
  styles: {
    borderStyle: "dashed",
    borderWidth: 2,
  },
}
```

## Style Merge Rules

When multiple charms contribute styles to the same `target`:

1. Sort contributions by `priority` ascending (default `0`). **Lower priority is merged first.**
2. When priorities are equal, preserve the order contributions appeared in the charm array.
3. Merge left-to-right: each subsequent contribution replaces conflicting property values.
4. **Higher priority always wins** over lower priority.

Example:

```text
ticket decorator:    priority 100
priority decorator:  priority 200

→ priority decorator wins on conflicting properties
```

# Element Contribution

```tsx
{
  region: "top",
  order: 1,
  render: (ctx) => (
    <CountdownDisplay />
  ),
}
```

# Interaction Contribution

Examples:

- drag ticket
- swipe ticket
- keyboard shortcuts
- gesture support
- pointer capture
- resize
- hover entire composer

```ts
{
  target: "container",
  mount(ctx) {
    // install listeners
    // return cleanup
  },
}
```

InteractionContribution remains part of the charm architecture for DOM-level behavior. State mutations should prefer structured `emit` events (see Composer Context).

# Runtime Contribution

Non-visual charm contribution consumed by the centralized runtime layer.

```ts
type RuntimeContribution = {
  shouldTick: (ctx: ComposerContext, decoration: MessageDecorator) => boolean;
  tick: (decoration: MessageDecorator, now: number) => MessageDecorator;
};
```

Decorators that need ticking (countdown, pomodoro, reminder, repeat, alarm) register via `RuntimeCharm`. **Visual charms must not own intervals.**

```text
active decorators
        ↓
RuntimeCharm contributions
        ↓
useDecoratorRuntime (single tick loop)
        ↓
updateDecorator / updateDraft
```

# Ticket Decorator

Mostly visual + one important interaction.

```text
╭──────────────╮║
│   content    ║║
╰──────────────╯║
```

Actions:

- click
- drag
- swipe

# Countdown Decorator

Mostly interactive + some visual.

```text
⏱ 25:00
▶ ⏸ ↺
```

Charm responsibilities:

| Charm | Role |
| ----- | ---- |
| DisplayCharm | Render countdown / countup / datetime display only (no ticking) |
| ModeCharm | Mode selector (countdown / countup / datetime) |
| ControlsCharm | Play / pause / reset buttons |
| RuntimeCharm | Register tick behavior with `useDecoratorRuntime` |

Modes:

- countdown — relative duration (days + time); Mantine duration picker while composing
- countup — elapsed time display
- datetime — exact date + time; Mantine DateTimePicker while composing

# Attachments

Rules:

- unlimited attachments
- all variants support attachments
- all decorators support attachments

Focused:

```css
opacity: 1;
```

Unfocused:

```css
opacity: 0.25;
```

Attachments should not push the chat timeline upward.

# Relationships

## Reply

```ts
replyToMessageId
```

- preview in composer
- preview in message
- jump to original message

## Forward

```ts
sourceMessageId
```

- reference original message
- no duplication
- render ForwardCard
- jump to original message

# Composer Draft

```ts
type ComposerDraft = {
  relationships: ComposerRelationship[];
  variant: MessageVariant;
  content: unknown;
  decorators: MessageDecorator[];
  attachments: Attachment[];
};
```

# Composer Context

```ts
type ComposerEvent = {
  decorator: MessageDecorator["type"];
  action: string;
  payload?: unknown;
};

type ComposerContext = {
  draft: ComposerDraft;
  variant: MessageVariant;
  decorators: MessageDecorator[];
  attachments: Attachment[];
  relationships: ComposerRelationship[];
  composing: boolean;
  updateDecorator: (index: number, decoration: MessageDecorator) => void;
  updateDraft: (updater: (draft: ComposerDraft) => ComposerDraft) => void;
  emit: (event: ComposerEvent) => void;
};
```

Structured events scale better than string-based names:

```ts
emit({ decorator: "ticket", action: "complete" });
emit({ decorator: "countdown", action: "play" });
emit({ decorator: "countdown", action: "pause" });
```

Expanded context slices (`variant`, `decorators`, `attachments`, `relationships`) allow charms to read cross-axis state (e.g. reply, forward, other active decorators) without reaching into `draft` internals.

# Registries

```ts
const decoratorRegistry = {
  ticket,
  countdown,
};

const variantRegistry = {
  text,
  todo,
  ai,
};
```

# Rendering Pipeline

```text
ComposerDraft
      ↓
Variant
      ↓
Decorators[]
      ↓
Charm[]
      ↓
Collect Contributions
      ↓
Sort by region
      ↓
Sort by order
      ↓
Merge styles (priority rules)
      ↓
Build regions (incl. overlay)
      ↓
Render
      ‖
useDecoratorRuntime (parallel)
      ↓
tick / update draft
```

# React Component Tree

```text
DiaryInput
├── RelationshipLayer
├── AttachmentLayer
├── ComposerSurface
│   ├── HeaderRegion
│   ├── TopRegion
│   ├── LeftRegion
│   ├── VariantEditor
│   ├── RightRegion
│   ├── BottomRegion
│   ├── FooterRegion
│   └── OverlayRegion
├── useDecoratorRuntime
└── ActionDock
```

# Long-Term Goal

Support:

- rich chat composer
- todo system
- AI chat
- scheduler
- tracker
- workspace integration
- plugin decorators
- future message variants

without:

```text
wrapper
  wrapper
    wrapper
      textarea
```

Final goal:

```text
Multiple decorators
        +
One variant
        +
Unlimited attachments
        +
Relationships
        =
ONE composer surface
```
