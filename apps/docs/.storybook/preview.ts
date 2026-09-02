import { withThemeByDataAttribute } from "@storybook/addon-themes"
import type { Preview } from "@storybook/react-vite"

import "@pixeloven/tokens/tokens.css"
import "./preview.css"

/**
 * The theme switcher writes `data-theme` on the root — exactly the attribute
 * tokens.css keys off. So flipping the toolbar exercises the real mechanism a
 * consumer uses, rather than a Storybook-only approximation of it.
 */
const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
    // The tokens paint the ground themselves; Storybook's own background
    // switcher would fight them and show a scheme that no consumer can get.
    backgrounds: { disable: true },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { dark: "dark", light: "light" },
      defaultTheme: "dark",
      attributeName: "data-theme",
    }),
  ],
}

export default preview
