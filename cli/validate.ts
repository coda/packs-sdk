import type {Arguments} from 'yargs';
import type {PackDefinition} from '../types';
import type {PackMetadataValidationError} from '../testing/upload_validation';
import {printAndExit} from '../testing/helpers';
import {validatePackMetadata} from '../testing/upload_validation';

interface ValidateArgs {
  manifestFile: string;
}

export async function handleValidate({manifestFile}: Arguments<ValidateArgs>) {
  const {manifest} = await import(manifestFile);
  return validateMetadata(manifest);
}

export async function validateMetadata(manifest: PackDefinition) {
  try {
    await validatePackMetadata(manifest);
  } catch (e: any) {
    const packMetadataValidationError = e as PackMetadataValidationError;
    const validationErrors = packMetadataValidationError.validationErrors?.map(error => error.message).join('\n');
    printAndExit(`${e.message}: \n${validationErrors}`);
  }
}
