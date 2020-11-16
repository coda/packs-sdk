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
exports.readCredentialsFile = exports.setupAuth = void 0;
const types_1 = require("../types");
const ensure_1 = require("../helpers/ensure");
const fs_1 = __importDefault(require("fs"));
const helpers_1 = require("./helpers");
const path_1 = __importDefault(require("path"));
const helpers_2 = require("./helpers");
const helpers_3 = require("./helpers");
const readline_1 = __importDefault(require("readline"));
const DEFAULT_CREDENTIALS_FILE = '.coda/credentials.json';
function setupAuth(module, opts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, defaultAuthentication } = helpers_1.getManifestFromModule(module);
        if (!defaultAuthentication) {
            return helpers_3.printAndExit(`The pack ${name} has no declared authentication. Provide a value for defaultAuthentication in the pack definition.`);
        }
        const handler = new CredentialHandler(name, opts);
        switch (defaultAuthentication.type) {
            case types_1.AuthenticationType.None:
                return helpers_3.printAndExit(`The pack ${name} declares AuthenticationType.None and so does not require authentication. ` +
                    `Please declare another AuthenticationType to use authentication with this pack.`);
            case types_1.AuthenticationType.CodaApiHeaderBearerToken:
            case types_1.AuthenticationType.CustomHeaderToken:
            case types_1.AuthenticationType.HeaderBearerToken:
                return handler.handleToken();
            case types_1.AuthenticationType.MultiQueryParamToken:
                return handler.handleMultiQueryParams(defaultAuthentication.params);
            case types_1.AuthenticationType.QueryParamToken:
                return handler.handleQueryParam(defaultAuthentication.paramName);
            case types_1.AuthenticationType.WebBasic:
                return handler.handleWebBasic();
            case types_1.AuthenticationType.AWSSignature4:
            case types_1.AuthenticationType.OAuth2:
                throw new Error('Not yet implemented');
            default:
                return ensure_1.ensureUnreachable(defaultAuthentication);
        }
    });
}
exports.setupAuth = setupAuth;
class CredentialHandler {
    constructor(packName, { credentialsFile = DEFAULT_CREDENTIALS_FILE }) {
        this.packName = packName;
        this.credentialsFile = credentialsFile;
    }
    checkForExistingCredential() {
        return __awaiter(this, void 0, void 0, function* () {
            const existingCredentials = readCredentialsFile(this.credentialsFile);
            if (existingCredentials && existingCredentials[this.packName]) {
                const input = yield this.promptForInput(`Credentials already exist for ${this.packName}, press "y" to overwrite or "n" to cancel: `);
                if (input.toLocaleLowerCase() !== 'y') {
                    return process.exit(1);
                }
            }
        });
    }
    handleToken() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkForExistingCredential();
            const input = yield this.promptForInput(`Paste the token or API key to use for ${this.packName}:\n`);
            this.storeCredential({ token: input });
            helpers_2.print('Credentials updated!');
        });
    }
    handleWebBasic() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkForExistingCredential();
            const username = yield this.promptForInput(`Enter the username for ${this.packName}:\n`);
            const password = yield this.promptForInput(`Enter the password for ${this.packName} (if any):\n`);
            this.storeCredential({ username, password });
            helpers_2.print('Credentials updated!');
        });
    }
    handleQueryParam(paramName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!paramName) {
                helpers_3.printAndExit(`Please provide a paramName attribute in the defaultAuthentication section of the ${this.packName} pack definition.`);
            }
            yield this.checkForExistingCredential();
            const input = yield this.promptForInput(`Enter the token to use for the "${paramName}" url param for ${this.packName}:\n`);
            this.storeCredential({ token: input });
            helpers_2.print('Credentials updated!');
        });
    }
    handleMultiQueryParams(paramDefs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (paramDefs.length === 0) {
                helpers_3.printAndExit(`Please define one or more entries for "params" in the defaultAuthentication section of the ${this.packName} pack definition.`);
            }
            yield this.checkForExistingCredential();
            const credentials = {};
            for (const paramDef of paramDefs) {
                const paramValue = yield this.promptForInput(`Enter the token to use for the "${paramDef.name}" url param for ${this.packName}:\n`);
                credentials[paramDef.name] = paramValue;
            }
            this.storeCredential(credentials);
            helpers_2.print('Credentials updated!');
        });
    }
    storeCredential(credentials) {
        storeCredential(this.credentialsFile, this.packName, credentials);
    }
    promptForInput(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            const rl = readlineInterface();
            return new Promise(resolve => rl.question(prompt, input => {
                rl.close();
                resolve(input);
            }));
        });
    }
}
function storeCredential(credentialsFile, packName, credentials) {
    const allCredentials = readCredentialsFile(credentialsFile) || {};
    allCredentials[packName] = credentials;
    writeCredentialsFile(credentialsFile, allCredentials);
}
function readCredentialsFile(credentialsFile = DEFAULT_CREDENTIALS_FILE) {
    let file;
    try {
        file = fs_1.default.readFileSync(credentialsFile);
    }
    catch (err) {
        if (err.message && err.message.includes('no such file or directory')) {
            return;
        }
        throw err;
    }
    return JSON.parse(file.toString());
}
exports.readCredentialsFile = readCredentialsFile;
function writeCredentialsFile(credentialsFile, allCredentials) {
    const dirname = path_1.default.dirname(credentialsFile);
    if (!fs_1.default.existsSync(dirname)) {
        fs_1.default.mkdirSync(dirname);
    }
    const fileExisted = fs_1.default.existsSync(credentialsFile);
    fs_1.default.writeFileSync(credentialsFile, JSON.stringify(allCredentials, undefined, 2));
    if (!fileExisted) {
        // When we create the file, make sure only the owner can read it, because it contains sensitive credentials.
        fs_1.default.chmodSync(credentialsFile, 0o600);
    }
}
function readlineInterface() {
    return readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });
}
