import type {AllPacks} from './create';
import type {Arguments} from 'yargs';
import {ConsoleLogger} from '../helpers/logging';
import type {PackMetadata} from '../compiled_types';
import {build} from './build';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import {getApiKey} from './helpers';
import {printAndExit} from '../testing/helpers';
import {readFile} from '../testing/helpers';
import {readPacksFile} from './create';
import requestPromise from 'request-promise-native';

interface PublishArgs {
  manifestFile: string;
  codaApiEndpoint: string;
}

export async function handlePublish({manifestFile, codaApiEndpoint}: Arguments<PublishArgs>) {
  const formattedEndpoint = formatEndpoint(codaApiEndpoint);
  const logger = new ConsoleLogger();
  const {manifest} = await import(manifestFile);
  logger.info('Building pack bundle...');
  const bundleFilename = await build(manifestFile);
  const packageJson = await import('../../' + 'package.json');
  const codaPacksSDKVersion = packageJson.version;
  codaPacksSDKVersion!;

  const apiKey = getApiKey();
  if (!apiKey) {
    printAndExit('Missing API key. Please run `coda register <apiKey>` to register one.');
  }

  const client = createCodaClient(apiKey, formattedEndpoint);

  const packs: AllPacks | undefined = readPacksFile();
  const packId = packs && packs[manifest.name];
  if (!packId) {
    printAndExit(`Could not find a pack id registered to pack "${manifest.name}"`);
  }

  const packVersion = manifest.version;
  if (!packVersion) {
    printAndExit(`No pack version found for your pack "${manifest.name}"`);
  }

  //  TODO(alan): error testing
  try {
    logger.info('Registering new pack version...');
    const {uploadUrl} = await client.registerPackVersion(packId, packVersion);

    logger.info('Uploading pack...');
    await uploadPackToSignedUrl(bundleFilename, manifest, uploadUrl);

    logger.info('Validating upload...');
    await client.packVersionUploadComplete(packId, packVersion);
  } catch (err) {
    printAndExit(`Error: ${err}`);
  }

  logger.info('Done!');
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
