import type {AllCredentials} from '../testing/auth_types';
import type {AllPacks} from './create';
import type {Arguments} from 'yargs';
import {Client} from '../helpers/external-api/coda';
import {build} from './build';
import {printAndExit} from '../testing/helpers';
import {readCredentialsFile} from '../testing/auth';
import {readFile} from '../testing/helpers';
import {readPacksFile} from './create';

interface PublishArgs {
  manifestFile: string;
}

export async function handlePublish({manifestFile}: Arguments<PublishArgs>) {
  const manifest = await import(manifestFile);
  const bundleFilename = await build(manifestFile);
  const packageJson = await import('../package.json');
  const codaPacksSDKVersion = packageJson.version;
  codaPacksSDKVersion!;

  const credentials: AllCredentials | undefined = readCredentialsFile();
  if (!credentials?.__coda__?.apiKey) {
    printAndExit('Missing API key. Please run `coda register <apiKey>` to register one.');
  }

  const client = new Client('https://dev.coda.io:8080', credentials.__coda__.apiKey);

  const packs: AllPacks | undefined = readPacksFile();
  if (!packs) {
    return;
  }
  const packId = packs[manifest.name];
  const packVersion = manifest.version;
  const {uploadUrl} = await client.registerPackVersion(packId, packVersion);
  await uploadPackToSignedUrl(bundleFilename, uploadUrl);
  await client.packVersionUploadComplete(packId, packVersion);
}

async function uploadPackToSignedUrl(bundleFilename: string, uploadUrl: string) {
  const payload = readFile(bundleFilename);
  try {
    await fetch(uploadUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: payload,
    });
  } catch (err) {
    printAndExit(`Error in uploading pack to signed url: ${err}`);
  }
}
