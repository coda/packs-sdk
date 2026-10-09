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
internal deployment is current and approve `sdk-release`. release-it stages the
package, tags the merge commit and creates a draft GitHub release. The run summary
links the draft and reports the npm stage ID; the package is not public yet.

Inspect the stage and check npm `latest`, then approve with your YubiKey on
npmjs.com or with `npm stage approve <stage-id>`. After npm approval, publish the
GitHub draft using the summary link. If a newer GitHub release exists, leave
**Set as latest release** unchecked. Complete the documentation deployments and
internal dependency update in the runbook.

For a manual dry run, run from `main` at the release PR's merge commit. Enter the
merged PR number in `release-pr` (e.g. `1234`) and leave `dry-run` checked.

## Retry or pause

Inspect npm before retrying a failed submission. If it was accepted, select
`skip-npm` to finish Git/GitHub without resubmitting. Matching public package bytes
skip submission automatically; conflicting package, tag or release state stops
the job.

Run manually with the same PR number and uncheck `dry-run`. Select `v<version>` if
the tag exists; otherwise use `main` while it still points to the release's merge
commit. If `main` advanced before tagging, pause for maintainer recovery. Keep the
version and commit unchanged; never move an existing tag.

To pause releases, set `PACKS_SDK_PUBLISH_ENABLED=false` and cancel pending/running
release workflows. Cancel those workflows before changing approval policy too.
