/**
 * Build tokens.json into the three artifacts consumers actually need.
 *
 *   dist/tokens.css   plain CSS custom properties — no bundler required.
 *                     This is the one Harmony vendors into its Homepage
 *                     ConfigMap, which has no build step at all.
 *   dist/tokens.js    JS/TS consts for anything that imports the package.
 *   dist/tokens.d.ts  types for the above.
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

/** kebab-case a camelCase key: surfaceHover -> surface-hover */
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

/**
 * Walk the token tree, skipping metadata. Yields [path[], value, use].
 * A group is any object whose entries are groups or {value} leaves; `$comment`
 * and `meta` are documentation and never emit a token.
 */
function* walk(node, path = []) {
  for (const [key, val] of Object.entries(node)) {
    if (key === "$comment" || key === "meta") continue;
    if (val && typeof val === "object" && "value" in val) {
      yield [[...path, key], val.value, val.use ?? ""];
    } else if (val && typeof val === "object") {
      yield* walk(val, [...path, key]);
    }
  }
}

const tokens = [...walk(raw)];

// A `base` leaf names its group: accent.base -> --pxo-accent, not
// --pxo-accent-base. Keeps the common case short at the call site.
const cssName = (path) => {
  const parts = path[path.length - 1] === "base" ? path.slice(0, -1) : path;
  return `--pxo-${parts.map(kebab).join("-")}`;
};
const jsName = (path) => {
  const parts = path[path.length - 1] === "base" ? path.slice(0, -1) : path;
  return parts
    .map((p, i) => (i === 0 ? kebab(p).replace(/-./g, (m) => m[1].toUpperCase()) : p[0].toUpperCase() + p.slice(1)))
    .join("");
};

mkdirSync(dist, { recursive: true });

// --- dist/tokens.css ---------------------------------------------------------
const banner = `/* PixelOven design tokens — ${raw.meta.name}.
 * GENERATED from packages/tokens/src/tokens.json. Do not edit.
 * Consumers without a bundler vendor this file at a pinned version.
 */`;

const cssLines = [banner, ":root {"];
let group = null;
for (const [path, value, use] of tokens) {
  if (path[0] !== group) {
    group = path[0];
    cssLines.push(`\n  /* ${group} */`);
  }
  cssLines.push(`  ${cssName(path)}: ${value};${use ? ` /* ${use} */` : ""}`);
}
cssLines.push("}", "");
writeFileSync(join(dist, "tokens.css"), cssLines.join("\n"));

// --- dist/tokens.js / .d.ts --------------------------------------------------
const jsLines = [
  banner.replace(/^\/\* /, "/* ").trimEnd(),
  "",
  "export const tokens = Object.freeze({",
  ...tokens.map(([p, v]) => `  ${jsName(p)}: ${JSON.stringify(v)},`),
  "});",
  "",
  "export default tokens;",
  "",
];
writeFileSync(join(dist, "tokens.js"), jsLines.join("\n"));

const dtsLines = [
  "export declare const tokens: Readonly<{",
  ...tokens.map(([p]) => `  ${jsName(p)}: string;`),
  "}>;",
  "export default tokens;",
  "",
];
writeFileSync(join(dist, "tokens.d.ts"), dtsLines.join("\n"));

// --- dist/tokens.json (flat, for non-JS consumers) ---------------------------
writeFileSync(
  join(dist, "tokens.json"),
  JSON.stringify(Object.fromEntries(tokens.map(([p, v]) => [cssName(p).replace("--pxo-", ""), v])), null, 2) + "\n",
);

console.log(`built ${tokens.length} tokens -> dist/{tokens.css,tokens.js,tokens.d.ts,tokens.json}`);
