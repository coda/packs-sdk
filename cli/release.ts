import type {ArgumentsCamelCase} from 'yargs';
import type {BasicPackDefinition} from '..';
import type {PackVersionDefinition} from '..';
import {build} from './build';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import {formatError} from './errors';
import {formatResponseError} from './errors';
import {getApiKey} from './config_storage';
import {getPackId} from './config_storage';
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
}

export async function handleRelease({
  manifestFile,
  packVersion: explicitPackVersion,
  codaApiEndpoint,
  notes,
}: ArgumentsCamelCase<ReleaseArgs>) {
  const manifestDir = path.dirname(manifestFile);
  const apiKey = getApiKey(codaApiEndpoint);
  const formattedEndpoint = formatEndpoint(codaApiEndpoint);

  if (!apiKey) {
    return printAndExit('Missing API token. Please run `coda register` to register one.');
  }

  const packId = getPackId(manifestDir, codaApiEndpoint);
  if (!packId) {
    return printAndExit(
      `Could not find a Pack id in directory ${manifestDir}. You may need to run "coda create" first if this is a brand new pack.`,
    );
  }

  const codaClient = createCodaClient(apiKey, formattedEndpoint);

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
