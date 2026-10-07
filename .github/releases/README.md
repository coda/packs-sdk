# SDK releases

## Setup

Create the `sdk-release` GitHub environment with:

- Only `@coda/go-ecosystem` as required reviewers.
- Self-review prevented and administrator bypass disabled.
- Deployment rules allowing branch `main` and tags `v*`.

Verify approval waits and settings readback with the workflow token before use.
The helper requires `can_admins_bypass: false`; GitHub exposes this field but
its REST schema does not document it. Missing protection fields stop the job.
Enable GitHub Actions PR creation. Preparation needs no npm credentials.
Cancel pending/running release workflows before changing approval policy.

## Prepare

1. Complete the documentation import and SDK snapshot export, and confirm the
   intended changes are deployed internally. Follow the [release runbook](https://docs.superhuman.com/d/Go-on-call-go-go-oncall_dkJe3Z8RRKc/Releasing-Packs-SDK-to-the-Public_suM7Qe50#_luFTQOHz).
2. Run **Prepare SDK release** on `main` with an exact stable version and sync
   confirmation. Approve `sdk-release`, including for dry runs. Review the
   default dry run before running with `dry-run: false` to create the release PR.
3. Review the changelog and diff, then merge after CI passes. If `main` advances,
   close the stale PR, delete its branch, and prepare the same unpublished
   version again instead of rebasing. Retry interrupted preparation with the
   same version to resume.

Author release-tool dependency changes internally and export through Copybara.

Until the publish workflow lands, use preparation dry runs only. Use the manual
runbook on an unprepared source branch; its version bump would double-bump a
prepared PR.
