# Warden review preview

This is the standalone entry for the same typed workspace and identity study
shown in Storybook under **Studies / Warden**. All work is synthetic; no API or
vault writes occur. The identity candidates are unapproved sources.

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

The draft belongs to this browser tab's session storage. If storage is blocked,
the prototype keeps it in memory and reports the limitation. Appearance
preferences are separate and do not submit a product preference or identity
approval.

Useful review paths: start a draft and close/reopen it; open a Review or Verify
issue and inspect consequences; compare board/list at phone widths; try error
and refusal scenarios; switch appearances; compare marks at actual icon sizes.
