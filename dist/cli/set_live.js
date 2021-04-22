"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSetLive = void 0;
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const errors_1 = require("./errors");
const auth_1 = require("../testing/auth");
const errors_2 = require("./errors");
const helpers_3 = require("../testing/helpers");
async function handleSetLive({ packId, packVersion, codaApiEndpoint }) {
    const apiKey = auth_1.getApiKey(codaApiEndpoint);
    const formattedEndpoint = helpers_2.formatEndpoint(codaApiEndpoint);
    if (!apiKey) {
        helpers_3.printAndExit('Missing API key. Please run `coda register <apiKey>` to register one.');
    }
    const codaClient = helpers_1.createCodaClient(apiKey, formattedEndpoint);
    try {
        const response = await codaClient.setPackLiveVersion(packId, {}, { packVersion });
        if (errors_2.isCodaError(response)) {
            helpers_3.printAndExit(`Error when setting pack live version: ${errors_1.formatError(response)}`);
        }
        else {
            helpers_3.printAndExit('Success!', 0);
        }
    }
    catch (err) {
        helpers_3.printAndExit(`Unexpected error while setting pack version: ${errors_1.formatError(err)}`);
    }
}
exports.handleSetLive = handleSetLive;
