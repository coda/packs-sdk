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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readPacksFile = exports.storePack = exports.createPack = exports.handleCreate = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const auth_1 = require("testing/auth");
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const DEFAULT_PACKS_FILE = '.coda-packs.json';
function handleCreate({ packName }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield createPack(packName);
    });
}
exports.handleCreate = handleCreate;
function createPack(packName) {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO(alan): we probably want to redirect them to the `coda register`
        // flow if they don't have a Coda API token.
        const credentialsFile = auth_1.readCredentialsFile();
        const { packId } = (yield request_promise_native_1.default.get(`https://coda.io/apis/v1/packs`, {
            headers: { Authorization: `Bearer ${credentialsFile === null || credentialsFile === void 0 ? void 0 : credentialsFile.__coda__}` },
        })).json();
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
    let file;
    try {
        file = fs_1.default.readFileSync(DEFAULT_PACKS_FILE);
    }
    catch (err) {
        if (err.message && err.message.includes('no such file or directory')) {
            return;
        }
        throw err;
    }
    return JSON.parse(file.toString());
}
exports.readPacksFile = readPacksFile;
function writePacksFile(allPacks) {
    const dirname = path_1.default.dirname(DEFAULT_PACKS_FILE);
    if (!fs_1.default.existsSync(dirname)) {
        fs_1.default.mkdirSync(dirname);
    }
    const fileExisted = fs_1.default.existsSync(DEFAULT_PACKS_FILE);
    fs_1.default.writeFileSync(DEFAULT_PACKS_FILE, JSON.stringify(allPacks, undefined, 2));
    if (!fileExisted) {
        // When we create the file, make sure only the owner can read it, because it contains sensitive credentials.
        fs_1.default.chmodSync(DEFAULT_PACKS_FILE, 0o600);
    }
}
