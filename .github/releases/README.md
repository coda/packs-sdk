# SDK releases

## Prepare

1. Complete the documentation import, SDK export and internal deployment in the
   [release runbook](https://docs.superhuman.com/d/Go-on-call-go-go-oncall_dkJe3Z8RRKc/Releasing-Packs-SDK-to-the-Public_suM7Qe50#_luFTQOHz).
2. Run **Prepare SDK release** on `main` with a stable version and confirm all
   intended release changes are exported and merged. Approve `sdk-release` for
   each run. Review the default dry run, then uncheck `dry-run` to create the PR.
3. Review the changelog and diff, then merge after CI passes.

If release-it selects no new version, no release PR is prepared. If preparation
stops after pushing its branch, open the PR for that branch or delete the branch
before preparing again.

## Publish

Merging a `release/v...` PR starts **Publish SDK release**. After validation, confirm
internal deployment is current and approve `sdk-release`. release-it stages the
package, tags the merge commit and creates a draft GitHub release. The run summary
includes native release-it output with the draft URL and npm stage approval
command, including output produced before a failure. The package is not public
yet.

Inspect the stage and check npm `latest`, then approve with your YubiKey on
npmjs.com or with `npm stage approve <stage-id>`. After npm approval, publish the
GitHub draft using the summary link. If a newer GitHub release exists, leave
**Set as latest release** unchecked. Complete the documentation deployments and
internal dependency update in the runbook.

For a manual dry run, run from `main` at the release PR's merge commit. Enter the
merged PR number in `release-pr` (e.g. `1234`) and leave `dry-run` checked.

The workflows retain clean-checkout checks, normal SDK validation and
`sdk-release` approval. Release-it and npm handle version, changelog and
publication checks; recovery requires the operator steps below.

## Retry or pause

Inspect npm before retrying a failed submission. If it was accepted, select
`skip-npm` to finish missing Git/GitHub steps without resubmitting. Select it for
an already published version too. If the stage and GitHub draft already exist,
approve npm and publish the draft; another CI run is unnecessary. Existing-state
conflicts surface as native tool errors and require maintainer recovery.

Run manually with the same PR number and uncheck `dry-run`. Select `v<version>` if
the tag exists; otherwise use `main` while it still points to the release's merge
commit. If `main` advanced before tagging, pause for maintainer recovery. Keep the
version and commit unchanged; never move an existing tag.

To pause releases, set `PACKS_SDK_PUBLISH_ENABLED=false` and cancel pending/running
release workflows. Cancel those workflows before changing approval policy too.
