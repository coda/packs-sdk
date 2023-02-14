import type {Authentication} from '../types';
import type {BasicPackDefinition} from '../types';
import {Client} from '../helpers/external-api/coda';
import type {SpawnSyncOptionsWithBufferEncoding} from 'child_process';
import {getApiKey} from './config_storage';
import {getPackId} from './config_storage';
import {parsePackIdOrUrl} from './link';
import path from 'path';
import {print} from '../testing/helpers';
import {printAndExit} from '../testing/helpers';
import {spawnSync} from 'child_process';

export function spawnProcess(command: string, {stdio = 'inherit'}: SpawnSyncOptionsWithBufferEncoding = {}) {
  return spawnSync(command, {
    shell: true,
    stdio,
  });
}

export function createCodaClient(apiToken: string, protocolAndHost?: string) {
  return new Client({protocolAndHost, apiToken});
}

export function formatEndpoint(endpoint: string) {
  return endpoint.startsWith('https://') ? endpoint : `https://${endpoint}`;
}

export function isTestCommand() {
  return process.argv[1]?.endsWith('coda.ts');
}

export function makeManifestFullPath(manifestPath: string): string {
  return path.isAbsolute(manifestPath) ? manifestPath : path.join(process.cwd(), manifestPath);
}

// Packs today do not have both defaultAuth and systemAuth specs, so this helper gets
// whichever is available, defaulting to defaultAuth. A smarter version could be supported
// in the future, for a use case like a Google Maps pack which allowed a default credential
// from the pack author to be used up to some rate limit, after which a power user would need
// to connect their own Maps API credential.
export function getPackAuth(packDef: BasicPackDefinition): Authentication | undefined {
  const {defaultAuthentication, systemConnectionAuthentication} = packDef;
  if (defaultAuthentication && systemConnectionAuthentication) {
    print('Both defaultAuthentication & systemConnectionAuthentication are specified.');
    print('Using defaultAuthentication.');
    return defaultAuthentication;
  }
  // Since SystemAuthentication is a strict subset of Authentication, we can cast them together.
  return defaultAuthentication || (systemConnectionAuthentication as Authentication);
}

export async function importManifest<T extends BasicPackDefinition = BasicPackDefinition>(
  bundleFilename: string,
): Promise<T> {
  const module = await import(path.resolve(bundleFilename));
  return module.pack || module.manifest;
}

export function assertApiToken(codaApiEndpoint: string, cliApiToken?: string): string {
  if (cliApiToken) {
    return cliApiToken;
  }
  const apiKey = getApiKey(codaApiEndpoint);
  if (!apiKey) {
    return printAndExit('Missing API token. Please run `coda register` to register one.');
  }
  return apiKey;
}

export function assertPackId(manifestDir: string, codaApiEndpoint: string): number {
  const packId = getPackId(manifestDir, codaApiEndpoint);
  if (!packId) {
    return printAndExit(
      `Could not find a Pack id in directory ${manifestDir}. You may need to run "coda create" first if this is a brand new pack.`,
    );
  }
  return packId;
}

export function assertPackIdOrUrl(packIdOrUrl: string): number {
  const packId = parsePackIdOrUrl(packIdOrUrl);
  if (!packId) {
    return printAndExit(`Not a valid pack ID or URL: ${packIdOrUrl}`);
  }
  return packId;
}
