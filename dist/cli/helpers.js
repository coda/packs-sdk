import { Client } from '../helpers/external-api/coda';
import path from 'path';
import { print } from '../testing/helpers';
import { spawnSync } from 'child_process';
export function spawnProcess(command, { stdio = 'inherit' } = {}) {
    return spawnSync(command, {
        shell: true,
        stdio,
    });
}
export function createCodaClient(apiToken, protocolAndHost) {
    return new Client({ protocolAndHost, apiToken });
}
export function formatEndpoint(endpoint) {
    return endpoint.startsWith('https://') ? endpoint : `https://${endpoint}`;
}
export function isTestCommand() {
    var _a;
    return (_a = process.argv[1]) === null || _a === void 0 ? void 0 : _a.endsWith('coda.ts');
}
export function makeManifestFullPath(manifestPath) {
    return path.isAbsolute(manifestPath) ? manifestPath : path.join(process.cwd(), manifestPath);
}
// Packs today do not have both defaultAuth and systemAuth specs, so this helper gets
// whichever is available, defaulting to defaultAuth. A smarter version could be supported
// in the future, for a use case like a Google Maps pack which allowed a default credential
// from the pack author to be used up to some rate limit, after which a power user would need
// to connect their own Maps API credential.
export function getPackAuth(packDef) {
    const { defaultAuthentication, systemConnectionAuthentication } = packDef;
    if (defaultAuthentication && systemConnectionAuthentication) {
        print('Both defaultAuthentication & systemConnectionAuthentication are specified.');
        print('Using defaultAuthentication.');
        return defaultAuthentication;
    }
    // Since SystemAuthentication is a strict subset of Authentication, we can cast them together.
    return defaultAuthentication || systemConnectionAuthentication;
}
export async function importManifest(bundleFilename) {
    const module = await import(path.resolve(bundleFilename));
    return module.pack || module.manifest;
}
