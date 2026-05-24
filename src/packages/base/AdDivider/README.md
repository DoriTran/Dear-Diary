# AdDivider

Thin wrapper around [Mantine `Divider`](https://mantine.dev/core/divider/) that maps compound API to props:

| Mantine API | AdDivider prop |
| ----------- | -------------- |
| `label`     | `children`     |
| `orientation="vertical"` | `vertical={true}` |
| `orientation="horizontal"` (default) | `vertical={false}` or omit |

All other Mantine `Divider` props are forwarded unchanged.

**Requires:** `@mantine/core`, `MantineProvider`, and Mantine styles in the app root.

---

## AdDivider-specific props

| Prop | Type | Default | Purpose |
| ---- | ---- | ------- | ------- |
| `children` | `ReactNode` | — | Label content passed to Mantine `label`. Only visible when `vertical` is `false` (horizontal divider). |
| `vertical` | `boolean` | `false` | When `true`, renders a vertical divider (`orientation="vertical"`). When `false` or omitted, renders horizontal. |

---

## Inherited props (`DividerProps`)

These come from Mantine and are spread onto the underlying `<Divider />`.

### Appearance

| Prop | Type | Default | Purpose |
| ---- | ---- | ------- | ------- |
| `variant` | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` | Line style. |
| `size` | `MantineSize \| number \| string` | `'xs'` | Line thickness (width for horizontal, height for vertical). |
| `color` | `MantineColor` | theme | Line color; theme key or any CSS color. |
| `labelPosition` | `'left' \| 'center' \| 'right'` | `'center'` | Label alignment along the divider (horizontal only). |

### Layout (`BoxProps`)

Common spacing props from Mantine `Box`:

| Prop | Type | Purpose |
| ---- | ---- | ------- |
| `my` | `MantineSpacing` | Vertical margin (typical for horizontal dividers). |
| `mx` | `MantineSpacing` | Horizontal margin. |
| `m`, `mt`, `mb`, `ml`, `mr` | `MantineSpacing` | Margin shorthands. |
| `p`, `px`, `py`, … | `MantineSpacing` | Padding. |
| `w`, `h` | `string \| number` | Width / height when you need explicit sizing (especially vertical dividers in flex layouts). |

### Styles API

Mantine styles props (from `StylesApiProps<DividerFactory>`):

| Prop | Type | Purpose |
| ---- | ---- | ------- |
| `classNames` | `Partial<Record<'root' \| 'label', string>>` | Class names per divider part. |
| `styles` | `Partial<Record<'root' \| 'label', CSSProperties \| StylesFunction>>` | Inline styles per part. |
| `unstyled` | `boolean` | Remove default Mantine styles. |
| `attributes` | `Attributes<DividerFactory>` | Data attributes per part. |

**Styling notes:**

- **`classNames.root` / `styles.root`** → the divider line element.
- **`classNames.label` / `styles.label`** → the label wrapper when `children` is set (horizontal only).

---

## Examples

### Basic horizontal

```tsx
import { AdDivider } from '@/packages/base';
import { Text } from '@mantine/core';

<Text>Section one</Text>
<AdDivider my="md" />
<Text>Section two</Text>
```

### Variants

```tsx
<AdDivider my="sm" />
<AdDivider my="sm" variant="dashed" />
<AdDivider my="sm" variant="dotted" />
```

### With label (`children`)

```tsx
<AdDivider my="xs" labelPosition="left">
  Label on the left
</AdDivider>

<AdDivider my="xs" labelPosition="center">
  Label in the center
</AdDivider>

<AdDivider my="xs" labelPosition="right">
  Label on the right
</AdDivider>
```

### Custom label content

```tsx
import { Box } from '@mantine/core';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';

<AdDivider
  my="xs"
  variant="dashed"
  labelPosition="center"
>
  <>
    <MagnifyingGlassIcon size={12} />
    <Box component="span" ml={5}>
      Search results
    </Box>
  </>
</AdDivider>
```

### Vertical

```tsx
import { Group, Text } from '@mantine/core';

<Group>
  <Text>One</Text>
  <AdDivider vertical />
  <Text>Two</Text>
  <AdDivider vertical size="sm" />
  <Text>Three</Text>
</Group>
```

### Sizes

```tsx
<AdDivider size="xs" />
<AdDivider size="sm" />
<AdDivider size="md" />
<AdDivider size="lg" />
<AdDivider size="xl" />
<AdDivider size={10} />
```

---

## Label behavior

From [Mantine Divider docs](https://mantine.dev/core/divider/):

- **`children` (label) is only shown for horizontal dividers** (`vertical={false}`).
- For vertical dividers, use `children` only if you accept that Mantine may not render it; prefer separate `Text` nodes beside the divider.

---

## Further reading

- [Mantine Divider documentation](https://mantine.dev/core/divider/)
- [Mantine Divider Styles API](https://mantine.dev/core/divider/?t=styles-api)
