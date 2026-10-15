import {TimerShimStrategy} from '../testing/compile';
import * as path from 'path';
import {readJSONFile} from '../testing/helpers';
import urlParse from 'url-parse';
import {writeJSONFile} from '../testing/helpers';

export const DEFAULT_API_ENDPOINT = 'https://coda.io';
export const DEFAULT_TIMER_STRATEGY = TimerShimStrategy.None;
export const DEFAULT_GIT_TAG = false;

const API_KEY_FILE_NAME = '.coda.json';
export const PACK_ID_FILE_NAME = '.coda-pack.json';
export const AGENT_INSTALL_FILE_NAME = '.coda-agent.json';

export interface ApiKeyFile {
  apiKey: string;
  // Codan-only overrides for storing API keys for other environments.
  environmentApiKeys?: {[host: string]: string};
}

export enum PackOptionKey {
  timerStrategy = 'timerStrategy',
  gitTag = 'gitTag',
  apiEndpoint = 'apiEndpoint',
}

/** @deprecated Keys kept only for reading legacy config files. */
export enum DeprecatedPackOptionKey {
  /** @deprecated Use {@link PackOptionKey.gitTag} instead. */
  enableGitTags = 'enableGitTags',
}

export interface PackOptions {
  [PackOptionKey.timerStrategy]?: TimerShimStrategy;
  [PackOptionKey.gitTag]?: boolean;
  [PackOptionKey.apiEndpoint]?: string;
  /** @deprecated Kept for reading legacy config files. */
  [DeprecatedPackOptionKey.enableGitTags]?: boolean;
}

export interface PackIdFile {
  packId: number;
  options?: PackOptions;
  // Codan-only overrides for storing pack ids for other environments.
  environmentPackIds?: {[host: string]: number};
}

export interface StoredAgentInstall {
  packId: number;
  agentInstanceId: string;
  tenantId?: string;
}

interface AgentInstallFile {
  agentInstall?: StoredAgentInstall;
  // Codan-only overrides for storing installs against other environments.
  environmentAgentInstalls?: {[host: string]: StoredAgentInstall};
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

export function storeAgentInstall(manifestDir: string, codaApiEndpoint: string, install: StoredAgentInstall): void {
  const fileContents: AgentInstallFile = readAgentInstallFile(manifestDir) || {};
  if (isDefaultApiEndpoint(codaApiEndpoint)) {
    fileContents.agentInstall = install;
  } else {
    const {host} = urlParse(codaApiEndpoint);
    fileContents.environmentAgentInstalls = fileContents.environmentAgentInstalls || {};
    fileContents.environmentAgentInstalls[host] = install;
  }
  writeAgentInstallFile(manifestDir, fileContents);
}

// Returns the install only when it belongs to the pack id stored for this directory
// and endpoint. A later `create` in the same directory must not reuse a stale instance.
export function getAgentInstall(manifestDir: string, codaApiEndpoint: string): StoredAgentInstall | undefined {
  const fileContents = readAgentInstallFile(manifestDir);
  if (!fileContents) {
    return;
  }
  const install = isDefaultApiEndpoint(codaApiEndpoint)
    ? fileContents.agentInstall
    : fileContents.environmentAgentInstalls?.[urlParse(codaApiEndpoint).host];
  if (!install?.agentInstanceId) {
    return;
  }
  if (getPackId(manifestDir, codaApiEndpoint) !== install.packId) {
    return;
  }
  return install;
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

function readAgentInstallFile(manifestDir: string): AgentInstallFile | undefined {
  return readJSONFile(path.join(manifestDir, AGENT_INSTALL_FILE_NAME));
}

function writeAgentInstallFile(manifestDir: string, fileContents: AgentInstallFile): void {
  writeJSONFile(path.join(manifestDir, AGENT_INSTALL_FILE_NAME), fileContents);
}
