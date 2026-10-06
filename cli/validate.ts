import type {AgentTool} from '../types';
import type {ArgumentsCamelCase} from 'yargs';
import type {Client} from '../helpers/external-api/coda';
import type {PackMetadataValidationError} from '../testing/upload_validation';
import type {PackVersionDefinition} from '..';
import type {PackVersionMetadata} from '../compiled_types';
import {ToolType} from '../types';
import type {ValidationError} from '../testing/types';
import {compilePackBundle} from '../testing/compile';
import {compilePackMetadata} from '../helpers/metadata';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import {formatResponseError} from './errors';
import {getApiKey} from './config_storage';
import {importManifest} from './helpers';
import {isResponseError} from '../helpers/external-api/coda';
import {isTestCommand} from './helpers';
import {makeManifestFullPath} from './helpers';
import {print} from '../testing/helpers';
import {printAndExit} from '../testing/helpers';
import {validatePackVersionMetadata} from '../testing/upload_validation';

interface ValidateArgs {
  manifestFile: string;
  checkDeprecationWarnings: boolean;
  checkConnectors?: boolean;
  apiToken?: string;
  apiEndpoint: string;
}

export async function handleValidate({
  manifestFile,
  checkDeprecationWarnings,
  checkConnectors,
  apiToken,
  apiEndpoint,
}: ArgumentsCamelCase<ValidateArgs>) {
  const fullManifestPath = makeManifestFullPath(manifestFile);
  const {bundlePath} = await compilePackBundle({manifestPath: fullManifestPath, minify: false});
  const manifest = await importManifest<PackVersionDefinition>(bundlePath);

  // Since it's okay to not specify a version, we inject one if it's not provided.
  if (!manifest.version) {
    manifest.version = '1';
  }

  if (manifest.agent) {
    if ((manifest.agent.tools ?? []).length === 0) {
      print('tools: none (chat-only)');
    }
    if (checkConnectors !== false) {
      const endpoint = formatEndpoint(apiEndpoint);
      const token = apiToken ?? getApiKey(endpoint);
      if (token) {
        const client = createCodaClient(token, endpoint);
        const connectorIds = getConnectorPackIds(manifest.agent.tools ?? []);
        for (const warning of await checkAgentConnectorListings(client, connectorIds)) {
          print(`warning: ${warning}`);
        }
      }
    }
  }

  const metadata = compilePackMetadata(manifest);
  return validateMetadata(metadata, {checkDeprecationWarnings});
}

export function getConnectorPackIds(tools: AgentTool[]): number[] {
  const packIds: number[] = [];
  for (const tool of tools) {
    if (tool.type === ToolType.Pack) {
      packIds.push(tool.packId);
    }
  }
  return packIds;
}

export async function checkAgentConnectorListings(
  client: Pick<Client, 'getPackListing'>,
  packIds: number[],
): Promise<string[]> {
  const results = await Promise.allSettled(packIds.map(packId => client.getPackListing(packId)));
  const warnings: string[] = [];
  for (const [index, result] of results.entries()) {
    if (result.status === 'rejected') {
      const err = result.reason;
      if (isResponseError(err)) {
        warnings.push(
          `Connector pack ${packIds[index]} was not found or is not visible to this token: ${await formatResponseError(err)}. ` +
            'Find connector IDs at https://superhuman.com/store/connectors.',
        );
      } else {
        throw err;
      }
    }
  }
  return warnings;
}

export async function validateMetadata(
  metadata: PackVersionMetadata,
  {checkDeprecationWarnings = true}: {checkDeprecationWarnings?: boolean} = {},
) {
  // Since package.json isn't in dist, we grab it from the root directory instead.
  const packageJson = await import(isTestCommand() ? '../package.json' : '../../package.json');
  const codaPacksSDKVersion = packageJson.version as string;

  try {
    await validatePackVersionMetadata(metadata, codaPacksSDKVersion);
  } catch (e: any) {
    const packMetadataValidationError = e as PackMetadataValidationError;
    const validationErrors = packMetadataValidationError.validationErrors?.map(makeErrorMessage).join('\n');
    printAndExit(`${e.message}: \n${validationErrors}`);
  }

  if (!checkDeprecationWarnings) {
    print('Pack is valid.');
    return;
  }

  try {
    await validatePackVersionMetadata(metadata, codaPacksSDKVersion, {warningMode: true});
  } catch (e: any) {
    const packMetadataValidationError = e as PackMetadataValidationError;
    const deprecationWarnings = packMetadataValidationError.validationErrors?.map(makeWarningMessage).join('\n');
    printAndExit(`Your Pack is using deprecated properties or features: \n${deprecationWarnings}`, 0);
  }

  print('Pack is valid.');
}

function makeErrorMessage({path, message}: ValidationError): string {
  if (path) {
    return `Error in field at path "${path}": ${message}`;
  }
  return message;
}

function makeWarningMessage({path, message}: ValidationError): string {
  if (path) {
    return `Warning in field at path "${path}": ${message} This will become an error in a future SDK version.`;
  }
  return message;
}
