import type {ArgumentsCamelCase} from 'yargs';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import {getApiKey} from './config_storage';
import {getPackId} from './config_storage';
import {isResponseError} from '../helpers/external-api/coda';
import {printAndExit} from '../testing/helpers';
import {promptForInput} from '../testing/helpers';
import {storePackId} from './config_storage';

// Regular expression that matches coda.io/p/<packId> or <packId>.
const PackEditUrlRegex = /^https:\/\/(?:[^/]*)coda.io(?:\:[0-9]+)?\/p\/([0-9]+)(:?[^0-9].*)?$/;
const PackGalleryUrlRegex = /^https:\/\/(?:[^/]*)coda.io(?:\:[0-9]+)?\/packs\/[^/]*-([0-9]+)$/;
const PackPlainIdRegex = /^([0-9]+)$/;
const PackRegexes = [PackEditUrlRegex, PackGalleryUrlRegex, PackPlainIdRegex];

interface LinkArgs {
  manifestDir: string;
  codaApiEndpoint: string;
  packIdOrUrl: string;
}

export async function handleLink({manifestDir, codaApiEndpoint, packIdOrUrl}: ArgumentsCamelCase<LinkArgs>) {
  const formattedEndpoint = formatEndpoint(codaApiEndpoint);
  // TODO(dweitzman): Add a download command to fetch the latest code from
  // the server and ask people if they want to download after linking.
  const apiKey = getApiKey(codaApiEndpoint);
  if (!apiKey) {
    return printAndExit('Missing API token. Please run `coda register` to register one.');
  }

  const codaClient = createCodaClient(apiKey, formattedEndpoint);
  const packId = parsePackIdOrUrl(packIdOrUrl);
  if (packId === null) {
    return printAndExit(`packIdOrUrl must be a pack ID or URL, not ${packIdOrUrl}`);
  }

  // Verify that the user has edit access to the pack. Currently only editors
  // can call getPack().
  try {
    await codaClient.getPack(packId);
  } catch (err: any) {
    if (isResponseError(err)) {
      switch (err.response.status) {
        case 401:
        case 403:
        case 404:
          return printAndExit("You don't have permission to edit this pack");
      }
    }
    throw err;
  }

  const existingPackId = getPackId(manifestDir, codaApiEndpoint);
  if (existingPackId) {
    if (existingPackId === packId) {
      return printAndExit(`Already associated with pack ${existingPackId}. No change needed`, 0);
    }

    const input = promptForInput(
      `Overwrite existing deploy to pack https://coda.io/p/${existingPackId} with https://coda.io/p/${packId} instead? (y/N): `,
      { yesOrNo: true }
    );
    if (input.toLocaleLowerCase() !== 'yes') {
      return process.exit(1);
    }
  }

  storePackId(manifestDir, packId, codaApiEndpoint);
  return printAndExit(`Linked successfully!`, 0);
}

export function parsePackIdOrUrl(packIdOrUrl: string): number | null {
  for (const regex of PackRegexes) {
    const match = packIdOrUrl.match(regex);
    if (match) {
      const matchedNumber = match[1];
      return Number(matchedNumber);
    }
  }
  return null;
}
