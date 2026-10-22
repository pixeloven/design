# Warden review preview

This is the standalone entry for the same typed workspace and identity study
shown in Storybook under **Studies / Warden**. All work is synthetic; no API or
vault writes occur. The identity candidates are unapproved sources.

**Review status:** the revised build follows the
[Epic/Issue brief](../../../docs/warden-design-brief.md). The operator accepted
Epic as the project outcome, with Story, Task, Bug and Spike child issues.
Ordinary issue capture and refinement develop requirements through work,
without an idea-intake wizard. Epics, All issues and Needs
attention provide working destinations. The lead owns delivery through the real
UI/MCP MVP before handoff; this local study is a design milestone. Warden's mark
remains a separate review decision.

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm --filter @pixeloven/tokens --filter @pixeloven/brand --filter @pixeloven/ui build
pnpm --filter @pixeloven/docs typecheck
pnpm --filter @pixeloven/docs build:review
node apps/docs/review/server.mjs
```

Open `http://localhost:4179/warden/`. The server binds to loopback by default;
set `PIXELOVEN_REVIEW_HOST` to a trusted interface when
sharing a preview. Network/firewall reachability must be verified separately.
Do not start a duplicate listener on an occupied port.

The generated `dist/warden-review.html` contains its scripts, styles, artwork
and licensed fonts, and can also open directly as a local file. Generated
artifacts and screenshots stay outside Git. The editable `index.html` is a
Vite entry, not the portable file to distribute.

The versioned workspace, drafts and decision reasons belong to this browser
tab's session storage. Reloads retain them; Reset demo clears the sample work.
If storage is blocked, the prototype keeps it in memory and reports the
limitation. Appearance preferences are separate and do not submit a product
preference or identity approval. URL fragments describe navigation; they do not
carry locally created records to another browser.

Choose **New issue**, select **Spike** and capture a question such as
**Explore focused note reading**. A title is enough to save. Add context,
investigation Plan and completion conditions when useful, then record findings
in Result and comments. Refine existing work or create a linked follow-up;
retain the original investigation. Create an Epic directly when a shared outcome
is useful and refine its finish line later. Creation starts records in Todo;
it does not approve a plan or start execution. Close/reload before saving to
check draft recovery. Standalone work requires no Epic or investigation step.

Open **Improve note reading**: create a child issue, refine its intent, Plan,
Result and criteria, change its planning order, and transfer it to **Release
preparation**. Use the Epic's Decisions/Blocked filters and Next in your plan row. Drag by
the handle and inspect the source, destination and insertion marker before
releasing; click the handle or use the keyboard for explicit placement. Cancel
and verify nothing moved. Inspect a plan from Needs attention and compare
Approve, Request changes and direct Move. In Activity, compare
Comments (including decision reasons) with Decisions. Add a comment from either
filter and check that it appears in Comments. Close
and reopen with an unfinished comment or decision reason to check draft recovery.
Complete and retrieve an issue; try accepting an Epic with unfinished children.
After finishing or transferring the children, explicitly accept the outcome
against its finish line. Child completion alone never accepts the Epic.
Use **Library maintenance** for the 50-issue case and **Reading foundation** for
a completed Epic. Compare Board/List, expanded reading, phone return and
enlarged text. Demo scenarios exercise incomplete reads and refusal without
changing any real records. The on-page review guide identifies the production
contract gaps. Identity comparisons remain a separate review.
