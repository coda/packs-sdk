# SDK releases

## Prepare

1. Complete the documentation import, SDK export and internal deployment. Confirm
   all changes intended for release have been exported and merged to `main`.
2. Run **Prepare SDK release** on `main` with the new stable version. Confirm the
   exported changes and approve `sdk-release`. Leave `dry-run` checked to review
   the proposed version, changelog and generated files without creating a PR.
3. After the dry run succeeds, run it again with `dry-run` unchecked. The job
   pushes a `release/v<version>` branch and opens a release PR. Review the changelog
   and diff, then merge after CI passes.

## Publish

Merging the PR created by **Prepare SDK release** starts **Publish SDK release**.
After validation, confirm internal deployment is current and approve `sdk-release`.
The job stages the npm package, tags the merge commit and creates a draft GitHub
release. The run summary includes the npm approval command and draft URL. The
package is not public yet.

Inspect the stage and check npm `latest`, then approve with your YubiKey on
npmjs.com or with `npm stage approve <stage-id>`. After npm approval, publish the
GitHub draft using the summary link. If a newer GitHub release exists, leave
**Set as latest release** unchecked. Complete the documentation deployments and
internal dependency update.

To validate without submitting a package, run **Publish SDK release** manually
while `main` still points to that PR's merge commit. Enter the merged PR number
in `release-pr` (e.g. `1234`) and leave `dry-run` checked.

## Troubleshooting and retries

If preparation reports **No new version selected**, release-it did not change the
version or create a PR. This can happen if the requested version is invalid or
older than `package.json`. Correct the version and run preparation again.
If preparation pushed its branch but failed to open the PR, open a PR from that
branch to `main`, or delete the branch before preparing again.

If publication fails, inspect the run log, npm stages and GitHub releases before
retrying. The summary retains any approval command or draft URL produced before
the failure. If the stage and draft already exist, approve npm and publish the
draft; no further CI run is needed.

To retry publication, run **Publish SDK release** manually
with the same `release-pr` number and `dry-run` unchecked. If npm accepted the
submission, or the version was already published, select `skip-npm` to finish the
missing Git/GitHub steps without resubmitting. Otherwise leave `skip-npm` unchecked.

The workflow's branch/tag selector must point to the original release commit so
the retry uses the same code:

- Select `v<version>` if the release tag exists.
- Otherwise select `main` only if its latest commit is still that release PR's
  merge commit.

If `main` has advanced and no release tag exists, stop and ask a maintainer to
resume from the original merge commit. If a retry reports an existing draft or
a rejected tag push, inspect that draft and tag before trying again. Never move
an existing release tag to another commit.

## Stop automated publication

To prevent new runs from submitting npm packages or creating tags and GitHub
releases, set the repository variable `PACKS_SDK_PUBLISH_ENABLED` to `false`.
Cancel pending or running release workflows too; changing the variable does not
stop a job already running. This does not remove an existing npm stage, tag or
GitHub draft.

Cancel pending or running release workflows before changing approval policy.
