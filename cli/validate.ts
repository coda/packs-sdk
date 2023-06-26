import type {ArgumentsCamelCase} from 'yargs';
import type {PackMetadataValidationError} from '../testing/upload_validation';
import type {PackVersionDefinition} from '..';
import type {PackVersionMetadata} from '../compiled_types';
import type {ValidationError} from '../testing/types';
import {compilePackBundle} from '../testing/compile';
import {compilePackMetadata} from '../helpers/metadata';
import fs from 'fs';
import {importManifest} from './helpers';
import {isTestCommand} from './helpers';
import {makeManifestFullPath} from './helpers';
import os from 'os';
import path from 'path';
import {print} from '../testing/helpers';
import {printAndExit} from '../testing/helpers';
import {v4} from 'uuid';
import {validatePackVersionMetadata} from '../testing/upload_validation';

interface ValidateArgs {
  manifestFile: string;
  checkDeprecationWarnings: boolean;
  writeMetadata: boolean;
}

export async function handleValidate({
  manifestFile,
  checkDeprecationWarnings,
  writeMetadata,
}: ArgumentsCamelCase<ValidateArgs>) {
  const fullManifestPath = makeManifestFullPath(manifestFile);
  const {bundlePath} = await compilePackBundle({manifestPath: fullManifestPath, minify: false});
  const manifest = await importManifest<PackVersionDefinition>(bundlePath);

  // Since it's okay to not specify a version, we inject one if it's not provided.
  if (!manifest.version) {
    manifest.version = '1';
  }

  if (writeMetadata) {
    const temporaryOutputDirectory = fs.mkdtempSync(path.join(os.tmpdir(), `coda-packs-${v4()}`));
    const outputFile = path.join(temporaryOutputDirectory, 'metadata.json');

    fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 2));

    print(`Metadata written to ${outputFile}`);
  }

  const metadata = compilePackMetadata(manifest);
  return validateMetadata(metadata, {checkDeprecationWarnings});
}

export async function validateMetadata(
  metadata: PackVersionMetadata,
  {checkDeprecationWarnings = true}: {checkDeprecationWarnings?: boolean} = {},
) {
  // Since package.json isn't in dist, we grab it from the root directory instead.
  const packageJson = await import(isTestCommand() ? '../package.json' : '../../package.json');
  const codaPacksSDKVersion = packageJson.version as string;

  try {
    await validatePackVersionMetadata(metadata, codaPacksSDKVersion);
  } catch (e: any) {
    const packMetadataValidationError = e as PackMetadataValidationError;
    const validationErrors = packMetadataValidationError.validationErrors?.map(makeErrorMessage).join('\n');
    printAndExit(`${e.message}: \n${validationErrors}`);
  }

  if (!checkDeprecationWarnings) {
    return;
  }

  try {
    await validatePackVersionMetadata(metadata, codaPacksSDKVersion, {warningMode: true});
  } catch (e: any) {
    const packMetadataValidationError = e as PackMetadataValidationError;
    const deprecationWarnings = packMetadataValidationError.validationErrors?.map(makeWarningMessage).join('\n');
    printAndExit(`Your Pack is using deprecated properties or features: \n${deprecationWarnings}`, 0);
  }
}

function makeErrorMessage({path, message}: ValidationError): string {
  if (path) {
    return `Error in field at path "${path}": ${message}`;
  }
  return message;
}

function makeWarningMessage({path, message}: ValidationError): string {
  if (path) {
    return `Warning in field at path "${path}": ${message} This will become an error in a future SDK version.`;
  }
  return message;
}
