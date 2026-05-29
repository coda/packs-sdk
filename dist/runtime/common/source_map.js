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
exports.translateErrorStackFromVM = void 0;
const source_map_1 = require("source-map");
const fs_1 = __importDefault(require("fs"));
const stackTraceParser = __importStar(require("stacktrace-parser"));
const SOURCE_MAP_INIT_TIMEOUT_MS = 5000; // 5 seconds timeout for WASM initialization
/**
 * Wraps a promise with a timeout. Avoids Promise.race() to prevent memory leaks.
 * The timeout is properly cleaned up whether the promise resolves or times out.
 */
function withTimeout(promise, timeoutMs) {
    let timeoutId;
    return new Promise((resolve, reject) => {
        // Set up timeout
        timeoutId = setTimeout(() => {
            reject(new Error(`Operation timed out after ${timeoutMs}ms`));
        }, timeoutMs);
        // Wait for the original promise and always clean up timeout
        promise.then(resolve, reject).finally(() => {
            clearTimeout(timeoutId);
        });
    });
}
// isolated-vm doesn't translate error stack with source map. so we have to do this manually.
async function translateErrorStackFromVM({ stacktrace, bundleSourceMapPath, vmFilename, }) {
    if (!stacktrace) {
        return stacktrace;
    }
    try {
        // Use async file read to avoid blocking the event loop
        const sourceMapContent = await fs_1.default.promises.readFile(bundleSourceMapPath, 'utf8');
        // Use SourceMapConsumer.with() which automatically calls destroy() when done.
        // Wrap with timeout to prevent infinite hangs if WASM init fails.
        const translatedStacktrace = await withTimeout(source_map_1.SourceMapConsumer.with(sourceMapContent, null, consumer => {
            const stack = stackTraceParser.parse(stacktrace);
            const translatedStack = stack.map(frame => {
                var _a;
                if (!((_a = frame.file) === null || _a === void 0 ? void 0 : _a.endsWith(vmFilename)) || frame.lineNumber === null || frame.column === null) {
                    return frame;
                }
                const originalFrame = consumer.originalPositionFor({ line: frame.lineNumber, column: frame.column - 1 });
                // If source map lookup failed, return original frame to avoid rendering "null:null:null"
                if (originalFrame.source === null || originalFrame.line === null) {
                    return frame;
                }
                return {
                    ...frame,
                    file: originalFrame.source,
                    column: originalFrame.column ? originalFrame.column + 1 : originalFrame.column,
                    lineNumber: originalFrame.line,
                    methodName: originalFrame.name || frame.methodName,
                };
            });
            return translatedStack
                .map(stackValue => `    at ${stackValue.methodName || '<unknown>'} (${stackValue.file}:${stackValue.lineNumber}:${stackValue.column})\n`)
                .join('');
        }), SOURCE_MAP_INIT_TIMEOUT_MS);
        return translatedStacktrace;
    }
    catch (err) {
        // Something went wrong (file read, WASM init timeout, or translation error).
        // Return the original stacktrace so we still have some error information.
        // eslint-disable-next-line no-console
        console.log('Failed to translate error stack', err);
        return stacktrace;
    }
}
exports.translateErrorStackFromVM = translateErrorStackFromVM;
