"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readPacksFile = exports.storePack = exports.createPack = exports.handleCreate = void 0;
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const helpers_3 = require("./helpers");
const helpers_4 = require("../testing/helpers");
const helpers_5 = require("../testing/helpers");
const helpers_6 = require("../testing/helpers");
const PACK_IDS_FILE = '.coda-packs.json';
function handleCreate({ packName, codaApiEndpoint }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield createPack(packName, codaApiEndpoint);
    });
}
exports.handleCreate = handleCreate;
function createPack(packName, codaApiEndpoint) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const response = yield codaClient.createPack();
            packId = response.packId;
        }
        catch (err) {
            // TODO(alan): pressure test with errors
            const error = JSON.parse(err.error);
            helpers_4.printAndExit(`Unable to create your pack, received error message ${error.message} (status code ${err.statusCode})`);
        }
        storePack(packName, packId);
    });
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
