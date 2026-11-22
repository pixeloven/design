/**
 * Rendered-story verification for the built static Storybook.
 *
 * A successful build, or a page that answers HTTP 200, does not prove a single
 * component rendered: a past documentation image served every page with a 200
 * while its Marks page threw `React is not defined`. So this opens the built
 * output in a headless browser, under the same project path GitHub Pages serves
 * it from, and fails on any console error, uncaught page error, failed request,
 * Storybook error screen, or story root with nothing rendered in it.
 *
 *   node scripts/verify-rendered.mjs [storybook-static]
 *
 * STORYBOOK_BASE_PATH (default `/design/`) is the path the files are served
 * under. RENDERED_SCREENSHOT_DIR, when set, saves one screenshot per target.
 */

import { createServer } from "node:http"
import { readFile, mkdir } from "node:fs/promises"
import { extname, join, normalize, resolve, sep } from "node:path"
import { chromium } from "playwright"

const root = resolve(process.argv[2] ?? "storybook-static")
const base = `/${(process.env.STORYBOOK_BASE_PATH ?? "/design/").replace(/^\/+|\/+$/g, "")}/`.replace("//", "/")
const screenshotDir = process.env.RENDERED_SCREENSHOT_DIR
const RENDER_TIMEOUT_MS = 30_000

// Each target names what must be on the page, not merely that something is.
// An empty root, or a page that kept only its prose while a component threw,
// fails its expectation even when the console stays quiet.
const TARGETS = [
  { id: "introduction--docs", mode: "docs", expect: { h1: 1, p: 1 } },
  // The page that threw `React is not defined`. Every mark image must load.
  { id: "foundations-marks--docs", mode: "docs", expect: { h1: 1, "img.approved-lockup": 1, ".pxo-marks img": 1 } },
  { id: "foundations-brand-themes--docs", mode: "docs", expect: { h1: 1, button: 1, select: 1 } },
  { id: "foundations-scales--docs", mode: "docs", expect: { h1: 1, ".pxo-scale-row": 5 } },
  // Representative controls: the shared @pixeloven/ui Button, Input, Select and Label.
  { id: "specimens-brand-themes--shared-workflows", mode: "story", expect: { button: 1, input: 1, select: 1, label: 1 } },
]

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".ico": "image/x-icon", ".woff": "font/woff", ".woff2": "font/woff2", ".txt": "text/plain",
}

// Serves the build only under `base`, as Pages does: anything that reaches for
// the site root instead of its project path gets a 404 here, not a lucky hit.
function serve() {
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url, "http://x").pathname)
    if (!path.startsWith(base)) return void res.writeHead(404).end()
    let file = normalize(join(root, path.slice(base.length)))
    if (file !== root && !file.startsWith(root + sep)) return void res.writeHead(403).end()
    if (path.endsWith("/")) file = join(file, "index.html")
    try {
      const body = await readFile(file)
      res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" }).end(body)
    } catch {
      res.writeHead(404).end()
    }
  })
  return new Promise(ok => server.listen(0, "127.0.0.1", () => ok(server)))
}

function watch(page, origin, problems) {
  page.on("console", msg => { if (msg.type() === "error") problems.push(`console error: ${msg.text()}`) })
  page.on("pageerror", err => problems.push(`page error: ${err.message}`))
  page.on("requestfailed", req => problems.push(`request failed: ${req.url()} (${req.failure()?.errorText})`))
  page.on("response", res => {
    if (res.url().startsWith(origin) && res.status() >= 400) problems.push(`HTTP ${res.status()}: ${res.url()}`)
  })
}

// Runs in the page. Reports what is missing, or null once everything is there.
function inspect({ rootSelector, expect }) {
  const body = document.body
  if (body.classList.contains("sb-show-errordisplay")) {
    return `Storybook error screen: ${document.querySelector("#error-message")?.textContent ?? ""}`.trim()
  }
  if (body.classList.contains("sb-show-nopreview")) return "Storybook shows no preview"
  const storyRoot = document.querySelector(rootSelector)
  if (!storyRoot || storyRoot.childElementCount === 0) return `${rootSelector} has no rendered content`
  const box = storyRoot.getBoundingClientRect()
  if (box.width === 0 || box.height === 0 || storyRoot.innerText.trim() === "") return `${rootSelector} renders nothing visible`
  const missing = Object.entries(expect)
    .map(([selector, min]) => [selector, min, storyRoot.querySelectorAll(selector).length])
    .filter(([, min, found]) => found < min)
    .map(([selector, min, found]) => `${selector} (${found} of ${min})`)
  if (missing.length) return `missing ${missing.join(", ")}`
  const broken = [...storyRoot.querySelectorAll("img")].filter(img => !img.complete || img.naturalWidth === 0)
  if (broken.length) return `images not loaded: ${broken.map(img => img.getAttribute("src")).join(", ")}`
  return null
}

async function checkTarget(context, origin, index, target) {
  const problems = []
  if (!index.entries[target.id]) return [`not in index.json`]
  const page = await context.newPage()
  watch(page, origin, problems)
  const rootSelector = target.mode === "docs" ? "#storybook-docs" : "#storybook-root"
  const arg = { rootSelector, expect: target.expect }
  try {
    await page.goto(`${origin}${base}iframe.html?id=${target.id}&viewMode=${target.mode}`, { waitUntil: "load" })
    // Waits for the render to settle; a timeout falls through to the final
    // inspection below, which names what never appeared.
    await page.waitForFunction(`(${inspect})(${JSON.stringify(arg)}) === null`, null, { timeout: RENDER_TIMEOUT_MS, polling: 250 })
      .catch(() => {})
    // Late errors — a lazy component throwing after first paint — still count.
    await page.waitForLoadState("networkidle").catch(() => {})
    const state = await page.evaluate(inspect, arg)
    if (state) problems.push(state)
    if (screenshotDir) await page.screenshot({ path: join(screenshotDir, `${target.id}.png`), fullPage: true })
  } catch (err) {
    problems.push(`navigation: ${err.message}`)
  } finally {
    await page.close()
  }
  return problems
}

// The manager is what a visitor lands on. It must load under the project path
// and show the preview inside its frame, not only when the iframe is opened bare.
async function checkManager(context, origin) {
  const problems = []
  const page = await context.newPage()
  watch(page, origin, problems)
  try {
    await page.goto(`${origin}${base}?path=/docs/introduction--docs`, { waitUntil: "load" })
    const frame = page.frameLocator("#storybook-preview-iframe")
    await frame.locator("#storybook-docs h1").first().waitFor({ timeout: RENDER_TIMEOUT_MS })
    await page.waitForLoadState("networkidle").catch(() => {})
  } catch (err) {
    problems.push(`manager did not show the Introduction preview: ${err.message.split("\n")[0]}`)
  } finally {
    await page.close()
  }
  return problems
}

const server = await serve()
const origin = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch()
let failed = 0
try {
  if (screenshotDir) await mkdir(screenshotDir, { recursive: true })
  const index = JSON.parse(await readFile(join(root, "index.json"), "utf8"))
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const results = [["manager", await checkManager(context, origin)]]
  for (const target of TARGETS) results.push([target.id, await checkTarget(context, origin, index, target)])
  for (const [name, problems] of results) {
    if (problems.length === 0) {
      console.log(`ok    ${name}`)
      continue
    }
    failed++
    console.log(`FAIL  ${name}`)
    for (const problem of problems) console.log(`      ${problem}`)
  }
} finally {
  await browser.close()
  server.close()
}
console.log(failed ? `\n${failed} rendered check(s) failed under ${base}` : `\nall rendered checks passed under ${base}`)
process.exitCode = failed ? 1 : 0
