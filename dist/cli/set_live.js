"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSetLive = void 0;
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const helpers_3 = require("./helpers");
const errors_1 = require("./errors");
const helpers_4 = require("../testing/helpers");
async function handleSetLive({ packId, packVersion, codaApiEndpoint }) {
    const apiKey = helpers_3.getApiKey();
    const formattedEndpoint = helpers_2.formatEndpoint(codaApiEndpoint);
    if (!apiKey) {
        helpers_4.printAndExit('Missing API key. Please run `coda register <apiKey>` to register one.');
    }
    const codaClient = helpers_1.createCodaClient(apiKey, formattedEndpoint);
    try {
        const response = await codaClient.setPackLiveVersion(packId, {}, { packVersion });
        if (errors_1.isCodaError(response)) {
            helpers_4.printAndExit(`Error when setting pack live version: ${response}`);
        }
        else {
            helpers_4.printAndExit('Success!');
        }
    }
    catch (err) {
        const { statusCode, message } = JSON.parse(err.error);
        helpers_4.printAndExit(`Could not set the pack version: ${statusCode} ${message}`);
    }
}
exports.handleSetLive = handleSetLive;
