import type {ArgumentsCamelCase} from 'yargs';
import {build} from './build';
import {importManifest} from './helpers';
import {makeManifestFullPath} from './helpers';
import {setupAuthFromModule} from '../testing/auth';

interface AuthArgs {
  manifestPath: string;
  oauthServerPort?: number;
  extraOAuthScopes?: string;
}

export async function handleAuth({manifestPath, oauthServerPort, extraOAuthScopes}: ArgumentsCamelCase<AuthArgs>) {
  const fullManifestPath = makeManifestFullPath(manifestPath);
  const bundleFilename = await build(fullManifestPath);
  const manifest = await importManifest(bundleFilename);
  await setupAuthFromModule(fullManifestPath, manifest, {oauthServerPort, extraOAuthScopes});
}
