#!/usr/bin/env node

import {DEFAULT_API_ENDPOINT} from './config_storage';
import {DEFAULT_OAUTH_SERVER_PORT} from '../testing/auth';
import {TimerShimStrategy} from '../testing/compile';
import {handleAuth} from './auth';
import {handleBuild} from './build';
import {handleCreate} from './create';
import {handleExecute} from './execute';
import {handleInit} from './init';
import {handleRegister} from './register';
import {handleRelease} from './release';
import {handleUpload} from './upload';
import {handleValidate} from './validate';
import yargs from 'yargs';

if (require.main === module) {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  void yargs
    .parserConfiguration({'parse-numbers': false})
    .command({
      command: 'execute <manifestPath> <formulaName> [params..]',
      describe: 'Execute a formula',
      handler: handleExecute,
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
          default: TimerShimStrategy.None,
          desc: 'Options: none, error, fake.',
        },
      },
    })
    .command({
      command: 'auth <manifestPath>',
      describe: 'Set up authentication for a Pack',
      handler: handleAuth,
      builder: {
        oauthServerPort: {
          alias: 'oauth_server_port',
          number: true,
          default: DEFAULT_OAUTH_SERVER_PORT,
          desc: 'Port to use for the local server that handles OAuth setup.',
        },
        extraOAuthScopes: {
          alias: 'extra_oauth_scopes',
          string: true,
          default: '',
          desc:
            `Scopes to request beyond those listed in the manifest, for specific formulas that ` +
            `need extra permissions. Example: --extra_oauth_scopes='first second third'`,
        },
      },
    })
    .command({
      command: 'init',
      describe: 'Initialize an empty Pack',
      handler: handleInit,
    })
    .command({
      command: 'register [apiToken]',
      describe: 'Register API token to publish a Pack',
      builder: {
        codaApiEndpoint: {
          string: true,
          hidden: true,
          default: DEFAULT_API_ENDPOINT,
        },
      },
      handler: handleRegister,
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
          default: TimerShimStrategy.None,
          desc: 'Options: none, error, fake.',
        },
      },
      handler: handleBuild,
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
          default: DEFAULT_API_ENDPOINT,
        },
        intermediateOutputDirectory: {
          string: true,
          alias: 'o',
          default: './_upload_build',
        },
      },
      handler: handleUpload,
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
          default: DEFAULT_API_ENDPOINT,
        },
      },
      handler: handleCreate,
    })
    .command({
      command: 'validate <manifestFile>',
      describe: 'Validate your Pack definition',
      handler: handleValidate,
    })
    .command({
      command: 'release <manifestFile> [packVersion]',
      describe:
        'Set the Pack version that is installable for users. You may specify a specific version, ' +
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
          default: DEFAULT_API_ENDPOINT,
        },
      },
      handler: handleRelease,
    })
    .demandCommand()
    .strict()
    .help().argv;
}
