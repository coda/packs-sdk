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
exports.processVmError = exports.getExpirationDate = exports.writeJSONFile = exports.readJSONFile = exports.readFile = exports.promptForInput = exports.printAndExit = exports.printError = exports.printWarn = exports.print = exports.getManifestFromModule = void 0;
const ensure_1 = require("../helpers/ensure");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readlineSync = __importStar(require("readline-sync"));
const source_map_1 = require("../runtime/common/source_map");
const marshaling_1 = require("../runtime/common/marshaling");
const marshaling_2 = require("../runtime/common/marshaling");
const yn_1 = __importDefault(require("yn"));
function getManifestFromModule(module) {
    if (!module.manifest && !module.pack) {
        printAndExit('Manifest file must export a variable called "manifest" that refers to a PackDefinition.');
    }
    return module.pack || module.manifest;
}
exports.getManifestFromModule = getManifestFromModule;
// eslint-disable-next-line no-console
exports.print = console.log;
// eslint-disable-next-line no-console
exports.printWarn = console.warn;
// eslint-disable-next-line no-console
exports.printError = console.error;
function printAndExit(msg, exitCode = 1) {
    (0, exports.print)(msg);
    return process.exit(exitCode);
}
exports.printAndExit = printAndExit;
function promptForInput(prompt, { mask, options, yesOrNo } = {}) {
    while (true) {
        const answer = readlineSync.question(prompt, { mask: mask ? '*' : undefined, hideEchoBack: mask });
        if (yesOrNo) {
            if (answer === '') {
                return 'no';
            }
            const response = (0, yn_1.default)(answer, { default: undefined });
            if (response === undefined) {
                continue;
            }
            return (0, yn_1.default)(answer) ? 'yes' : 'no';
        }
        else if (!options || options.includes(answer)) {
            return answer;
        }
    }
}
exports.promptForInput = promptForInput;
function readFile(fileName) {
    (0, ensure_1.ensureNonEmptyString)(fileName);
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
    return file;
}
exports.readFile = readFile;
function readJSONFile(fileName) {
    const file = readFile(fileName);
    return file ? JSON.parse(file.toString()) : undefined;
}
exports.readJSONFile = readJSONFile;
function writeJSONFile(fileName, payload, mode) {
    (0, ensure_1.ensureNonEmptyString)(fileName);
    const dirname = path_1.default.dirname(fileName);
    if (!fs_1.default.existsSync(dirname)) {
        fs_1.default.mkdirSync(dirname, { recursive: true });
    }
    if (mode && fs_1.default.existsSync(fileName)) {
        // If the file already existed, make sure we update the mode before writing anything
        // sensitive to it.
        fs_1.default.chmodSync(fileName, mode);
    }
    fs_1.default.writeFileSync(fileName, JSON.stringify(payload, undefined, 2), { mode });
}
exports.writeJSONFile = writeJSONFile;
function getExpirationDate(expiresInSeconds) {
    // OAuth standard says expiresIn units should be seconds.
    return new Date(Date.now() + expiresInSeconds * 1000);
}
exports.getExpirationDate = getExpirationDate;
async function processVmError(vmError, bundlePath) {
    // this is weird. the error thrown by ivm seems a standard error but somehow its stack can't be overwritten.
    // unwrapError(wrapError(err)) will recreate the same type of error in a standard way, where the stack can
    // be overwritten.
    const err = (0, marshaling_1.unwrapError)((0, marshaling_2.wrapErrorForSameOrHigherNodeVersion)(vmError));
    const translatedStacktrace = await (0, source_map_1.translateErrorStackFromVM)({
        stacktrace: err.stack,
        bundleSourceMapPath: bundlePath + '.map',
        vmFilename: bundlePath,
    });
    const messageSuffix = err.message ? `: ${err.message}` : '';
    err.stack = `${err.constructor.name}${messageSuffix}\n${translatedStacktrace}`;
    return err;
}
exports.processVmError = processVmError;
