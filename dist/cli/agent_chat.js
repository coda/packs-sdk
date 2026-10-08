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
exports.handleAgentChat = exports.nextBackoffMs = exports.joinAssistantTexts = exports.describeRunReason = exports.isApiErrorBody = exports.buildAgentChatMessagesUrl = exports.buildAgentRunStatusUrl = exports.buildTriggerAgentUrl = void 0;
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const helpers_3 = require("./helpers");
const path = __importStar(require("path"));
const helpers_4 = require("../testing/helpers");
const helpers_5 = require("../testing/helpers");
const errors_1 = require("./errors");
const DEFAULT_TIMEOUT_SECS = 120;
const POLL_INTERVAL_MS = 2000;
const MAX_BACKOFF_MS = 10000;
function buildTriggerAgentUrl(apiEndpoint) {
    return `${(0, helpers_3.formatEndpoint)(apiEndpoint)}/apis/v1/agents/trigger`;
}
exports.buildTriggerAgentUrl = buildTriggerAgentUrl;
function buildAgentRunStatusUrl(apiEndpoint, tenantId, agentInstanceId, chatId, executionId) {
    return (`${(0, helpers_3.formatEndpoint)(apiEndpoint)}/apis/v1/go/tenants/${tenantId}` +
        `/agentInstances/${agentInstanceId}/chats/${chatId}/runStatus?${new URLSearchParams({ executionId })}`);
}
exports.buildAgentRunStatusUrl = buildAgentRunStatusUrl;
function buildAgentChatMessagesUrl(apiEndpoint, tenantId, agentInstanceId, chatId) {
    return (`${(0, helpers_3.formatEndpoint)(apiEndpoint)}/apis/v1/go/tenants/${tenantId}` +
        `/agentInstances/${agentInstanceId}/chats/${chatId}/messages`);
}
exports.buildAgentChatMessagesUrl = buildAgentChatMessagesUrl;
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
function describeRunReason(status, reason) {
    if (status === 'failed') {
        switch (reason) {
            case 'quota_exceeded':
                return 'the run exceeded its quota';
            case 'max_attempts_exceeded':
                return 'the run exhausted its attempts';
            case 'non_retriable_error':
                return 'the run hit an error it could not retry';
            default:
                return 'the run failed';
        }
    }
    switch (reason) {
        case 'tool_approval':
            return 'a tool call needs approval in the browser';
        case 'question':
            return 'the agent asked a question — answer it in the browser';
        case 'step_limit':
            return 'the run paused on its step limit with a partial reply below';
        default:
            return 'the run is waiting on input in the browser';
    }
}
exports.describeRunReason = describeRunReason;
// Every completed assistant text, oldest first. A run that writes, calls a
// tool, then wraps up reads like the browser transcript, not just the tail.
function joinAssistantTexts(messages) {
    const texts = messages
        .filter(message => message.messageType === 'assistant' && message.isComplete && message.text)
        .sort((left, right) => (left.createdAt < right.createdAt ? -1 : left.createdAt > right.createdAt ? 1 : 0))
        .map(message => message.text);
    return texts.length > 0 ? texts.join('\n\n') : undefined;
}
exports.joinAssistantTexts = joinAssistantTexts;
function nextBackoffMs(failedAttempts) {
    return Math.min(1000 * 2 ** failedAttempts, MAX_BACKOFF_MS);
}
exports.nextBackoffMs = nextBackoffMs;
function assertTriggerResponse(body) {
    if (typeof body !== 'object' ||
        body === null ||
        typeof body.executionId !== 'string' ||
        typeof body.chatId !== 'string' ||
        typeof body.agentInstanceId !== 'string' ||
        typeof body.tenantId !== 'string' ||
        typeof body.packId !== 'number') {
        throw new Error('Trigger response had an unexpected shape.');
    }
    return body;
}
function assertStatusResponse(body) {
    if (typeof body !== 'object' ||
        body === null ||
        typeof body.status !== 'string' ||
        typeof body.chatId !== 'string') {
        throw new Error('Status response had an unexpected shape.');
    }
    return body;
}
function assertMessagesResponse(body) {
    if (typeof body !== 'object' || body === null || !Array.isArray(body.messages)) {
        throw new Error('Messages response had an unexpected shape.');
    }
    return body.messages;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function readErrorBody(response) {
    try {
        return await response.text();
    }
    catch {
        return '';
    }
}
function isTransientStatus(status) {
    return status === 429 || status >= 500;
}
async function handleAgentChat({ manifestPath, prompt, agentInstanceId, tenantId: tenantIdFlag, timeout, apiToken, apiEndpoint, }) {
    const manifestDir = path.dirname(manifestPath);
    const formattedEndpoint = (0, helpers_3.formatEndpoint)(apiEndpoint);
    apiToken = (0, helpers_1.assertApiToken)(apiEndpoint, apiToken);
    const packId = (0, helpers_2.assertPackId)(manifestDir, apiEndpoint);
    const headers = { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' };
    const timeoutSecs = timeout !== null && timeout !== void 0 ? timeout : DEFAULT_TIMEOUT_SECS;
    let triggerBody;
    try {
        const triggerResponse = await fetch(buildTriggerAgentUrl(apiEndpoint), {
            method: 'POST',
            headers,
            body: JSON.stringify({ input: prompt, agentInstanceId }),
            signal: AbortSignal.timeout(30000),
        });
        if (!triggerResponse.ok) {
            const bodyText = await readErrorBody(triggerResponse);
            if (triggerResponse.status === 404 && !isApiErrorBody(bodyText)) {
                return (0, helpers_5.printAndExit)('The agent trigger endpoint is not available on this server.\n' +
                    'It ships with the agent runtime API — upgrade the server or verify in the browser agent directory.');
            }
            if (triggerResponse.status === 404) {
                return (0, helpers_5.printAndExit)('Agent not found or agent triggering is not enabled.\n' +
                    '  Check --agentInstanceId (copy it from the installed agent URL) and that triggering is enabled.');
            }
            if (triggerResponse.status === 429) {
                return (0, helpers_5.printAndExit)(`Agent is busy, retry later. (${triggerResponse.status} ${triggerResponse.statusText})`);
            }
            return (0, helpers_5.printAndExit)(`Agent trigger failed: ${triggerResponse.status} ${triggerResponse.statusText}`);
        }
        triggerBody = assertTriggerResponse(await triggerResponse.json());
    }
    catch (err) {
        const errors = [`Error while triggering the agent: ${err}`, (0, errors_1.tryParseSystemError)(err)];
        return (0, helpers_5.printAndExit)(errors.join('\n'));
    }
    const { executionId, chatId } = triggerBody;
    if (triggerBody.packId !== packId) {
        return (0, helpers_5.printAndExit)(`Agent instance ${agentInstanceId} belongs to pack ${triggerBody.packId}, not pack ${packId}.\n` +
            '  A run has already been queued on that instance. Check it in the browser agent directory.\n' +
            `  execution: ${executionId}\n  chat: ${chatId}\n` +
            '  Install this pack first, or point --agentInstanceId at its install.');
    }
    const tenantId = tenantIdFlag !== null && tenantIdFlag !== void 0 ? tenantIdFlag : triggerBody.tenantId;
    (0, helpers_4.print)(`Run queued for pack ${packId} (execution ${executionId}). Waiting for a reply…`);
    const deadlineMs = Date.now() + timeoutSecs * 1000;
    const statusUrl = buildAgentRunStatusUrl(formattedEndpoint, tenantId, agentInstanceId, chatId, executionId);
    const waitWithinDeadline = (ms) => {
        const remainingMs = Math.min(ms, deadlineMs - Date.now());
        return remainingMs > 0 ? sleep(remainingMs) : Promise.resolve();
    };
    let failedAttempts = 0;
    for (;;) {
        if (Date.now() >= deadlineMs) {
            return (0, helpers_5.printAndExit)(`Timed out waiting for the agent reply after ${timeoutSecs}s.\n` +
                `  execution: ${executionId}\n  chat: ${chatId}\n` +
                '  The run may still be going — check the browser agent directory, or retry with --timeout.');
        }
        let statusResponse;
        try {
            statusResponse = await fetch(statusUrl, {
                headers: { Authorization: `Bearer ${apiToken}` },
                signal: AbortSignal.timeout(Math.max(1, Math.ceil(Math.min(30000, deadlineMs - Date.now())))),
            });
        }
        catch {
            await waitWithinDeadline(nextBackoffMs(failedAttempts++));
            continue;
        }
        if (!statusResponse.ok) {
            if (isTransientStatus(statusResponse.status)) {
                await waitWithinDeadline(nextBackoffMs(failedAttempts++));
                continue;
            }
            return (0, helpers_5.printAndExit)(`Agent status check failed: ${statusResponse.status} ${statusResponse.statusText}`);
        }
        let statusBody;
        try {
            statusBody = assertStatusResponse(await statusResponse.json());
            failedAttempts = 0;
        }
        catch (err) {
            const errors = [`Error while checking the agent run: ${err}`, (0, errors_1.tryParseSystemError)(err)];
            return (0, helpers_5.printAndExit)(errors.join('\n'));
        }
        if (statusBody.status === 'queued' || statusBody.status === 'running') {
            await waitWithinDeadline(POLL_INTERVAL_MS);
            continue;
        }
        if (statusBody.status === 'failed') {
            return (0, helpers_5.printAndExit)(`Agent run failed: ${describeRunReason('failed', statusBody.reason)}. (execution ${executionId})`);
        }
        if (statusBody.status === 'done') {
            const reply = await fetchReply({ apiToken, apiEndpoint, tenantId, agentInstanceId, chatId });
            if (reply.error) {
                return (0, helpers_5.printAndExit)(`Run finished but reading the reply failed (chat ${chatId}): ${reply.error}\n` +
                    '  The reply is still in the browser agent directory.');
            }
            if (reply.text) {
                (0, helpers_4.print)(reply.text);
                return;
            }
            return (0, helpers_5.printAndExit)('The run finished without a text reply.\n  Check the browser agent directory for tool-only output.');
        }
        if (statusBody.status === 'needs_input') {
            const reply = await fetchReply({ apiToken, apiEndpoint, tenantId, agentInstanceId, chatId });
            if (reply.error) {
                return (0, helpers_5.printAndExit)(`Run paused but reading the reply failed (chat ${chatId}): ${reply.error}\n` +
                    '  The partial reply is still in the browser agent directory.');
            }
            if (reply.text) {
                (0, helpers_4.print)(reply.text);
            }
            (0, helpers_4.print)(`Note: ${describeRunReason('needs_input', statusBody.reason)}.`);
            return;
        }
        await waitWithinDeadline(POLL_INTERVAL_MS);
    }
}
exports.handleAgentChat = handleAgentChat;
async function fetchReply({ apiToken, apiEndpoint, tenantId, agentInstanceId, chatId, }) {
    let messagesResponse;
    try {
        messagesResponse = await fetch(`${buildAgentChatMessagesUrl(apiEndpoint, tenantId, agentInstanceId, chatId)}?limit=25`, { headers: { Authorization: `Bearer ${apiToken}` }, signal: AbortSignal.timeout(30000) });
    }
    catch (err) {
        return { error: `${err}` };
    }
    if (!messagesResponse.ok) {
        return { error: `${messagesResponse.status} ${messagesResponse.statusText}` };
    }
    try {
        const messages = assertMessagesResponse(await messagesResponse.json());
        return { text: joinAssistantTexts(messages) };
    }
    catch (err) {
        return { error: `${err}` };
    }
}
