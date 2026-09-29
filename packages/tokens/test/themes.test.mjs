import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import legacy from "../dist/tokens.js";
import {
  accentNames, appearances, defaultThemeSettings, normalizeThemeSettings,
  resolveAppearance, resolveTheme, themeNames, themeTokens,
} from "../dist/themes.js";
import { contrastRatio } from "../test-support/color.mjs";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
const source = JSON.parse(read("../src/themes.json"));
const incumbent = JSON.parse(read("../src/tokens.json"));
const json = JSON.parse(read("../dist/themes.json"));
const css = read("../dist/themes.css");
const declarations = read("../dist/themes.d.ts");
const toCss = name => `--pxo-${name.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)}`;
const planes = ["surfaceVoid", "surfaceCanvas", "surfaceBg", "surface", "surfaceHover", "surfaceRaised"];
const cssBlocks = [...css.matchAll(/(:root[^{}]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({
  selector: selector.trim(),
  values: Object.fromEntries([...body.matchAll(/(--pxo-[a-z-]+|color-scheme): ([^;]+);/g)]
    .map(([, name, value]) => [name, value])),
}));
const requireContrast = (tokens, foreground, ground, minimum, label) => {
  const ratio = contrastRatio(tokens[foreground], tokens[ground]);
  assert.ok(ratio >= minimum, `${label}: ${foreground} on ${ground}: ${ratio.toFixed(3)} < ${minimum}`);
};

test("legacy artifacts remain byte-identical to tokens 0.5.0", () => {
  // Captured from the unmodified 0.5.0 build. These are API compatibility
  // sentinels, not snapshots of the new implementation under test.
  const hashes = {
    "tokens-dark.css": "9ca62d40b084ea9633ca6e9f527e032f77267227034fec5163b06c991b6567b5",
    "tokens-light.css": "5442cb23f7042bd413ab0e4d97016ead2ef594c071ab6c93e25223afc90836ef",
    "tokens.css": "d14f561963548be425874b1627e5c8cafb685eb943b7a785786bd6327140b1c5",
    "tokens.d.ts": "cf148dd2d80cd098cfbcc409db259b53f51f56375a57b2c8c2c6b545a2cd4d66",
    "tokens.js": "332672f6dc143ab7fb400e0765838219a7995141c49c61fd389caaf5f3e0bd65",
    "tokens.json": "c8c6ebb95dc23b2cecd60354e961ead5621227091820c7b58e8850c1a662396b",
  };
  for (const [file, expected] of Object.entries(hashes)) {
    assert.equal(createHash("sha256").update(read(`../dist/${file}`)).digest("hex"), expected, file);
  }
});

test("strict choices and pure appearance resolution preserve explicit settings", () => {
  assert.deepEqual(themeNames, ["cool", "warm"]);
  assert.deepEqual(accentNames, ["acid", "violet"]);
  assert.deepEqual(appearances, ["dark", "light", "system"]);
  assert.deepEqual(defaultThemeSettings, { theme: "cool", accent: "acid", appearance: "system" });
  for (const systemScheme of ["dark", "light"]) {
    assert.equal(resolveAppearance("system", systemScheme), systemScheme);
    for (const appearance of ["dark", "light"]) {
      assert.equal(resolveAppearance(appearance, systemScheme), appearance);
      assert.equal(resolveTheme({ appearance }, systemScheme).scheme, appearance);
    }
  }
  assert.equal(resolveTheme().scheme, "dark");
  assert.equal(resolveAppearance("system", "corrupt"), "dark");
  assert.equal(resolveAppearance("corrupt", "light"), "light");
  const before = { theme: "warm", accent: "violet", appearance: "system" };
  const dark = resolveTheme(before, "dark");
  const light = resolveTheme(before, "light");
  assert.deepEqual(before, { theme: "warm", accent: "violet", appearance: "system" });
  assert.equal(dark.appearance, "system");
  assert.equal(light.appearance, "system");
  assert.notEqual(dark.tokens.surfaceBg, light.tokens.surfaceBg);
  assert.ok(Object.isFrozen(dark) && Object.isFrozen(dark.tokens));
  assert.throws(() => { dark.tokens.surfaceBg = "changed"; }, TypeError);
});

test("invalid decoded saved settings fall back per field without inheriting keys", () => {
  for (const input of [undefined, null, true, 1, "warm", [], ["warm"], Object.create({theme: "warm"})]) {
    assert.deepEqual(normalizeThemeSettings(input), defaultThemeSettings);
    assert.deepEqual(resolveTheme(input), resolveTheme());
  }
  assert.deepEqual(normalizeThemeSettings({ theme: "warm", accent: "unknown", appearance: "dark", other: "ignored" }),
    { theme: "warm", accent: "acid", appearance: "dark" });
  assert.deepEqual(normalizeThemeSettings({ theme: "__proto__", accent: {}, appearance: "LIGHT" }), defaultThemeSettings);
  assert.deepEqual(normalizeThemeSettings({ theme: "cool", accent: "violet", appearance: "light" }),
    { theme: "cool", accent: "violet", appearance: "light" });
  assert.ok(Object.isFrozen(normalizeThemeSettings({})));
  for (const value of [themeNames, accentNames, appearances, defaultThemeSettings, themeTokens,
    themeTokens.cool, themeTokens.cool.acid, themeTokens.cool.acid.dark]) assert.ok(Object.isFrozen(value));
});

test("declarations expose strict choices and the complete inherited token contract", () => {
  assert.match(declarations, /import type \{ TokenSet \} from "\.\/tokens\.js"/);
  assert.match(declarations, /type ThemeName = "cool" \| "warm"/);
  assert.match(declarations, /type AccentName = "acid" \| "violet"/);
  assert.match(declarations, /type Appearance = "dark" \| "light" \| "system"/);
  assert.match(declarations, /interface ThemeTokenSet extends TokenSet/);
  assert.match(declarations, /normalizeThemeSettings\(settings: unknown\)/);
  for (const name of Object.keys(themeTokens.cool.acid.dark)) {
    if (!(name in legacy.dark)) assert.ok(declarations.includes(`${name}: string;`), name);
  }
  const manifest = JSON.parse(read("../package.json"));
  for (const name of ["./themes", "./themes.css", "./themes.json", "./themes/source"]) {
    const value = manifest.exports[name];
    for (const file of typeof value === "string" ? [value] : Object.values(value)) assert.ok(read(`../${file}`).length, file);
  }
  assert.ok(manifest.files.includes("src/themes.json"));
  assert.ok(manifest.files.includes("README.md"));
});

for (const theme of themeNames) for (const accent of accentNames) for (const scheme of ["dark", "light"]) {
  const label = `${theme}/${accent}/${scheme}`;
  const tokens = resolveTheme({ theme, accent, appearance: scheme }).tokens;
  const roles = { ...source.shared, ...source.themes[theme].roles, ...source.accents[accent].roles };

  test(`[${label}] canonical roles reach complete JS, JSON and actual CSS blocks`, () => {
    assert.strictEqual(tokens, themeTokens[theme][accent][scheme]);
    assert.deepEqual(tokens, json[theme][accent][scheme]);
    for (const key of Object.keys(legacy[scheme])) assert.ok(key in tokens, key);
    for (const [name, entry] of Object.entries(roles)) {
      assert.ok(entry.use.length >= 8, name);
      assert.equal(tokens[name], entry.ref ? tokens[entry.ref] : entry[scheme], name);
    }
    const accentSelector = accent === "acid" ? ':not([data-pxo-accent="violet"])' : '[data-pxo-accent="violet"]';
    const selector = `:root[data-pxo-theme="${theme}"]:where(${accentSelector})`;
    const matching = cssBlocks.filter(block => block.selector.startsWith(selector) && block.values["color-scheme"] === scheme);
    assert.equal(matching.length, 2, `${label}: base/system and explicit CSS blocks`);
    assert.ok(matching.some(block => block.selector === `${selector}[data-theme="${scheme}"]`));
    if (scheme === "light") assert.ok(matching.some(block => block.selector.endsWith(':not([data-theme="dark"]):not([data-theme="light"])')));
    for (const { values } of matching) for (const [name, value] of Object.entries(tokens)) {
      assert.equal(values[toCss(name)], value, name);
      if (/^#[0-9a-f]{6}$/i.test(value)) assert.equal(values[`${toCss(name)}-rgb`],
        [1, 3, 5].map(i => Number.parseInt(value.slice(i, i + 2), 16)).join(" "), name);
    }
    for (const key of Object.keys(legacy[scheme])) {
      if (!(key in roles)) assert.equal(tokens[key], legacy[scheme][key], `unmodified inherited ${key}`);
    }
  });

  test(`[${label}] text, action states, selection, focus and essential boundaries meet declared contrast`, () => {
    for (const [name, entry] of Object.entries(roles)) {
      if (entry.minContrast) for (const ground of entry.on) requireContrast(tokens, name, ground, entry.minContrast, label);
    }
    for (const ground of planes) {
      for (const text of ["text", "textBright", "textSecondary", "textDim", "accentText"]) requireContrast(tokens, text, ground, 4.5, label);
      requireContrast(tokens, "borderControl", ground, 3, label);
      requireContrast(tokens, "interactionFocus", ground, 3, label);
    }
    assert.equal(tokens.actionPrimary, accent === "acid" ? "#d0ff34" : "#bf4dff", "approved action fill");
    assert.equal(new Set([tokens.actionPrimary, tokens.actionPrimaryHover, tokens.actionPrimaryPressed]).size, 3);
    for (const state of ["actionPrimary", "actionPrimaryHover", "actionPrimaryPressed"]) {
      requireContrast(tokens, "actionOnPrimary", state, 4.5, label);
    }
    requireContrast(tokens, "interactionSelectionText", "interactionSelectionSurface", 4.5, label);
  });

  test(`[${label}] semantic status and graph origins stay accent-independent and readable`, () => {
    for (const status of ["Success", "Warning", "Danger"]) {
      assert.equal(tokens[`status${status}`], legacy[scheme][`status${status}`]);
      for (const ground of [...planes, `statusSurface${status}`]) requireContrast(tokens, `status${status}`, ground, 4.5, label);
      for (const text of ["text", "textBright", "textSecondary", "textDim"]) {
        requireContrast(tokens, text, `statusSurface${status}`, 4.5, label);
      }
    }
    for (const [name, value] of Object.entries(legacy[scheme])) {
      if (/^graph(Origin|Pattern|Light)/.test(name)) assert.equal(tokens[name], value, name);
    }
    for (const group of ["graph", "graphOrigin"]) for (const [name, entry] of Object.entries(incumbent[group])) {
      if (!entry.minContrast) continue;
      const jsName = group + name[0].toUpperCase() + name.slice(1);
      for (const ground of entry.on) {
        const [group, key] = ground.split(".");
        requireContrast(tokens, jsName, group + key[0].toUpperCase() + key.slice(1), entry.minContrast, label);
      }
    }
    assert.equal(tokens.graphCanvas, tokens.surfaceCanvas);
    assert.equal(tokens.graphLabelSurface, tokens.surface);
    assert.equal(tokens.browserTheme, tokens.surfaceVoid);
  });
}

test("theme CSS is root-opt-in and scopes OS following separately from explicit appearance", () => {
  assert.equal(cssBlocks.length, 16);
  for (const { selector } of cssBlocks) assert.match(selector, /^:root\[data-pxo-theme="(?:cool|warm)"\]/);
  assert.equal([...css.matchAll(/@media \(prefers-color-scheme: light\)/g)].length, 4);
  assert.ok(!css.includes('data-theme="system"'), "System removes the existing appearance attribute");
});

test("packed package supports an isolated offline consumer through public exports", () => {
  const temporary = mkdtempSync(join(tmpdir(), "pxo-tokens-consumer-"));
  try {
    // Do not rebuild while other test files read dist. This checks the same
    // previously built artifact that the release would pack, with no installs.
    // npm 10's pacote can still run prepare despite --ignore-scripts. A no-op
    // script shell makes that lifecycle suppression explicit on supported CI.
    const [packed] = JSON.parse(execFileSync("npm", [
      "pack", "--ignore-scripts", "--script-shell=/bin/true", "--offline", "--json", "--pack-destination", temporary,
    ], { cwd: fileURLToPath(new URL("..", import.meta.url)), encoding: "utf8" }));
    const installed = join(temporary, "node_modules", "@pixeloven", "tokens");
    mkdirSync(installed, { recursive: true });
    execFileSync("tar", ["-xzf", join(temporary, packed.filename), "-C", installed, "--strip-components=1"]);
    const consumer = join(temporary, "consumer.mjs");
    writeFileSync(consumer, String.raw`
      import assert from "node:assert/strict";
      import { readFileSync, rmSync } from "node:fs";
      import { createRequire } from "node:module";
      import { dirname, join } from "node:path";
      const require = createRequire(import.meta.url);
      const text = name => readFileSync(require.resolve(name), "utf8");
      const css = text("@pixeloven/tokens/themes.css");
      const flat = JSON.parse(text("@pixeloven/tokens/themes.json"));
      const source = JSON.parse(text("@pixeloven/tokens/themes/source"));
      assert.match(css, /data-pxo-theme="warm"/);
      assert.match(css, /--pxo-action-primary-pressed:/);
      assert.equal(source.themes.warm.label, "Warm");
      assert.equal(JSON.parse(text("@pixeloven/tokens/source")).meta.defaultScheme, "dark");
      const root = dirname(dirname(require.resolve("@pixeloven/tokens/themes")));
      const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
      for (const name of [".", "./themes"]) {
        const declarations = readFileSync(join(root, manifest.exports[name].types), "utf8");
        assert.match(declarations, name === "." ? /interface TokenSet/ : /interface ThemeTokenSet extends TokenSet/);
      }
      // Source exports were present in the tarball. Removing them now proves
      // runtime consumers depend only on shipped dist files, not build inputs.
      rmSync(join(root, "src"), { recursive: true });
      const { default: legacy } = await import("@pixeloven/tokens");
      const { resolveTheme, normalizeThemeSettings } = await import("@pixeloven/tokens/themes");
      const resolved = resolveTheme({ theme: "warm", accent: "violet", appearance: "system" }, "light");
      assert.equal(resolved.scheme, "light");
      assert.deepEqual(resolved.tokens, flat.warm.violet.light);
      assert.equal(resolved.tokens.readingBodySize, legacy.light.readingBodySize);
      assert.equal(resolved.tokens.graphOriginDataview, legacy.light.graphOriginDataview);
      assert.notEqual(resolved.tokens.surfaceBg, legacy.light.surfaceBg);
      assert.ok(Object.isFrozen(resolved.tokens));
      assert.equal(resolveTheme({ appearance: "dark" }, "light").scheme, "dark");
      assert.equal(normalizeThemeSettings({ theme: "corrupt", accent: "violet" }).accent, "violet");
    `);
    execFileSync(process.execPath, [consumer], {
      cwd: temporary,
      env: { ...process.env, NODE_PATH: "" },
      encoding: "utf8",
    });
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});
