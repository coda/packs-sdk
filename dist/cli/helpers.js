"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertPackIdOrUrl = exports.assertPackId = exports.assertApiToken = exports.importManifest = exports.getPackAuth = exports.makeManifestFullPath = exports.isTestCommand = exports.formatEndpoint = exports.createCodaClient = exports.spawnProcess = void 0;
const coda_1 = require("../helpers/external-api/coda");
const config_storage_1 = require("./config_storage");
const config_storage_2 = require("./config_storage");
const link_1 = require("./link");
const path_1 = __importDefault(require("path"));
const helpers_1 = require("../testing/helpers");
const helpers_2 = require("../testing/helpers");
const child_process_1 = require("child_process");
function spawnProcess(command, { stdio = 'inherit' } = {}) {
    return (0, child_process_1.spawnSync)(command, {
        shell: true,
        stdio,
    });
}
exports.spawnProcess = spawnProcess;
function createCodaClient(apiToken, protocolAndHost) {
    return new coda_1.Client({ protocolAndHost, apiToken });
}
exports.createCodaClient = createCodaClient;
function formatEndpoint(endpoint) {
    return endpoint.startsWith('https://') ? endpoint : `https://${endpoint}`;
}
exports.formatEndpoint = formatEndpoint;
function isTestCommand() {
    var _a;
    return (_a = process.argv[1]) === null || _a === void 0 ? void 0 : _a.endsWith('coda.ts');
}
exports.isTestCommand = isTestCommand;
function makeManifestFullPath(manifestPath) {
    return path_1.default.isAbsolute(manifestPath) ? manifestPath : path_1.default.join(process.cwd(), manifestPath);
}
exports.makeManifestFullPath = makeManifestFullPath;
// Packs today do not have both defaultAuth and systemAuth specs, so this helper gets
// whichever is available, defaulting to defaultAuth. A smarter version could be supported
// in the future, for a use case like a Google Maps pack which allowed a default credential
// from the pack author to be used up to some rate limit, after which a power user would need
// to connect their own Maps API credential.
function getPackAuth(packDef) {
    const { defaultAuthentication, systemConnectionAuthentication } = packDef;
    if (defaultAuthentication && systemConnectionAuthentication) {
        (0, helpers_1.print)('Both defaultAuthentication & systemConnectionAuthentication are specified.');
        (0, helpers_1.print)('Using defaultAuthentication.');
        return defaultAuthentication;
    }
    // Since SystemAuthentication is a strict subset of Authentication, we can cast them together.
    return defaultAuthentication || systemConnectionAuthentication;
}
exports.getPackAuth = getPackAuth;
async function importManifest(bundleFilename) {
    const module = await Promise.resolve(`${path_1.default.resolve(bundleFilename)}`).then(s => __importStar(require(s)));
    return module.pack || module.manifest;
}
exports.importManifest = importManifest;
function assertApiToken(codaApiEndpoint, cliApiToken) {
    if (cliApiToken) {
        return cliApiToken;
    }
    const apiKey = (0, config_storage_1.getApiKey)(codaApiEndpoint);
    if (!apiKey) {
        return (0, helpers_2.printAndExit)('Missing API token. Please run `coda register` to register one.');
    }
    return apiKey;
}
exports.assertApiToken = assertApiToken;
function assertPackId(manifestDir, codaApiEndpoint) {
    const packId = (0, config_storage_2.getPackId)(manifestDir, codaApiEndpoint);
    if (!packId) {
        return (0, helpers_2.printAndExit)(`Could not find a Pack id in directory ${manifestDir}. You may need to run "coda create" first if this is a brand new pack.`);
    }
    return packId;
}
exports.assertPackId = assertPackId;
function assertPackIdOrUrl(packIdOrUrl) {
    const packId = (0, link_1.parsePackIdOrUrl)(packIdOrUrl);
    if (!packId) {
        return (0, helpers_2.printAndExit)(`Not a valid pack ID or URL: ${packIdOrUrl}`);
    }
    return packId;
}
exports.assertPackIdOrUrl = assertPackIdOrUrl;
