#!/usr/bin/env node
/**
 * Regenerate catalog/index.json from entry and decision frontmatter.
 *
 *   node tools/catalog/build-index.mjs           write the index
 *   node tools/catalog/build-index.mjs --check   fail if the committed index is stale
 *
 * Either way, an invalid entry fails before anything is written: an index built
 * over a broken entry would record the breakage as fact.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { analyse, readRepo, serialise } from "./lib.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const target = join(root, "catalog", "index.json");

const { files, tokens } = readRepo(root);
const { index, errors } = analyse(files, { tokens });

if (errors.length > 0) {
  console.error(`catalogue has ${errors.length} problem(s):\n  ${errors.join("\n  ")}`);
  process.exit(1);
}

const next = serialise(index);
if (process.argv.includes("--check")) {
  const current = existsSync(target) ? readFileSync(target, "utf8") : "";
  if (current !== next) {
    console.error("catalog/index.json is stale: run `pnpm catalog:index` and commit the result.");
    process.exit(1);
  }
  console.log(`catalog/index.json is current: ${index.entries.length} entries, ${index.decisions.length} decisions.`);
} else {
  writeFileSync(target, next);
  console.log(`wrote catalog/index.json: ${index.entries.length} entries, ${index.decisions.length} decisions.`);
}
