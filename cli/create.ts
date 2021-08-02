import type {Arguments} from 'yargs';
import {PACK_ID_FILE_NAME} from './config_storage';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import {formatError} from './errors';
import fs from 'fs';
import {getApiKey} from './config_storage';
import {getPackId} from './config_storage';
import {isCodaError} from './errors';
import * as path from 'path';
import {printAndExit} from '../testing/helpers';
import {storePackId} from './config_storage';
import {tryParseSystemError} from './errors';

interface CreateArgs {
  manifestFile: string;
  codaApiEndpoint: string;
  name?: string;
  description?: string;
}

export async function handleCreate({manifestFile, codaApiEndpoint, name, description}: Arguments<CreateArgs>) {
  await createPack(manifestFile, codaApiEndpoint, {name, description});
}

export async function createPack(
  manifestFile: string,
  codaApiEndpoint: string,
  {name, description}: {name?: string; description?: string},
) {
  const manifestDir = path.dirname(manifestFile);
  const formattedEndpoint = formatEndpoint(codaApiEndpoint);
  // TODO(alan): we probably want to redirect them to the `coda register`
  // flow if they don't have a Coda API token.
  const apiKey = getApiKey(codaApiEndpoint);
  if (!apiKey) {
    printAndExit('Missing API key. Please run `coda register <apiKey>` to register one.');
  }

  if (!fs.existsSync(manifestFile)) {
    return printAndExit(`${manifestFile} is not a valid pack definition file. Check the filename and try again.`);
  }

  const existingPackId = getPackId(manifestDir, codaApiEndpoint);
  if (existingPackId) {
    return printAndExit(
      `This directory has already been registered on ${codaApiEndpoint} with pack id ${existingPackId}.\n` +
        `If you're trying to create a new pack from a different manifest, you should put the new manifest in a different directory.\n` +
        `If you're intentionally trying to create a new pack, you can delete ${PACK_ID_FILE_NAME} in this directory and try again.`,
    );
  }

  const codaClient = createCodaClient(apiKey, formattedEndpoint);
  try {
    const response = await codaClient.createPack({}, {name, description});
    if (isCodaError(response)) {
      return printAndExit(`Unable to create your pack, received error: ${formatError(response)}`);
    }
    const packId = response.packId;
    storePackId(manifestDir, packId, codaApiEndpoint);
    return printAndExit(`Pack created successfully! You can manage pack settings at ${codaApiEndpoint}/p/${packId}`, 0);
  } catch (err) {
    const errors = [`Unable to create your pack, received error: ${formatError(err)}`, tryParseSystemError(err)];
    return printAndExit(errors.join('\n'));
  }
}
