import type {PackDefinition} from '../types';
import {ensureNonEmptyString} from '../helpers/ensure';
import fs from 'fs';
import path from 'path';
import * as readlineSync from 'readline-sync';

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

export function promptForInput(prompt: string, {mask}: {mask?: boolean} = {}): string {
  return readlineSync.question(prompt, {mask: mask ? '*' : undefined, hideEchoBack: mask});
}

export function readFile(fileName: string): Buffer | undefined {
  ensureNonEmptyString(fileName);
  let file: Buffer;
  try {
    file = fs.readFileSync(fileName);
  } catch (err) {
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

export function writeJSONFile(fileName: string, payload: any): void {
  ensureNonEmptyString(fileName);
  const dirname = path.dirname(fileName);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, {recursive: true});
  }
  fs.writeFileSync(fileName, JSON.stringify(payload, undefined, 2));
}

export function getExpirationDate(expiresInSeconds: number): Date {
  // OAuth standard says expiresIn units should be seconds.
  return new Date(Date.now() + expiresInSeconds * 1000);
}
