import type {ArgumentsCamelCase} from 'yargs';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import {isResponseError} from '../helpers/external-api/coda';
import open from 'open';
import {printAndExit} from '../testing/helpers';
import {promptForInput} from '../testing/helpers';
import {storeCodaApiKey} from './config_storage';
import {tryParseSystemError} from './errors';

interface RegisterArgs {
  apiToken?: string;
  codaApiEndpoint: string;
}

export async function handleRegister({apiToken, codaApiEndpoint}: ArgumentsCamelCase<RegisterArgs>) {
  const formattedEndpoint = formatEndpoint(codaApiEndpoint);
  if (!apiToken) {
    // TODO: deal with auto-open on devbox setups
    const shouldOpenBrowser = promptForInput(
      'No API token provided. Do you want to visit Coda to create one (y/N)? ',
      {yesOrNo: true},
    );
    if (shouldOpenBrowser !== 'yes') {
      return process.exit(1);
    }
    await open(`${formattedEndpoint}/account?openDialog=CREATE_API_TOKEN&scopeType=pack#apiSettings`);
    apiToken = promptForInput('Please paste the token here: ', {mask: true});
  }

  const client = createCodaClient(apiToken, formattedEndpoint);

  try {
    await client.whoami();
  } catch (err: any) {
    if (isResponseError(err)) {
      return printAndExit(`Invalid API token provided.`);
    }

    const errors = [`Unexpected error while checking validity of API token: ${err}`, tryParseSystemError(err)];
    return printAndExit(errors.join('\n'));
  }

  storeCodaApiKey(apiToken, process.env.PWD, codaApiEndpoint);
  printAndExit(`API key validated and stored successfully!`, 0);
}
