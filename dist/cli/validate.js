import { compilePackBundle } from '../testing/compile';
import { compilePackMetadata } from '../helpers/metadata';
import { importManifest } from './helpers';
import { isTestCommand } from './helpers';
import { makeManifestFullPath } from './helpers';
import { printAndExit } from '../testing/helpers';
import { validatePackVersionMetadata } from '../testing/upload_validation';
export async function handleValidate({ manifestFile, checkDeprecationWarnings }) {
    const fullManifestPath = makeManifestFullPath(manifestFile);
    const { bundlePath } = await compilePackBundle({ manifestPath: fullManifestPath, minify: false });
    const manifest = await importManifest(bundlePath);
    // Since it's okay to not specify a version, we inject one if it's not provided.
    if (!manifest.version) {
        manifest.version = '1';
    }
    const metadata = compilePackMetadata(manifest);
    return validateMetadata(metadata, { checkDeprecationWarnings });
}
export async function validateMetadata(metadata, { checkDeprecationWarnings = true } = {}) {
    var _a, _b;
    // Since package.json isn't in dist, we grab it from the root directory instead.
    const packageJson = await import(isTestCommand() ? '../package.json' : '../../package.json');
    const codaPacksSDKVersion = packageJson.version;
    try {
        await validatePackVersionMetadata(metadata, codaPacksSDKVersion);
    }
    catch (e) {
        const packMetadataValidationError = e;
        const validationErrors = (_a = packMetadataValidationError.validationErrors) === null || _a === void 0 ? void 0 : _a.map(makeErrorMessage).join('\n');
        printAndExit(`${e.message}: \n${validationErrors}`);
    }
    if (!checkDeprecationWarnings) {
        return;
    }
    try {
        await validatePackVersionMetadata(metadata, codaPacksSDKVersion, { warningMode: true });
    }
    catch (e) {
        const packMetadataValidationError = e;
        const deprecationWarnings = (_b = packMetadataValidationError.validationErrors) === null || _b === void 0 ? void 0 : _b.map(makeWarningMessage).join('\n');
        printAndExit(`Your Pack is using deprecated properties or features: \n${deprecationWarnings}`, 0);
    }
}
function makeErrorMessage({ path, message }) {
    if (path) {
        return `Error in field at path "${path}": ${message}`;
    }
    return message;
}
function makeWarningMessage({ path, message }) {
    if (path) {
        return `Warning in field at path "${path}": ${message} This will become an error in a future SDK version.`;
    }
    return message;
}
