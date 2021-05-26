"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackAuth = exports.spawnBootstrapCommand = exports.escapeShellArg = exports.isTypescript = exports.makeManifestFullPath = exports.isTestCommand = exports.formatEndpoint = exports.createCodaClient = exports.spawnProcess = void 0;
const coda_1 = require("../helpers/external-api/coda");
const path_1 = __importDefault(require("path"));
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
function isTypescript(path) {
    return path.toLowerCase().endsWith('.ts');
}
exports.isTypescript = isTypescript;
function escapeShellArg(arg) {
    return `"${arg.replace(/(["'$`\\])/g, '\\$1')}"`;
}
exports.escapeShellArg = escapeShellArg;
function spawnBootstrapCommand(command) {
    let cmd = command;
    // Hack to allow us to run this CLI tool for testing purposes from within this repo, without
    // needing it installed as an npm package.
    if (isTestCommand()) {
        cmd = command.replace('coda-packs-sdk/dist', process.env.PWD);
    }
    spawnProcess(cmd);
}
exports.spawnBootstrapCommand = spawnBootstrapCommand;
// Packs should not have both defaultAuth and systemAuth specs, so this helper just gets
// whichever is available.
// TODO: Reviewers, is this correct? Is this enforced anywhere?
function getPackAuth(packDef) {
    const { defaultAuthentication, systemConnectionAuthentication } = packDef;
    // Since SystemAuthentication is a strict subset of Authentication, we can cast them together.
    return defaultAuthentication || systemConnectionAuthentication;
}
exports.getPackAuth = getPackAuth;
