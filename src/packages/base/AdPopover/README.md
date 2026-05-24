# AdPopover

Thin wrapper around [Mantine `Popover`](https://mantine.dev/core/popover/) that maps compound slots to props:

| Mantine compound API | AdPopover prop |
| -------------------- | -------------- |
| `Popover.Target`     | `anchor`       |
| `Popover.Dropdown`   | `children`     |

All other Mantine `Popover` props are forwarded unchanged.

**Requires:** `@mantine/core`, `MantineProvider`, and Mantine styles in the app root.

---

## AdPopover-specific props

| Prop | Type | Purpose |
| ---- | ---- | ------- |
| `anchor` | `ReactNode` | Content passed to `Popover.Target`. Must be **one element** that accepts `ref` (e.g. `<button>`, Mantine `Button`). Strings, fragments, numbers, and multiple nodes will throw at runtime. Style the anchor with `className` / `style` on that element directly. |
| `children` | `ReactNode` | Content rendered inside `Popover.Dropdown`. When omitted or `null`, the dropdown is not rendered. |
| `targetRefProp` | `string` | Prop name used to attach the floating-ui reference to the anchor. Default: `'ref'`. Use when the anchor component expects a different ref prop name. |
| `targetPopupType` | `string` | Value for the anchor’s `aria-haspopup` attribute. Default: `'dialog'`. |

---

## Inherited props (`PopoverProps`)

These come from Mantine and are spread onto the underlying `<Popover />`.

### Open / close state

| Prop | Type | Default | Purpose |
| ---- | ---- | ------- | ------- |
| `opened` | `boolean` | — | Controlled open state. |
| `defaultOpened` | `boolean` | — | Initial open state for uncontrolled usage. |
| `onChange` | `(opened: boolean) => void` | — | Called when open state changes (open or close). |
| `onOpen` | `() => void` | — | Called when the dropdown opens. |
| `onClose` | `() => void` | — | Called when the dropdown closes. |
| `onDismiss` | `() => void` | — | Called when dismissed by outside click or Escape. Useful with controlled `opened` when you only want to react to dismiss actions. |
| `disabled` | `boolean` | — | When `true`, `Popover.Dropdown` is not rendered. |

### Interaction

| Prop | Type | Default | Purpose |
| ---- | ---- | ------- | ------- |
| `closeOnClickOutside` | `boolean` | `true` | Close when clicking outside the dropdown. |
| `clickOutsideEvents` | `string[]` | `['mousedown', 'touchstart']` | DOM events used for outside-click detection. |
| `closeOnEscape` | `boolean` | `true` | Close when Escape is pressed while focus is in the dropdown. |
| `trapFocus` | `boolean` | `false` | Trap focus inside the dropdown. Set `true` when the dropdown contains inputs or other focusable controls. |
| `returnFocus` | `boolean` | `false` | Return focus to the anchor when the dropdown closes. |

### Position & layout

| Prop | Type | Default | Purpose |
| ---- | ---- | ------- | ------- |
| `position` | `FloatingPosition` | `'bottom'` | Dropdown placement relative to the anchor. See [Position values](#position-values). |
| `offset` | `number \| FloatingAxesOffsets` | `8` | Gap between anchor and dropdown. Number = main axis only; object = main + cross axis. |
| `width` | `PopoverWidth` | `'max-content'` | Dropdown width. Use `'target'` to match anchor width, or any CSS width value. |
| `middlewares` | `PopoverMiddlewares` | `{ flip: true, shift: true, inline: false }` | [Floating UI](https://floating-ui.com/) middleware toggles/options (`shift`, `flip`, `inline`, `size`). |
| `onPositionChange` | `(position: FloatingPosition) => void` | — | Called when computed placement changes (e.g. after flip). |
| `floatingStrategy` | `'absolute' \| 'fixed'` | `'absolute'` | CSS positioning strategy for the floating element. |
| `hideDetached` | `boolean` | `true` | Hide dropdown when the anchor is off-screen, hidden, or removed from layout. |
| `preventPositionChangeWhenVisible` | `boolean` | — | Lock placement while the dropdown is open (no flip/shift updates). |
| `zIndex` | `string \| number` | `300` | Dropdown `z-index`. |

#### Position values

`FloatingPosition`:

```
'top' | 'top-start' | 'top-end'
'right' | 'right-start' | 'right-end'
'bottom' | 'bottom-start' | 'bottom-end'
'left' | 'left-start' | 'left-end'
```

#### Offset object

`FloatingAxesOffsets`:

| Field | Type | Purpose |
| ----- | ---- | ------- |
| `mainAxis` | `number` | Offset along the placement axis. |
| `crossAxis` | `number` | Offset perpendicular to placement. |
| `alignmentAxis` | `number \| null` | Alignment offset for `-start` / `-end` positions. |

#### Middlewares object

`PopoverMiddlewares`:

| Key | Type | Default | Purpose |
| --- | ---- | ------- | ------- |
| `shift` | `boolean \| ShiftOptions` | `true` | Keep dropdown in viewport by shifting. |
| `flip` | `boolean \| FlipOptions` | `true` | Flip placement when there isn’t enough space. |
| `inline` | `boolean \| InlineOptions` | `false` | Better positioning for inline anchors (e.g. text spans). |
| `size` | `boolean \| SizeOptions` | `false` | Resize dropdown based on available space. |

### Arrow

| Prop | Type | Default | Purpose |
| ---- | ---- | ------- | ------- |
| `withArrow` | `boolean` | `false` | Render a pointer arrow on the dropdown. |
| `arrowSize` | `number` | `7` | Arrow size in px. |
| `arrowOffset` | `number` | `5` | Arrow offset in px (used when `arrowPosition="side"`). |
| `arrowRadius` | `number` | `0` | Arrow border-radius in px. |
| `arrowPosition` | `'center' \| 'side'` | `'side'` | Arrow alignment for `*-start` / `*-end` positions. |

### Portal & overlay

| Prop | Type | Default | Purpose |
| ---- | ---- | ------- | ------- |
| `withinPortal` | `boolean` | `true` | Render dropdown in a portal. Set `false` for nested popovers/comboboxes inside the dropdown. |
| `portalProps` | `BasePortalProps` | — | Props forwarded to the portal component. |
| `withOverlay` | `boolean` | `false` | Show a backdrop overlay while open. |
| `overlayProps` | `OverlayProps & ElementProps<'motion.div'>` | — | Props for the overlay (e.g. `blur`, `zIndex`). |

### Appearance (dropdown panel)

| Prop | Type | Default | Purpose |
| ---- | ---- | ------- | ------- |
| `radius` | `MantineRadius` | theme default | Border radius; sets `--popover-radius` on the dropdown. |
| `shadow` | `MantineShadow` | — | Box shadow; sets `--popover-shadow` on the dropdown. |

### Transition

| Prop | Type | Default | Purpose |
| ---- | ---- | ------- | ------- |
| `transitionProps` | `TransitionOverride` | `{ duration: 150, transition: 'fade' }` | Enter/exit animation for the dropdown. |
| `keepMounted` | `boolean` | — | Keep dropdown in the DOM when closed (hidden with `display: none`). |
| `onEnterTransitionEnd` | `() => void` | — | Fired when enter transition finishes. |
| `onExitTransitionEnd` | `() => void` | — | Fired when exit transition finishes. |

### Accessibility

| Prop | Type | Default | Purpose |
| ---- | ---- | ------- | ------- |
| `id` | `string` | auto | Base id for `aria-controls` / `aria-labelledby` links between anchor and dropdown. |
| `withRoles` | `boolean` | `true` | Apply dialog ARIA roles and attributes to anchor and dropdown. |

### Styles API

Mantine styles props (from `StylesApiProps<PopoverFactory>`):

| Prop | Type | Purpose |
| ---- | ---- | ------- |
| `classNames` | `Partial<Record<'dropdown' \| 'arrow' \| 'overlay', string>>` | Class names per popover part. **`dropdown`** targets the wrapper `motion.div` around `children`. |
| `styles` | `Partial<Record<'dropdown' \| 'arrow' \| 'overlay', CSSProperties \| StylesFunction>>` | Inline styles per part. Same keys as `classNames`. |
| `variant` | `string` | Visual variant from theme. |
| `unstyled` | `boolean` | Remove default Mantine styles. |
| `attributes` | `Attributes<PopoverFactory>` | Data attributes per part. |

**Styling notes:**

- **`classNames.dropdown` / `styles.dropdown`** → the dropdown wrapper div (`.mantine-Popover-dropdown`), not the inner content nodes.
- **Plain `className` / `style` on `AdPopover`** → forwarded to `Popover` and end up on the **anchor** via `targetProps`, **not** on the dropdown. Use `classNames` / `styles` for the panel.

### Deprecated / internal

| Prop | Type | Purpose |
| ---- | ---- | ------- |
| `positionDependencies` | `any[]` | **Deprecated** — will be removed in Mantine 9. |
| `__staticSelector` | `string` | Internal Mantine selector; rarely needed. |

---

## Examples

### Basic (uncontrolled)

```tsx
import { AdPopover } from '@/packages/base';
import { Button, Text } from '@mantine/core';

<AdPopover width={200} position="bottom" withArrow shadow="md" anchor={<Button>Toggle</Button>}>
  <Text size="xs">Popover content</Text>
</AdPopover>
```

### Controlled

```tsx
const [opened, setOpened] = useState(false);

<AdPopover opened={opened} onChange={setOpened} anchor={<Button onClick={() => setOpened((o) => !o)}>Toggle</Button>}>
  Dropdown
</AdPopover>
```

### Style the dropdown wrapper

```tsx
<AdPopover
  classNames={{ dropdown: styles.panel }}
  styles={{ dropdown: { padding: 12 } }}
  radius="md"
  shadow="md"
  anchor={<button className={styles.trigger}>Open</button>}
>
  Content
</AdPopover>
```

### Match anchor width

```tsx
<AdPopover width="target" position="bottom" anchor={<Button w={280}>Menu</Button>}>
  Same width as button
</AdPopover>
```

---

## Anchor requirements

From [Mantine Popover docs](https://mantine.dev/core/popover/):

1. **`anchor` must be a single React element** that forwards `ref` to its root DOM node.
2. Uncontrolled toggle (click to open) works best with a **`<button>`** or a component that renders one (`Button`, `ActionIcon`, …).
3. For hover-controlled popovers, manage `opened` yourself and attach `onMouseEnter` / `onMouseLeave` on the anchor element.

Custom components must accept and forward `ref`:

```tsx
function MyTrigger({ ref, ...props }: React.ComponentProps<'button'>) {
  return <button ref={ref} type="button" {...props} />;
}

<AdPopover anchor={<MyTrigger>Open</MyTrigger>}>…</AdPopover>
```

---

## Further reading

- [Mantine Popover documentation](https://mantine.dev/core/popover/)
- [Mantine Popover Styles API](https://mantine.dev/core/popover/?t=styles-api)
- [Floating UI middlewares](https://floating-ui.com/docs/middleware)
