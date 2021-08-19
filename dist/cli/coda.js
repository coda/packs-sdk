#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_storage_1 = require("./config_storage");
const auth_1 = require("../testing/auth");
const compile_1 = require("../testing/compile");
const auth_2 = require("./auth");
const build_1 = require("./build");
const create_1 = require("./create");
const execute_1 = require("./execute");
const init_1 = require("./init");
const register_1 = require("./register");
const release_1 = require("./release");
const upload_1 = require("./upload");
const validate_1 = require("./validate");
const yargs_1 = __importDefault(require("yargs"));
if (require.main === module) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    void yargs_1.default
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
            dynamicUrl: {
                string: true,
                desc: 'For a dynamic sync table with a variable source location, specify the URL to test here.',
            },
            timerStrategy: {
                string: true,
                default: compile_1.TimerShimStrategy.None,
                desc: 'Options: none, error, fake.',
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
            extraOAuthScopes: {
                alias: 'extra_oauth_scopes',
                string: true,
                default: '',
                desc: `Scopes to request beyond those listed in the manifest, for specific formulas that ` +
                    `need extra permissions. Example: --extra_oauth_scopes='first second third'`,
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
            outputDir: {
                string: true,
                alias: 'o',
                default: undefined,
            },
            minify: {
                boolean: true,
                default: true,
            },
            timerStrategy: {
                string: true,
                default: compile_1.TimerShimStrategy.None,
                desc: 'Options: none, error, fake.',
            },
        },
        handler: build_1.handleBuild,
    })
        .command({
        command: 'upload <manifestFile>',
        describe: 'Upload your Pack version to Coda',
        builder: {
            notes: {
                string: true,
                alias: 'n',
                describe: 'Notes about the contents of this Pack version',
            },
            codaApiEndpoint: {
                string: true,
                hidden: true,
                default: config_storage_1.DEFAULT_API_ENDPOINT,
            },
            intermediateOutputDirectory: {
                string: true,
                alias: 'o',
                default: './_upload_build',
            },
        },
        handler: upload_1.handleUpload,
    })
        .command({
        command: 'create <manifestFile>',
        describe: "Register a new Pack with Coda's servers",
        builder: {
            name: {
                string: true,
                alias: 'n',
                describe: 'The name of the Pack. Can be set later in the UI.',
            },
            description: {
                string: true,
                alias: 'd',
                describe: 'A description of the Pack. Can be set later in the UI.',
            },
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
        command: 'release <manifestFile> [packVersion]',
        describe: 'Set the Pack version that is installable for users. You may specify a specific version, ' +
            'or omit a version to use the version currently in the manifest file. ' +
            'The version must always be higher than that of any previous release.',
        builder: {
            notes: {
                string: true,
                alias: 'n',
                describe: 'Notes about the contents of this Pack release',
            },
            codaApiEndpoint: {
                string: true,
                hidden: true,
                default: config_storage_1.DEFAULT_API_ENDPOINT,
            },
        },
        handler: release_1.handleRelease,
    })
        .demandCommand()
        .strict()
        .help().argv;
}
