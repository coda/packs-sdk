#!/usr/bin/env node

import {DEFAULT_API_ENDPOINT} from './config_storage';
import {DEFAULT_OAUTH_SERVER_PORT} from '../testing/auth';
import type {Options} from 'yargs';
import {handleAuth} from './auth';
import {handleBuild} from './build';
import {handleCreate} from './create';
import {handleExecute} from './execute';
import {handleInit} from './init';
import {handlePublish} from './publish';
import {handleRegister} from './register';
import {handleSetLive} from './set_live';
import {handleValidate} from './validate';
import yargs from 'yargs';

if (require.main === module) {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  yargs
    .parserConfiguration({'parse-numbers': false})
    .command({
      command: 'execute <manifestPath> <formulaName> [params..]',
      describe: 'Execute a formula',
      handler: handleExecute,
      builder: {
        fetch: {
          boolean: true,
          desc: 'Actually fetch http requests instead of using mocks. Run "coda auth" first to set up credentials.',
        } as Options,
        vm: {
          boolean: true,
          desc: 'Execute the requested command in a virtual machine that mimics the environment Coda uses to execute Packs.',
        } as Options,
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
        } as Options,
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
        } as Options,
      },
      handler: handleRegister,
    })
    .command({
      command: 'build <manifestFile>',
      describe: 'Generate a bundle for your Pack',
      handler: handleBuild,
    })
    .command({
      command: 'publish <manifestFile>',
      describe: 'Upload your Pack to Coda',
      builder: {
        codaApiEndpoint: {
          string: true,
          hidden: true,
          default: DEFAULT_API_ENDPOINT,
        } as Options,
      },
      handler: handlePublish,
    })
    .command({
      command: 'create <manifestFile>',
      describe: "Register a new Pack with Coda's servers",
      builder: {
        codaApiEndpoint: {
          string: true,
          hidden: true,
          default: DEFAULT_API_ENDPOINT,
        } as Options,
      },
      handler: handleCreate,
    })
    .command({
      command: 'validate <manifestFile>',
      describe: 'Validate your Pack definition',
      handler: handleValidate,
    })
    .command({
      command: 'setLive <manifestFile> <packVersion>',
      describe: 'Set the Pack version that is installable for users.',
      builder: {
        codaApiEndpoint: {
          string: true,
          hidden: true,
          default: DEFAULT_API_ENDPOINT,
        } as Options,
      },
      handler: handleSetLive,
    })
    .demandCommand()
    .strict()
    .help().argv;
}
