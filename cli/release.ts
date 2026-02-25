import type {ArgumentsCamelCase} from 'yargs';
import type {BasicPackDefinition} from '..';
import {PackOptionKey} from './config_storage';
import type {PackVersionDefinition} from '..';
import {assertApiToken} from './helpers';
import {assertPackId} from './helpers';
import {build} from './build';
import {createCodaClient} from './helpers';
import {createGitTag} from './git_helpers';
import {formatEndpoint} from './helpers';
import {formatError} from './errors';
import {formatResponseError} from './errors';
import {getGitState} from './git_helpers';
import {getPackOptions} from './config_storage';
import {gitTagExists} from './git_helpers';
import {importManifest} from './helpers';
import {isResponseError} from '../helpers/external-api/coda';
import path from 'path';
import {print} from '../testing/helpers';
import {printAndExit} from '../testing/helpers';
import {promptForInput} from '../testing/helpers';
import {resolveApiEndpoint} from './helpers';
import {tryParseSystemError} from './errors';

interface ReleaseArgs {
  manifestFile: string;
  packVersion?: string;
  apiEndpoint: string;
  notes: string;
  apiToken?: string;
  gitTag?: boolean;
}

export async function handleRelease({
  manifestFile,
  packVersion: explicitPackVersion,
  apiEndpoint,
  notes,
  apiToken,
  gitTag,
}: ArgumentsCamelCase<ReleaseArgs>) {
  const manifestDir = path.dirname(manifestFile);
  apiEndpoint = resolveApiEndpoint(apiEndpoint, manifestDir);
  const formattedEndpoint = formatEndpoint(apiEndpoint);
  apiToken = assertApiToken(apiEndpoint, apiToken);
  const packId = assertPackId(manifestDir, apiEndpoint);

  // Check if git tagging is enabled via CLI flag or pack options
  const packOptions = getPackOptions(manifestDir);
  const enableGitTags = gitTag || packOptions?.[PackOptionKey.enableGitTags] || false;

  const codaClient = createCodaClient(apiToken, formattedEndpoint);

  // Git state validation
  const gitState = getGitState(manifestDir);

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
        `Warning: You are releasing from branch '${gitState.currentBranch}', not 'main'.\n` + `Continue anyway? (y/N) `,
        {yesOrNo: true},
      );
      if (shouldContinue !== 'yes') {
        return process.exit(1);
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

  // Create git tag if enabled
  if (enableGitTags && gitState.isGitRepo) {
    const releaseGitTag = `pack/${packId}/v${packVersion}`;

    if (gitTagExists(releaseGitTag, manifestDir)) {
      print(`Git tag ${releaseGitTag} already exists, skipping.`);
    } else {
      const tagMessage = buildTagMessage(releaseResponse.releaseId, releaseResponse.releaseNotes);
      if (createGitTag(releaseGitTag, tagMessage, manifestDir)) {
        print(`Created git tag: ${releaseGitTag}`);
        print(`Run 'git push --tags' to push the tag to remote.`);
      } else {
        print(`Warning: Failed to create git tag ${releaseGitTag}`);
      }
    }
  }

  return printAndExit('Done!', 0);
}

function buildTagMessage(releaseId: number, notes: string): string {
  const parts = [`Release ID: ${releaseId}`];
  if (notes) {
    parts.push('', notes);
  }
  return parts.join('\n');
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
