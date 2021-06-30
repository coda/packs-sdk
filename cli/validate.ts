import type {Arguments} from 'yargs';
import type {PackMetadataValidationError} from '../testing/upload_validation';
import type {PackVersionMetadata} from '../compiled_types';
import type {ValidationError} from '../testing/types';
import { compilePackBundle } from '../testing/compile';
import {compilePackMetadata} from '../helpers/metadata';
import {importManifest} from './helpers';
import {makeManifestFullPath} from './helpers';
import {printAndExit} from '../testing/helpers';
import {validatePackVersionMetadata} from '../testing/upload_validation';

interface ValidateArgs {
  manifestFile: string;
}

export async function handleValidate({manifestFile}: Arguments<ValidateArgs>) {
  const fullManifestPath = makeManifestFullPath(manifestFile);
  const {bundlePath} = await compilePackBundle({manifestPath: fullManifestPath, minify: false});
  const manifest = await importManifest(bundlePath);
  const metadata = compilePackMetadata(manifest);
  return validateMetadata(metadata);
}

export async function validateMetadata(metadata: PackVersionMetadata) {
  try {
    await validatePackVersionMetadata(metadata);
  } catch (e: any) {
    const packMetadataValidationError = e as PackMetadataValidationError;
    const validationErrors = packMetadataValidationError.validationErrors?.map(makeErrorMessage).join('\n');
    printAndExit(`${e.message}: \n${validationErrors}`);
  }
}

function makeErrorMessage({path, message}: ValidationError): string {
  if (path) {
    return `Error in field at path "${path}": ${message}`;
  }
  return message;
}
