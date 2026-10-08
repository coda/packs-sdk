"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAgentInstall = exports.buildAgentInstallUrl = void 0;
const agent_api_1 = require("./agent_api");
const confirm_1 = require("./confirm");
const agent_api_2 = require("./agent_api");
const helpers_1 = require("../testing/helpers");
const agent_api_3 = require("./agent_api");
function buildAgentInstallUrl(apiEndpoint, packId, version) {
    return (0, agent_api_1.buildAgentRouteUrl)(apiEndpoint, packId, version, 'agentInstall');
}
exports.buildAgentInstallUrl = buildAgentInstallUrl;
function missingInstallRouteMessage(url) {
    return ('The agent install endpoint is not available on this server.\n' +
        `  attempted: POST ${url}\n` +
        'The server needs a token-authed install route that binds a pack version to your account.\n' +
        'Until then: open the agent directory, search the agent by name, and click Open → install agent.');
}
async function handleAgentInstall({ manifestPath, version, reinstall, yes, apiToken, apiEndpoint, }) {
    const { packId, resolvedVersion, apiToken: token, } = await (0, agent_api_3.resolveAgentContext)({
        manifestPath,
        version,
        apiToken,
        apiEndpoint,
    });
    if (reinstall) {
        (0, confirm_1.confirmOrFail)({
            yes,
            prompt: `Reinstall version ${resolvedVersion}? This rebinds tool grants and triggers (y/N)? `,
            example: 'packs agent install pack.ts --reinstall --yes',
        });
    }
    await (0, agent_api_2.postAgentRoute)('agentInstall', {
        apiToken: token,
        apiEndpoint,
        packId,
        version: resolvedVersion,
        progressVerb: 'installing the agent',
        commandNoun: 'install',
        missingRouteMessage: missingInstallRouteMessage,
    }, { reinstall: reinstall !== null && reinstall !== void 0 ? reinstall : false });
    // TODO: once the server contract lands, read an `alreadyInstalled` field on the
    // success body to tell "already installed, nothing changed" apart from a fresh install.
    if (reinstall) {
        (0, helpers_1.print)(`Reinstalled agent version ${resolvedVersion} of pack ${packId}.\n` +
            'Tool grants and triggers rebound to this version.');
    }
    else {
        (0, helpers_1.print)(`Installed agent version ${resolvedVersion} of pack ${packId}.\n` +
            'Triggers and tool grants copied at install time — reinstall after changing tools or triggers.');
    }
}
exports.handleAgentInstall = handleAgentInstall;
