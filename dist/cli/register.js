"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRegister = void 0;
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const coda_1 = require("../helpers/external-api/coda");
const open_1 = __importDefault(require("open"));
const helpers_3 = require("../testing/helpers");
const helpers_4 = require("../testing/helpers");
const config_storage_1 = require("./config_storage");
const errors_1 = require("./errors");
async function handleRegister({ apiToken, codaApiEndpoint }) {
    const formattedEndpoint = (0, helpers_2.formatEndpoint)(codaApiEndpoint);
    if (!apiToken) {
        // TODO: deal with auto-open on devbox setups
        const shouldOpenBrowser = (0, helpers_4.promptForInput)('No API token provided. Do you want to visit Coda to create one (y/N)? ', { yesOrNo: true });
        if (shouldOpenBrowser !== 'yes') {
            return process.exit(1);
        }
        await (0, open_1.default)(`${formattedEndpoint}/account?openDialog=CREATE_API_TOKEN&scopeType=pack#apiSettings`);
        apiToken = (0, helpers_4.promptForInput)('Please paste the token here: ', { mask: true });
    }
    const client = (0, helpers_1.createCodaClient)(apiToken, formattedEndpoint);
    try {
        await client.whoami();
    }
    catch (err) {
        if ((0, coda_1.isResponseError)(err)) {
            return (0, helpers_3.printAndExit)(`Invalid API token provided.`);
        }
        const errors = [`Unexpected error while checking validity of API token: ${err}`, (0, errors_1.tryParseSystemError)(err)];
        return (0, helpers_3.printAndExit)(errors.join('\n'));
    }
    (0, config_storage_1.storeCodaApiKey)(apiToken, process.env.PWD, codaApiEndpoint);
    (0, helpers_3.printAndExit)(`API key validated and stored successfully!`, 0);
}
exports.handleRegister = handleRegister;
