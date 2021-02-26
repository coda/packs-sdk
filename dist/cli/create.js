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
const coda_1 = require("../helpers/external-api/coda");
const helpers_1 = require("../testing/helpers");
const auth_1 = require("../testing/auth");
const helpers_2 = require("../testing/helpers");
const helpers_3 = require("../testing/helpers");
const PACK_IDS_FILE = '.coda-packs.json';
function handleCreate({ packName }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield createPack(packName);
    });
}
exports.handleCreate = handleCreate;
function createPack(packName) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // TODO(alan): we probably want to redirect them to the `coda register`
        // flow if they don't have a Coda API token.
        const credentials = auth_1.readCredentialsFile();
        if (!((_a = credentials === null || credentials === void 0 ? void 0 : credentials.__coda__) === null || _a === void 0 ? void 0 : _a.apiKey)) {
            helpers_1.printAndExit('Missing API key. Please run `coda register <apiKey>` to register one.');
        }
        const codaClient = new coda_1.Client(`https://dev.coda.io:8080`, credentials.__coda__.apiKey);
        let packId;
        try {
            const response = yield codaClient.createPack();
            packId = response.packId;
        }
        catch (err) {
            // TODO(alan): pressure test with errors
            const error = JSON.parse(err.error);
            helpers_1.printAndExit(`Unable to create your pack, received error message ${error.message} (status code ${err.statusCode})`);
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
    return helpers_2.readJSONFile(PACK_IDS_FILE);
}
exports.readPacksFile = readPacksFile;
function writePacksFile(allPacks) {
    helpers_3.writeJSONFile(PACK_IDS_FILE, allPacks);
}
