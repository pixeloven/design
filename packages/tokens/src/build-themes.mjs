import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** Additive build: the incumbent token artifacts are deliberately untouched. */
export function buildThemes({ here, dist, legacy, names }) {
  const source = JSON.parse(readFileSync(join(here, "themes.json"), "utf8"));
  const schemes = source.meta.schemes;
  const themeNames = Object.keys(source.themes);
  const accentNames = Object.keys(source.accents);
  const additionalNames = new Set();
  const cssName = (name) => `--pxo-${name.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)}`;
  const banner = "/* PixelOven opt-in themes. GENERATED from src/themes.json and src/tokens.json. Do not edit. */";

  const resolve = (theme, accent, scheme) => {
    const entries = { ...source.shared, ...source.themes[theme].roles, ...source.accents[accent].roles };
    const result = { ...legacy[scheme] };
    const complete = new Set();
    const visit = (name, ancestors = []) => {
      if (complete.has(name)) return result[name];
      const entry = entries[name];
      if (!entry) {
        if (!Object.hasOwn(result, name)) throw new Error(`Unknown theme reference: ${name}`);
        return result[name];
      }
      if (ancestors.includes(name)) throw new Error(`Cyclic theme reference: ${[...ancestors, name].join(" -> ")}`);
      if (!entry.use) throw new Error(`Theme role missing use: ${name}`);
      const value = entry.ref ? visit(entry.ref, [...ancestors, name]) : entry[scheme];
      if (typeof value !== "string" || !/^#[0-9a-f]{6}$/i.test(value)) {
        throw new Error(`Invalid ${scheme} theme color: ${name}`);
      }
      if (!names.includes(name)) additionalNames.add(name);
      result[name] = value;
      complete.add(name);
      return value;
    };
    for (const name of Object.keys(entries)) visit(name);
    return result;
  };

  const themeTokens = Object.fromEntries(themeNames.map(theme => [theme,
    Object.fromEntries(accentNames.map(accent => [accent,
      Object.fromEntries(schemes.map(scheme => [scheme, resolve(theme, accent, scheme)])),
    ])),
  ]));
  writeFileSync(join(dist, "themes.json"), JSON.stringify(themeTokens, null, 2) + "\n");
  writeFileSync(join(dist, "theme-runtime.js"), readFileSync(join(here, "theme-runtime.mjs"), "utf8"));
  writeFileSync(join(dist, "themes.js"), [
    banner,
    'import { createThemeAPI } from "./theme-runtime.js";',
    `const data = ${JSON.stringify(themeTokens, null, 2)};`,
    "export const {",
    "  themeNames, accentNames, appearances, defaultThemeSettings, themeTokens,",
    "  normalizeThemeSettings, resolveAppearance, resolveTheme,",
    `} = createThemeAPI(data, ${JSON.stringify(source.meta.defaultSettings)}, ${JSON.stringify(source.meta.appearances)});`,
    "",
  ].join("\n"));

  const union = (values) => values.map(value => JSON.stringify(value)).join(" | ");
  writeFileSync(join(dist, "themes.d.ts"), [
    'import type { TokenSet } from "./tokens.js";',
    `export type ThemeName = ${union(themeNames)};`,
    `export type AccentName = ${union(accentNames)};`,
    `export type Appearance = ${union(source.meta.appearances)};`,
    `export type Scheme = ${union(schemes)};`,
    "export interface ThemeSettings {",
    "  theme: ThemeName;",
    "  accent: AccentName;",
    "  appearance: Appearance;",
    "}",
    "export interface ThemeTokenSet extends TokenSet {",
    ...[...additionalNames].map(name => `  ${name}: string;`),
    "}",
    "export interface ResolvedTheme extends Readonly<ThemeSettings> {",
    "  readonly scheme: Scheme;",
    "  readonly tokens: Readonly<ThemeTokenSet>;",
    "}",
    "export declare const themeNames: readonly ThemeName[];",
    "export declare const accentNames: readonly AccentName[];",
    "export declare const appearances: readonly Appearance[];",
    "export declare const defaultThemeSettings: Readonly<ThemeSettings>;",
    "export declare const themeTokens: Readonly<Record<ThemeName, Readonly<Record<AccentName, Readonly<Record<Scheme, Readonly<ThemeTokenSet>>>>>>>;",
    "export declare function normalizeThemeSettings(settings: unknown): Readonly<ThemeSettings>;",
    'export declare function resolveAppearance(appearance: Appearance, systemScheme?: Scheme): Scheme;',
    "export declare function resolveTheme(settings?: Partial<ThemeSettings>, systemScheme?: Scheme): Readonly<ResolvedTheme>;",
    "",
  ].join("\n"));

  const declarations = (values, scheme, indent) => [
    `${indent}color-scheme: ${scheme};`,
    ...Object.entries(values).flatMap(([name, value]) => [
      `${indent}${cssName(name)}: ${value};`,
      ...(/^#[0-9a-f]{6}$/i.test(value) ? [
        `${indent}${cssName(name)}-rgb: ${[1, 3, 5].map(i => parseInt(value.slice(i, i + 2), 16)).join(" ")};`,
      ] : []),
    ]),
  ];
  const css = [banner, "/* Root opt-in only. Import on its own, or after legacy tokens.css. */"];
  for (const theme of themeNames) {
    for (const accent of accentNames) {
      // Zero selector specificity inside :where keeps explicit appearance last.
      // Missing/unrecognized accent follows the same default as the JS resolver.
      const accentSelector = accent === source.meta.defaultSettings.accent
        ? `:not([data-pxo-accent=${JSON.stringify(accentNames.find(a => a !== accent))}])`
        : `[data-pxo-accent=${JSON.stringify(accent)}]`;
      const selector = `:root[data-pxo-theme="${theme}"]:where(${accentSelector})`;
      const values = themeTokens[theme][accent];
      css.push("", `${selector} {`, ...declarations(values.dark, "dark", "  "), "}");
      css.push("", "@media (prefers-color-scheme: light) {",
        `  ${selector}:not([data-theme="dark"]):not([data-theme="light"]) {`,
        ...declarations(values.light, "light", "    "), "  }", "}");
      for (const scheme of schemes) {
        css.push("", `${selector}[data-theme="${scheme}"] {`,
          ...declarations(values[scheme], scheme, "  "), "}");
      }
    }
  }
  writeFileSync(join(dist, "themes.css"), css.join("\n") + "\n");
  console.log(`built ${themeNames.length} themes x ${accentNames.length} accents x ${schemes.length} schemes -> dist/themes.*`);
}
