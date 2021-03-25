"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSetLive = void 0;
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const helpers_3 = require("./helpers");
const helpers_4 = require("../testing/helpers");
async function handleSetLive({ packId, packVersion, codaApiEndpoint }) {
    const apiKey = helpers_3.getApiKey();
    const formattedEndpoint = helpers_2.formatEndpoint(codaApiEndpoint);
    if (!apiKey) {
        helpers_4.printAndExit('Missing API key. Please run `coda register <apiKey>` to register one.');
    }
    const codaClient = helpers_1.createCodaClient(apiKey, formattedEndpoint);
    try {
        await codaClient.setPackLiveVersion(packId, {}, { packVersion });
    }
    catch (err) {
        const { statusCode, message } = JSON.parse(err.error);
        helpers_4.printAndExit(`Could not set the pack version: ${statusCode} ${message}`);
    }
    helpers_4.printAndExit('Success!');
}
exports.handleSetLive = handleSetLive;
