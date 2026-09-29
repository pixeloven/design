# @pixeloven/ui

Four native React 19 controls using the PixelOven reading and theme roles:
`Button`, `Input`, `Select` and `Label`. Version 0.1 supports tokens **0.6.x**.
ESM JavaScript, declarations and scoped CSS ship separately. React and tokens
are peers; neither is bundled. No styling framework or provider is required.

## Install and apply a theme

Use the registry and authentication setup in
[the design-system guide](https://github.com/pixeloven/design/blob/main/skills/design-system-usage/SKILL.md). Then:

```sh
pnpm add @pixeloven/ui@0.1.0 @pixeloven/tokens@0.6.0 react@19 react-dom@19
```

The consumer loads the CSS once, in this order:

```tsx
import "@pixeloven/tokens/tokens.css";
import "@pixeloven/tokens/themes.css";
import "@pixeloven/ui/styles.css";
import { Button, Input, Label, Select } from "@pixeloven/ui";
```

Choose `data-pxo-theme="cool"` or `"warm"` on the document root and
`data-pxo-accent="acid"` or `"violet"` independently. Set `data-theme="dark"`
or `"light"` for explicit appearance; remove that attribute for System. The
new control roles require an opted-in 0.6 theme or equivalent variables from
`resolveTheme`. Importing legacy `tokens.css` alone does not supply these roles.

Consumers own theme selection, saved preferences, OS subscriptions and font
loading. Self-host the desired IBM Plex Sans font weights and subsets; the
controls use token font stacks and contain no font binaries. No global CSS
reset, root attributes, storage access or stylesheet side-effect import comes
from the JavaScript entry point.

## Use native form semantics

```tsx
<form onSubmit={saveNote}>
  <Label htmlFor="title">Note title</Label>
  <Input id="title" name="title" required aria-describedby="title-help" />
  <p id="title-help">Use a title you can recognize in search.</p>

  <Label htmlFor="status">Status</Label>
  <Select id="status" name="status" defaultValue="ready">
    <option value="ready">Ready</option>
    <option value="done">Done</option>
  </Select>

  <Button type="submit" variant="primary">Save note</Button>
  <Button type="reset">Reset</Button>
</form>
```

| Component | Contract |
| --- | --- |
| `Button` | Native button props and ref. `variant="secondary"` is the default; `"primary"` marks a main action. Defaults to `type="button"`; request `"submit"` or `"reset"` explicitly. |
| `Input` | Native input props and ref; defaults to `type="text"`. Text, search, number and date entry use reading typography. |
| `Select` | Native select props and ref, including controlled/uncontrolled values, `multiple`, `size`, `option` and `optgroup`. Browser menus and keyboard behavior are preserved. |
| `Label` | Native label props and ref. Associate with `htmlFor`/`id`, or wrap the control. Plain sentence case keeps task text readable. |

`ButtonProps`, `InputProps`, `SelectProps` and `LabelProps` are exported. React
19 object refs and callback refs (including cleanup functions) reach the actual
DOM element. Native `name`, `form`, constraint validation, event handlers,
`aria-*`, `data-*`, `className` and `style` props pass through. There is no
polymorphic `asChild` API and no custom select popup.

`Input` also passes checkbox, radio, range, color, file, image, hidden, button,
reset and submit types through. These retain browser presentation; they are
not styled text fields or dedicated shared controls. In particular, checkbox
and radio inputs are not enlarged to text-field dimensions. Use `Button` for
shared action styling. Compositions, spacing between controls, icons, loading
indicators and specialized input components remain consumer concerns.

## States and accessibility

Buttons and styled text-entry controls have a minimum 44px height that scales
with root text size; buttons also have a 44px minimum width. Text inputs and
selects fill their container. Keep form columns wide enough for their content.
Buttons wrap longer labels. Control text uses the 14px reading role, and input
and select text use the 16px reading role; both scale with root font preferences.

Use native `disabled` for disabled behavior. Disabled controls keep readable
text and a dashed boundary without reducing opacity. `aria-disabled` alone
does not disable a native element. Read-only input behavior remains native.
Keyboard focus has a visible token outline; keep space around controls so a
parent does not clip it. `aria-pressed="true"` keeps paired selection colors
through hover and pressed states.

Set `aria-invalid="true"` on an invalid input or select and connect a helpful
error with `aria-describedby`. The invalid boundary uses danger color and a
dashed line; color is not the only signal. Validation messages, timing and
focus recovery belong to the form. Native validity is not automatically copied
into `aria-invalid`. The package never invents a label or accessible name.

The stylesheet targets only `pxo-*` control classes. It retains native select
appearance and forced-color adaptation, introduces no motion, and defines no
local palette or token overrides. Existing token tests verify all eight
Cool/Warm × Acid/Violet × Dark/Light role combinations; browser specimens in
the docs exercise rendered controls and actual contrast.

## Contributing

```sh
pnpm --filter @pixeloven/ui lint
pnpm --filter @pixeloven/ui test
```

`test` builds ESM and declarations, strictly typechecks source, tests and the
public API fixture, runs native DOM interaction tests, then installs the actual
tarball in an isolated temporary consumer to verify exports, SSR, CSS and
strict public types. Tests require the workspace token build first.
`skipLibCheck` avoids an upstream `@types/jsdom`/TypeScript 7 declaration
conflict; application and test source remain strict. The isolated packed public
API check also checks dependencies without `skipLibCheck`.

DOM tests cover forms, keyboard order, label focus, disabled behavior, controlled
values, native constraints and React refs. Layout, OS picker presentation and
visual focus still need the docs browser checks. Biome's recommended rules are
the package lint gate. Generated `dist` files and test artifacts are not committed.
