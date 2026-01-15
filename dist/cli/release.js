"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRelease = void 0;
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const build_1 = require("./build");
const helpers_3 = require("./helpers");
const git_helpers_1 = require("./git_helpers");
const helpers_4 = require("./helpers");
const errors_1 = require("./errors");
const errors_2 = require("./errors");
const git_helpers_2 = require("./git_helpers");
const git_helpers_3 = require("./git_helpers");
const helpers_5 = require("./helpers");
const coda_1 = require("../helpers/external-api/coda");
const path_1 = __importDefault(require("path"));
const helpers_6 = require("../testing/helpers");
const helpers_7 = require("../testing/helpers");
const helpers_8 = require("../testing/helpers");
const errors_3 = require("./errors");
async function handleRelease({ manifestFile, packVersion: explicitPackVersion, codaApiEndpoint, notes, apiToken, }) {
    const manifestDir = path_1.default.dirname(manifestFile);
    const formattedEndpoint = (0, helpers_4.formatEndpoint)(codaApiEndpoint);
    apiToken = (0, helpers_1.assertApiToken)(codaApiEndpoint, apiToken);
    const packId = (0, helpers_2.assertPackId)(manifestDir, codaApiEndpoint);
    const codaClient = (0, helpers_3.createCodaClient)(apiToken, formattedEndpoint);
    // Git state validation
    const gitState = (0, git_helpers_2.getGitState)(manifestDir);
    if (gitState.isGitRepo) {
        // Block release if there are uncommitted changes
        if (gitState.isDirty) {
            return (0, helpers_7.printAndExit)('Cannot release with uncommitted changes.\n' +
                'Please commit your changes first, then run the release command again.');
        }
        // Warn if not on main/master branch
        if (gitState.currentBranch && !['main', 'master'].includes(gitState.currentBranch)) {
            const shouldContinue = (0, helpers_8.promptForInput)(`Warning: You are releasing from branch '${gitState.currentBranch}', not 'main'.\n` + `Continue anyway? (y/N) `, { yesOrNo: true });
            if (shouldContinue !== 'yes') {
                return process.exit(1);
            }
        }
    }
    // Resolve pack version
    let packVersion = explicitPackVersion;
    if (!packVersion) {
        try {
            const bundleFilename = await (0, build_1.build)(manifestFile);
            const manifest = await (0, helpers_5.importManifest)(bundleFilename);
            if ('version' in manifest) {
                packVersion = manifest.version;
            }
        }
        catch (err) {
            return (0, helpers_7.printAndExit)(`Got an error while building your pack to get the current pack version: ${(0, errors_1.formatError)(err)}`);
        }
    }
    if (!packVersion) {
        const { items: versions } = await codaClient.listPackVersions(packId, { limit: 1 });
        if (!versions.length) {
            (0, helpers_7.printAndExit)('No version was found to release for your Pack.');
        }
        const [latestPackVersionData] = versions;
        const { packVersion: latestPackVersion } = latestPackVersionData;
        const shouldReleaseLatestPackVersion = (0, helpers_8.promptForInput)(`No version specified in your manifest. Do you want to release the latest version of the Pack (${latestPackVersion})? (y/N)\n`, { yesOrNo: true });
        if (shouldReleaseLatestPackVersion !== 'yes') {
            return process.exit(1);
        }
        packVersion = latestPackVersion;
    }
    // Create release via API
    const releaseResponse = await handleResponse(codaClient.createPackRelease(packId, {}, { packVersion, releaseNotes: notes }));
    (0, helpers_6.print)(`Pack version ${packVersion} released successfully (release #${releaseResponse.releaseId}).`);
    // Create git tag
    if (gitState.isGitRepo) {
        const gitTag = `pack/${packId}/v${packVersion}`;
        if ((0, git_helpers_3.gitTagExists)(gitTag, manifestDir)) {
            (0, helpers_6.print)(`Git tag ${gitTag} already exists, skipping.`);
        }
        else {
            const tagMessage = buildTagMessage(releaseResponse.releaseId, releaseResponse.releaseNotes);
            if ((0, git_helpers_1.createGitTag)(gitTag, tagMessage, manifestDir)) {
                (0, helpers_6.print)(`Created git tag: ${gitTag}`);
                (0, helpers_6.print)(`Run 'git push --tags' to push the tag to remote.`);
            }
            else {
                (0, helpers_6.print)(`Warning: Failed to create git tag ${gitTag}`);
            }
        }
    }
    return (0, helpers_7.printAndExit)('Done!', 0);
}
exports.handleRelease = handleRelease;
function buildTagMessage(releaseId, notes) {
    const parts = [`Release ID: ${releaseId}`];
    if (notes) {
        parts.push('', notes);
    }
    return parts.join('\n');
}
async function handleResponse(p) {
    try {
        return await p;
    }
    catch (err) {
        if ((0, coda_1.isResponseError)(err)) {
            return (0, helpers_7.printAndExit)(`Error while creating pack release: ${await (0, errors_2.formatResponseError)(err)}`);
        }
        const errors = [`Unexpected error while creating release: ${(0, errors_1.formatError)(err)}`, (0, errors_3.tryParseSystemError)(err)];
        return (0, helpers_7.printAndExit)(errors.join('\n'));
    }
}
