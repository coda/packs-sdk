"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readPacksFile = exports.storePack = exports.createPack = exports.handleCreate = void 0;
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const errors_1 = require("./errors");
const auth_1 = require("../testing/auth");
const errors_2 = require("./errors");
const helpers_3 = require("../testing/helpers");
const helpers_4 = require("../testing/helpers");
const helpers_5 = require("../testing/helpers");
const PACK_IDS_FILE = '.coda-packs.json';
async function handleCreate({ packName, codaApiEndpoint }) {
    await createPack(packName, codaApiEndpoint);
}
exports.handleCreate = handleCreate;
async function createPack(packName, codaApiEndpoint) {
    const formattedEndpoint = helpers_2.formatEndpoint(codaApiEndpoint);
    // TODO(alan): we probably want to redirect them to the `coda register`
    // flow if they don't have a Coda API token.
    const apiKey = auth_1.getApiKey(codaApiEndpoint);
    if (!apiKey) {
        helpers_3.printAndExit('Missing API key. Please run `coda register <apiKey>` to register one.');
    }
    const codaClient = helpers_1.createCodaClient(apiKey, formattedEndpoint);
    try {
        const response = await codaClient.createPack({}, {});
        if (errors_2.isCodaError(response)) {
            helpers_3.printAndExit(`Unable to create your pack, received error: ${errors_1.formatError(response)}`);
        }
        else {
            const packId = response.packId;
            storePack(packName, packId);
        }
    }
    catch (err) {
        helpers_3.printAndExit(`Unable to create your pack, received error: ${errors_1.formatError(err)}`);
    }
}
exports.createPack = createPack;
function storePack(packName, packId) {
    const allPacks = readPacksFile() || {};
    allPacks[packName] = packId;
    writePacksFile(allPacks);
}
exports.storePack = storePack;
function readPacksFile() {
    return helpers_4.readJSONFile(PACK_IDS_FILE);
}
exports.readPacksFile = readPacksFile;
function writePacksFile(allPacks) {
    helpers_5.writeJSONFile(PACK_IDS_FILE, allPacks);
}
