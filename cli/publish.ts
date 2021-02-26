import type {AllCredentials} from '../testing/auth_types';
import type {AllPacks} from './create';
import type {Arguments} from 'yargs';
import {Client} from '../helpers/external-api/coda';
import type {PackMetadata} from '../compiled_types';
import {build} from './build';
import {printAndExit} from '../testing/helpers';
import {readCredentialsFile} from '../testing/auth';
import {readFile} from '../testing/helpers';
import {readPacksFile} from './create';
import requestPromise from 'request-promise-native';

interface PublishArgs {
  manifestFile: string;
}

export async function handlePublish({manifestFile}: Arguments<PublishArgs>) {
  const {manifest} = await import(manifestFile);
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
    // TODO(alan): probably add a command to regenerate the file if it is missing.
    printAndExit(`Could not find your packs file.`);
  }

  const packId = packs[manifest.name];
  if (!packId) {
    printAndExit(`Could not find a pack id registered to pack "${manifest.name}"`);
  }

  const packVersion = manifest.version;
  if (!packVersion) {
    printAndExit(`No pack version found for your pack "${manifest.name}"`);
  }

  //  TODO(alan): error testing
  const {uploadUrl} = await client.registerPackVersion(packId, packVersion);
  await uploadPackToSignedUrl(bundleFilename, manifest, uploadUrl);
  await client.packVersionUploadComplete(packId, packVersion);
}

async function uploadPackToSignedUrl(bundleFilename: string, metadata: PackMetadata, uploadUrl: string) {
  const bundle = readFile(bundleFilename);
  if (!bundle) {
    printAndExit(`Could not find bundle file at path ${bundleFilename}`);
  }

  try {
    await requestPromise.put(uploadUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      json: {
        metadata,
        bundle: bundle.toString(),
      },
    });
  } catch (err) {
    printAndExit(`Error in uploading pack to signed url: ${err}`);
  }
}
