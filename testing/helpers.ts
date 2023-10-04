import type {PackVersionDefinition} from '../types';
import {ensureNonEmptyString} from '../helpers/ensure';
import fs from 'fs';
import path from 'path';
import * as readlineSync from 'readline-sync';
import {translateErrorStackFromVM} from '../runtime/common/source_map';
import {unwrapError} from '../runtime/common/marshaling';
import {wrapErrorForSameOrHigherNodeVersion} from '../runtime/common/marshaling';
import yn from 'yn';

export function getManifestFromModule(module: any): PackVersionDefinition {
  if (!module.manifest && !module.pack) {
    printAndExit('Manifest file must export a variable called "manifest" that refers to a PackDefinition.');
  }
  return module.pack || module.manifest;
}

// eslint-disable-next-line no-console
export const print = console.log;
// eslint-disable-next-line no-console
export const printWarn = console.warn;
// eslint-disable-next-line no-console
export const printError = console.error;

export function printAndExit(msg: string, exitCode: number = 1): never {
  print(msg);
  return process.exit(exitCode);
}

export function promptForInput(
  prompt: string,
  {mask, options, yesOrNo}: {mask?: boolean; options?: string[]; yesOrNo?: boolean} = {},
): string {
  while (true) {
    const answer = readlineSync.question(prompt, {mask: mask ? '*' : undefined, hideEchoBack: mask});
    if (yesOrNo) {
      if (answer === '') {
        return 'no';
      }
      const response = yn(answer, {default: undefined});
      if (response === undefined) {
        continue;
      }
      return yn(answer) ? 'yes' : 'no';
    } else if (!options || options.includes(answer)) {
      return answer;
    }
  }
}

export function readFile(fileName: string): Buffer | undefined {
  ensureNonEmptyString(fileName);
  let file: Buffer;
  try {
    file = fs.readFileSync(fileName);
  } catch (err: any) {
    if (err.message && err.message.includes('no such file or directory')) {
      return;
    }
    throw err;
  }
  return file;
}

export function readJSONFile(fileName: string): any | undefined {
  const file = readFile(fileName);
  return file ? JSON.parse(file.toString()) : undefined;
}

export function writeJSONFile(fileName: string, payload: any, mode?: fs.Mode): void {
  ensureNonEmptyString(fileName);
  const dirname = path.dirname(fileName);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, {recursive: true});
  }
  if (mode && fs.existsSync(fileName)) {
    // If the file already existed, make sure we update the mode before writing anything
    // sensitive to it.
    fs.chmodSync(fileName, mode);
  }
  fs.writeFileSync(fileName, JSON.stringify(payload, undefined, 2), {mode});
}

export function getExpirationDate(expiresInSeconds: number): Date {
  // OAuth standard says expiresIn units should be seconds.
  return new Date(Date.now() + expiresInSeconds * 1000);
}

export async function processVmError(vmError: Error, bundlePath: string): Promise<Error> {
  // this is weird. the error thrown by ivm seems a standard error but somehow its stack can't be overwritten.
  // unwrapError(wrapError(err)) will recreate the same type of error in a standard way, where the stack can
  // be overwritten.
  const err = unwrapError(wrapErrorForSameOrHigherNodeVersion(vmError));
  const translatedStacktrace = await translateErrorStackFromVM({
    stacktrace: err.stack,
    bundleSourceMapPath: bundlePath + '.map',
    vmFilename: bundlePath,
  });
  const messageSuffix = err.message ? `: ${err.message}` : '';
  err.stack = `${err.constructor.name}${messageSuffix}\n${translatedStacktrace}`;
  return err;
}
