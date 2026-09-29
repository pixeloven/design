import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { accentNames, resolveTheme, themeNames } from "@pixeloven/tokens/themes";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("..", import.meta.url));
const css = readFileSync(join(root, "dist/styles.css"), "utf8");

test("scoped CSS consumes existing roles in every theme without redefining foundations", () => {
  const references = [...css.matchAll(/var\((--pxo-[a-z-]+)\)/g)].map(match => match[1]);
  assert.ok(references.length > 0);
  for (const theme of themeNames) for (const accent of accentNames) for (const appearance of ["dark", "light"]) {
    const tokens = resolveTheme({ theme, accent, appearance }).tokens;
    const names = new Set(Object.keys(tokens).map(name => `--pxo-${name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`));
    for (const reference of references) assert.ok(names.has(reference), `${theme}/${accent}/${appearance}: ${reference}`);
  }
  assert.doesNotMatch(css, /#[\da-f]{3,8}\b|\b(?:rgb|hsl|oklch|color-mix)\(/i, "no local palette");
  assert.doesNotMatch(css, /--pxo-[a-z-]+\s*:/, "controls never redefine foundation tokens");
  assert.doesNotMatch(css, /(?:font-size|font-weight|line-height|letter-spacing|border-radius|transition-duration|z-index)\s*:\s*(?!var\()[\d.-]/, "existing scales stay tokenized");
  const rules = css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{[^{}]*\}/g);
  for (const [, selectors] of rules) for (const selector of selectors.split(",")) {
    assert.match(selector.trim(), /^\.pxo-(?:button|input|select|label)(?=[\s:.[#-]|$)/, selector);
  }
});

test("an isolated consumer imports and typechecks the tarball without source or bundled peers", () => {
  const temporary = mkdtempSync(join(tmpdir(), "pxo-ui-consumer-"));
  try {
    const [packed] = JSON.parse(execFileSync("npm", ["pack", "--ignore-scripts", "--offline", "--json", "--pack-destination", temporary], { cwd: root, encoding: "utf8" }));
    const installed = join(temporary, "node_modules/@pixeloven/ui");
    mkdirSync(installed, { recursive: true });
    execFileSync("tar", ["-xzf", join(temporary, packed.filename), "-C", installed, "--strip-components=1"]);
    assert.ok(packed.files.every(file => /^(dist\/|README\.md$|CHANGELOG\.md$|package\.json$)/.test(file.path)), "only public artifact and documentation ship");
    const manifest = JSON.parse(readFileSync(join(installed, "package.json"), "utf8"));
    assert.equal(manifest.peerDependencies.react, "^19.0.0");
    assert.equal(manifest.peerDependencies["@pixeloven/tokens"], ">=0.6.0 <0.7.0");
    assert.equal(manifest.dependencies, undefined, "no runtime copies of peers");
    assert.ok(manifest.sideEffects.includes("**/*.css"), "bundlers retain the imported stylesheet");
    for (const dependency of ["react", "react-dom", "@types/react"]) {
      const destination = join(temporary, "node_modules", dependency);
      mkdirSync(dirname(destination), { recursive: true });
      symlinkSync(dirname(realpathSync(require.resolve(`${dependency}/package.json`))), destination);
    }
    const entry = readFileSync(join(installed, "dist/index.js"), "utf8");
    assert.match(entry, /from ["']react\/jsx-runtime["']/, "React stays an external runtime import");
    assert.doesNotMatch(entry, /@pixeloven\/tokens|localStorage|matchMedia/, "theme resolution and preference storage belong to the consumer");
    assert.equal(readFileSync(join(installed, "dist/styles.css"), "utf8"), css);
    writeFileSync(join(temporary, "package.json"), JSON.stringify({ type: "module" }));
    writeFileSync(join(temporary, "consumer.mjs"), `
      import assert from "node:assert/strict";
      import { readFileSync } from "node:fs";
      import { createElement } from "react";
      import { renderToStaticMarkup } from "react-dom/server";
      import * as controls from "@pixeloven/ui";
      assert.deepEqual(Object.keys(controls).sort(), ["Button", "Input", "Label", "Select"]);
      assert.match(renderToStaticMarkup(createElement(controls.Button, null, "Save")), /type="button"/);
      assert.match(readFileSync(new URL(import.meta.resolve("@pixeloven/ui/styles.css")), "utf8"), /--pxo-action-primary/);
    `);
    execFileSync(process.execPath, [join(temporary, "consumer.mjs")], { cwd: temporary, encoding: "utf8", env: { ...process.env, NODE_PATH: "" } });
    copyFileSync(join(root, "type-tests/public-api.tsx"), join(temporary, "consumer.tsx"));
    writeFileSync(join(temporary, "tsconfig.json"), JSON.stringify({
      compilerOptions: {
        target: "ES2022", module: "NodeNext", moduleResolution: "NodeNext", jsx: "react-jsx", strict: true,
        exactOptionalPropertyTypes: true, noUncheckedIndexedAccess: true, noUnusedLocals: true,
        noUnusedParameters: true, verbatimModuleSyntax: true, noEmit: true, types: ["react"],
      },
      include: ["consumer.tsx"],
    }));
    execFileSync(join(root, "node_modules/.bin/tsc"), ["-p", join(temporary, "tsconfig.json")], { cwd: temporary, encoding: "utf8" });
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});
