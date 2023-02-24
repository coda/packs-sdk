import type {ArgumentsCamelCase} from 'yargs';
import {PACK_ID_FILE_NAME} from './config_storage';
import {assertApiToken} from './helpers';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import {formatError} from './errors';
import {formatResponseError} from './errors';
import fs from 'fs';
import {getPackId} from './config_storage';
import {isResponseError} from '../helpers/external-api/coda';
import * as path from 'path';
import {printAndExit} from '../testing/helpers';
import {storePackId} from './config_storage';
import {tryParseSystemError} from './errors';

interface CreateArgs {
  manifestFile: string;
  codaApiEndpoint: string;
  name?: string;
  description?: string;
  workspace?: string;
  apiToken?: string;
}

export async function handleCreate({
  manifestFile,
  codaApiEndpoint,
  name,
  description,
  workspace,
  apiToken,
}: ArgumentsCamelCase<CreateArgs>) {
  await createPack(manifestFile, codaApiEndpoint, {name, description, workspace}, apiToken);
}

export async function createPack(
  manifestFile: string,
  codaApiEndpoint: string,
  {name, description, workspace}: {name?: string; description?: string; workspace?: string},
  apiToken?: string,
) {
  const manifestDir = path.dirname(manifestFile);
  const formattedEndpoint = formatEndpoint(codaApiEndpoint);
  apiToken = assertApiToken(codaApiEndpoint, apiToken);

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

  const codaClient = createCodaClient(apiToken, formattedEndpoint);
  try {
    const response = await codaClient.createPack({}, {name, description, workspaceId: parseWorkspace(workspace)});
    const packId = response.packId;
    storePackId(manifestDir, packId, codaApiEndpoint);
    return printAndExit(`Pack created successfully! You can manage pack settings at ${codaApiEndpoint}/p/${packId}`, 0);
  } catch (err: any) {
    if (isResponseError(err)) {
      return printAndExit(`Unable to create your pack, received error: ${await formatResponseError(err)}`);
    }
    const errors = [`Unable to create your pack, received error: ${formatError(err)}`, tryParseSystemError(err)];
    return printAndExit(errors.join('\n'));
  }
}

function parseWorkspace(workspace: string | undefined): string | undefined {
  if (workspace) {
    const match = /.*\/workspaces\/(ws-[A-Za-z0-9=_-]{10})/.exec(workspace);
    if (match) {
      return match[1];
    }
  }

  return workspace;
}
