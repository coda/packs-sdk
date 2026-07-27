import type {ArgumentsCamelCase} from 'yargs';
import {DEFAULT_API_ENDPOINT} from './config_storage';
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
  apiEndpoint: string;
}

const DEFAULT_ACCOUNT_ENDPOINT = 'https://docs.superhuman.com';

export function getApiTokenCreationUrl(apiEndpoint: string): string {
  const normalizedEndpoint = apiEndpoint.replace(/\/+$/, '');
  const accountEndpoint = normalizedEndpoint === DEFAULT_API_ENDPOINT ? DEFAULT_ACCOUNT_ENDPOINT : normalizedEndpoint;
  return `${accountEndpoint}/account?openDialog=CREATE_API_TOKEN&scopeType=pack#apiSettings`;
}

export async function handleRegister({apiToken, apiEndpoint}: ArgumentsCamelCase<RegisterArgs>) {
  const formattedEndpoint = formatEndpoint(apiEndpoint);
  if (!apiToken) {
    // TODO: deal with auto-open on devbox setups
    const shouldOpenBrowser = promptForInput(
      'No API token provided. Do you want to open your account page to create one (y/N)? ',
      {yesOrNo: true},
    );
    if (shouldOpenBrowser !== 'yes') {
      return process.exit(1);
    }
    await open(getApiTokenCreationUrl(formattedEndpoint));
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

  storeCodaApiKey(apiToken, process.env.PWD, apiEndpoint);
  printAndExit(`API key validated and stored successfully!`, 0);
}
