import type {ArgumentsCamelCase} from 'yargs';
import {DEFAULT_API_ENDPOINT} from './config_storage';
import {confirmOrFail} from './confirm';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import {isInteractive} from './confirm';
import {isResponseError} from '../helpers/external-api/coda';
import {missingFlagError} from './confirm';
import open from 'open';
import {printAndExit} from '../testing/helpers';
import {promptForInput} from '../testing/helpers';
import {storeCodaApiKey} from './config_storage';
import {tryParseSystemError} from './errors';

interface RegisterArgs {
  apiToken?: string;
  apiEndpoint: string;
  open?: boolean;
  yes?: boolean;
}

const DEFAULT_ACCOUNT_ENDPOINT = 'https://docs.superhuman.com';

export function getApiTokenCreationUrl(apiEndpoint: string): string {
  const normalizedEndpoint = apiEndpoint.replace(/\/+$/, '');
  const accountEndpoint = normalizedEndpoint === DEFAULT_API_ENDPOINT ? DEFAULT_ACCOUNT_ENDPOINT : normalizedEndpoint;
  return `${accountEndpoint}/account?openDialog=CREATE_API_TOKEN&scopeType=pack#apiSettings`;
}

export async function handleRegister({
  apiToken,
  apiEndpoint,
  open: openBrowser,
  yes,
}: ArgumentsCamelCase<RegisterArgs>) {
  const formattedEndpoint = formatEndpoint(apiEndpoint);
  const tokenUrl = getApiTokenCreationUrl(formattedEndpoint);
  if (!apiToken) {
    if (openBrowser || (isInteractive() && !yes)) {
      if (!openBrowser) {
        confirmOrFail({
          yes,
          prompt: 'No API token provided. Do you want to open your account page to create one (y/N)? ',
          example: 'packs register --apiToken <token>',
        });
      }
      await open(tokenUrl);
    }
    if (isInteractive()) {
      apiToken = promptForInput('Please paste the token here: ', {mask: true});
    }
    if (!apiToken) {
      return missingFlagError(
        'No API token specified.',
        'packs register --apiToken <token>',
        `Create a token at ${tokenUrl}`,
      );
    }
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
  printAndExit(`registered\nendpoint: ${formattedEndpoint}`, 0);
}
