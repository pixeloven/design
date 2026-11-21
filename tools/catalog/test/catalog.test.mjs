/**
 * Catalogue tests.
 *
 * An id is only worth citing if it keeps resolving. These hold the generated
 * index and the entry files together in both directions, the way
 * packages/brand/test/marks.test.mjs holds marks.json and marks/ together, and
 * check that every `superseded_by` and every cited decision points at
 * something real.
 *
 * The second half feeds deliberately broken catalogues to the same analysis,
 * so each guard is shown to fail on the mistake it exists for. A check that has
 * never failed is not a check.
 *
 * Run with: pnpm test:catalog
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { analyse, idForPath, parseFrontmatter, readRepo, serialise } from "../lib.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const { files, tokens } = readRepo(root);
const { index, errors } = analyse(files, { tokens });
const committed = JSON.parse(readFileSync(join(root, "catalog", "index.json"), "utf8"));

/* ---------------------------------------------------------------- the repo */

test("every catalogue entry and decision is valid", () => {
  assert.deepEqual(errors, [], `catalogue problems:\n  ${errors.join("\n  ")}`);
});

test("the committed index is exactly what the files generate", () => {
  // Byte-for-byte, so a hand edit to index.json fails as surely as a stale one.
  assert.equal(readFileSync(join(root, "catalog", "index.json"), "utf8"), serialise(index));
});

test("every file is in the index", () => {
  const listed = new Set([...committed.entries, ...committed.decisions].map((e) => e.path));
  for (const f of files) {
    const at = idForPath(f.path);
    if (at && !at.error) assert.ok(listed.has(f.path), `${f.path} (${at.id}) is missing from catalog/index.json`);
  }
});

test("every index row is a file that carries that id", () => {
  for (const row of [...committed.entries, ...committed.decisions]) {
    const full = join(root, row.path);
    assert.ok(existsSync(full), `${row.id} points at ${row.path}, which does not exist`);
    const { data } = parseFrontmatter(readFileSync(full, "utf8"), row.path);
    assert.equal(data.id, row.id, `${row.path} carries ${data.id}, the index says ${row.id}`);
  }
});

test("every superseded_by resolves to an indexed id or a token", () => {
  const ids = new Set([...committed.entries, ...committed.decisions].map((e) => e.id));
  const isToken = (ref) => {
    const [group, name] = ref.startsWith("pxo:token/") ? ref.slice("pxo:token/".length).split(".") : [];
    return Boolean(group && name && tokens?.[group]?.[name] !== undefined);
  };
  for (const row of [...committed.entries, ...committed.decisions]) {
    for (const ref of row.superseded_by) {
      assert.ok(ids.has(ref) || isToken(ref), `${row.id}: superseded_by ${ref} does not resolve`);
    }
  }
});

test("decisions are numbered without gaps", () => {
  // A gap means a record was deleted; decisions are superseded, never removed.
  const numbers = committed.decisions.map((d) => Number(d.id.slice("pxo:ddr/".length)));
  assert.deepEqual(numbers, numbers.map((_, i) => i + 1));
});

/* ------------------------------------------------ the guards, made to fail */

const entry = (fields, body = "\nBody.\n") =>
  `---\n${Object.entries(fields)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? `[${v.join(", ")}]` : v}`)
    .join("\n")}\n---\n${body}`;

const good = {
  id: "pxo:pattern/command-bar",
  title: "Command bar",
  tier: "pattern",
  status: "adopted",
  since: "catalog-2026.11",
  owners: ["design"],
};
const ddr = {
  id: "pxo:ddr/0001",
  title: "A decision",
  status: "accepted",
  date: "2026-11-21",
  sources: ["docs/brand-family.md"],
};
const run = (list) => analyse(list.map(([path, text]) => ({ path, text }))).errors;
const fails = (list, pattern) => {
  const errs = run(list);
  assert.ok(
    errs.some((e) => pattern.test(e)),
    `expected an error matching ${pattern}, got:\n  ${errs.join("\n  ") || "(none)"}`,
  );
};

test("a well-formed catalogue passes", () => {
  assert.deepEqual(
    run([
      ["catalog/patterns/command-bar.md", entry(good)],
      ["decisions/0001-a-decision.md", entry(ddr)],
    ]),
    [],
  );
});

test("fails: an id that disagrees with its path", () => {
  fails([["catalog/patterns/palette.md", entry(good)]], /its path makes it "pxo:pattern\/palette"/);
});

test("fails: a file outside the known areas", () => {
  fails([["catalog/widgets/thing.md", entry(good)]], /not a catalogue area/);
});

test("fails: a stray Markdown file that is not an entry", () => {
  fails([["catalog/patterns/command-bar/notes/extra.md", "# notes"]], /not an entry/);
});

test("fails: a missing required field", () => {
  const { owners, ...rest } = good;
  fails([["catalog/patterns/command-bar.md", entry(rest)]], /missing required "owners"/);
});

test("fails: an unknown field (a typo would otherwise vanish from the index)", () => {
  fails([["catalog/patterns/command-bar.md", entry({ ...good, superseeded_by: "x" })]], /unknown field "superseeded_by"/);
});

test("fails: a status or tier off the line", () => {
  fails([["catalog/patterns/command-bar.md", entry({ ...good, status: "live" })]], /status "live"/);
  fails([["catalog/patterns/command-bar.md", entry({ ...good, tier: "component" })]], /tier "component"/);
});

test("fails: a superseded_by that does not resolve", () => {
  fails(
    [["catalog/patterns/command-bar.md", entry({ ...good, status: "deprecated", superseded_by: "pxo:pattern/nothing" })]],
    /superseded_by "pxo:pattern\/nothing" does not resolve/,
  );
});

test("fails: superseded_by on an entry still adopted", () => {
  fails(
    [
      ["catalog/patterns/command-bar.md", entry({ ...good, superseded_by: "pxo:pattern/palette" })],
      ["catalog/patterns/palette.md", entry({ ...good, id: "pxo:pattern/palette" })],
    ],
    /status must be deprecated or retired/,
  );
});

test("fails: a cited decision that does not exist", () => {
  fails([["catalog/patterns/command-bar.md", entry({ ...good, decisions: ["pxo:ddr/0009"] })]], /"pxo:ddr\/0009" does not resolve/);
});

test("fails: a retired entry outside the archive, and an archived one not retired", () => {
  fails([["catalog/patterns/command-bar.md", entry({ ...good, status: "retired" })]], /belongs under catalog\/archive/);
  fails([["catalog/archive/patterns/command-bar.md", entry({ ...good, tier: "archive" })]], /must have status retired/);
});

test("a retired entry keeps its id in the archive", () => {
  assert.equal(idForPath("catalog/archive/patterns/command-bar.md").id, "pxo:pattern/command-bar");
  assert.equal(idForPath("catalog/archive/pi-web-dark.md").id, "pxo:archive/pi-web-dark");
  assert.equal(idForPath("catalog/studies/warden-identity/README.md").id, "pxo:study/warden-identity");
});

test("fails: a study outside the study tier", () => {
  fails(
    [["catalog/studies/x.md", entry({ ...good, id: "pxo:study/x", tier: "pattern", status: "study" })]],
    /must have tier study/,
  );
});

test("fails: an art entry with no ip declaration", () => {
  fails(
    [["catalog/art/harbour.md", entry({ ...good, id: "pxo:art/harbour", tier: "direction", status: "study" })]],
    /must declare ip/,
  );
});

test("fails: two files claiming one id", () => {
  fails(
    [
      ["catalog/patterns/command-bar.md", entry(good)],
      ["catalog/patterns/command-bar/README.md", entry(good)],
    ],
    /already used/,
  );
});

test("fails: a superseded decision that names no successor", () => {
  fails([["decisions/0001-a-decision.md", entry({ ...ddr, status: "superseded" })]], /must name superseded_by/);
});

test("fails: frontmatter the parser does not understand", () => {
  fails([["catalog/patterns/command-bar.md", `---\nid: pxo:pattern/command-bar\nnested:\n  key: value\n---\n`]], /expected "key: value"/);
  fails([["catalog/patterns/command-bar.md", "# no frontmatter\n"]], /must start with a --- frontmatter block/);
});

test("resolves token ids against tokens.json", () => {
  const withToken = entry({ ...good, status: "deprecated", superseded_by: "pxo:token/status.danger" });
  const errs = analyse([{ path: "catalog/patterns/command-bar.md", text: withToken }], { tokens }).errors;
  assert.deepEqual(errs, []);
  const missing = entry({ ...good, status: "deprecated", superseded_by: "pxo:token/status.nope" });
  assert.ok(analyse([{ path: "catalog/patterns/command-bar.md", text: missing }], { tokens }).errors.length > 0);
});
