# SDK releases

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

## Publish

Merging the release PR starts **Publish SDK release**. Validation runs first;
live publishing requires a separate `sdk-release` approval. Recheck internal
sync and deployment before approving. npm OIDC publishes without an OTP or token,
then the job creates the version tag and GitHub release.

For verification, manually dispatch with the release PR number and
`dry-run: true`; validation needs no approval or publishing identity.
For an interrupted live release, rerun the original Actions run until its tag
exists. Afterward, dispatch from that `v<version>` tag with the same PR number
and `dry-run: false`. Matching npm bytes skip republishing; conflicts stop.
Preserve the version, PR, commit and release tag when retrying.

To pause releases or change approval policy, disable publication and cancel
pending/running release workflows. Changing the variable alone does not stop
runs already in progress.

After publication, review documentation deployments and open the internal
dependency-update PR described in the runbook.
