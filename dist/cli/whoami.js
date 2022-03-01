"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatWhoami = exports.handleWhoami = void 0;
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const config_storage_1 = require("./config_storage");
const coda_1 = require("../helpers/external-api/coda");
const helpers_3 = require("../testing/helpers");
const errors_1 = require("./errors");
async function handleWhoami({ apiToken, codaApiEndpoint }) {
    const formattedEndpoint = (0, helpers_2.formatEndpoint)(codaApiEndpoint);
    if (!apiToken) {
        apiToken = (0, config_storage_1.getApiKey)(codaApiEndpoint);
        if (!apiToken) {
            return (0, helpers_3.printAndExit)('Missing API token. Please run `coda register` to register one.');
        }
    }
    const client = (0, helpers_1.createCodaClient)(apiToken, formattedEndpoint);
    try {
        const response = await client.whoami();
        return (0, helpers_3.printAndExit)(formatWhoami(response), 0);
    }
    catch (err) {
        if ((0, coda_1.isResponseError)(err)) {
            return (0, helpers_3.printAndExit)(`Invalid API token provided.`);
        }
        const errors = [`Unexpected error while checking owner of API token: ${err}`, (0, errors_1.tryParseSystemError)(err)];
        return (0, helpers_3.printAndExit)(errors.join('\n'));
    }
}
exports.handleWhoami = handleWhoami;
function formatWhoami(user) {
    const { name, loginId, tokenName, scoped } = user;
    return `You are ${name} (${loginId}) using ${scoped ? 'scoped' : 'non-scoped'} token "${tokenName}"`;
}
exports.formatWhoami = formatWhoami;
