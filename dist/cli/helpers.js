"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.importManifest = exports.getPackAuth = exports.makeManifestFullPath = exports.isTestCommand = exports.formatEndpoint = exports.createCodaClient = exports.spawnProcess = void 0;
const coda_1 = require("../helpers/external-api/coda");
const path_1 = __importDefault(require("path"));
const helpers_1 = require("../testing/helpers");
const child_process_1 = require("child_process");
function spawnProcess(command) {
    return child_process_1.spawnSync(command, {
        shell: true,
        stdio: 'inherit',
    });
}
exports.spawnProcess = spawnProcess;
function createCodaClient(apiKey, protocolAndHost) {
    return new coda_1.Client(protocolAndHost !== null && protocolAndHost !== void 0 ? protocolAndHost : 'https://coda.io', apiKey);
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
    return manifestPath.startsWith('/') ? manifestPath : path_1.default.join(process.cwd(), manifestPath);
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
        helpers_1.print('Both defaultAuthentication & systemConnectionAuthentication are specified.');
        helpers_1.print('Using defaultAuthentication.');
        return defaultAuthentication;
    }
    // Since SystemAuthentication is a strict subset of Authentication, we can cast them together.
    return defaultAuthentication || systemConnectionAuthentication;
}
exports.getPackAuth = getPackAuth;
async function importManifest(bundleFilename) {
    const module = await Promise.resolve().then(() => __importStar(require(path_1.default.resolve(bundleFilename))));
    return module.pack || module.manifest;
}
exports.importManifest = importManifest;
