import type {Arguments} from 'yargs';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import {formatError} from './errors';
import {getApiKey} from './helpers';
import {isCodaError} from './errors';
import {printAndExit} from '../testing/helpers';

interface SetLiveArgs {
  packId: number;
  packVersion: string;
  codaApiEndpoint: string;
}

export async function handleSetLive({packId, packVersion, codaApiEndpoint}: Arguments<SetLiveArgs>) {
  const apiKey = getApiKey();
  const formattedEndpoint = formatEndpoint(codaApiEndpoint);

  if (!apiKey) {
    printAndExit('Missing API key. Please run `coda register <apiKey>` to register one.');
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
