import type {Authentication} from '../types';
import {Client} from '../helpers/external-api/coda';
import type {PackVersionDefinition} from '../types';
import path from 'path';
import {spawnSync} from 'child_process';

export function spawnProcess(command: string) {
  return spawnSync(command, {
    shell: true,
    stdio: 'inherit',
  });
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

// Packs should not have both defaultAuth and systemAuth specs, so this helper just gets
// whichever is available.
// TODO: Reviewers, is this correct? Is this enforced anywhere?
export function getPackAuth(packDef: PackVersionDefinition): Authentication | undefined {
  const {defaultAuthentication, systemConnectionAuthentication} = packDef;
  // Since SystemAuthentication is a strict subset of Authentication, we can cast them together.
  return defaultAuthentication || (systemConnectionAuthentication as Authentication);
}
