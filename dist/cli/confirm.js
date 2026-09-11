"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.missingFlagError = exports.confirmOrFail = exports.isInteractive = void 0;
const helpers_1 = require("../testing/helpers");
const helpers_2 = require("../testing/helpers");
function isInteractive() {
    return Boolean(process.stdin.isTTY);
}
exports.isInteractive = isInteractive;
function confirmOrFail({ yes, prompt, example, interactive = isInteractive(), }) {
    if (yes) {
        return;
    }
    if (interactive) {
        const answer = (0, helpers_2.promptForInput)(prompt, { yesOrNo: true });
        if (answer !== 'yes') {
            (0, helpers_1.printAndExit)('Aborted.');
        }
        return;
    }
    (0, helpers_1.printAndExit)(`${prompt.trim()}\nPass --yes to continue without a prompt.\n  ${example}`);
}
exports.confirmOrFail = confirmOrFail;
function missingFlagError(message, example, extra) {
    const lines = [`Error: ${message}`, `  ${example}`];
    if (extra) {
        lines.push(extra);
    }
    return (0, helpers_1.printAndExit)(lines.join('\n'));
}
exports.missingFlagError = missingFlagError;
