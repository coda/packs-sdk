#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_storage_1 = require("./config_storage");
const auth_1 = require("../testing/auth");
const auth_2 = require("./auth");
const build_1 = require("./build");
const create_1 = require("./create");
const execute_1 = require("./execute");
const init_1 = require("./init");
const publish_1 = require("./publish");
const register_1 = require("./register");
const set_live_1 = require("./set_live");
const validate_1 = require("./validate");
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
            vm: {
                boolean: true,
                desc: 'Execute the requested command in a virtual machine that mimics the environment Coda uses to execute Packs.',
            },
        },
    })
        .command({
        command: 'auth <manifestPath>',
        describe: 'Set up authentication for a Pack',
        handler: auth_2.handleAuth,
        builder: {
            oauthServerPort: {
                alias: 'oauth_server_port',
                number: true,
                default: auth_1.DEFAULT_OAUTH_SERVER_PORT,
                desc: 'Port to use for the local server that handles OAuth setup.',
            },
        },
    })
        .command({
        command: 'init',
        describe: 'Initialize an empty Pack',
        handler: init_1.handleInit,
    })
        .command({
        command: 'register [apiToken]',
        describe: 'Register API token to publish a Pack',
        builder: {
            codaApiEndpoint: {
                string: true,
                hidden: true,
                default: config_storage_1.DEFAULT_API_ENDPOINT,
            },
        },
        handler: register_1.handleRegister,
    })
        .command({
        command: 'build <manifestFile>',
        describe: 'Generate a bundle for your Pack',
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
        describe: 'Upload your Pack to Coda',
        builder: {
            codaApiEndpoint: {
                string: true,
                hidden: true,
                default: config_storage_1.DEFAULT_API_ENDPOINT,
            },
        },
        handler: publish_1.handlePublish,
    })
        .command({
        command: 'create <manifestFile>',
        describe: "Register a new Pack with Coda's servers",
        builder: {
            codaApiEndpoint: {
                string: true,
                hidden: true,
                default: config_storage_1.DEFAULT_API_ENDPOINT,
            },
        },
        handler: create_1.handleCreate,
    })
        .command({
        command: 'validate <manifestFile>',
        describe: 'Validate your Pack definition',
        handler: validate_1.handleValidate,
    })
        .command({
        command: 'setLive <manifestPath> <packVersion>',
        describe: 'Set the Pack version that is installable for users.',
        builder: {
            codaApiEndpoint: {
                string: true,
                hidden: true,
                default: config_storage_1.DEFAULT_API_ENDPOINT,
            },
        },
        handler: set_live_1.handleSetLive,
    })
        .demandCommand()
        .strict()
        .help().argv;
}
