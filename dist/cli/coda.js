#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../testing/auth");
const auth_2 = require("../testing/auth");
const auth_3 = require("./auth");
const build_1 = require("./build");
const create_1 = require("./create");
const execute_1 = require("./execute");
const init_1 = require("./init");
const publish_1 = require("./publish");
const register_1 = require("./register");
const yargs_1 = __importDefault(require("yargs"));
if (require.main === module) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    yargs_1.default
        .parserConfiguration({ 'parse-numbers': false })
        .command({
        command: 'execute <manifestPath> <formulaName> [params..]',
        describe: 'Execute a formula',
        handler: execute_1.handleExecute,
        builder: {
            fetch: {
                boolean: true,
                desc: 'Actually fetch http requests instead of using mocks. Run "coda auth" first to set up credentials.',
            },
            credentialsFile: {
                alias: 'credentials_file',
                string: true,
                default: auth_1.DEFAULT_CREDENTIALS_FILE,
                desc: 'Path to the credentials file.',
            },
        },
    })
        .command({
        command: 'auth <manifestPath>',
        describe: 'Set up authentication for a pack',
        handler: auth_3.handleAuth,
        builder: {
            credentialsFile: {
                alias: 'credentials_file',
                string: true,
                default: auth_1.DEFAULT_CREDENTIALS_FILE,
                desc: 'Path to the credentials file.',
            },
            oauthServerPort: {
                alias: 'oauth_server_port',
                number: true,
                default: auth_2.DEFAULT_OAUTH_SERVER_PORT,
                desc: 'Port to use for the local server that handles OAuth setup.',
            },
        },
    })
        .command({
        command: 'init',
        describe: 'Initialize an empty pack',
        handler: init_1.handleInit,
    })
        .command({
        command: 'register [apiToken]',
        describe: 'Register API token to publish a pack',
        builder: {
            codaApiEndpoint: {
                string: true,
                hidden: true,
                default: 'https://coda.io',
            },
        },
        handler: register_1.handleRegister,
    })
        .command({
        command: 'build <manifestFile>',
        describe: 'Generate a bundle for your pack',
        builder: {
            compiler: {
                string: true,
                default: 'esbuild',
                desc: '`esbuild` or `webpack`',
            },
        },
        handler: build_1.handleBuild,
    })
        .command({
        command: 'publish <manifestFile>',
        describe: 'Upload your pack to Coda',
        builder: {
            codaApiEndpoint: {
                string: true,
                hidden: true,
                default: 'https://coda.io',
            },
        },
        handler: publish_1.handlePublish,
    })
        .command({
        command: 'create <packName>',
        describe: "Register a new pack with Coda's servers",
        builder: {
            codaApiEndpoint: {
                string: true,
                hidden: true,
                default: 'https://coda.io',
            },
        },
        handler: create_1.handleCreate,
    })
        .demandCommand()
        .strict()
        .help().argv;
}
