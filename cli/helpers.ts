import {Client} from '../helpers/external-api/coda';
import path from 'path';
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

export function makeManifestFullPath(manifestPath: string): string {
  return manifestPath.startsWith('/') ? manifestPath : path.join(process.cwd(), manifestPath);
}

export function isTypescript(path: string): boolean {
  return path.toLowerCase().endsWith('.ts');
}

export function escapeShellArg(arg: string): string {
  return `"${arg.replace(/(["'$`\\])/g, '\\$1')}"`;
}

export function spawnBootstrapCommand(command: string) {
  let cmd = command;
  // Hack to allow us to run this CLI tool for testing purposes from within this repo, without
  // needing it installed as an npm package.
  if (isTestCommand()) {
    cmd = command.replace('coda-packs-sdk/dist', process.env.PWD!);
  }
  spawnProcess(cmd);
}
