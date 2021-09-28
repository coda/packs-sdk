"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatError = exports.formatResponseError = exports.tryParseSystemError = void 0;
const util_1 = __importDefault(require("util"));
function tryParseSystemError(error) {
    // NB(alan): this should only be hit for Coda developers trying to use the CLI with their development server.
    if (error.errno === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
        return 'Run `export NODE_TLS_REJECT_UNAUTHORIZED=0` and rerun your command.';
    }
    return '';
}
exports.tryParseSystemError = tryParseSystemError;
async function formatResponseError(err) {
    const json = await err.response.json();
    return formatError(json);
}
exports.formatResponseError = formatResponseError;
function formatError(obj) {
    return util_1.default.inspect(obj, false, null, true);
}
exports.formatError = formatError;
