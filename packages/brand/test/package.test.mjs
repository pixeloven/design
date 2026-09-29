import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const flatten = (value) => typeof value === "string" ? [value] : Object.values(value).flatMap(flatten);

test("packed package resolves every legacy, source and generated registry asset through public exports", () => {
  const temporary = mkdtempSync(join(tmpdir(), "pixeloven-brand-pack-"));
  try {
    const [archive] = JSON.parse(execFileSync("npm", ["pack", "--json", "--ignore-scripts", "--pack-destination", temporary], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }));
    writeFileSync(join(temporary, "package.json"), JSON.stringify({ name: "brand-install-check", version: "1.0.0", private: true }));
    execFileSync("npm", ["install", "--offline", "--no-audit", "--no-fund", "--no-package-lock", join(temporary, archive.filename)], { cwd: temporary, stdio: ["ignore", "pipe", "pipe"] });
    const installed = join(temporary, "node_modules", "@pixeloven", "brand");
    const consumer = createRequire(join(temporary, "consumer.cjs"));
    const registry = JSON.parse(readFileSync(consumer.resolve("@pixeloven/brand/marks.json"), "utf8"));
    const references = registry.marks.flatMap((mark) => [mark.file, ...Object.values(mark.variants).flatMap((variant) => [variant.source, ...flatten(variant.assets)])]);
    const shipped = archive.files.map(({ path }) => path);
    assert.deepEqual(shipped.filter((path) => /\.(svg|png)$/.test(path)).sort(), references.sort(), "only registered visual assets may ship");
    for (const file of references) {
      const resolved = consumer.resolve(`@pixeloven/brand/${file}`);
      assert.equal(relative(installed, resolved), file);
      assert.deepEqual(readFileSync(resolved), readFileSync(join(root, file)));
      if (file.startsWith("dist/assets/")) assert.equal(consumer.resolve(`@pixeloven/brand/${file.slice(5)}`), resolved);
    }
    for (const required of ["README.md", "CHANGELOG.md", "LICENSES/IBM-Plex-OFL.txt"]) assert.ok(shipped.includes(required));
    assert.ok(!shipped.some((file) => file.startsWith("node_modules/") || file.startsWith("test/")));
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});
