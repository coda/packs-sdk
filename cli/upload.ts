import type {Arguments} from 'yargs';
import {ConsoleLogger} from '../helpers/logging';
import type {PackUpload} from '../compiled_types';
import {compilePackBundle} from '../testing/compile';
import {compilePackMetadata} from '../helpers/metadata';
import {computeSha256} from '../helpers/crypto';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import {formatError} from './errors';
import {getApiKey} from './config_storage';
import {getPackId} from './config_storage';
import {importManifest} from './helpers';
import {isCodaError} from './errors';
import {isTestCommand} from './helpers';
import * as path from 'path';
import {printAndExit} from '../testing/helpers';
import {readFile} from '../testing/helpers';
import requestPromise from 'request-promise-native';
import {validateMetadata} from './validate';

interface UploadArgs {
  manifestFile: string;
  codaApiEndpoint: string;
  notes?: string;
  skipValidation?: boolean;
}

export async function handleUpload({manifestFile, codaApiEndpoint, notes, skipValidation}: Arguments<UploadArgs>) {
  const manifestDir = path.dirname(manifestFile);
  const formattedEndpoint = formatEndpoint(codaApiEndpoint);
  const logger = new ConsoleLogger();
  logger.info('Building Pack bundle...');

  // we need to generate the bundle file in the working directory instead of a temp directory in
  // order to set source map right. The source map tool chain isn't smart enough to resolve a
  // relative path in the end.
  const {bundlePath, bundleSourceMapPath} = await compilePackBundle({
    manifestPath: manifestFile,
    outputDirectory: './',
    intermediateOutputDirectory: './',
  });

  const manifest = await importManifest(bundlePath);

  // Since package.json isn't in dist, we grab it from the root directory instead.
  const packageJson = await import(isTestCommand() ? '../package.json' : '../../package.json');
  const codaPacksSDKVersion = packageJson.version as string;

  const apiKey = getApiKey(codaApiEndpoint);
  if (!apiKey) {
    printAndExit('Missing API key. Please run `coda register <apiKey>` to register one.');
  }

  const client = createCodaClient(apiKey, formattedEndpoint);

  const packId = getPackId(manifestDir, codaApiEndpoint);
  if (!packId) {
    printAndExit(`Could not find a Pack id registered in directory "${manifestDir}"`);
  }

  const packVersion = manifest.version;
  if (!packVersion) {
    printAndExit(`No Pack version declared for this Pack`);
  }

  try {
    const bundle = readFile(bundlePath);
    if (!bundle) {
      printAndExit(`Could not find bundle file at path ${bundlePath}`);
    }
    const metadata = compilePackMetadata(manifest);

    const sourceMap = readFile(bundleSourceMapPath);
    if (!sourceMap) {
      printAndExit(`Could not find bundle source map at path ${bundleSourceMapPath}`);
    }

    const upload: PackUpload = {
      metadata,
      sdkVersion: codaPacksSDKVersion,
      bundle: bundle.toString(),
      sourceMap: sourceMap.toString(),
    };
    const uploadPayload = JSON.stringify(upload);

    const bundleHash = computeSha256(uploadPayload);

    if (skipValidation) {
      logger.info('Skipping Pack metadata validation...');
    } else {
      logger.info('Validating Pack metadata...');
      await validateMetadata(metadata);  
    }

    logger.info('Registering new Pack version...');
    const registerResponse = await client.registerPackVersion(packId, packVersion, {}, {bundleHash});
    if (isCodaError(registerResponse)) {
      return printAndExit(`Error while registering pack version: ${formatError(registerResponse)}`);
    }
    const {uploadUrl, headers} = registerResponse;

    logger.info('Uploading Pack...');
    await uploadPack(uploadUrl, uploadPayload, headers);

    logger.info('Validating upload...');
    const uploadCompleteResponse = await client.packVersionUploadComplete(packId, packVersion, {}, {notes});
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
