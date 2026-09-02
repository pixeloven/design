/**
 * Docs coverage tests.
 *
 * A reference site fails quietly: nobody notices a missing page, they just
 * cannot find the thing and invent their own instead — which is the failure
 * mode this whole system exists to remove. So the coverage is asserted rather
 * than assumed.
 *
 * Run with: node --test
 */

import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync, readdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const storiesDir = join(here, "..", "stories")
const repoRoot = join(here, "..", "..", "..")

const tokens = JSON.parse(
  readFileSync(join(repoRoot, "packages", "tokens", "src", "tokens.json"), "utf8"),
)
const marks = JSON.parse(readFileSync(join(repoRoot, "packages", "brand", "marks.json"), "utf8"))

const pages = readdirSync(storiesDir).filter((f) => f.endsWith(".mdx"))
const allPages = pages.map((f) => readFileSync(join(storiesDir, f), "utf8")).join("\n")

test("every token group is actually rendered, not just mentioned", () => {
  // Adding a group to tokens.json without documenting it leaves a token nobody
  // can find — and an undiscoverable token gets reinvented locally.
  //
  // This asserts the group is RENDERED, not that its name appears somewhere.
  // The first version of this test matched the group name as a substring of the
  // page text, and a fake `elevation` group passed it because the prose happens
  // to contain the word "elevation". A check that a word appears in prose is
  // not a check.
  const rendered = new Set(
    [...allPages.matchAll(/<Swatches\s+group="([^"]+)"/g)].map((m) => m[1]),
  )

  // Groups shown by a dedicated component rather than the generic swatch grid.
  // Listing them here is deliberate: adding a group means choosing how it is
  // documented, and this line is where that choice gets recorded.
  const RENDERED_ELSEWHERE = {
    surface: "the Ladder component on Foundations/Colour",
    border: "the Ladder component on Foundations/Colour",
    font: "Foundations/Typography",
  }

  const groups = Object.keys(tokens).filter((g) => !["meta", "$comment"].includes(g))
  for (const group of groups) {
    assert.ok(
      rendered.has(group) || group in RENDERED_ELSEWHERE,
      `token group "${group}" is not rendered on any docs page — add a ` +
        `<Swatches group="${group}" />, or record where it is shown in ` +
        `RENDERED_ELSEWHERE`,
    )
  }
})

test("both schemes are documented", () => {
  for (const scheme of tokens.meta.schemes) {
    assert.ok(allPages.toLowerCase().includes(scheme), `scheme "${scheme}" is not documented`)
  }
})

test("the docs render marks from the registry, not a hand-written list", () => {
  // If a mark were listed literally in MDX, adding one to the registry would
  // silently not appear. The page must go through the registry.
  const helpers = readFileSync(join(storiesDir, "Marks.helpers.tsx"), "utf8")
  assert.match(helpers, /@pixeloven\/brand\/marks\.json/, "Marks page must read the registry")
  for (const mark of marks.marks) {
    assert.ok(
      !allPages.includes(`marks/${mark.id}.svg`),
      `${mark.id} appears to be hardcoded in MDX — it should come from the registry`,
    )
  }
})

test("the colour page reads the token source rather than transcribing it", () => {
  const helpers = readFileSync(join(storiesDir, "Colour.helpers.tsx"), "utf8")
  assert.match(helpers, /@pixeloven\/tokens\/source/, "Colour page must read tokens at build time")
  // A transcribed value in the HELPERS would defeat the point. Prose in the MDX
  // may still cite historical values to explain why they were retired, which is
  // why only the helpers are checked.
  const literals = helpers.match(/#[0-9a-fA-F]{6}/g) ?? []
  assert.deepEqual(literals, [], `Colour helpers contain transcribed values: ${literals}`)
})

test("every page has a title", () => {
  for (const file of pages) {
    const body = readFileSync(join(storiesDir, file), "utf8")
    assert.match(body, /<Meta title="[^"]+"/, `${file} has no <Meta title>`)
  }
})
