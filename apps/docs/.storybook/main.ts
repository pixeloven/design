import type { StorybookConfig } from "@storybook/react-vite"

/**
 * The docs site IS Storybook (design system plan, phase 5).
 *
 * One tool rather than a separate marketing site plus component docs: the
 * foundations pages read the palette and the marks from the packages
 * themselves, so documentation cannot drift from what ships. Component stories
 * land here as packages/ui is populated — the glob already covers them.
 */
const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(ts|tsx)",
    // Component stories, once packages/ui exists.
    "../../../packages/ui/**/*.stories.@(ts|tsx)",
  ],
  addons: [
    "@storybook/addon-docs",
    // Contrast is already asserted in the token tests — but those check VALUES.
    // This checks the RENDERED result, which is where a correct token used on
    // the wrong ground still fails.
    "@storybook/addon-a11y",
    // The tokens ship light and dark; documenting only one would hide half the
    // system.
    "@storybook/addon-themes",
  ],
  framework: { name: "@storybook/react-vite", options: {} },
}

export default config
