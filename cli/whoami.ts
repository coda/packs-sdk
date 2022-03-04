import type {ArgumentsCamelCase} from 'yargs';
import type {PublicApiUser} from '../helpers/external-api/v1';
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
      return printAndExit('Missing API token. Please run `coda register` to register one.');
    }
  }

  const client = createCodaClient(apiToken, formattedEndpoint);

  try {
    const response = await client.whoami();
    return printAndExit(formatWhoami(response), 0);
  } catch (err: any) {
    if (isResponseError(err)) {
      return printAndExit(`Invalid API token provided.`);
    }

    const errors = [`Unexpected error while checking owner of API token: ${err}`, tryParseSystemError(err)];
    return printAndExit(errors.join('\n'));
  }
}

export function formatWhoami(user: PublicApiUser) {
  const {name, loginId, tokenName, scoped} = user;

  return `You are ${name} (${loginId}) using ${scoped ? 'scoped' : 'non-scoped'} token "${tokenName}"`;
}
