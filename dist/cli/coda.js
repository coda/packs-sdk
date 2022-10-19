#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_storage_1 = require("./config_storage");
const execution_1 = require("../testing/execution");
const auth_1 = require("../testing/auth");
const compile_1 = require("../testing/compile");
const auth_2 = require("./auth");
const build_1 = require("./build");
const clone_1 = require("./clone");
const create_1 = require("./create");
const execute_1 = require("./execute");
const init_1 = require("./init");
const link_1 = require("./link");
const register_1 = require("./register");
const release_1 = require("./release");
const set_option_1 = require("./set_option");
const upload_1 = require("./upload");
const validate_1 = require("./validate");
const whoami_1 = require("./whoami");
const ivm_wrapper_1 = require("../testing/ivm_wrapper");
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
                default: true,
            },
            vm: {
                boolean: true,
                desc: 'Execute the requested command in a virtual machine that mimics the environment Coda uses to execute Packs.',
                default: Boolean((0, ivm_wrapper_1.tryGetIvm)()),
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
            maxRows: {
                number: true,
                default: execution_1.DEFAULT_MAX_ROWS,
                desc: 'For a sync table, the maximum number of rows to sync.',
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
                default: undefined,
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
        command: 'clone <packIdOrUrl>',
        describe: 'Clone an existing Pack that was created using Pack Studio',
        builder: {
            codaApiEndpoint: {
                string: true,
                hidden: true,
                default: config_storage_1.DEFAULT_API_ENDPOINT,
            },
        },
        handler: clone_1.handleClone,
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
        command: 'whoami [apiToken]',
        describe: 'Looks up information about the API token that is registered in this environment',
        builder: {
            codaApiEndpoint: {
                string: true,
                hidden: true,
                default: config_storage_1.DEFAULT_API_ENDPOINT,
            },
        },
        handler: whoami_1.handleWhoami,
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
            intermediateOutputDirectory: {
                string: true,
                default: undefined,
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
            timerStrategy: {
                string: true,
                default: compile_1.TimerShimStrategy.None,
                desc: 'Options: none, error, fake.',
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
            workspace: {
                string: true,
                alias: 'w',
                describe: 'The workspace ID, or workspace URL that you want your Pack to be created under.',
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
        command: 'link <manifestDir> <packIdOrUrl>',
        describe: "Link to a pre-existing Pack ID on Coda's servers",
        builder: {
            codaApiEndpoint: {
                string: true,
                hidden: true,
                default: config_storage_1.DEFAULT_API_ENDPOINT,
            },
        },
        handler: link_1.handleLink,
    })
        .command({
        command: 'validate <manifestFile>',
        describe: 'Validate your Pack definition',
        builder: {
            checkDeprecationWarnings: {
                boolean: true,
                desc: 'Also check for warnings about deprecated properties and features that will become errors in a future SDK version.',
                default: true,
            },
        },
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
                demandOption: 'Please provide release notes, which will be shown to Pack users to understand the release.',
            },
            codaApiEndpoint: {
                string: true,
                hidden: true,
                default: config_storage_1.DEFAULT_API_ENDPOINT,
            },
        },
        handler: release_1.handleRelease,
    })
        .command({
        command: 'setOption <manifestFile> <option> <value>',
        describe: 'Set a persistent build option for the pack. This will store the option alongside the pack id in ' +
            'the .coda-pack.json file and it will be used for all builds of the pack. ' +
            'Currently the only supported option is `timerStrategy`. Valid values are "none", "error", or "fake".\n\n' +
            'Usage: coda setOption path/to/pack.ts timerStrategy fake',
        handler: set_option_1.handleSetOption,
    })
        .demandCommand()
        .strict()
        .help().argv;
}
