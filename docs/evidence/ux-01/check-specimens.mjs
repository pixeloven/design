// Reproducible local specimen evidence. See README.md for temporary tool setup.
import assert from "node:assert/strict";
import { writeFileSync, mkdirSync } from "node:fs";
assert.ok(process.env.AXE_PATH, "AXE_PATH is required: specimen evidence must include a real accessibility audit");
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const output = new URL("./", import.meta.url);
mkdirSync(output, { recursive: true });
const results = [];
const failures = [];
const base = process.env.SPECIMEN_URL || "http://127.0.0.1:6106";
for (const theme of ["dark", "light"]) {
  for (const [name, width, height, scale] of [["desktop", 1440, 1000, 1], ["phone", 390, 844, 1], ["text-200", 320, 568, 2]]) {
    const page = await browser.newPage({ viewport: { width, height }, colorScheme: theme, reducedMotion: "reduce" });
    page.on("pageerror", error => failures.push(error.message));
    const externalRequests = [];
    page.on("request", request => { if (!request.url().startsWith(base) && !request.url().startsWith("data:")) externalRequests.push(request.url()); });
    await page.goto(`${base}/iframe.html?id=specimens-lattice--overview&viewMode=story&globals=theme:${theme}`);
    await page.locator(".pxo-lattice").waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(scale => { document.documentElement.style.fontSize = `${scale * 100}%`; }, scale);
    await page.locator("#specimen-search").fill("no matching fixture");
    assert.equal(await page.locator(".pxo-result").count(), 0);
    await page.getByRole("button", { name: "Clear search" }).click();
    assert.equal(await page.locator(".pxo-result").count(), 1);
    await page.locator(".pxo-result").click();
    assert.equal(await page.locator(".pxo-result").getAttribute("aria-pressed"), "false");
    await page.locator(".pxo-result").click();
    await page.locator("#specimen-search").fill("garden");
    await page.locator("#specimen-search").focus();
    await page.keyboard.press("Tab");
    assert.equal(await page.locator(".pxo-result").evaluate(el => el === document.activeElement), true);
    await page.locator("#specimen-search").focus();
    await page.evaluate(() => window.scrollTo(0, 0));
    const computed = await page.evaluate(() => {
      const style = selector => { const s = getComputedStyle(document.querySelector(selector)); return { family: s.fontFamily, size: s.fontSize, line: s.lineHeight, weight: s.fontWeight }; };
      const panel = document.querySelector(".pxo-lattice");
      const root = getComputedStyle(document.documentElement);
      return {
        theme: document.documentElement.dataset.theme,
        overflow: document.documentElement.scrollWidth > innerWidth,
        body: style(".pxo-lattice"), resultHeading: style(".pxo-result > span:first-child"), control: style(".pxo-result"), input: style("#specimen-search"), code: style(".pxo-lattice pre"),
        targets: [...panel.querySelectorAll("button,input")].map(el => ({ name: el.textContent || el.id, width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height })),
        focus: getComputedStyle(document.activeElement).outlineStyle,
        canvas: root.getPropertyValue("--pxo-graph-canvas").trim(),
        fontFaces: [...document.fonts].filter(face => face.status === "loaded").map(face => `${face.family}:${face.weight}`),
        patterns: [...document.querySelectorAll(".pxo-origin-line")].map(el => getComputedStyle(el).borderTopStyle),
      };
    });
    assert.equal(computed.theme, theme);
    assert.equal(computed.overflow, false);
    assert.equal(computed.body.size, `${16 * scale}px`);
    assert.equal(computed.body.line, `${24 * scale}px`);
    assert.equal(computed.resultHeading.size, `${16 * scale}px`);
    assert.equal(computed.control.size, `${14 * scale}px`);
    assert.equal(computed.input.size, `${16 * scale}px`);
    assert.equal(computed.code.size, `${14 * scale}px`);
    assert.equal(computed.code.line, `${22 * scale}px`);
    assert.ok(computed.targets.every(target => target.width >= 44 && target.height >= 44));
    assert.equal(computed.focus, "solid");
    assert.deepEqual(computed.patterns, ["solid", "solid", "solid", "solid", "solid", "dashed"]);
    assert.ok(computed.fontFaces.some(face => face.includes("IBM Plex Sans")));
    assert.ok(computed.fontFaces.some(face => face.includes("IBM Plex Mono")));
    assert.deepEqual(externalRequests, []);
    await page.addScriptTag({ path: process.env.AXE_PATH });
    const axe = await page.evaluate(async () => {
      const result = await window.axe.run(document.querySelector(".pxo-lattice"), { runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] });
      return { status: "ran", version: window.axe.version, passes: result.passes.length, incomplete: result.incomplete.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), violations: result.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })) };
    });
    assert.ok(axe.passes > 0);
    assert.deepEqual(axe.violations, []);
    assert.deepEqual(axe.incomplete, []);
    if (process.env.CAPTURE !== "0") await page.screenshot({ path: new URL(`${theme}-${name}.png`, output).pathname, fullPage: true });
    results.push({ theme, name, width, height, scale, ...computed, externalRequests, axe });
    await page.close();
  }
}
assert.deepEqual(failures, []);
writeFileSync(new URL("browser-results.json", output), JSON.stringify({ browser: browser.version(), failures, results }, null, 2) + "\n");
await browser.close();
console.log(`Verified ${results.length} theme/viewport/text-scale combinations.`);
