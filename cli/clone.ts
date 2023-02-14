import type {ArgumentsCamelCase} from 'yargs';
import type {Client} from '../helpers/external-api/coda';
import {assertApiToken} from './helpers';
import {assertPackIdOrUrl} from './helpers';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import fs from 'fs-extra';
import {handleInit} from './init';
import {isResponseError} from '../helpers/external-api/coda';
import path from 'path';
import {print} from '../testing/helpers';
import {printAndExit} from '../testing/helpers';
import {promptForInput} from '../testing/helpers';
import {storePackId} from './config_storage';

interface CloneArgs {
  packIdOrUrl: string;
  codaApiEndpoint: string;
  apiToken?: string;
}

export async function handleClone({packIdOrUrl, codaApiEndpoint, apiToken}: ArgumentsCamelCase<CloneArgs>) {
  const manifestDir = process.cwd();
  const packId = assertPackIdOrUrl(packIdOrUrl);
  const formattedEndpoint = formatEndpoint(codaApiEndpoint);
  apiToken = assertApiToken(codaApiEndpoint, apiToken);

  const codeAlreadyExists = fs.existsSync(path.join(manifestDir, 'pack.ts'));
  if (codeAlreadyExists) {
    const shouldOverwrite = promptForInput('A pack.ts file already exists. Do you want to overwrite it? (y/N)?', {
      yesOrNo: true,
    });
    if (shouldOverwrite.toLocaleLowerCase() !== 'yes') {
      return printAndExit('Aborting');
    }
  }

  const client = createCodaClient(apiToken, formattedEndpoint);

  let packVersion: string | null;
  try {
    packVersion = await getPackLatestVersion(client, packId);
    if (!packVersion) {
      return printAndExit(`No built versions found for pack ${packId}. Only built versions can be cloned.`);
    }
  } catch (err: any) {
    maybeHandleClientError(err);
    throw err;
  }

  let sourceCode: string | null;
  try {
    sourceCode = await getPackSource(client, packId, packVersion);
  } catch (err: any) {
    maybeHandleClientError(err);
    throw err;
  }

  if (!sourceCode) {
    print(`Unable to download source for Pack version ${packVersion}. Packs built using the CLI can't be cloned.`);

    const shouldInitializeWithoutDownload = promptForInput(
      'Do you want to continue initializing with template starter code instead (y/N)?',
      {yesOrNo: true},
    );
    if (shouldInitializeWithoutDownload !== 'yes') {
      return process.exit(1);
    }

    await handleInit();
    storePackId(manifestDir, packId, codaApiEndpoint);
    return;
  }

  print(`Fetched source at version ${packVersion}`);

  await handleInit();
  storePackId(manifestDir, packId, codaApiEndpoint);

  fs.writeFileSync(path.join(manifestDir, 'pack.ts'), sourceCode);
  printAndExit("Successfully updated pack.ts with the Pack's code!", 0);
}

function maybeHandleClientError(err: any) {
  if (isResponseError(err)) {
    switch (err.response.status) {
      case 401:
      case 403:
      case 404:
        return printAndExit("You don't have permission to edit this pack.");
    }
  }
}

async function getPackLatestVersion(client: Client, packId: number) {
  const {items} = await client.listPackVersions(packId, {limit: 1});
  if (!items || !items[0]) {
    return null;
  }
  return items[0].packVersion;
}

async function getPackSource(client: Client, packId: number, version: string) {
  const {files} = await client.getPackSourceCode(packId, version);

  if (files.length !== 1 || !files[0].filename.endsWith('.ts')) {
    return null;
  }

  const onlyFile = files[0];

  // Fetch existing source code
  const response = await fetch(onlyFile.url, {
    headers: {
      'Content-Type': 'application/javascript',
      'User-Agent': 'Coda-Typescript-API-Client',
    },
  });
  if (response.status >= 400) {
    return printAndExit(`Error while fetching pack source code: ${response.statusText}`);
  }
  return response.text();
}
