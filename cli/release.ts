import type {ArgumentsCamelCase} from 'yargs';
import type {BasicPackDefinition} from '..';
import type {PackVersionDefinition} from '..';
import {assertApiToken} from './helpers';
import {assertPackId} from './helpers';
import {build} from './build';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import {formatError} from './errors';
import {formatResponseError} from './errors';
import {importManifest} from './helpers';
import {isResponseError} from '../helpers/external-api/coda';
import * as path from 'path';
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

  await handleResponse(codaClient.createPackRelease(packId, {}, {packVersion, releaseNotes: notes}));
  return printAndExit('Success!', 0);
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
