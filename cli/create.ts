import type {Arguments} from 'yargs';
import {readCredentialsFile} from '../testing/auth';
import {readFile} from '../testing/helpers';
import requestPromise from 'request-promise-native';
import {writeFile} from '../testing/helpers';

interface CreateArgs {
  packName: string;
}

interface AllPacks {
  [name: string]: number;
}

const DEFAULT_PACKS_FILE = '.coda-packs.json';

export async function handleCreate({packName}: Arguments<CreateArgs>) {
  await createPack(packName);
}

export async function createPack(packName: string) {
  // TODO(alan): we probably want to redirect them to the `coda register`
  // flow if they don't have a Coda API token.
  const credentialsFile = readCredentialsFile();
  const {packId} = JSON.parse(
    await requestPromise.post(`https://coda.io/apis/v1/packs`, {
      headers: {Authorization: `Bearer ${credentialsFile?.__coda__}`},
    }),
  );
  storePack(packName, packId);
}

export function storePack(packName: string, packId: number): void {
  const allPacks = readPacksFile() || {};
  allPacks[packName] = packId;
  writePacksFile(allPacks);
}

export function readPacksFile(): AllPacks | undefined {
  return readFile(DEFAULT_PACKS_FILE);
}

function writePacksFile(allPacks: AllPacks): void {
  writeFile(DEFAULT_PACKS_FILE, allPacks);
}
