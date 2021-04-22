import type {Arguments} from 'yargs';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import {getApiKey} from './helpers';
import {isCodaError} from './errors';
import {printAndExit} from '../testing/helpers';
import {readJSONFile} from '../testing/helpers';
import {writeJSONFile} from '../testing/helpers';

interface CreateArgs {
  packName: string;
  codaApiEndpoint: string;
}

export interface AllPacks {
  [name: string]: number;
}

const PACK_IDS_FILE = '.coda-packs.json';

export async function handleCreate({packName, codaApiEndpoint}: Arguments<CreateArgs>) {
  await createPack(packName, codaApiEndpoint);
}

export async function createPack(packName: string, codaApiEndpoint: string) {
  const formattedEndpoint = formatEndpoint(codaApiEndpoint);
  // TODO(alan): we probably want to redirect them to the `coda register`
  // flow if they don't have a Coda API token.
  const apiKey = getApiKey();
  if (!apiKey) {
    printAndExit('Missing API key. Please run `coda register <apiKey>` to register one.');
  }

  const codaClient = createCodaClient(apiKey, formattedEndpoint);
  try {
    const response = await codaClient.createPack({}, {});
    if (isCodaError(response)) {
      printAndExit(`Unable to create your pack, received error: ${response}`);
    } else {
      const packId = response.packId;
      storePack(packName, packId);
    }
  } catch (err) {
    printAndExit(`Unable to create your pack, received error: ${err}`);
  }
}

export function storePack(packName: string, packId: number): void {
  const allPacks = readPacksFile() || {};
  allPacks[packName] = packId;
  writePacksFile(allPacks);
}

export function readPacksFile(): AllPacks | undefined {
  return readJSONFile(PACK_IDS_FILE);
}

function writePacksFile(allPacks: AllPacks): void {
  writeJSONFile(PACK_IDS_FILE, allPacks);
}
