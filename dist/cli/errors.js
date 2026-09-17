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
    const { response } = err;
    const status = response.statusText ? `${response.status} ${response.statusText}` : `${response.status}`;
    const body = await tryReadResponseBody(response);
    return body ? `${status}: ${body}` : status;
}
exports.formatResponseError = formatResponseError;
async function tryReadResponseBody(response) {
    let text;
    try {
        text = await response.text();
    }
    catch {
        // The body was unreadable (e.g. already consumed or a network error); fall back to the status alone.
        return '';
    }
    const trimmed = text.trim();
    if (!trimmed) {
        return '';
    }
    // Coda API errors are JSON, so pretty-print them. Non-JSON bodies (proxy/gateway errors,
    // plain text) are surfaced verbatim so the server-side message is never swallowed.
    try {
        return formatError(JSON.parse(trimmed));
    }
    catch {
        return trimmed;
    }
}
function formatError(obj) {
    return util_1.default.inspect(obj, false, null, true);
}
exports.formatError = formatError;
