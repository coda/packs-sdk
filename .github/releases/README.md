# Public SDK release jobs

Complete the reviewed documentation import and SDK snapshot export first.
Confirm that Coda's live deployment supports the intended SDK changes.

Run **Prepare SDK release** on `main` with an exact stable version and the
sync confirmation. Dry run is the default; inspect its diff before a live run.
A live run creates one `release/v<version>` PR. Approve its GitHub workflow
runs if requested, review the release diff and changelog, then merge after CI.
If main moves first, close/delete the stale preparation and recreate it from
current main with the same unpublished version; do not rebase that release PR.
Preparation never creates an npm version, tag, or GitHub release.

Until the Publish SDK release layer is delivered, use preparation dry runs
only. The existing manual runbook remains usable from its normal unprepared
source branch. Do not run its version-bumping command on a prepared release PR.
Once the publisher is delivered, an authorized first candidate may be prepared
and merged with publication disabled to validate the new publish dry-run path.

Source synchronization and the production deployment are human-reviewed
prerequisites. This public job cannot prove completion of internal imports.
An open snapshot blocks preparation; the checkbox does not replace review.

A conflicting or stale release branch stops preparation. Do not force-push or
reuse it; inspect and close/delete it deliberately before a new preparation.
The PR summary records partial branch/PR creation so a retry can resume safely.

The public job files live under `.github/`. Author release-tool dependency
changes internally and bring them here through a reviewed Copybara export.
Dependencies use pnpm; preparation rejects an unexpected npm lockfile.
