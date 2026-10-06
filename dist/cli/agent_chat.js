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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAgentChat = exports.isApiErrorBody = exports.resolveAgentVersion = exports.buildAgentChatUrl = void 0;
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const helpers_3 = require("./helpers");
const helpers_4 = require("./helpers");
const errors_1 = require("./errors");
const coda_1 = require("../helpers/external-api/coda");
const path = __importStar(require("path"));
const helpers_5 = require("../testing/helpers");
const helpers_6 = require("../testing/helpers");
const errors_2 = require("./errors");
function buildAgentChatUrl(apiEndpoint, packId, version) {
    return `${(0, helpers_4.formatEndpoint)(apiEndpoint)}/apis/v1/packs/${packId}/versions/${version}/agentChat`;
}
exports.buildAgentChatUrl = buildAgentChatUrl;
async function resolveAgentVersion(client, packId, requested) {
    var _a;
    if (requested) {
        return requested;
    }
    const { items } = await client.listPackVersions(packId, { limit: 1 });
    return (_a = items[0]) === null || _a === void 0 ? void 0 : _a.packVersion;
}
exports.resolveAgentVersion = resolveAgentVersion;
function isApiErrorBody(bodyText) {
    let parsed;
    try {
        parsed = JSON.parse(bodyText);
    }
    catch {
        return false;
    }
    return (typeof parsed === 'object' && parsed !== null && typeof parsed.statusCode === 'number');
}
exports.isApiErrorBody = isApiErrorBody;
function missingServerRouteError(apiEndpoint, packId, version) {
    return (0, helpers_6.printAndExit)('The agent chat endpoint is not available on this server.\n' +
        `  attempted: POST ${buildAgentChatUrl(apiEndpoint, packId, version)}\n` +
        'The server needs a token-authed alias of the streaming agent path ' +
        '(/agentRuntime/executeStreamingAgent).\n' +
        'Until then: packs upload pack.ts, then verify in the browser agent directory.');
}
function printAgentEvent(line) {
    let event;
    try {
        event = JSON.parse(line);
    }
    catch {
        (0, helpers_5.print)(line);
        return;
    }
    if (typeof event === 'string') {
        (0, helpers_5.print)(event);
        return;
    }
    if (event && typeof event === 'object' && typeof event.text === 'string') {
        (0, helpers_5.print)(event.text);
        return;
    }
    (0, helpers_5.print)(line);
}
async function handleAgentChat({ manifestPath, prompt, version, thread, apiToken, apiEndpoint, }) {
    var _a;
    const manifestDir = path.dirname(manifestPath);
    const formattedEndpoint = (0, helpers_4.formatEndpoint)(apiEndpoint);
    apiToken = (0, helpers_1.assertApiToken)(apiEndpoint, apiToken);
    const packId = (0, helpers_2.assertPackId)(manifestDir, apiEndpoint);
    const client = (0, helpers_3.createCodaClient)(apiToken, formattedEndpoint);
    let resolvedVersion;
    try {
        resolvedVersion = await resolveAgentVersion(client, packId, version);
    }
    catch (err) {
        if ((0, coda_1.isResponseError)(err)) {
            return (0, helpers_6.printAndExit)(`Error while resolving pack version: ${await (0, errors_1.formatResponseError)(err)}`);
        }
        throw err;
    }
    if (!resolvedVersion) {
        return (0, helpers_6.printAndExit)('Error: this pack has no uploaded versions yet.\n  packs upload <manifestFile>');
    }
    (0, helpers_5.print)(`Chatting with version ${resolvedVersion}${version ? '' : ' (latest)'}.`);
    const url = buildAgentChatUrl(apiEndpoint, packId, resolvedVersion);
    let response;
    try {
        response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
                Accept: 'application/stream+json',
            },
            body: JSON.stringify({ prompt, threadId: thread }),
            signal: AbortSignal.timeout(60000),
        });
    }
    catch (err) {
        const errors = [`Error while chatting with the agent: ${err}`, (0, errors_2.tryParseSystemError)(err)];
        return (0, helpers_6.printAndExit)(errors.join('\n'));
    }
    if (!response.ok) {
        const bodyText = await response.text();
        if (response.status === 404 && !isApiErrorBody(bodyText)) {
            return missingServerRouteError(apiEndpoint, packId, resolvedVersion);
        }
        return (0, helpers_6.printAndExit)(`Agent chat failed: ${response.status} ${response.statusText}`);
    }
    const body = response.body;
    if (!body) {
        return (0, helpers_6.printAndExit)('Agent chat failed: empty response body.');
    }
    const reader = body.pipeThrough(new TextDecoderStream()).getReader();
    let buffer = '';
    for (;;) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        buffer += value;
        const lines = buffer.split('\n');
        buffer = (_a = lines.pop()) !== null && _a !== void 0 ? _a : '';
        for (const line of lines) {
            if (line.trim()) {
                printAgentEvent(line);
            }
        }
    }
    if (buffer.trim()) {
        printAgentEvent(buffer);
    }
}
exports.handleAgentChat = handleAgentChat;
