import {ensureExists} from '../helpers/ensure';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
let ivm: typeof import('isolated-vm') | null;
try {
  ivm = require('isolated-vm');
} catch (e: any) {
  ivm = null;
}

export function getIvm() {
  return ensureExists(ivm);
}

export function tryGetIvm() {
  return ivm;
}
