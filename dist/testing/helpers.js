"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printAndExit = exports.print = exports.getManifestFromModule = void 0;
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
