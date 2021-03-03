import type {Arguments} from 'yargs';
import {isTypescript} from './helpers';
import {makeManifestFullPath} from './helpers';
import {setupAuthFromModule} from '../testing/auth';
import {spawnBootstrapCommand} from './helpers';

interface AuthArgs {
  manifestPath: string;
  credentialsFile?: string;
  oauthServerPort?: number;
}

const AUTH_BOOTSTRAP_CODE = `
import {setupAuthFromModule} from 'coda-packs-sdk/dist/testing/auth';

async function main() {
  const manifestPath = process.argv[1];
  const credentialsFile = process.argv[2] || undefined;
  const oauthServerPort = process.argv[3] ? parseInt(process.argv[3]) : undefined;
  const module = await import(manifestPath);
  await setupAuthFromModule(module, {credentialsFile, oauthServerPort});
}

void main();`;

export async function handleAuth({manifestPath, credentialsFile, oauthServerPort}: Arguments<AuthArgs>) {
  const fullManifestPath = makeManifestFullPath(manifestPath);
  if (isTypescript(manifestPath)) {
    const tsCommand = `ts-node -e "${AUTH_BOOTSTRAP_CODE}" ${fullManifestPath} ${credentialsFile || '""'} ${
      oauthServerPort || '""'
    }`;
    spawnBootstrapCommand(tsCommand);
  } else {
    const module = await import(fullManifestPath);
    await setupAuthFromModule(module, {credentialsFile, oauthServerPort});
  }
}
