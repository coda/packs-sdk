import type {Arguments} from 'yargs';
import fs from 'fs';
import path from 'path';
import {readCredentialsFile} from 'testing/auth';
import requestPromise from 'request-promise-native';

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
  const {packId} = (
    await requestPromise.get(`https://coda.io/apis/v1/packs`, {
      headers: {Authorization: `Bearer ${credentialsFile?.__coda__}`},
    })
  ).json();
  storePack(packName, packId);
}

export function storePack(packName: string, packId: number): void {
  const allPacks = readPacksFile() || {};
  allPacks[packName] = packId;
  writePacksFile(allPacks);
}

export function readPacksFile(): AllPacks | undefined {
  let file: Buffer;
  try {
    file = fs.readFileSync(DEFAULT_PACKS_FILE);
  } catch (err) {
    if (err.message && err.message.includes('no such file or directory')) {
      return;
    }
    throw err;
  }
  return JSON.parse(file.toString());
}

function writePacksFile(allPacks: AllPacks): void {
  const dirname = path.dirname(DEFAULT_PACKS_FILE);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
  }
  const fileExisted = fs.existsSync(DEFAULT_PACKS_FILE);
  fs.writeFileSync(DEFAULT_PACKS_FILE, JSON.stringify(allPacks, undefined, 2));
  if (!fileExisted) {
    // When we create the file, make sure only the owner can read it, because it contains sensitive credentials.
    fs.chmodSync(DEFAULT_PACKS_FILE, 0o600);
  }
}
