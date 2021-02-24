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
exports.writeFile = exports.readFile = exports.promptForInput = exports.printAndExit = exports.print = exports.getManifestFromModule = void 0;
const ensure_1 = require("../helpers/ensure");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readlineSync = __importStar(require("readline-sync"));
function getManifestFromModule(module) {
    if (!module.manifest) {
        printAndExit('Manifest file must export a variable called "manifest" that refers to a PackDefinition.');
    }
    return module.manifest;
}
exports.getManifestFromModule = getManifestFromModule;
// eslint-disable-next-line no-console
exports.print = console.log;
function printAndExit(msg, exitCode = 1) {
    exports.print(msg);
    return process.exit(exitCode);
}
exports.printAndExit = printAndExit;
function promptForInput(prompt, { mask } = {}) {
    return readlineSync.question(prompt, { mask: mask ? '*' : undefined, hideEchoBack: mask });
}
exports.promptForInput = promptForInput;
function readFile(fileName) {
    ensure_1.ensureNonEmptyString(fileName);
    let file;
    try {
        file = fs_1.default.readFileSync(fileName);
    }
    catch (err) {
        if (err.message && err.message.includes('no such file or directory')) {
            return;
        }
        throw err;
    }
    return JSON.parse(file.toString());
}
exports.readFile = readFile;
function writeFile(fileName, payload) {
    ensure_1.ensureNonEmptyString(fileName);
    const dirname = path_1.default.dirname(fileName);
    if (!fs_1.default.existsSync(dirname)) {
        fs_1.default.mkdirSync(dirname);
    }
    const fileExisted = fs_1.default.existsSync(fileName);
    fs_1.default.writeFileSync(fileName, JSON.stringify(payload, undefined, 2));
    if (!fileExisted) {
        // When we create the file, make sure only the owner can read it, because it contains sensitive credentials.
        fs_1.default.chmodSync(fileName, 0o600);
    }
}
exports.writeFile = writeFile;
