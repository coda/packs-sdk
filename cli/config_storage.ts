import type {TimerShimStrategy} from '../testing/compile';
import * as path from 'path';
import {readJSONFile} from '../testing/helpers';
import urlParse from 'url-parse';
import {writeJSONFile} from '../testing/helpers';

export const DEFAULT_API_ENDPOINT = 'https://coda.io';

const API_KEY_FILE_NAME = '.coda.json';
export const PACK_ID_FILE_NAME = '.coda-pack.json';

export interface ApiKeyFile {
  apiKey: string;
  // Codan-only overrides for storing API keys for other environments.
  environmentApiKeys?: {[host: string]: string};
}

export enum PackOptionKey {
  timerStrategy = 'timerStrategy',
}

export interface PackOptions {
  [PackOptionKey.timerStrategy]?: TimerShimStrategy;
}

export interface PackIdFile {
  packId: number;
  options?: PackOptions;
  // Codan-only overrides for storing pack ids for other environments.
  environmentPackIds?: {[host: string]: number};
}

function isDefaultApiEndpoint(apiEndpoint: string): boolean {
  return apiEndpoint === DEFAULT_API_ENDPOINT;
}

export function getApiKey(codaApiEndpoint: string): string | undefined {
  // Traverse up from the current directory for a while to see if we can find an API key file.
  // Usually it will be in the current directory, but if the user has cd'ed deeper into their
  // project it may be higher up.
  for (let i = 0; i < 10; i++) {
    const filename = path.join(process.env.PWD || '.', `..${path.sep}`.repeat(i), API_KEY_FILE_NAME);
    const apiKeyFile = readApiKeyFile(filename);
    if (apiKeyFile) {
      if (isDefaultApiEndpoint(codaApiEndpoint)) {
        return apiKeyFile.apiKey;
      } else {
        const {host} = urlParse(codaApiEndpoint);
        return apiKeyFile.environmentApiKeys?.[host];
      }
    }
  }
  return process.env.CODA_PACKS_API_KEY;
}
export function storeCodaApiKey(apiKey: string, projectDir: string = '.', codaApiEndpoint: string) {
  const filename = path.join(projectDir, API_KEY_FILE_NAME);
  const apiKeyFile = readApiKeyFile(filename) || {apiKey: ''};
  if (isDefaultApiEndpoint(codaApiEndpoint)) {
    apiKeyFile.apiKey = apiKey;
  } else {
    apiKeyFile.environmentApiKeys = apiKeyFile.environmentApiKeys || {};
    const {host} = urlParse(codaApiEndpoint);
    apiKeyFile.environmentApiKeys[host] = apiKey;
  }
  writeApiKeyFile(filename, apiKeyFile);
}

function readApiKeyFile(filename: string): ApiKeyFile | undefined {
  return readJSONFile(filename);
}

function writeApiKeyFile(filename: string, fileContents: ApiKeyFile): void {
  writeJSONFile(filename, fileContents, 0o600);
}

export function storePackId(manifestDir: string, packId: number, codaApiEndpoint: string): void {
  const fileContents: PackIdFile = readPackIdFile(manifestDir) || {packId: -1};
  if (isDefaultApiEndpoint(codaApiEndpoint)) {
    fileContents.packId = packId;
  } else {
    const {host} = urlParse(codaApiEndpoint);
    fileContents.environmentPackIds = fileContents.environmentPackIds || {};
    fileContents.environmentPackIds[host] = packId;
  }
  writePacksFile(manifestDir, fileContents);
}

export function getPackId(manifestDir: string, codaApiEndpoint: string): number | undefined {
  const fileContents = readPackIdFile(manifestDir);
  if (!fileContents) {
    return;
  }
  if (isDefaultApiEndpoint(codaApiEndpoint)) {
    return fileContents.packId;
  } else {
    const {host} = urlParse(codaApiEndpoint);
    return fileContents.environmentPackIds?.[host];
  }
}

// Merges new options with existing ones, if any.
export function storePackOptions(manifestDir: string, options: PackOptions): void {
  const fileContents: PackIdFile = readPackIdFile(manifestDir) || {packId: -1};
  fileContents.options = {...fileContents.options, ...options};
  writePacksFile(manifestDir, fileContents);
}

export function getPackOptions(manifestDir: string): PackOptions | undefined {
  const fileContents = readPackIdFile(manifestDir);
  return fileContents?.options;
}

function readPackIdFile(manifestDir: string): PackIdFile | undefined {
  const filename = path.join(manifestDir, PACK_ID_FILE_NAME);
  return readJSONFile(filename);
}

function writePacksFile(manifestDir: string, fileContents: PackIdFile): void {
  const filename = path.join(manifestDir, PACK_ID_FILE_NAME);
  writeJSONFile(filename, fileContents);
}
