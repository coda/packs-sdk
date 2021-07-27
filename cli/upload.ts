import type {Arguments} from 'yargs';
import {ConsoleLogger} from '../helpers/logging';
import type {PackUpload} from '../compiled_types';
import {compilePackBundle} from '../testing/compile';
import {compilePackMetadata} from '../helpers/metadata';
import {computeSha256} from '../helpers/crypto';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import {formatError} from './errors';
import fs from 'fs';
import {getApiKey} from './config_storage';
import {getPackId} from './config_storage';
import {importManifest} from './helpers';
import {isCodaError} from './errors';
import {isTestCommand} from './helpers';
import os from 'os';
import * as path from 'path';
import {printAndExit as printAndExitImpl} from '../testing/helpers';
import {readFile} from '../testing/helpers';
import requestPromise from 'request-promise-native';
import {tryParseSystemError} from './errors';
import {v4} from 'uuid';
import {validateMetadata} from './validate';

interface UploadArgs {
  manifestFile: string;
  codaApiEndpoint: string;
  notes?: string;
  intermediateOutputDirectory: string;
}

function cleanup(intermediateOutputDirectory: string, logger: ConsoleLogger) {
  logger.info('\n\nCleaning up...');

  if (fs.existsSync(intermediateOutputDirectory)) {
    const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), `coda-packs-${v4()}`));
    fs.renameSync(intermediateOutputDirectory, tempDirectory);

    logger.info(`Intermediate files are moved to ${tempDirectory}`);
  }
}

export async function handleUpload({
  intermediateOutputDirectory,
  manifestFile,
  codaApiEndpoint,
  notes,
}: Arguments<UploadArgs>) {
  function printAndExit(message: string): never {
    cleanup(intermediateOutputDirectory, logger);
    printAndExitImpl(message);
  }

  const manifestDir = path.dirname(manifestFile);
  const formattedEndpoint = formatEndpoint(codaApiEndpoint);
  const logger = new ConsoleLogger();
  logger.info('Building Pack bundle...');

  if (fs.existsSync(intermediateOutputDirectory)) {
    logger.info(
      `Existing directory ${intermediateOutputDirectory} detected. Probably left over from previous build. Removing it...`,
    );
    fs.rmdirSync(intermediateOutputDirectory, {recursive: true});
  }

  // we need to generate the bundle file in the working directory instead of a temp directory in
  // order to set source map right. The source map tool chain isn't smart enough to resolve a
  // relative path in the end.
  const {bundlePath, bundleSourceMapPath} = await compilePackBundle({
    manifestPath: manifestFile,
    outputDirectory: intermediateOutputDirectory,
    intermediateOutputDirectory,
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

    logger.info('Validating Pack metadata...');
    await validateMetadata(metadata);

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
    const errors = [`Unexpected error during Pack upload: ${formatError(err)}`, tryParseSystemError(err)];
    printAndExit(errors.join(`\n`));
  }

  cleanup(intermediateOutputDirectory, logger);
  logger.info('Done!');
}

async function uploadPack(uploadUrl: string, uploadPayload: string, headers: {[header: string]: any}) {
  try {
    await requestPromise.put(uploadUrl, {
      headers,
      body: uploadPayload,
    });
  } catch (err) {
    printAndExitImpl(`Error in uploading Pack to signed url: ${formatError(err)}`);
  }
}
