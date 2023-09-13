import type {ArgumentsCamelCase} from 'yargs';
import type {Logger} from '../api_types';
import type {PackUpload} from '../compiled_types';
import type {PackVersionDefinition} from '..';
import type {PublicApiCreatePackVersionResponse} from '../helpers/external-api/v1';
import {PublicApiPackSource} from '../helpers/external-api/v1';
import type {PublicApiPackVersionUploadInfo} from '../helpers/external-api/v1';
import type {TimerShimStrategy} from '../testing/compile';
import {assertApiToken} from './helpers';
import {assertPackId} from './helpers';
import {compilePackBundle} from '../testing/compile';
import {compilePackMetadata} from '../helpers/metadata';
import {computeSha256} from '../helpers/crypto';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import {formatError} from './errors';
import {formatResponseError} from './errors';
import fs from 'fs-extra';
import {importManifest} from './helpers';
import {isResponseError} from '../helpers/external-api/coda';
import {isTestCommand} from './helpers';
import os from 'os';
import * as path from 'path';
import {print} from '../testing/helpers';
import {printAndExit as printAndExitImpl} from '../testing/helpers';
import {readFile} from '../testing/helpers';
import {tryParseSystemError} from './errors';
import {v4} from 'uuid';
import {validateMetadata} from './validate';

interface UploadArgs {
  manifestFile: string;
  codaApiEndpoint: string;
  notes?: string;
  intermediateOutputDirectory: string;
  timerStrategy: TimerShimStrategy;
  apiToken?: string;
}

function cleanup(intermediateOutputDirectory: string, logger: Logger) {
  logger.info('\n\nCleaning up...');

  if (fs.existsSync(intermediateOutputDirectory)) {
    const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), `coda-packs-${v4()}`));
    fs.moveSync(intermediateOutputDirectory, path.join(tempDirectory, 'build'));

    logger.info(`Intermediate files are moved to ${tempDirectory}`);
  }
}

export async function handleUpload({
  intermediateOutputDirectory,
  manifestFile,
  codaApiEndpoint,
  notes,
  timerStrategy,
  apiToken,
  allowOlderSdkVersion,
}: ArgumentsCamelCase<UploadArgs>) {
  const logger = console;
  function printAndExit(message: string): never {
    cleanup(intermediateOutputDirectory, logger);
    printAndExitImpl(message);
  }

  const manifestDir = path.dirname(manifestFile);
  const formattedEndpoint = formatEndpoint(codaApiEndpoint);
  apiToken = assertApiToken(codaApiEndpoint, apiToken);
  const packId = assertPackId(manifestDir, codaApiEndpoint);

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
    timerStrategy,
  });

  const manifest = await importManifest<PackVersionDefinition>(bundlePath);

  // Since package.json isn't in dist, we grab it from the root directory instead.
  const packageJson = await import(isTestCommand() ? '../package.json' : '../../package.json');
  const codaPacksSDKVersion = packageJson.version as string;

  const client = createCodaClient(apiToken, formattedEndpoint);

  const metadata = compilePackMetadata(manifest);
  let packVersion = manifest.version;
  try {
    // Do local validation even if we don't have a pack version. This is faster and saves resources
    // over having the server validate, but there is a downside: errors from the server will be
    // in a different format and the code will be exercised less often so we're less likely to
    // notice if there are issues with how it's returned.
    logger.info('Validating Pack metadata...');
    const metadataWithFakeVersion = !packVersion ? {...metadata, version: '0.0.1'} : metadata;
    await validateMetadata(metadataWithFakeVersion, {checkDeprecationWarnings: false});

    if (!packVersion) {
      try {
        const nextPackVersionInfo = await client.getNextPackVersion(
          packId,
          {},
          {proposedMetadata: JSON.stringify(metadata), sdkVersion: codaPacksSDKVersion},
        );
        packVersion = nextPackVersionInfo.nextVersion;
        print(`Pack version not provided. Generated one for you: version is ${packVersion}`);
      } catch (err: any) {
        if (isResponseError(err)) {
          printAndExit(`Error while finalizing pack version: ${await formatResponseError(err)}`);
        }
        throw err;
      }
    }

    metadata.version = packVersion;

    const bundle = readFile(bundlePath);
    if (!bundle) {
      printAndExit(`Could not find bundle file at path ${bundlePath}`);
    }

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

    logger.info('Registering new Pack version...');
    let registerResponse: PublicApiPackVersionUploadInfo;
    try {
      registerResponse = await client.registerPackVersion(packId, packVersion, {}, {bundleHash});
    } catch (err: any) {
      if (isResponseError(err)) {
        return printAndExit(`Error while registering pack version: ${await formatResponseError(err)}`);
      }
      throw err;
    }

    const {uploadUrl, headers} = registerResponse;

    logger.info('Uploading Pack...');
    await uploadPack(uploadUrl, uploadPayload, headers);

    logger.info('Validating upload...');
    let uploadCompleteResponse: PublicApiCreatePackVersionResponse;
    try {
      uploadCompleteResponse = await client.packVersionUploadComplete(
        packId,
        packVersion,
        {},
        {notes, source: PublicApiPackSource.Cli, allowOlderSdkVersion: Boolean(allowOlderSdkVersion)},
      );
    } catch (err: any) {
      if (isResponseError(err)) {
        printAndExit(`Error while finalizing pack version: ${await formatResponseError(err)}`);
      }
      throw err;
    }

    const {deprecationWarnings} = uploadCompleteResponse;
    if (deprecationWarnings?.length) {
      print(
        '\nYour Pack version uploaded successfully. ' +
          'However, your Pack is using deprecated properties or features that will become errors in a future SDK version.\n',
      );
      for (const {path, message} of deprecationWarnings) {
        print(`Warning in field at path "${path}": ${message}`);
      }
    }
  } catch (err: any) {
    const errors = [`Unexpected error during Pack upload: ${formatError(err)}`, tryParseSystemError(err)];
    printAndExit(errors.join(`\n`));
  }

  cleanup(intermediateOutputDirectory, logger);
  logger.info('Done!');
}

async function uploadPack(uploadUrl: string, uploadPayload: string, headers: {[header: string]: any}) {
  try {
    await fetch(uploadUrl, {
      method: 'PUT',
      headers,
      body: uploadPayload,
    });
  } catch (err: any) {
    printAndExitImpl(`Error in uploading Pack to signed url: ${formatError(err)}`);
  }
}
