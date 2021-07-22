import type {Arguments} from 'yargs';
import {build} from './build';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import {formatError} from './errors';
import {getApiKey} from './config_storage';
import {getPackId} from './config_storage';
import {importManifest} from './helpers';
import {isCodaError} from './errors';
import * as path from 'path';
import {printAndExit} from '../testing/helpers';
import {tryParseSystemError} from './errors';

interface ReleaseArgs {
  manifestFile: string;
  packVersion?: string;
  codaApiEndpoint: string;
  notes?: string;
}

export async function handleRelease({
  manifestFile,
  packVersion: explicitPackVersion,
  codaApiEndpoint,
  notes,
}: Arguments<ReleaseArgs>) {
  const manifestDir = path.dirname(manifestFile);
  const apiKey = getApiKey(codaApiEndpoint);
  const formattedEndpoint = formatEndpoint(codaApiEndpoint);

  if (!apiKey) {
    return printAndExit('Missing API key. Please run `coda register <apiKey>` to register one.');
  }

  const packId = getPackId(manifestDir, codaApiEndpoint);
  if (!packId) {
    return printAndExit(
      `Could not find a Pack id in directory ${manifestDir}. You may need to run "coda create" first if this is a brand new pack.`,
    );
  }

  let packVersion = explicitPackVersion;
  if (!packVersion) {
    try {
      const bundleFilename = await build(manifestFile);
      const manifest = await importManifest(bundleFilename);
      packVersion = manifest.version as string;
    } catch (err) {
      return printAndExit(`Got an error while building your pack to get the current pack version: ${formatError(err)}`);
    }
  }

  const codaClient = createCodaClient(apiKey, formattedEndpoint);

  await handleResponse(codaClient.createPackRelease(packId, {}, {packVersion, releaseNotes: notes}));
  return printAndExit('Success!', 0);
}

async function handleResponse<T extends any>(p: Promise<T>): Promise<T> {
  try {
    const response = await p;
    if (isCodaError(response)) {
      return printAndExit(`Error while creating pack release: ${formatError(response)}`);
    }
    return p;
  } catch (err) {
    const errors = [`Unexpected error while creating release: ${formatError(err)}`, tryParseSystemError(err)];
    return printAndExit(errors.join('\n'));
  }
}
