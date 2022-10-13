import { build } from './build';
import { importManifest } from './helpers';
import { makeManifestFullPath } from './helpers';
import { setupAuthFromModule } from '../testing/auth';
export async function handleAuth({ manifestPath, oauthServerPort, extraOAuthScopes }) {
    const fullManifestPath = makeManifestFullPath(manifestPath);
    const bundleFilename = await build(fullManifestPath);
    const manifest = await importManifest(bundleFilename);
    await setupAuthFromModule(fullManifestPath, manifest, { oauthServerPort, extraOAuthScopes });
}
