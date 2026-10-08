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
exports.handleAgentLogs = exports.firstSessionId = exports.formatAgentLog = exports.redactSecrets = void 0;
const v1_1 = require("../helpers/external-api/v1");
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const helpers_3 = require("./helpers");
const helpers_4 = require("./helpers");
const errors_1 = require("./errors");
const coda_1 = require("../helpers/external-api/coda");
const path = __importStar(require("path"));
const helpers_5 = require("../testing/helpers");
const helpers_6 = require("../testing/helpers");
const agent_api_1 = require("./agent_api");
const errors_2 = require("./errors");
const TAIL_POLL_INTERVAL_MS = 5000;
const TAIL_MAX_POLLS = 60;
function redactSecrets(text) {
    return text
        .replace(/(bearer\s+)[^\s"']+/gi, '$1[redacted]')
        .replace(/(api[_-]?key["'\s:=]+)[^\s"',}]+/gi, '$1[redacted]');
}
exports.redactSecrets = redactSecrets;
function describeAgentTurn(log) {
    var _a, _b;
    const parts = [log.turnType];
    if (log.fromAgent || log.toAgent) {
        parts.push(`(${(_a = log.fromAgent) !== null && _a !== void 0 ? _a : '?'} → ${(_b = log.toAgent) !== null && _b !== void 0 ? _b : '?'})`);
    }
    if (log.name) {
        parts.push(`[${log.name}]`);
    }
    if (log.model) {
        parts.push(`via ${log.model}`);
    }
    if (log.durationMs !== undefined) {
        parts.push(`${log.durationMs}ms`);
    }
    return parts.join(' ');
}
function formatAgentLog(log) {
    if (log.type === v1_1.PublicApiPackLogType.AgentRuntime) {
        return redactSecrets(describeAgentTurn(log));
    }
    return redactSecrets(`[${log.type}]`);
}
exports.formatAgentLog = formatAgentLog;
function firstSessionId(items) {
    var _a, _b;
    return (_b = (_a = items[0]) === null || _a === void 0 ? void 0 : _a.context) === null || _b === void 0 ? void 0 : _b.agentSessionId;
}
exports.firstSessionId = firstSessionId;
function logKey(item, fallback) {
    var _a, _b;
    return (_b = (_a = item.context) === null || _a === void 0 ? void 0 : _a.logId) !== null && _b !== void 0 ? _b : fallback;
}
function missingIdentityError() {
    return (0, helpers_6.printAndExit)('Error: agent logs need a tenant and an agent instance.\n' +
        '  packs agent logs pack.ts --tenant <tenantId> --instance <agentInstanceId>\n' +
        'Find the instance id in the agent builder page URL after installing, and ask your workspace admin for the tenant id.');
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function handleAgentLogs({ manifestPath, tenant, instance, session, limit, tail, apiToken, apiEndpoint, }) {
    var _a, _b, _c, _d;
    const manifestDir = path.dirname(manifestPath);
    const formattedEndpoint = (0, helpers_4.formatEndpoint)(apiEndpoint);
    apiToken = (0, helpers_1.assertApiToken)(apiEndpoint, apiToken);
    const packId = (0, helpers_2.assertPackId)(manifestDir, apiEndpoint);
    if (!tenant || !instance) {
        return missingIdentityError();
    }
    const client = (0, helpers_3.createCodaClient)(apiToken, formattedEndpoint);
    let resolvedVersion;
    try {
        resolvedVersion = await (0, agent_api_1.resolveAgentVersion)(client, packId);
    }
    catch (err) {
        if ((0, coda_1.isResponseError)(err)) {
            return (0, helpers_6.printAndExit)(`Error while resolving pack version: ${await (0, errors_1.formatResponseError)(err)}`);
        }
        throw err;
    }
    let sessionId = session;
    if (!sessionId) {
        try {
            const sessions = await client.listAgentSessionIds(tenant, instance, { limit: 1 });
            sessionId = firstSessionId(sessions.items);
        }
        catch (err) {
            if ((0, coda_1.isResponseError)(err)) {
                return (0, helpers_6.printAndExit)(`Error while listing agent sessions: ${await (0, errors_1.formatResponseError)(err)}`);
            }
            throw err;
        }
        if (!sessionId) {
            return (0, helpers_6.printAndExit)('No agent runs yet for this instance.\n  packs agent chat pack.ts "hello"');
        }
    }
    (0, helpers_5.print)(`Logs for pack ${packId}${resolvedVersion ? ` version ${resolvedVersion}` : ''}, session ${sessionId}.`);
    const sessionIds = [sessionId];
    const seen = new Set();
    // Cursor per watched session: a shared cursor would let one chatty session
    // advance past another session's unread records, skipping them for good.
    const cursors = new Map();
    let polls = 0;
    for (;;) {
        if (tail && !session) {
            // Pick up chat sessions that started since the last poll so --tail follows new runs.
            let fresh;
            try {
                fresh = await client.listAgentSessionIds(tenant, instance, { limit: 10 });
            }
            catch (err) {
                if ((0, coda_1.isResponseError)(err)) {
                    return (0, helpers_6.printAndExit)(`Error while listing agent sessions: ${await (0, errors_1.formatResponseError)(err)}`);
                }
                throw err;
            }
            for (const row of fresh.items) {
                const id = firstSessionId([row]);
                if (id && !sessionIds.includes(id)) {
                    sessionIds.push(id);
                    (0, helpers_5.print)(`Following new session ${id}.`);
                }
            }
        }
        for (const watchedSessionId of sessionIds) {
            // Drain every page before moving the cursor: with newest-first paging,
            // advancing past an undrained page would skip its records forever.
            const items = await fetchSessionLogs(client, {
                tenant,
                instance,
                sessionId: watchedSessionId,
                afterTimestamp: cursors.get(watchedSessionId),
                limit: limit !== null && limit !== void 0 ? limit : 20,
            });
            for (const item of items) {
                const key = logKey(item, `${item.type}:${(_b = (_a = item.context) === null || _a === void 0 ? void 0 : _a.createdAt) !== null && _b !== void 0 ? _b : ''}`);
                if (seen.has(key)) {
                    continue;
                }
                seen.add(key);
                (0, helpers_5.print)(formatAgentLog(item));
                const createdAt = (_c = item.context) === null || _c === void 0 ? void 0 : _c.createdAt;
                if (createdAt && createdAt > ((_d = cursors.get(watchedSessionId)) !== null && _d !== void 0 ? _d : '')) {
                    cursors.set(watchedSessionId, createdAt);
                }
            }
        }
        if (!tail) {
            return;
        }
        polls += 1;
        if (polls >= TAIL_MAX_POLLS) {
            (0, helpers_5.print)('Stopped polling after 5 minutes. Re-run with --tail to continue, or Ctrl-C to exit.');
            return;
        }
        await delay(TAIL_POLL_INTERVAL_MS);
    }
}
exports.handleAgentLogs = handleAgentLogs;
async function fetchSessionLogs(client, { tenant, instance, sessionId, afterTimestamp, limit, }) {
    const items = [];
    let pageToken;
    for (;;) {
        let result;
        try {
            result = await client.listAgentLogs(tenant, instance, {
                agentSessionId: sessionId,
                afterTimestamp,
                limit,
                ...(pageToken ? { pageToken } : {}),
            });
        }
        catch (err) {
            if ((0, coda_1.isResponseError)(err)) {
                return (0, helpers_6.printAndExit)(`Error while listing agent logs: ${await (0, errors_1.formatResponseError)(err)}`);
            }
            const errors = [`Unexpected error while listing agent logs: ${err}`, (0, errors_2.tryParseSystemError)(err)];
            return (0, helpers_6.printAndExit)(errors.join('\n'));
        }
        items.push(...result.items);
        if (!result.nextPageToken) {
            return items;
        }
        pageToken = result.nextPageToken;
    }
}
