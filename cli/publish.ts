import type {AllPacks} from './create';
import type {Arguments} from 'yargs';
import {ConsoleLogger} from '../helpers/logging';
import type {PackMetadata} from '../compiled_types';
import type {PackUpload} from '../compiled_types';
import {build} from './build';
import {compilePackMetadata} from '../helpers/cli';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import {getApiKey} from './helpers';
import {isTestCommand} from './helpers';
import {printAndExit} from '../testing/helpers';
import {readFile} from '../testing/helpers';
import {readPacksFile} from './create';
import requestPromise from 'request-promise-native';
import {validateMetadata} from './validate';

interface PublishArgs {
  manifestFile: string;
  codaApiEndpoint: string;
}

export async function handlePublish({manifestFile, codaApiEndpoint}: Arguments<PublishArgs>) {
  const formattedEndpoint = formatEndpoint(codaApiEndpoint);
  const logger = new ConsoleLogger();
  const {manifest} = await import(manifestFile);
  logger.info('Building Pack bundle...');
  const bundleFilename = await build(manifestFile);

  // Since package.json isn't in dist, we grab it from the root directory instead.
  const packageJson = await import(isTestCommand() ? '../package.json' : '../../package.json');
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
    printAndExit(`Could not find a Pack id registered to Pack "${manifest.name}"`);
  }

  const packVersion = manifest.version;
  if (!packVersion) {
    printAndExit(`No Pack version found for your Pack "${manifest.name}"`);
  }

  //  TODO(alan): error testing
  try {
    logger.info('Registering new Pack version...');
    const {uploadUrl} = await client.registerPackVersion(packId, packVersion);

    // TODO(alan): only grab metadata from manifest.
    logger.info('Validating Pack metadata...');
    await validateMetadata(manifest);

    logger.info('Uploading Pack...');
    const metadata = compilePackMetadata(manifest);
    await uploadPackToSignedUrl(bundleFilename, metadata, uploadUrl);

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

  const upload: PackUpload = {
    metadata,
    bundle: bundle.toString(),
  };

  try {
    await requestPromise.put(uploadUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      json: upload,
    });
  } catch (err) {
    printAndExit(`Error in uploading Pack to signed url: ${err}`);
  }
}
