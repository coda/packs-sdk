import type {Arguments} from 'yargs';
import {isTypescript} from './helpers';
import {makeManifestFullPath} from './helpers';
import {setupAuthFromModule} from '../testing/auth';
import {spawnBootstrapCommand} from './helpers';

interface AuthArgs {
  manifestPath: string;
  oauthServerPort?: number;
}

const AUTH_BOOTSTRAP_CODE = `
import {setupAuthFromModule} from 'coda-packs-sdk/dist/testing/auth';

async function main() {
  const manifestPath = process.argv[1];
  const oauthServerPort = process.argv[2] ? parseInt(process.argv[2]) : undefined;
  const module = await import(manifestPath);
  await setupAuthFromModule(manifestPath, module, {oauthServerPort});
}

void main();`;

export async function handleAuth({manifestPath, oauthServerPort}: Arguments<AuthArgs>) {
  const fullManifestPath = makeManifestFullPath(manifestPath);
  if (isTypescript(manifestPath)) {
    const tsCommand = `ts-node -e "${AUTH_BOOTSTRAP_CODE}" ${fullManifestPath} ${oauthServerPort || '""'}`;
    spawnBootstrapCommand(tsCommand);
  } else {
    const module = await import(fullManifestPath);
    await setupAuthFromModule(fullManifestPath, module, {oauthServerPort});
  }
}
