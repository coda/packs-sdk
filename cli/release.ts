import type {ArgumentsCamelCase} from 'yargs';
import type {BasicPackDefinition} from '..';
import type {GitState} from './git_helpers';
import type {PackVersionDefinition} from '..';
import {addReleaseToLockFile} from './lock_file';
import {assertApiToken} from './helpers';
import {assertPackId} from './helpers';
import {build} from './build';
import {createCodaClient} from './helpers';
import {createGitTag} from './git_helpers';
import {formatEndpoint} from './helpers';
import {formatError} from './errors';
import {formatResponseError} from './errors';
import {getGitState} from './git_helpers';
import {gitTagExists} from './git_helpers';
import {importManifest} from './helpers';
import {isResponseError} from '../helpers/external-api/coda';
import {lockFileExists} from './lock_file';
import path from 'path';
import {print} from '../testing/helpers';
import {printAndExit} from '../testing/helpers';
import {promptForInput} from '../testing/helpers';
import {tryParseSystemError} from './errors';

interface ReleaseArgs {
  manifestFile: string;
  packVersion?: string;
  codaApiEndpoint: string;
  notes: string;
  apiToken?: string;
}

export async function handleRelease({
  manifestFile,
  packVersion: explicitPackVersion,
  codaApiEndpoint,
  notes,
  apiToken,
}: ArgumentsCamelCase<ReleaseArgs>) {
  const manifestDir = path.dirname(manifestFile);
  const formattedEndpoint = formatEndpoint(codaApiEndpoint);
  apiToken = assertApiToken(codaApiEndpoint, apiToken);
  const packId = assertPackId(manifestDir, codaApiEndpoint);

  const codaClient = createCodaClient(apiToken, formattedEndpoint);

  // Check if release tracking is enabled (lock file exists)
  const shouldTrackRelease = lockFileExists(manifestDir);

  // Git state validation (only if tracking releases)
  let gitState: GitState | undefined;
  if (shouldTrackRelease) {
    gitState = getGitState(manifestDir);

    if (gitState.isGitRepo) {
      // Block release if there are uncommitted changes
      if (gitState.isDirty) {
        return printAndExit(
          'Cannot release with uncommitted changes.\n' +
            'Please commit your changes first, then run the release command again.',
        );
      }

      // Warn if not on main/master branch
      if (gitState.currentBranch && !['main', 'master'].includes(gitState.currentBranch)) {
        const shouldContinue = promptForInput(
          `Warning: You are releasing from branch '${gitState.currentBranch}', not 'main'.\n` +
            `Continue anyway? (y/N) `,
          {yesOrNo: true},
        );
        if (shouldContinue !== 'yes') {
          return process.exit(1);
        }
      }
    }
  }

  // Resolve pack version
  let packVersion = explicitPackVersion;
  if (!packVersion) {
    try {
      const bundleFilename = await build(manifestFile);
      const manifest = await importManifest<BasicPackDefinition | PackVersionDefinition>(bundleFilename);
      if ('version' in manifest) {
        packVersion = manifest.version;
      }
    } catch (err: any) {
      return printAndExit(`Got an error while building your pack to get the current pack version: ${formatError(err)}`);
    }
  }

  if (!packVersion) {
    const {items: versions} = await codaClient.listPackVersions(packId, {limit: 1});
    if (!versions.length) {
      printAndExit('No version was found to release for your Pack.');
    }

    const [latestPackVersionData] = versions;
    const {packVersion: latestPackVersion} = latestPackVersionData;
    const shouldReleaseLatestPackVersion = promptForInput(
      `No version specified in your manifest. Do you want to release the latest version of the Pack (${latestPackVersion})? (y/N)\n`,
      {yesOrNo: true},
    );
    if (shouldReleaseLatestPackVersion !== 'yes') {
      return process.exit(1);
    }
    packVersion = latestPackVersion;
  }

  // Create release via API
  const releaseResponse = await handleResponse(
    codaClient.createPackRelease(packId, {}, {packVersion, releaseNotes: notes}),
  );

  print(`Pack version ${packVersion} released successfully (release #${releaseResponse.releaseId}).`);

  // Track release in lock file and create git tag
  if (shouldTrackRelease) {
    const gitTag = `pack/${packId}/v${packVersion}`;

    // Add to lock file using API response as source of truth
    addReleaseToLockFile(manifestDir, {
      version: releaseResponse.packVersion,
      releaseId: releaseResponse.releaseId,
      releasedAt: releaseResponse.createdAt,
      notes: releaseResponse.releaseNotes,
      commitSha: gitState?.commitSha || null,
      gitTag: gitState?.isGitRepo ? gitTag : undefined,
    });
    print(`Updated .coda-pack.lock.json`);

    // Create git tag
    if (gitState?.isGitRepo) {
      if (gitTagExists(gitTag, manifestDir)) {
        print(`Git tag ${gitTag} already exists, skipping.`);
      } else if (createGitTag(gitTag, manifestDir)) {
        print(`Created git tag: ${gitTag}`);
        print(`Run 'git push --tags' to push the tag to remote.`);
      } else {
        print(`Warning: Failed to create git tag ${gitTag}`);
      }
    }
  }

  return printAndExit('Done!', 0);
}

async function handleResponse<T extends any>(p: Promise<T>): Promise<T> {
  try {
    return await p;
  } catch (err: any) {
    if (isResponseError(err)) {
      return printAndExit(`Error while creating pack release: ${await formatResponseError(err)}`);
    }
    const errors = [`Unexpected error while creating release: ${formatError(err)}`, tryParseSystemError(err)];
    return printAndExit(errors.join('\n'));
  }
}
