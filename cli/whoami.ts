import type {ArgumentsCamelCase} from 'yargs';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import {getApiKey} from './config_storage';
import {isResponseError} from '../helpers/external-api/coda';
import {printAndExit} from '../testing/helpers';
import {tryParseSystemError} from './errors';

interface WhoamiArgs {
  apiToken?: string;
  codaApiEndpoint: string;
}

export async function handleWhoami({apiToken, codaApiEndpoint}: ArgumentsCamelCase<WhoamiArgs>) {
  const formattedEndpoint = formatEndpoint(codaApiEndpoint);
  if (!apiToken) {
    apiToken = getApiKey(codaApiEndpoint);
    if (!apiToken) {
      return printAndExit('Missing API key. Please run `coda register` to register one.');
    }
  }

  const client = createCodaClient(apiToken, formattedEndpoint);

  try {
    const {name, loginId, workspace} = await client.whoami();

    printAndExit(`You are ${name} (${loginId}) in workspace ${workspace.id}`, 0);
  } catch (err: any) {
    if (isResponseError(err)) {
      return printAndExit(`Invalid API token provided.`);
    }

    const errors = [`Unexpected error while checking owner of API token: ${err}`, tryParseSystemError(err)];
    return printAndExit(errors.join('\n'));
  }
}
