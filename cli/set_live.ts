import type {Arguments} from 'yargs';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import {formatError} from './errors';
import {getApiKey} from './config_storage';
import {getPackId} from './config_storage';
import {isCodaError} from './errors';
import * as path from 'path';
import {printAndExit} from '../testing/helpers';

interface SetLiveArgs {
  manifestFile: string;
  packVersion: string;
  codaApiEndpoint: string;
}

export async function handleSetLive({manifestFile, packVersion, codaApiEndpoint}: Arguments<SetLiveArgs>) {
  const manifestDir = path.dirname(manifestFile);
  const apiKey = getApiKey(codaApiEndpoint);
  const formattedEndpoint = formatEndpoint(codaApiEndpoint);

  if (!apiKey) {
    printAndExit('Missing API key. Please run `coda register <apiKey>` to register one.');
  }

  const packId = getPackId(manifestDir, codaApiEndpoint);
  if (!packId) {
    return printAndExit(
      `Could not find a Pack id in directory ${manifestDir}. You may need to run "coda create" first if this is a brand new pack.`,
    );
  }

  const codaClient = createCodaClient(apiKey, formattedEndpoint);
  try {
    const response = await codaClient.setPackLiveVersion(packId, {}, {packVersion});
    if (isCodaError(response)) {
      printAndExit(`Error when setting pack live version: ${formatError(response)}`);
    } else {
      printAndExit('Success!', 0);
    }
  } catch (err) {
    printAndExit(`Unexpected error while setting pack version: ${formatError(err)}`);
  }
}
