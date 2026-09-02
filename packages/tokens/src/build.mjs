/**
 * Build tokens.json into the artifacts consumers actually need.
 *
 *   dist/tokens.css   plain CSS custom properties, both schemes — no bundler
 *                     required. This is the one Harmony vendors into its
 *                     Homepage ConfigMap, which has no build step at all.
 *   dist/tokens.js    JS/TS consts, nested by scheme.
 *   dist/tokens.d.ts  types for the above.
 *   dist/tokens.json  flat {scheme: {name: value}} for non-JS consumers.
 *
 * THE CSS EMITS THREE BLOCKS, and the shape matters. `:root` carries the
 * default scheme so a page with no theme wiring still renders correctly;
 * `@media (prefers-color-scheme: light)` guarded by `:not([data-theme="dark"])`
 * follows the OS unless an explicit choice overrides it; `[data-theme="light"]`
 * lets a toggle win in both directions. A consumer that only ever wants dark
 * (Harmony, Lattice) can ignore all but the first.
 *
 * Deliberately dependency-free and plain Node: this runs in CI, in a release
 * job, and on a workstation, and a build chain is one more thing that can rot
 * between a token changing and a surface seeing it.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, "..", "dist");

const raw = JSON.parse(readFileSync(join(here, "tokens.json"), "utf8"));
const SCHEMES = raw.meta.schemes;
const DEFAULT_SCHEME = raw.meta.defaultScheme;
const OTHER_SCHEME = SCHEMES.find((s) => s !== DEFAULT_SCHEME);

/** kebab-case a camelCase key: statusSurface -> status-surface */
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

/**
 * Walk the token tree, skipping metadata. Yields [path[], entry].
 * `$comment` and `meta` are documentation and never emit a token.
 */
function* walk(node, path = []) {
  for (const [key, val] of Object.entries(node)) {
    if (key === "$comment" || key === "meta") continue;
    if (val && typeof val === "object" && ("value" in val || DEFAULT_SCHEME in val)) {
      yield [[...path, key], val];
    } else if (val && typeof val === "object") {
      yield* walk(val, [...path, key]);
    }
  }
}

const tokens = [...walk(raw)];

// A `base` leaf names its group: accent.base -> --pxo-accent, not
// --pxo-accent-base. Keeps the common case short at the call site.
const trim = (path) => (path[path.length - 1] === "base" ? path.slice(0, -1) : path);
const cssName = (path) => `--pxo-${trim(path).map(kebab).join("-")}`;
const jsName = (path) =>
  trim(path)
    .map((p, i) => (i === 0 ? p : p[0].toUpperCase() + p.slice(1)))
    .join("");

/** A font token has one `value`; a colour token has one per scheme. */
const valueFor = (entry, scheme) => ("value" in entry ? entry.value : entry[scheme]);

mkdirSync(dist, { recursive: true });

// --- dist/tokens.css ---------------------------------------------------------
const banner = `/* PixelOven design tokens — ${raw.meta.name}.
 * GENERATED from packages/tokens/src/tokens.json. Do not edit.
 * Consumers without a bundler vendor this file at a pinned version.
 */`;

const declarations = (scheme, indent = "  ") => {
  const lines = [];
  let group = null;
  for (const [path, entry] of tokens) {
    // Scheme-independent tokens (fonts) belong only in the default block.
    if ("value" in entry && scheme !== DEFAULT_SCHEME) continue;
    if (path[0] !== group) {
      group = path[0];
      lines.push(`\n${indent}/* ${kebab(group)} */`);
    }
    const use = scheme === DEFAULT_SCHEME && entry.use ? ` /* ${entry.use} */` : "";
    lines.push(`${indent}${cssName(path)}: ${valueFor(entry, scheme)};${use}`);
  }
  return lines;
};

const css = [
  banner,
  "",
  `/* Default scheme (${DEFAULT_SCHEME}). A page with no theme wiring gets this. */`,
  ":root {",
  ...declarations(DEFAULT_SCHEME),
  "}",
  "",
  `/* Follow the OS, unless an explicit ${DEFAULT_SCHEME} choice overrides it. */`,
  `@media (prefers-color-scheme: ${OTHER_SCHEME}) {`,
  `  :root:not([data-theme="${DEFAULT_SCHEME}"]) {`,
  ...declarations(OTHER_SCHEME, "    "),
  "  }",
  "}",
  "",
  "/* An explicit toggle wins in both directions. */",
  `:root[data-theme="${OTHER_SCHEME}"] {`,
  ...declarations(OTHER_SCHEME),
  "}",
  "",
  `:root[data-theme="${DEFAULT_SCHEME}"] {`,
  ...declarations(DEFAULT_SCHEME),
  "}",
  "",
].join("\n");
writeFileSync(join(dist, "tokens.css"), css);

// --- dist/tokens.js / .d.ts --------------------------------------------------
const schemeObject = (scheme) =>
  [
    `  ${scheme}: Object.freeze({`,
    ...tokens.map(([p, e]) => `    ${jsName(p)}: ${JSON.stringify(valueFor(e, scheme))},`),
    "  }),",
  ].join("\n");

writeFileSync(
  join(dist, "tokens.js"),
  [
    banner,
    "",
    "export const tokens = Object.freeze({",
    ...SCHEMES.map(schemeObject),
    "});",
    "",
    `export const defaultScheme = ${JSON.stringify(DEFAULT_SCHEME)};`,
    `export const schemes = ${JSON.stringify(SCHEMES)};`,
    "",
    "export default tokens;",
    "",
  ].join("\n"),
);

writeFileSync(
  join(dist, "tokens.d.ts"),
  [
    "export interface TokenSet {",
    ...tokens.map(([p]) => `  ${jsName(p)}: string;`),
    "}",
    "export declare const tokens: Readonly<{",
    ...SCHEMES.map((s) => `  ${s}: Readonly<TokenSet>;`),
    "}>;",
    `export declare const defaultScheme: ${JSON.stringify(DEFAULT_SCHEME)};`,
    "export declare const schemes: readonly string[];",
    "export default tokens;",
    "",
  ].join("\n"),
);

// --- dist/tokens.json (flat per scheme, for non-JS consumers) ----------------
writeFileSync(
  join(dist, "tokens.json"),
  JSON.stringify(
    Object.fromEntries(
      SCHEMES.map((s) => [
        s,
        Object.fromEntries(tokens.map(([p, e]) => [cssName(p).replace("--pxo-", ""), valueFor(e, s)])),
      ]),
    ),
    null,
    2,
  ) + "\n",
);

console.log(
  `built ${tokens.length} tokens x ${SCHEMES.length} schemes -> ` +
    `dist/{tokens.css,tokens.js,tokens.d.ts,tokens.json}`,
);
