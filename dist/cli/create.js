"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readPacksFile = exports.storePack = exports.createPack = exports.handleCreate = void 0;
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const helpers_3 = require("./helpers");
const helpers_4 = require("../testing/helpers");
const helpers_5 = require("../testing/helpers");
const helpers_6 = require("../testing/helpers");
const PACK_IDS_FILE = '.coda-packs.json';
async function handleCreate({ packName, codaApiEndpoint }) {
    await createPack(packName, codaApiEndpoint);
}
exports.handleCreate = handleCreate;
async function createPack(packName, codaApiEndpoint) {
    const formattedEndpoint = helpers_2.formatEndpoint(codaApiEndpoint);
    // TODO(alan): we probably want to redirect them to the `coda register`
    // flow if they don't have a Coda API token.
    const apiKey = helpers_3.getApiKey();
    if (!apiKey) {
        helpers_4.printAndExit('Missing API key. Please run `coda register <apiKey>` to register one.');
    }
    const codaClient = helpers_1.createCodaClient(apiKey, formattedEndpoint);
    let packId;
    try {
        const response = await codaClient.createPack();
        packId = response.packId;
    }
    catch (err) {
        // TODO(alan): pressure test with errors
        const error = JSON.parse(err.error);
        helpers_4.printAndExit(`Unable to create your pack, received error message ${error.message} (status code ${err.statusCode})`);
    }
    storePack(packName, packId);
}
exports.createPack = createPack;
function storePack(packName, packId) {
    const allPacks = readPacksFile() || {};
    allPacks[packName] = packId;
    writePacksFile(allPacks);
}
exports.storePack = storePack;
function readPacksFile() {
    return helpers_5.readJSONFile(PACK_IDS_FILE);
}
exports.readPacksFile = readPacksFile;
function writePacksFile(allPacks) {
    helpers_6.writeJSONFile(PACK_IDS_FILE, allPacks);
}
