import {Client} from '../helpers/external-api/coda';
import {readCredentialsFile} from '../testing/auth';
import {spawnSync} from 'child_process';

export function spawnProcess(command: string) {
  return spawnSync(command, {
    shell: true,
    stdio: 'inherit',
  });
}

export function getApiKey() {
  const credentials = readCredentialsFile();
  return credentials?.__coda__?.apiKey;
}

export function createCodaClient(apiKey: string, protocolAndHost?: string) {
  return new Client(protocolAndHost ?? 'https://coda.io', apiKey);
}

export function formatEndpoint(endpoint: string) {
  return endpoint.startsWith('https://') ? endpoint : `https://${endpoint}`;
}

export function isTestCommand() {
  return process.argv[1]?.endsWith('coda.ts');
}
