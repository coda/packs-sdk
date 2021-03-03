#!/usr/bin/env node

import {DEFAULT_CREDENTIALS_FILE} from '../testing/auth';
import {DEFAULT_OAUTH_SERVER_PORT} from '../testing/auth';
import type {Options} from 'yargs';
import {handleAuth} from './auth';
import {handleBuild} from './build';
import {handleCreate} from './create';
import {handleExecute} from './execute';
import {handleInit} from './init';
import {handlePublish} from './publish';
import {handleRegister} from './register';
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
        credentialsFile: {
          alias: 'credentials_file',
          string: true,
          default: DEFAULT_CREDENTIALS_FILE,
          desc: 'Path to the credentials file.',
        } as Options,
      },
    })
    .command({
      command: 'auth <manifestPath>',
      describe: 'Set up authentication for a pack',
      handler: handleAuth,
      builder: {
        credentialsFile: {
          alias: 'credentials_file',
          string: true,
          default: DEFAULT_CREDENTIALS_FILE,
          desc: 'Path to the credentials file.',
        } as Options,
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
      describe: 'Initialize an empty pack',
      handler: handleInit,
    })
    .command({
      command: 'register [apiToken]',
      describe: 'Register API token to publish a pack',
      builder: {
        codaApiEndpoint: {
          string: true,
          hidden: true,
          default: 'https://coda.io',
        } as Options,
      },
      handler: handleRegister,
    })
    .command({
      command: 'build <manifestFile>',
      describe: 'Generate a bundle for your pack',
      builder: {
        compiler: {
          string: true,
          default: 'esbuild',
          desc: '`esbuild` or `webpack`',
        } as Options,
      },
      handler: handleBuild,
    })
    .command({
      command: 'publish <manifestFile>',
      describe: 'Upload your pack to Coda',
      builder: {
        codaApiEndpoint: {
          string: true,
          hidden: true,
          default: 'https://coda.io',
        } as Options,
      },
      handler: handlePublish,
    })
    .command({
      command: 'create <packName>',
      describe: "Register a new pack with Coda's servers",
      builder: {
        codaApiEndpoint: {
          string: true,
          hidden: true,
          default: 'https://coda.io',
        } as Options,
      },
      handler: handleCreate,
    })
    .demandCommand()
    .strict()
    .help().argv;
}
