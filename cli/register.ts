import type {Arguments} from 'yargs';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import open from 'open';
import {printAndExit} from '../testing/helpers';
import {promptForInput} from '../testing/helpers';
import {storeCodaApiKey} from '../testing/auth';

interface RegisterArgs {
  apiToken?: string;
  codaApiEndpoint: string;
}

export async function handleRegister({apiToken, codaApiEndpoint}: Arguments<RegisterArgs>) {
  const formattedEndpoint = formatEndpoint(codaApiEndpoint);
  if (!apiToken) {
    // TODO: deal with auto-open on devbox setups
    const shouldOpenBrowser = promptForInput('No API token provided. Do you want to visit Coda to create one? ');
    if (!shouldOpenBrowser.toLocaleLowerCase().startsWith('y')) {
      return process.exit(1);
    }
    // TODO: figure out how to deep-link to the API tokens section of account settings
    await open(`${formattedEndpoint}/account`);
    apiToken = promptForInput('Please paste the token here: ', {mask: true});
  }

  const client = createCodaClient(apiToken, formattedEndpoint);

  try {
    await client.whoami();
  } catch (err) {
    const {statusCode, message} = JSON.parse(err.error);
    printAndExit(`Invalid API token provided: ${statusCode} ${message}`);
  }
  storeCodaApiKey(apiToken, process.env.PWD, codaApiEndpoint);
}
