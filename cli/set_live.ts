import type {Arguments} from 'yargs';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import {getApiKey} from './helpers';
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
    await codaClient.setPackLiveVersion(packId, {}, {packVersion});
  } catch (err) {
    const {statusCode, message} = JSON.parse(err.error);
    printAndExit(`Could not set the pack version: ${statusCode} ${message}`);
  }

  printAndExit('Success!');
}
