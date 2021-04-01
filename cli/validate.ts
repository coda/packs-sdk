import type {Arguments} from 'yargs';
// import type {PackMetadataValidationError} from '../testing/upload_validation';
// import {printAndExit} from '../testing/helpers';
// import {validatePackMetadata} from '../testing/upload_validation';

interface ValidateArgs {
  manifestFile: string;
}

export async function handleValidate({manifestFile}: Arguments<ValidateArgs>) {
  return validateMetadata(manifestFile);
}

export async function validateMetadata(_manifestFile: string) {
  // const {manifest} = await import(manifestFile);
  try {
    // await validatePackMetadata(manifest);
  } catch (e: any) {
    // const packMetadataValidationError = e as PackMetadataValidationError;
    // const validationErrors = packMetadataValidationError.validationErrors?.map(error => error.message).join('\n');
    // printAndExit(`${e.message}: \n${validationErrors}`);
  }
}
