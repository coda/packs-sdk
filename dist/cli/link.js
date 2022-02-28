"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLink = exports.parsePackIdOrUrl = void 0;
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const config_storage_1 = require("./config_storage");
const config_storage_2 = require("./config_storage");
const helpers_3 = require("../testing/helpers");
const helpers_4 = require("../testing/helpers");
const config_storage_3 = require("./config_storage");
// Regular expression that matches coda.io/p/<packId> or <packId>.
const PackUrlRegex = /^(?:https:\/\/(?:[^/]*)coda.io(?:\:[0-9]+)?\/p\/)?([0-9]+)(:?[^0-9]*)$/;
function parsePackIdOrUrl(packIdOrUrl) {
    const match = packIdOrUrl.match(PackUrlRegex);
    if (!match) {
        return null;
    }
    const matchedNumber = match[1];
    return Number(matchedNumber);
}
exports.parsePackIdOrUrl = parsePackIdOrUrl;
async function handleLink({ manifestDir, codaApiEndpoint, packIdOrUrl }) {
    const formattedEndpoint = (0, helpers_2.formatEndpoint)(codaApiEndpoint);
    // TODO(dweitzman): Redirect to the `coda register` if there's not
    // an existing Coda API token.
    // TODO(dweitzman): Add a download command to fetch the latest code from
    // the server and ask people if they want to download after linking.
    const apiKey = (0, config_storage_1.getApiKey)(codaApiEndpoint);
    if (!apiKey) {
        (0, helpers_3.printAndExit)('Missing API key. Please run `coda register <apiKey>` to register one.');
    }
    const codaClient = (0, helpers_1.createCodaClient)(apiKey, formattedEndpoint);
    const packId = parsePackIdOrUrl(packIdOrUrl);
    if (packId === null) {
        (0, helpers_3.printAndExit)(`packIdOrUrl must be a pack ID or URL, not ${packIdOrUrl}`);
    }
    // Verify that the user has edit access to the pack. Currently only editors
    // can call getPack().
    await codaClient.getPack(packId);
    const existingPackId = (0, config_storage_2.getPackId)(manifestDir, codaApiEndpoint);
    if (existingPackId) {
        if (existingPackId === packId) {
            (0, helpers_3.printAndExit)(`Already associated with pack ${existingPackId}. No change needed`, 0);
        }
        const input = (0, helpers_4.promptForInput)(`Overwrite existing deploy to pack https://coda.io/p/${existingPackId} with https://coda.io/p/${packId} instead? Press "y" to overwrite or "n" to cancel: `);
        if (input.toLocaleLowerCase() !== 'y') {
            return process.exit(1);
        }
    }
    (0, config_storage_3.storePackId)(manifestDir, packId, codaApiEndpoint);
    return (0, helpers_3.printAndExit)(`Linked successfully!`, 0);
}
exports.handleLink = handleLink;
