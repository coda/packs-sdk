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

export function createCodaClient(apiKey: string, dev?: boolean) {
  return new Client(dev ? 'https://dev.coda.io:8080' : 'https://coda.io', apiKey);
}
