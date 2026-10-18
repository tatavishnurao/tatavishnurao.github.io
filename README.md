# Tata Vishnu Rao — canonical static portfolio

Edit **`site/`**, the only directory published by GitHub Pages. Its HTML, CSS,
Canvas animations and hash routes require no framework build or npm install.
The retained Next.js source (`app/`, `components/`, `lib/`, root `content/`,
`public/`, package files) is not currently built or published. Root legacy pages
and assets are archival inputs, not a second editable deployment.

## Validate and preview

Python 3.9+ and Node.js are required.

```sh
python3 scripts/portfolio_release.py --site site
python3 scripts/validate_portfolio.py --site site
python3 -m unittest discover -s scripts -p 'test_portfolio_migration.py'
git diff --check
python3 -m http.server 8000 --directory site
```

Open http://localhost:8000/. Never serve the repository root as the deployment.
Commit updated `site/release.json` alongside each static change. Its deterministic
`release_id` hashes the complete published file inventory, excluding the manifest
itself. CI checks the inventory; it does not silently regenerate it.

Optional browser regression (requires an independently installed Playwright and
Chromium, not a Next build):

```sh
node scripts/test_portfolio_browser.cjs
```

Set `PLAYWRIGHT_MODULE`, `CHROMIUM_PATH`, or `PORTFOLIO_URL` for a separately
installed browser/tooling or a different preview origin. See
[MIGRATION.md](MIGRATION.md) for actual verification scope and outstanding checks.

## Publication

Open a draft PR against `main`; review before merging. The single Pages workflow
`.github/workflows/deploy.yml` validates PRs. After merge to `main`, it validates
again and uploads **only `site/`**. GitHub Pages must use **GitHub Actions** as its
source (confirmed through the API during this migration). No Next.js build runs.
A feature-branch commit or draft PR does not publish the live homepage.

## Resources and inbound URLs

The original résumé remains at `/assets/resume.pdf`, byte for byte. Legacy static
entrypoints redirect to matching hash routes; `/resume/` opens the PDF. Retained
images and content resources remain available. The recovered Rust log-Mel note
is genuine repository content, not generated replacement prose. See
[MIGRATION.md](MIGRATION.md) for the route audit and provenance. If changing the
reviewed redirect map, edit `scripts/prepare_legacy_redirects.py`, run it, then
regenerate the release manifest. Do not copy old project pages wholesale.

## Private staging and rollback

[STAGING_SYNC.md](STAGING_SYNC.md) specifies the supported synchronization process.
The existing private Site is staging, remains owner-only, and keeps project ID
`appgprj_6ad04334ffe08191b316727641a9e521`. No automatic GitHub-to-Sites bridge is
installed. An authorized Sites agent must synchronize all canonical static files
and publish through the native save/deploy workflow. Matching release IDs alone
do not prove all hosted assets match; compare actual served/materialized files.

Rollback uses a normal revert PR, never a force-push. The pre-migration base is
`16c7e873915ef762d17858bdf1ea84363dc6e5f9`. Revert the migration commits in reverse
order through a PR to restore the old root-publishing workflow and root homepage.
For later releases, revert the relevant release merge and let Pages redeploy;
republish the corresponding private saved version separately. Record the commit,
release ID and both deployment states for every release.
