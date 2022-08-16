"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleClone = void 0;
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const fs_extra_1 = __importDefault(require("fs-extra"));
const config_storage_1 = require("./config_storage");
const init_1 = require("./init");
const coda_1 = require("../helpers/external-api/coda");
const link_1 = require("./link");
const path_1 = __importDefault(require("path"));
const helpers_3 = require("../testing/helpers");
const helpers_4 = require("../testing/helpers");
const helpers_5 = require("../testing/helpers");
const config_storage_2 = require("./config_storage");
async function handleClone({ packIdOrUrl, codaApiEndpoint }) {
    const manifestDir = process.cwd();
    const packId = (0, link_1.parsePackIdOrUrl)(packIdOrUrl);
    if (!packId) {
        return (0, helpers_4.printAndExit)(`Not a valid pack ID or URL: ${packIdOrUrl}`);
    }
    const formattedEndpoint = (0, helpers_2.formatEndpoint)(codaApiEndpoint);
    const apiKey = (0, config_storage_1.getApiKey)(codaApiEndpoint);
    if (!apiKey) {
        return (0, helpers_4.printAndExit)('Missing API token. Please run `coda register <apiKey>` to register one.');
    }
    const codeAlreadyExists = fs_extra_1.default.existsSync(path_1.default.join(manifestDir, 'pack.ts'));
    if (codeAlreadyExists) {
        const shouldOverwrite = (0, helpers_5.promptForInput)('A pack.ts file already exists. Do you want to overwrite it? (y/N)?', {
            yesOrNo: true,
        });
        if (shouldOverwrite.toLocaleLowerCase() !== 'yes') {
            return (0, helpers_4.printAndExit)('Aborting');
        }
    }
    const client = (0, helpers_1.createCodaClient)(apiKey, formattedEndpoint);
    let packVersion;
    try {
        packVersion = await getPackLatestVersion(client, packId);
        if (!packVersion) {
            return (0, helpers_4.printAndExit)(`No built versions found for pack ${packId}. Only built versions can be cloned.`);
        }
    }
    catch (err) {
        maybeHandleClientError(err);
        throw err;
    }
    let sourceCode;
    try {
        sourceCode = await getPackSource(client, packId, packVersion);
    }
    catch (err) {
        maybeHandleClientError(err);
        throw err;
    }
    if (!sourceCode) {
        (0, helpers_3.print)(`Unable to download source for Pack version ${packVersion}. Packs built using the CLI can't be cloned.`);
        const shouldInitializeWithoutDownload = (0, helpers_5.promptForInput)('Do you want to continue initializing with template starter code instead (y/N)?', { yesOrNo: true });
        if (shouldInitializeWithoutDownload !== 'yes') {
            return process.exit(1);
        }
        await (0, init_1.handleInit)();
        (0, config_storage_2.storePackId)(manifestDir, packId, codaApiEndpoint);
        return;
    }
    (0, helpers_3.print)(`Fetched source at version ${packVersion}`);
    await (0, init_1.handleInit)();
    (0, config_storage_2.storePackId)(manifestDir, packId, codaApiEndpoint);
    fs_extra_1.default.writeFileSync(path_1.default.join(manifestDir, 'pack.ts'), sourceCode);
    (0, helpers_4.printAndExit)("Successfully updated pack.ts with the Pack's code!", 0);
}
exports.handleClone = handleClone;
function maybeHandleClientError(err) {
    if ((0, coda_1.isResponseError)(err)) {
        switch (err.response.status) {
            case 401:
            case 403:
            case 404:
                return (0, helpers_4.printAndExit)("You don't have permission to edit this pack.");
        }
    }
}
async function getPackLatestVersion(client, packId) {
    const { items } = await client.listPackVersions(packId, { limit: 1 });
    if (!items || !items[0]) {
        return null;
    }
    return items[0].packVersion;
}
async function getPackSource(client, packId, version) {
    const { files } = await client.getPackSourceCode(packId, version);
    if (files.length !== 1 || !files[0].filename.endsWith('.ts')) {
        return null;
    }
    const onlyFile = files[0];
    // Fetch existing source code
    const response = await fetch(onlyFile.url, {
        headers: {
            'Content-Type': 'application/javascript',
            'User-Agent': 'Coda-Typescript-API-Client',
        },
    });
    if (response.status >= 400) {
        return (0, helpers_4.printAndExit)(`Error while fetching pack source code: ${response.statusText}`);
    }
    return response.text();
}
