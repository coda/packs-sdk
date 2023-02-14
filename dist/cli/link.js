"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePackIdOrUrl = exports.handleLink = void 0;
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const helpers_3 = require("./helpers");
const helpers_4 = require("./helpers");
const config_storage_1 = require("./config_storage");
const coda_1 = require("../helpers/external-api/coda");
const helpers_5 = require("../testing/helpers");
const helpers_6 = require("../testing/helpers");
const config_storage_2 = require("./config_storage");
// Regular expression that matches coda.io/p/<packId> or <packId>.
const PackEditUrlRegex = /^https:\/\/(?:[^/]*)coda.io(?:\:[0-9]+)?\/p\/([0-9]+)(:?[^0-9].*)?$/;
const PackGalleryUrlRegex = /^https:\/\/(?:[^/]*)coda.io(?:\:[0-9]+)?\/packs\/[^/]*-([0-9]+)$/;
const PackPlainIdRegex = /^([0-9]+)$/;
const PackRegexes = [PackEditUrlRegex, PackGalleryUrlRegex, PackPlainIdRegex];
async function handleLink({ manifestDir, codaApiEndpoint, packIdOrUrl, apiToken }) {
    // TODO(dweitzman): Add a download command to fetch the latest code from
    // the server and ask people if they want to download after linking.
    const formattedEndpoint = (0, helpers_4.formatEndpoint)(codaApiEndpoint);
    apiToken = (0, helpers_1.assertApiToken)(codaApiEndpoint, apiToken);
    const packId = (0, helpers_2.assertPackIdOrUrl)(packIdOrUrl);
    const codaClient = (0, helpers_3.createCodaClient)(apiToken, formattedEndpoint);
    // Verify that the user has edit access to the pack. Currently only editors
    // can call getPack().
    try {
        await codaClient.getPack(packId);
    }
    catch (err) {
        if ((0, coda_1.isResponseError)(err)) {
            switch (err.response.status) {
                case 401:
                case 403:
                case 404:
                    return (0, helpers_5.printAndExit)("You don't have permission to edit this pack");
            }
        }
        throw err;
    }
    const existingPackId = (0, config_storage_1.getPackId)(manifestDir, codaApiEndpoint);
    if (existingPackId) {
        if (existingPackId === packId) {
            return (0, helpers_5.printAndExit)(`Already associated with pack ${existingPackId}. No change needed`, 0);
        }
        const input = (0, helpers_6.promptForInput)(`Overwrite existing deploy to pack https://coda.io/p/${existingPackId} with https://coda.io/p/${packId} instead? (y/N): `, { yesOrNo: true });
        if (input.toLocaleLowerCase() !== 'yes') {
            return process.exit(1);
        }
    }
    (0, config_storage_2.storePackId)(manifestDir, packId, codaApiEndpoint);
    return (0, helpers_5.printAndExit)(`Linked successfully!`, 0);
}
exports.handleLink = handleLink;
function parsePackIdOrUrl(packIdOrUrl) {
    for (const regex of PackRegexes) {
        const match = packIdOrUrl.match(regex);
        if (match) {
            const matchedNumber = match[1];
            return Number(matchedNumber);
        }
    }
    return null;
}
exports.parsePackIdOrUrl = parsePackIdOrUrl;
