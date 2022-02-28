import type {ArgumentsCamelCase} from 'yargs';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import {getApiKey} from './config_storage';
import {getPackId} from './config_storage';
import {printAndExit} from '../testing/helpers';
import {promptForInput} from '../testing/helpers';
import {storePackId} from './config_storage';

// Regular expression that matches coda.io/p/<packId> or <packId>.
const PackUrlRegex = /^(?:https:\/\/(?:[^/]*)coda.io(?:\:[0-9]+)?\/p\/)?([0-9]+)(:?[^0-9]*)$/;

interface LinkArgs {
  manifestDir: string;
  codaApiEndpoint: string;
  packIdOrUrl: string;
}

export function parsePackIdOrUrl(packIdOrUrl: string): number | null {
  const match = packIdOrUrl.match(PackUrlRegex);
  if (!match) {
    return null;
  }
  const matchedNumber = match[1];
  return Number(matchedNumber);
}

export async function handleLink({manifestDir, codaApiEndpoint, packIdOrUrl}: ArgumentsCamelCase<LinkArgs>) {
  const formattedEndpoint = formatEndpoint(codaApiEndpoint);
  // TODO(dweitzman): Redirect to the `coda register` if there's not
  // an existing Coda API token.
  // TODO(dweitzman): Add a download command to fetch the latest code from
  // the server and ask people if they want to download after linking.
  const apiKey = getApiKey(codaApiEndpoint);
  if (!apiKey) {
    printAndExit('Missing API key. Please run `coda register <apiKey>` to register one.');
  }

  const codaClient = createCodaClient(apiKey, formattedEndpoint);
  const packId = parsePackIdOrUrl(packIdOrUrl);
  if (packId === null) {
    printAndExit(`packIdOrUrl must be a pack ID or URL, not ${packIdOrUrl}`);
  }

  // Verify that the user has edit access to the pack. Currently only editors
  // can call getPack().
  await codaClient.getPack(packId);

  const existingPackId = getPackId(manifestDir, codaApiEndpoint);
  if (existingPackId) {
    if (existingPackId === packId) {
      printAndExit(`Already associated with pack ${existingPackId}. No change needed`, 0);
    }

    const input = promptForInput(
      `Overwrite existing deploy to pack https://coda.io/p/${existingPackId} with https://coda.io/p/${packId} instead? Press "y" to overwrite or "n" to cancel: `,
    );
    if (input.toLocaleLowerCase() !== 'y') {
      return process.exit(1);
    }
  }

  storePackId(manifestDir, packId, codaApiEndpoint);
  return printAndExit(`Linked successfully!`, 0);
}
