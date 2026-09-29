import { normalizeThemeSettings, resolveAppearance, resolveTheme, type ThemeSettings } from "@pixeloven/tokens/themes"

const settings: ThemeSettings = { theme: "warm", accent: "violet", appearance: "system" }
const theme = resolveTheme(settings, "light")
const legacyToken: string = theme.tokens.graphOriginWikilink
const newToken: string = theme.tokens.actionPrimaryPressed
const normalized: ThemeSettings = normalizeThemeSettings({ accent: "unknown" })
void [legacyToken, newToken, normalized, resolveAppearance("system", "dark")]

// @ts-expect-error Arbitrary accents have no validated role set.
resolveTheme({ accent: "orange" })
// @ts-expect-error Scheme is resolved separately from visual theme.
resolveTheme({ theme: "dark" })
// @ts-expect-error Invalid appearances must be normalized before resolution.
const invalid: ThemeSettings = { theme: "cool", accent: "acid", appearance: "auto" }
void invalid
// @ts-expect-error Browser scheme input is a strict resolved scheme.
resolveTheme(settings, "system")
// @ts-expect-error Consumers cannot mutate the canonical token object.
theme.tokens.actionPrimary = "red"
