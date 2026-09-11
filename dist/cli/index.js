#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
const config_storage_1 = require("./config_storage");
const config_storage_2 = require("./config_storage");
const execution_1 = require("../testing/execution");
const auth_1 = require("../testing/auth");
const config_storage_3 = require("./config_storage");
const extensions_1 = require("./extensions");
const helpers_1 = require("./helpers");
const auth_2 = require("./auth");
const build_1 = require("./build");
const clone_1 = require("./clone");
const create_1 = require("./create");
const execute_1 = require("./execute");
const extensions_2 = require("./extensions");
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
const ApiTokenArg = {
    string: true,
    alias: 't',
    desc: 'API token to use for the operation. Use the `register` command to define a default token.',
};
const ApiEndpointArg = {
    string: true,
    desc: `API endpoint to use for the operation (default: ${config_storage_1.DEFAULT_API_ENDPOINT}). Required for single-tenant instances. Can also be set persistently via \`packs setOption <manifestFile> apiEndpoint <url>\`.`,
    alias: 'codaApiEndpoint',
};
const TimerStrategyArg = {
    string: true,
    desc: `Options: none, error, fake (default: ${config_storage_3.DEFAULT_TIMER_STRATEGY}).`,
};
const YesArg = {
    boolean: true,
    alias: 'y',
    default: false,
    desc: 'Skip confirmation prompts. Required in non-interactive environments.',
};
const CommandExamples = {
    execute: [
        ['$0 execute pack.ts MyFormula "arg1"', 'Run a formula with mocked or live HTTP as configured.'],
        ['$0 execute pack.ts MySyncTable --maxRows 10', 'Sync a table and cap the number of rows.'],
    ],
    auth: [['$0 auth pack.ts', 'Start local auth setup for the Pack.']],
    init: [['$0 init', 'Scaffold pack.ts and related starter files in the current directory.']],
    extensions: [['$0 extensions vscode', 'Install VS Code snippets for Packs.']],
    clone: [
        ['$0 clone 1234', 'Download the latest Pack Studio source into this directory.'],
        ['$0 clone https://coda.io/p/1234 --yes', 'Overwrite pack.ts without prompting.'],
    ],
    register: [
        ['$0 register --apiToken <token>', 'Validate and store a Pack API token.'],
        ['$0 register --open', 'Open the token creation page, then pass --apiToken to store it.'],
    ],
    whoami: [['$0 whoami', 'Print the account and token currently registered.']],
    build: [
        ['$0 build pack.ts', 'Compile the Pack bundle locally.'],
        ['$0 build pack.ts --outputDir dist', 'Write the bundle to a directory.'],
    ],
    upload: [
        ['$0 upload pack.ts', 'Build and upload a new Pack version.'],
        ['$0 upload pack.ts --notes "Fix formula errors"', 'Upload with version notes.'],
    ],
    create: [
        ['$0 create pack.ts --name "My Pack"', 'Create a Pack and write its id to .coda-pack.json.'],
        ['$0 create pack.ts --workspace ws-abc123', 'Create the Pack in a specific workspace.'],
    ],
    link: [
        ['$0 link . 1234', 'Associate this directory with an existing Pack.'],
        ['$0 link . 5678 --yes', 'Overwrite an existing Pack id without prompting.'],
    ],
    validate: [['$0 validate pack.ts', 'Validate the Pack definition without uploading.']],
    release: [
        ['$0 release pack.ts 1.2.3 --notes "Bug fixes"', 'Release a specific uploaded version.'],
        ['$0 release pack.ts --notes "Bug fixes" --yes', 'Release from a non-main branch without prompting.'],
        ['$0 release pack.ts --use-latest --notes "Bug fixes"', 'Release the latest uploaded version.'],
    ],
    setOption: [
        ['$0 setOption pack.ts gitTag true', 'Create git tags on future releases.'],
        ['$0 setOption pack.ts apiEndpoint https://my-company.coda.io', 'Pin a single-tenant API endpoint.'],
    ],
};
function withExamples(argv, examples) {
    for (const [command, description] of examples) {
        argv.example(command, description);
    }
    return argv;
}
exports.commands = [
    {
        command: 'execute <manifestPath> <formulaName> [params..]',
        describe: 'Execute a formula',
        handler: execute_1.handleExecute,
        builder: {
            fetch: {
                boolean: true,
                desc: 'Actually fetch http requests instead of using mocks. Run "packs auth" first to set up credentials.',
                default: true,
            },
            vm: {
                boolean: true,
                desc: 'Execute the requested command in a virtual machine that mimics the environment the platform uses to execute Packs.' +
                    'This defaults to true if the isolated-vm package is installed, and to false if not.',
                default: Boolean((0, ivm_wrapper_1.tryGetIvm)()),
            },
            dynamicUrl: {
                string: true,
                desc: 'For a dynamic sync table with a variable source location, specify the URL to test here.',
            },
            timerStrategy: TimerStrategyArg,
            maxRows: {
                number: true,
                default: execution_1.DEFAULT_MAX_ROWS,
                desc: 'For a sync table, the maximum number of rows to sync.',
            },
            allowMultipleNetworkDomains: {
                boolean: true,
                default: false,
                desc: 'Allow executing Packs that use multiple network domains. You must get approval from Superhuman before you can upload these Packs.',
            },
        },
    },
    {
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
    },
    {
        command: 'init',
        describe: 'Initialize an empty Pack',
        handler: init_1.handleInit,
    },
    {
        command: 'extensions <tools..>',
        describe: 'Installs developer extensions for working with Packs.',
        builder: (yargs) => {
            yargs.positional('tools', {
                type: 'string',
                choices: Object.values(extensions_1.Tools),
                desc: 'Which tools to install extensions for.',
            });
            return yargs;
        },
        handler: extensions_2.handleExtensions,
    },
    {
        command: 'clone <packIdOrUrl>',
        describe: 'Clone an existing Pack that was created using Pack Studio',
        builder: {
            apiToken: ApiTokenArg,
            apiEndpoint: ApiEndpointArg,
            yes: YesArg,
        },
        handler: clone_1.handleClone,
    },
    {
        command: 'register [apiToken]',
        describe: 'Register API token to publish a Pack',
        builder: {
            apiEndpoint: ApiEndpointArg,
            open: {
                boolean: true,
                default: false,
                desc: 'Open the API token creation page in a browser.',
            },
            yes: YesArg,
        },
        handler: register_1.handleRegister,
    },
    {
        command: 'whoami [apiToken]',
        describe: 'Looks up information about the API token that is registered in this environment',
        builder: {
            apiEndpoint: ApiEndpointArg,
        },
        handler: whoami_1.handleWhoami,
    },
    {
        command: 'build <manifestFile>',
        describe: 'Build your Pack locally (not required; for debugging purposes only)',
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
            timerStrategy: TimerStrategyArg,
            intermediateOutputDirectory: {
                string: true,
                default: undefined,
            },
        },
        handler: build_1.handleBuild,
    },
    {
        command: 'upload <manifestFile>',
        describe: 'Build and upload your Pack version to the server',
        builder: {
            notes: {
                string: true,
                alias: 'n',
                describe: 'Notes about the contents of this Pack version',
            },
            intermediateOutputDirectory: {
                string: true,
                alias: 'o',
                default: './_upload_build',
            },
            timerStrategy: TimerStrategyArg,
            apiToken: ApiTokenArg,
            apiEndpoint: ApiEndpointArg,
            allowOlderSdkVersion: {
                boolean: true,
                desc: 'Not recommended. Allows uploading a Pack build that uses an older version of the ' +
                    'SDK than the prior Pack build.',
                default: false,
            },
        },
        handler: upload_1.handleUpload,
    },
    {
        command: 'create <manifestFile>',
        describe: 'Register a new Pack with the server',
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
            apiToken: ApiTokenArg,
            apiEndpoint: ApiEndpointArg,
        },
        handler: create_1.handleCreate,
    },
    {
        command: 'link <manifestDir> <packIdOrUrl>',
        describe: 'Link to a pre-existing Pack ID on the server',
        builder: {
            apiToken: ApiTokenArg,
            apiEndpoint: ApiEndpointArg,
            yes: YesArg,
        },
        handler: link_1.handleLink,
    },
    {
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
    },
    {
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
            gitTag: {
                boolean: true,
                alias: 'g',
                describe: `Create a git tag for this release (default: ${config_storage_2.DEFAULT_GIT_TAG}). Can also be enabled by default via \`packs setOption <manifestFile> gitTag true\``,
            },
            apiToken: ApiTokenArg,
            apiEndpoint: ApiEndpointArg,
            yes: YesArg,
            useLatest: {
                boolean: true,
                default: false,
                desc: 'Release the latest uploaded version when the manifest has no version.',
            },
        },
        handler: release_1.handleRelease,
    },
    {
        command: 'setOption <manifestFile> <option> <value>',
        describe: 'Set a persistent build option for the pack (.coda-pack.json)',
        handler: set_option_1.handleSetOption,
    },
];
if (require.main === module) {
    let cli = yargs_1.default.parserConfiguration({ 'parse-numbers': false }).middleware(helpers_1.backfillFromPackConfig);
    for (const cmd of exports.commands) {
        const name = cmd.command.split(' ')[0];
        cli = cli.command({
            ...cmd,
            builder: (argv) => {
                var _a;
                let next = argv;
                if (typeof cmd.builder === 'function') {
                    next = cmd.builder(argv);
                }
                else if (cmd.builder) {
                    next = argv.options(cmd.builder);
                }
                return withExamples(next, (_a = CommandExamples[name]) !== null && _a !== void 0 ? _a : []);
            },
        });
    }
    void cli.demandCommand().strict().help().argv;
}
