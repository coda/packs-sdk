"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRegister = void 0;
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const errors_1 = require("./errors");
const open_1 = __importDefault(require("open"));
const helpers_3 = require("../testing/helpers");
const helpers_4 = require("../testing/helpers");
const config_storage_1 = require("./config_storage");
async function handleRegister({ apiToken, codaApiEndpoint }) {
    const formattedEndpoint = helpers_2.formatEndpoint(codaApiEndpoint);
    if (!apiToken) {
        // TODO: deal with auto-open on devbox setups
        const shouldOpenBrowser = helpers_4.promptForInput('No API token provided. Do you want to visit Coda to create one? ');
        if (!shouldOpenBrowser.toLocaleLowerCase().startsWith('y')) {
            return process.exit(1);
        }
        // TODO: figure out how to deep-link to the API tokens section of account settings
        await open_1.default(`${formattedEndpoint}/account`);
        apiToken = helpers_4.promptForInput('Please paste the token here: ', { mask: true });
    }
    const client = helpers_1.createCodaClient(apiToken, formattedEndpoint);
    try {
        const response = await client.whoami();
        if (errors_1.isCodaError(response)) {
            return helpers_3.printAndExit(`Invalid API token provided.`);
        }
    }
    catch (err) {
        helpers_3.printAndExit(`Unexpected error while checking validity of API token: ${err}`);
    }
    config_storage_1.storeCodaApiKey(apiToken, process.env.PWD, codaApiEndpoint);
}
exports.handleRegister = handleRegister;
