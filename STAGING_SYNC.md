# Canonical source and release procedure

Canonical repository: https://github.com/tatavishnurao/tatavishnurao.github.io
Canonical editable published tree after migration: site/
Public origin: https://tatavishnurao.github.io/
Existing private Site: appgprj_6ad04334ffe08191b316727641a9e521
Private URL: https://vishnu-motion-v2.tatavishnurao.chatgpt.site/

## First migration

The kit contains only the private Site's current static assets. Merge the public
repository's real résumé, content/images and legacy URLs into the canonical site/
first. Those preservation changes mean the final content release will differ
from the current private build until that build is synchronized too.

## After migration

1. Edit site/ in a feature branch. Do not edit a second root homepage or the
   dormant Next application and expect it to appear in the published static site.
2. Generate release.json, validate, and commit all changed static files together.
3. For a private preview, an authorized Sites agent reads the existing project,
   opens its supported source checkout, and copies the complete canonical site/
   contents into its configured static directory (currently dist/). Preserve the
   hosting manifest, project identity, audience and source workflow. Keep old
   generated-only files from surviving as stale staged content; review removals.
4. Package and deploy through supported Sites tools; do not invent a webhook or
   store a short-lived Sites credential in GitHub. This kit installs no automatic
   bridge and cannot make Sites track a GitHub branch by itself.
5. Review the private staging release, then merge the matching canonical commit
   to main. GitHub Actions validates and publishes site/.
6. Compare the release_id in both authenticated/private and public release.json
   responses. Check selected served files or compare both materialized directories
   with `python scripts/compare_portfolio.py <public-tree> <private-tree>`.
   This script verifies actual local bytes against both manifests before matching.
7. Record the GitHub commit, release_id, private Site saved version/deployment,
   and public Pages workflow run in the PR/release notes.

If a change is first explored through ChatGPT Sites, export its changed files back
to a GitHub feature branch, reconcile there, validate, and publish the same canonical
release to both destinations. A change is not synchronized until this round trip
is complete. A private preview may temporarily be ahead of production; record that
explicitly instead of claiming both are identical.

## Rollback

Revert the release's merge commit through a normal PR and let Pages redeploy the
previous canonical files. Republish the corresponding prior saved private Site
version through supported Sites tools. Keep both release IDs recorded. No forced
Git history rewrite is needed.

## Remaining manual/browser review

Automated checks cover project identity/order, assets, résumé existence, syntax,
core motion guards, effect count, timeout and file integrity. They do not verify
pixel layout, network/external-link availability, all dynamic JavaScript behavior,
GitHub Pages account settings, or a private hosting publication. These require the
coding agent's browser/account capabilities or explicit follow-up verification.
