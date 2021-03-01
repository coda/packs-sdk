import type {Arguments} from 'yargs';
import {createCodaClient} from './helpers';
import {getApiKey} from './helpers';
import {printAndExit} from '../testing/helpers';
import {readJSONFile} from '../testing/helpers';
import {writeJSONFile} from '../testing/helpers';

interface CreateArgs {
  packName: string;
  dev?: boolean;
}

export interface AllPacks {
  [name: string]: number;
}

const PACK_IDS_FILE = '.coda-packs.json';

export async function handleCreate({packName, dev}: Arguments<CreateArgs>) {
  await createPack(packName, dev);
}

export async function createPack(packName: string, dev?: boolean) {
  // TODO(alan): we probably want to redirect them to the `coda register`
  // flow if they don't have a Coda API token.
  const apiKey = getApiKey();
  if (!apiKey) {
    printAndExit('Missing API key. Please run `coda register <apiKey>` to register one.');
  }

  const codaClient = createCodaClient(apiKey, dev);
  let packId: number;
  try {
    const response = await codaClient.createPack();
    packId = response.packId;
  } catch (err) {
    // TODO(alan): pressure test with errors
    const error = JSON.parse(err.error);
    printAndExit(`Unable to create your pack, received error message ${error.message} (status code ${err.statusCode})`);
  }

  storePack(packName, packId);
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
