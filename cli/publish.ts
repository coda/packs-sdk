import type {Arguments} from 'yargs';
import {ConsoleLogger} from '../helpers/logging';
import type {PackUpload} from '../compiled_types';
import {build} from './build';
import {compilePackMetadata} from '../helpers/cli';
import {computeSha256} from '../helpers/crypto';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import {formatError} from './errors';
import {getApiKey} from './config_storage';
import {getPackId} from './config_storage';
import {isCodaError} from './errors';
import {isTestCommand} from './helpers';
import * as path from 'path';
import {printAndExit} from '../testing/helpers';
import {readFile} from '../testing/helpers';
import requestPromise from 'request-promise-native';
import {validateMetadata} from './validate';

interface PublishArgs {
  manifestFile: string;
  codaApiEndpoint: string;
}

export async function handlePublish({manifestFile, codaApiEndpoint}: Arguments<PublishArgs>) {
  const manifestDir = path.dirname(manifestFile);
  const formattedEndpoint = formatEndpoint(codaApiEndpoint);
  const logger = new ConsoleLogger();
  logger.info('Building Pack bundle...');
  const bundleFilename = await build(manifestFile);
  const {manifest} = await import(bundleFilename);

  // Since package.json isn't in dist, we grab it from the root directory instead.
  const packageJson = await import(isTestCommand() ? '../package.json' : '../../package.json');
  const codaPacksSDKVersion = packageJson.version;
  codaPacksSDKVersion!;

  const apiKey = getApiKey(codaApiEndpoint);
  if (!apiKey) {
    printAndExit('Missing API key. Please run `coda register <apiKey>` to register one.');
  }

  const client = createCodaClient(apiKey, formattedEndpoint);

  const packId = getPackId(manifestDir, codaApiEndpoint);
  if (!packId) {
    printAndExit(`Could not find a Pack id registered to Pack "${manifest.name}"`);
  }

  const packVersion = manifest.version;
  if (!packVersion) {
    printAndExit(`No Pack version found for your Pack "${manifest.name}"`);
  }

  try {
    logger.info('Registering new Pack version...');

    const bundle = readFile(bundleFilename);
    if (!bundle) {
      printAndExit(`Could not find bundle file at path ${bundleFilename}`);
    }
    const metadata = compilePackMetadata(manifest);

    const upload: PackUpload = {
      metadata,
      bundle: bundle.toString(),
    };
    const uploadPayload = JSON.stringify(upload);

    const bundleHash = computeSha256(uploadPayload);
    const registerResponse = await client.registerPackVersion(packId, packVersion, {}, {bundleHash});
    if (isCodaError(registerResponse)) {
      return printAndExit(`Error while registering pack version: ${formatError(registerResponse)}`);
    }
    const {uploadUrl, headers} = registerResponse;

    logger.info('Validating Pack metadata...');
    await validateMetadata(metadata);

    logger.info('Uploading Pack...');
    await uploadPack(uploadUrl, uploadPayload, headers);

    logger.info('Validating upload...');
    const uploadCompleteResponse = await client.packVersionUploadComplete(packId, packVersion);
    if (isCodaError(uploadCompleteResponse)) {
      printAndExit(`Error while finalizing pack version: ${formatError(uploadCompleteResponse)}`);
    }
  } catch (err) {
    printAndExit(`Unepected error during pack upload: ${formatError(err)}`);
  }

  logger.info('Done!');
}

async function uploadPack(uploadUrl: string, uploadPayload: string, headers: {[header: string]: any}) {
  try {
    await requestPromise.put(uploadUrl, {
      headers,
      body: uploadPayload,
    });
  } catch (err) {
    printAndExit(`Error in uploading Pack to signed url: ${formatError(err)}`);
  }
}
