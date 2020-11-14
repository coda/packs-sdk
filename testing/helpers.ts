import type {PackDefinition} from '../types';

export function getManifestFromModule(module: any): PackDefinition {
  if (!module.manifest) {
    printAndExit('Manifest file must export a variable called "manifest" that refers to a PackDefinition.');
  }
  return module.manifest;
}

// eslint-disable-next-line no-console
export const print = console.log;

export function printAndExit(msg: string, exitCode: number = 1): never {
  print(msg);
  return process.exit(exitCode);
}
