# Current-Site parity migration

## Source, scope and safety

- Target: `tatavishnurao/tatavishnurao.github.io`.
- Base/rollback commit: `16c7e873915ef762d17858bdf1ea84363dc6e5f9`
  (fetched `origin/main` before branching).
- Branch: `portfolio/current-site-parity`.
- Supplied private snapshot: version 23, source commit
  `59dfec4bba1e3a4657586bb9bd336b4832ae579d`, prepared 2026-10-18.
- The kit's `prepare_migration.py` dry run was reviewed before `--apply`.
- Migration used a separate clean worktree because the original checkout had a
  modified `index.html` and untracked `dist/` and `tmp/`. Those changes were not
  stashed, reset, deleted or included. No applicable AGENTS.md was found.
- Supplied `index.html`, `assets/timely.js`, `assets/timely.css` and all 14 blog
  images are unchanged. No framework rewrite, private-site scraping, iframe,
  homepage redirect, new Site, audience change or Next build was performed.
- Five projects remain in supplied order: ctxd, DubPatch, signalflow-rs,
  GlyphPortrait, LatentPagedAttention-rs. Old project pages are not published.

## Resource and legacy-URL audit

Current tracked legacy directories each contained an `index.html`, not individual
project pages. Their old links and descriptions were reviewed before selecting
redirects. Static redirects have canonical links, immediate meta refresh and a
keyboard-accessible fallback link; `.html` aliases are also included.

- `/projects/` and `/projects/index.html` → `/#projects`.
- `/research/` and `/research/index.html` → `/#research`; the retained attention
  study remains accessible in the supplied research/project views.
- `/writing/` and `/writing/index.html` → `/#blogs`; do not republish the old
  agent-memory retrieval entry or its benchmark descriptions.
- `/resume/` and `/resume/index.html` → `/assets/resume.pdf`.
- Defensive removed-project entrypoints `/projects/RealKV-Serve/`,
  `/projects/realkv-serve/`, `/projects/realkv/`, `/projects/SochDB/` and
  `/projects/sochdb/` → `/#projects`. These redirects contain no retired project
  descriptions. Their `.html` aliases also redirect. These specific pages did
  not exist in the current tracked tree; aliases prevent likely old bookmarks
  from exposing archived content.
- `/assets/resume.pdf` remains byte-identical to the real repository PDF:
  SHA-256 `a6ed7cbe3be1111922a7f30c8752c081eaa10fa3ab9ae5bee3a64840f5336f50`.
- Existing `assets/`, `content/` and `images/` are preserved; supplied blog images
  own overlapping blog paths. Missing-path resources from `public/` are copied
  without overwriting canonical resources, retaining `/files/cv.pdf` and the old
  `/images/projects/` image URLs.
- `/content/notes/real-time-log-mel-rust.md` was absent on current main but linked
  from the supplied retained SignalFlow project. Its authentic bytes were
  recovered from commit `d157a8c` (not generated or rewritten): SHA-256
  `2cb0afbaebd76497f05bcb2e193175d8de44753281198438db031c02188f981a`.
  Other missing historical notes are not invented; the writing redirect no
  longer links them. Unknown legacy URLs beyond these audited paths are not
  claimed to be supported.

## Deployment selection and retirement

The sole workflow is `.github/workflows/deploy.yml`, replaced with the supplied
PR validator and main-only publisher. Its artifact path is `site`, not `.` or
`out`. GitHub's Pages API returned `build_type: workflow` and the expected public
URL; no settings mutation was necessary. Root `index.html` and obsolete
`REBUILD_PLAN.md` are retired in a separate reviewable commit after selecting
this artifact. Unrelated Next sources and root legacy resources remain intact,
but are outside the deployment boundary. No deployment is triggered by the
feature branch; merge only after review.

## Validation performed

- Release generator and supplied static validator: PASS.
- Five migration unit tests: PASS (PDF/resource bytes, recovered-note checksum,
  redirect map and single canonical Pages artifact).
- `git diff --check`: PASS.
- Actual headless Chromium/Playwright browser checks: PASS across widths 320,
  390, 768, 1024 and 1280, each portrait and landscape with both desktop and
  coarse pointers (20 configurations, ten routes each). Checked overflow,
  retained-project diagram dialogs, blog index/article, Socials contact links
  and active state, keyboard link activation, terminal navigation, legacy
  redirects, PDF and recovered-note HTTP responses. No collected console errors
  or local HTTP errors.
- Actual browser timers: explicit dialogue visible at 1550 ms, closed by 1950 ms,
  remains closed until activation. The supplied source's 1750 ms deadline is
  also checked by the validator; this is not a claim of millisecond-precise
  visual timing under every device load.
- Browser exercise of 100 randomized entrances: all six styles observed with no
  consecutive repeats. Additional frame-delayed exercise rendered each style.
  Global pause and emulated reduced motion suppress entrances as expected.
- Additional real pointer drag moved the actor 40 px without opening dialogue.
  Desktop 1280 px and mobile 320 px screenshots were inspected; header wrapping,
  portrait and the reserved mobile companion slot remained visible and clear.

### Remaining verification limits

Physical-device visual/performance review and touch swipe gestures remain
pending. Headless Chromium did not mark an old tab hidden when another tab was
activated, so **actual hidden-tab lifecycle verification is pending**, not
passed. Source guards are present and static-validated; that is not a substitute
for this browser check. Exhaustive external-link availability is not claimed.

## Host state and release identity

The feature branch is prepared for a draft PR, not automatically merged.
Public Pages remains on its pre-migration deployment until merge and a successful
main workflow run. Its existing `built` API state is not evidence this migration
is live. The canonical content identity is in `site/release.json`; obtain it via:

```sh
python3 -c 'import json; print(json.load(open("site/release.json"))["release_id"])'
```

Private staging synchronization is **pending**: this agent has no supported Sites
source/save/deploy tools. Project ID, URL and owner-only audience were not changed.
Follow `STAGING_SYNC.md` with an authorized Sites agent. Include all preserved
resources and release.json, but exclude GitHub workflows, scripts and credentials.
No cross-host parity is claimed. Before declaring parity, verify both hosts serve
the canonical release and compare the actual required files, not just manifest IDs.

## Rollout and rollback

1. Review the draft PR and green validation; finish pending device/lifecycle checks.
2. Publish the canonical tree to existing private staging using supported tools.
3. Merge the reviewed matching commit; monitor the Pages workflow.
4. Verify served files and release identity on both hosts and record deployment
   identifiers in the PR. Do not merge automatically.
5. If needed, open a normal revert PR. For this initial migration, revert its two
   commits in reverse order to restore the previous root homepage and workflow.
   For later releases, revert the release merge. Republish the corresponding
   private saved version separately. Never reset or force-push shared history.
