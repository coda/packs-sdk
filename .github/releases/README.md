# SDK releases

## Prepare

1. Complete the documentation import, SDK export and internal deployment in the
   [release runbook](https://docs.superhuman.com/d/Go-on-call-go-go-oncall_dkJe3Z8RRKc/Releasing-Packs-SDK-to-the-Public_suM7Qe50#_luFTQOHz).
2. Run **Prepare SDK release** on `main` with a stable version and confirm all
   intended release changes are exported and merged. Approve `sdk-release` for
   each run. Review the default dry run, then uncheck `dry-run` to create the PR.
3. Review the changelog and diff, then merge after CI passes.

If `main` advances before merging, close the PR, delete its branch and prepare
again with the same unpublished version. Resume interrupted preparation by
running it again with the same version.

## Publish

Merging the release PR starts **Publish SDK release**. After validation, confirm
internal deployment is current and approve `sdk-release`. The job tags the merge
commit, publishes to npm and creates the GitHub release.

For a manual dry run, run from `main` at the release PR's merge commit. Enter the
merged PR number in `release-pr` (e.g. `1234`) and leave `dry-run` checked.

After publication, complete the documentation deployments and internal dependency
update in the runbook.

## Retry or pause

Before a release tag exists, rerun the original Actions run. Afterward, select
`v<version>` as the workflow ref, enter the same PR number and uncheck `dry-run`.
Keep the version, commit and tag unchanged. Matching npm publications are skipped;
conflicting state stops the job.

To pause releases, set `PACKS_SDK_PUBLISH_ENABLED=false` and cancel pending/running
release workflows. Cancel those workflows before changing approval policy too.
