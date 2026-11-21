/**
 * The design catalogue: discovery, frontmatter, ids and the generated index.
 *
 * Every non-code entry in catalog/ and every decision record in decisions/
 * carries its metadata as frontmatter. catalog/index.json is generated from
 * that frontmatter and never edited by hand, the same way marks.json and
 * marks/ are held together in packages/brand: a registry that can disagree
 * with its files silently is worse than no registry.
 *
 * Everything below `analyse` is pure: it takes { path, text } records, so the
 * tests can feed it the real repository or a deliberately broken one.
 *
 * No dependencies. The frontmatter is a deliberately small YAML subset
 * (scalars, flow lists and block lists); anything else is an error rather than
 * a guess, so an entry cannot carry data the index silently drops.
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

/** Id area -> folder under catalog/. The id names the kind; the folder groups it. */
export const AREAS = {
  a11y: "a11y",
  pattern: "patterns",
  voice: "voice",
  art: "art",
  scene: "scene",
  study: "studies",
  archive: "archive",
};
const FOLDER_TO_AREA = Object.fromEntries(Object.entries(AREAS).map(([a, f]) => [f, a]));

export const TIERS = ["foundation", "pattern", "direction", "study", "archive"];
export const STATUSES = ["proposed", "study", "adopted", "deprecated", "retired"];
export const IP = ["reference-only", "original", "under-review"];
export const DDR_STATUSES = ["proposed", "accepted", "superseded"];

const ENTRY_REQUIRED = ["id", "title", "tier", "status", "since", "owners"];
const ENTRY_OPTIONAL = ["consumers", "supersedes", "superseded_by", "decisions", "sources", "ip", "outcome"];
const DDR_REQUIRED = ["id", "title", "status", "date", "sources"];
const DDR_OPTIONAL = ["supersedes", "superseded_by", "affects"];
const LIST_FIELDS = new Set(["owners", "consumers", "supersedes", "superseded_by", "decisions", "sources", "affects"]);

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DDR_FILE = /^decisions\/(\d{4})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;

/* ------------------------------------------------------------------------ */
/* Frontmatter                                                               */
/* ------------------------------------------------------------------------ */

function scalar(raw, where) {
  const v = raw.trim();
  if (v.startsWith('"')) {
    if (!v.endsWith('"') || v.length < 2) throw new Error(`${where}: unterminated quoted string`);
    return JSON.parse(v);
  }
  if (v.startsWith("'") || v.startsWith("{") || v.startsWith("|") || v.startsWith(">")) {
    throw new Error(`${where}: unsupported YAML (use plain or "double-quoted" scalars)`);
  }
  return v;
}

function flowList(raw, where) {
  const inner = raw.trim().slice(1, -1).trim();
  if (inner === "") return [];
  // Split on commas outside double quotes.
  const items = [];
  let cur = "";
  let quoted = false;
  for (const ch of inner) {
    if (ch === '"') quoted = !quoted;
    if (ch === "," && !quoted) {
      items.push(cur);
      cur = "";
    } else cur += ch;
  }
  items.push(cur);
  return items.map((i) => scalar(i, where));
}

/**
 * Parse the leading `---` block. Returns { data, body } or throws with the
 * file and line, because a half-parsed entry is how an index drifts.
 */
export function parseFrontmatter(text, file) {
  const lines = text.split(/\r?\n/);
  if (lines[0] !== "---") throw new Error(`${file}: must start with a --- frontmatter block`);
  const end = lines.indexOf("---", 1);
  if (end === -1) throw new Error(`${file}: frontmatter block is not closed with ---`);
  const data = {};
  let listKey = null;
  for (let i = 1; i < end; i++) {
    const line = lines[i];
    const where = `${file}:${i + 1}`;
    if (line.trim() === "" || line.trimStart().startsWith("#")) continue;
    const item = line.match(/^ {2}- (.*)$/);
    if (item) {
      if (!listKey) throw new Error(`${where}: list item without a key`);
      data[listKey].push(scalar(item[1], where));
      continue;
    }
    const kv = line.match(/^([a-z_]+):(?: (.*))?$/);
    if (!kv) throw new Error(`${where}: expected "key: value" or "  - item"`);
    const [, key, rawValue = ""] = kv;
    if (key in data) throw new Error(`${where}: duplicate key "${key}"`);
    listKey = null;
    const v = rawValue.trim();
    if (v === "") {
      data[key] = [];
      listKey = key;
    } else if (v.startsWith("[")) {
      if (!v.endsWith("]")) throw new Error(`${where}: unterminated [list]`);
      data[key] = flowList(v, where);
    } else {
      data[key] = scalar(v, where);
    }
  }
  return { data, body: lines.slice(end + 1).join("\n") };
}

/* ------------------------------------------------------------------------ */
/* Paths and ids                                                             */
/* ------------------------------------------------------------------------ */

/**
 * The id a file must carry, derived from where it lives. Returns null for a
 * Markdown file that is not an entry (catalog/README.md, files inside an entry
 * directory). An entry is `<folder>/<slug>.md` or `<folder>/<slug>/README.md`.
 * A retired entry keeps its id: `archive/<folder>/<slug>` keeps `<area>/<slug>`,
 * while something that was only ever archived is `archive/<slug>`.
 */
export function idForPath(path) {
  const ddr = path.match(DDR_FILE);
  if (ddr) return { id: `pxo:ddr/${ddr[1]}`, kind: "decision" };
  if (path.startsWith("decisions/")) return null;
  if (!path.startsWith("catalog/")) return null;

  const parts = path.slice("catalog/".length).split("/");
  if (parts.length === 1) return null; // catalog/README.md and friends

  const entryAt = (segs) => {
    // segs: [slug + ".md"] or [slug, "README.md"]
    if (segs.length === 1 && segs[0].endsWith(".md") && segs[0] !== "README.md") return segs[0].slice(0, -3);
    if (segs.length === 2 && segs[1] === "README.md") return segs[0];
    return null;
  };

  const folder = parts[0];
  const area = FOLDER_TO_AREA[folder];
  if (!area) return { error: `catalog/${folder}/ is not a catalogue area (${Object.values(AREAS).join(", ")})` };

  if (area === "archive") {
    const inner = FOLDER_TO_AREA[parts[1]];
    if (inner && inner !== "archive") {
      const slug = entryAt(parts.slice(2));
      return slug ? { id: `pxo:${inner}/${slug}`, kind: "entry", archived: true, area: inner } : null;
    }
    const slug = entryAt(parts.slice(1));
    return slug ? { id: `pxo:archive/${slug}`, kind: "entry", archived: true, area: "archive" } : null;
  }
  const slug = entryAt(parts.slice(1));
  return slug ? { id: `pxo:${area}/${slug}`, kind: "entry", archived: false, area } : null;
}

/** The directory an entry owns, when it is a `<slug>/README.md` entry. */
function entryDir(path) {
  return path.endsWith("/README.md") ? path.slice(0, -"README.md".length) : null;
}

/* ------------------------------------------------------------------------ */
/* Validation and the index                                                  */
/* ------------------------------------------------------------------------ */

const asList = (v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

function checkKeys(data, required, optional, file, errors) {
  for (const k of required) {
    if (data[k] === undefined || (Array.isArray(data[k]) && data[k].length === 0)) {
      errors.push(`${file}: missing required "${k}"`);
    }
  }
  for (const k of Object.keys(data)) {
    if (!required.includes(k) && !optional.includes(k)) errors.push(`${file}: unknown field "${k}"`);
  }
  for (const k of Object.keys(data)) {
    if (LIST_FIELDS.has(k) && !Array.isArray(data[k])) {
      // Single values are allowed for supersedes/superseded_by; normalise later.
      if (!["supersedes", "superseded_by"].includes(k)) errors.push(`${file}: "${k}" must be a list`);
    }
    if (!LIST_FIELDS.has(k) && Array.isArray(data[k])) errors.push(`${file}: "${k}" must be a single value`);
  }
}

/**
 * Analyse every Markdown file under catalog/ and decisions/.
 *
 * @param {{path: string, text: string}[]} files  repo-relative, "/"-separated
 * @param {{tokens?: object}} [opts]  tokens.json, to resolve pxo:token/ ids
 * @returns {{ index: object, errors: string[] }}
 */
export function analyse(files, opts = {}) {
  const errors = [];
  const entries = [];
  const decisions = [];

  const md = files.filter((f) => f.path.endsWith(".md")).sort((a, b) => a.path.localeCompare(b.path));
  const ownedDirs = md
    .map((f) => ({ f, at: idForPath(f.path) }))
    .filter(({ at }) => at && at.kind === "entry")
    .map(({ f }) => entryDir(f.path))
    .filter(Boolean);

  for (const file of md) {
    const at = idForPath(file.path);
    if (at === null) {
      const allowed =
        file.path === "catalog/README.md" ||
        file.path === "decisions/README.md" ||
        file.path === "decisions/TEMPLATE.md" ||
        ownedDirs.some((d) => file.path.startsWith(d));
      if (!allowed) errors.push(`${file.path}: not an entry, and not inside an entry directory`);
      continue;
    }
    if (at.error) {
      errors.push(`${file.path}: ${at.error}`);
      continue;
    }

    let data;
    try {
      ({ data } = parseFrontmatter(file.text, file.path));
    } catch (e) {
      errors.push(e.message);
      continue;
    }

    if (data.id !== at.id) errors.push(`${file.path}: id is "${data.id}" but its path makes it "${at.id}"`);

    if (at.kind === "decision") {
      checkKeys(data, DDR_REQUIRED, DDR_OPTIONAL, file.path, errors);
      if (data.status && !DDR_STATUSES.includes(data.status)) {
        errors.push(`${file.path}: status "${data.status}" is not one of ${DDR_STATUSES.join(", ")}`);
      }
      if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) errors.push(`${file.path}: date must be YYYY-MM-DD`);
      const by = asList(data.superseded_by);
      if (data.status === "superseded" && by.length === 0) {
        errors.push(`${file.path}: a superseded decision must name superseded_by`);
      }
      if (by.length > 0 && data.status !== "superseded") {
        errors.push(`${file.path}: superseded_by is set, so status must be superseded`);
      }
      decisions.push({
        id: data.id,
        title: data.title,
        status: data.status,
        date: data.date,
        path: file.path,
        supersedes: asList(data.supersedes),
        superseded_by: by,
        affects: asList(data.affects),
        sources: asList(data.sources),
      });
      continue;
    }

    checkKeys(data, ENTRY_REQUIRED, ENTRY_OPTIONAL, file.path, errors);
    if (data.tier && !TIERS.includes(data.tier)) {
      errors.push(`${file.path}: tier "${data.tier}" is not one of ${TIERS.join(", ")}`);
    }
    if (data.status && !STATUSES.includes(data.status)) {
      errors.push(`${file.path}: status "${data.status}" is not one of ${STATUSES.join(", ")}`);
    }
    if (data.ip !== undefined && !IP.includes(data.ip)) {
      errors.push(`${file.path}: ip "${data.ip}" is not one of ${IP.join(", ")}`);
    }
    if (at.area === "art" && data.ip === undefined) errors.push(`${file.path}: an art entry must declare ip`);
    if (at.archived) {
      if (data.tier !== "archive") errors.push(`${file.path}: an archived entry must have tier archive`);
      if (data.status !== "retired") errors.push(`${file.path}: an archived entry must have status retired`);
    } else {
      if (data.status === "retired") errors.push(`${file.path}: a retired entry belongs under catalog/archive/`);
      if (data.tier === "archive") errors.push(`${file.path}: tier archive belongs under catalog/archive/`);
    }
    if (at.area === "study" && !at.archived && data.tier !== "study") {
      errors.push(`${file.path}: an entry in catalog/studies/ must have tier study`);
    }
    const by = asList(data.superseded_by);
    if (by.length > 0 && !["deprecated", "retired"].includes(data.status)) {
      errors.push(`${file.path}: superseded_by is set, so status must be deprecated or retired`);
    }

    const entry = {
      id: data.id,
      title: data.title,
      tier: data.tier,
      status: data.status,
      since: data.since,
      path: file.path,
      owners: asList(data.owners),
      consumers: asList(data.consumers),
      supersedes: asList(data.supersedes),
      superseded_by: by,
      decisions: asList(data.decisions),
      sources: asList(data.sources),
    };
    if (data.ip !== undefined) entry.ip = data.ip;
    if (data.outcome !== undefined) entry.outcome = data.outcome;
    entries.push(entry);
  }

  // Ids are unique, and every pxo: reference resolves.
  const known = new Map();
  for (const e of [...entries, ...decisions]) {
    if (known.has(e.id)) errors.push(`${e.path}: id ${e.id} is already used by ${known.get(e.id)}`);
    else known.set(e.id, e.path);
  }
  const resolves = (ref) => {
    if (known.has(ref)) return true;
    const token = ref.match(/^pxo:token\/([A-Za-z]+)\.([A-Za-z0-9]+)$/);
    return Boolean(token && opts.tokens?.[token[1]]?.[token[2]] !== undefined);
  };
  const checkRefs = (owner, field, refs, { pxoOnly }) => {
    for (const ref of refs) {
      if (typeof ref !== "string") continue;
      if (!ref.startsWith("pxo:")) {
        if (pxoOnly) errors.push(`${owner.path}: ${field} "${ref}" must be a pxo: id`);
        continue;
      }
      if (!resolves(ref)) errors.push(`${owner.path}: ${field} "${ref}" does not resolve`);
      if (ref === owner.id) errors.push(`${owner.path}: ${field} names the entry itself`);
    }
  };
  for (const e of [...entries, ...decisions]) {
    checkRefs(e, "supersedes", e.supersedes, { pxoOnly: true });
    checkRefs(e, "superseded_by", e.superseded_by, { pxoOnly: true });
    if (e.decisions) checkRefs(e, "decisions", e.decisions, { pxoOnly: false });
    if (e.affects) checkRefs(e, "affects", e.affects, { pxoOnly: false });
  }

  entries.sort((a, b) => a.id.localeCompare(b.id));
  decisions.sort((a, b) => a.id.localeCompare(b.id));
  const index = {
    $comment:
      "Generated from catalogue and decision frontmatter by tools/catalog/build-index.mjs. Do not edit by hand; run `pnpm catalog:index`.",
    entries,
    decisions,
  };
  return { index, errors };
}

/** Serialise exactly as the committed file is written. */
export const serialise = (index) => `${JSON.stringify(index, null, 2)}\n`;

/* ------------------------------------------------------------------------ */
/* Filesystem                                                                */
/* ------------------------------------------------------------------------ */

function walk(dir, root, out) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, root, out);
    else if (name.endsWith(".md")) {
      out.push({ path: relative(root, full).split(sep).join("/"), text: readFileSync(full, "utf8") });
    }
  }
  return out;
}

/** Read every catalogue and decision Markdown file under the repo root. */
export function readRepo(root) {
  const files = [...walk(join(root, "catalog"), root, []), ...walk(join(root, "decisions"), root, [])];
  const tokensPath = join(root, "packages", "tokens", "src", "tokens.json");
  const tokens = existsSync(tokensPath) ? JSON.parse(readFileSync(tokensPath, "utf8")) : undefined;
  return { files, tokens };
}
