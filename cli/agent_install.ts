import type {ArgumentsCamelCase} from 'yargs';
import {buildAgentRouteUrl} from './agent_api';
import {confirmOrFail} from './confirm';
import * as path from 'path';
import {postAgentRoute} from './agent_api';
import {print} from '../testing/helpers';
import {printAndExit} from '../testing/helpers';
import {resolveAgentContext} from './agent_api';
import {storeAgentInstall} from './config_storage';

export interface AgentInstallArgs {
  manifestPath: string;
  version?: string;
  reinstall?: boolean;
  yes?: boolean;
  apiToken?: string;
  apiEndpoint: string;
}

export function buildAgentInstallUrl(apiEndpoint: string, packId: number, version: string): string {
  return buildAgentRouteUrl(apiEndpoint, packId, version, 'agentInstall');
}

function missingInstallRouteMessage(url: string): string {
  return (
    'The agent install endpoint is not available on this server.\n' +
    `  attempted: POST ${url}\n` +
    'The server needs a token-authed install route that binds a pack version to your account.\n' +
    'Until then: open the agent directory, search the agent by name, and click Open → install agent.'
  );
}

interface AgentInstallResponse {
  agentInstanceId: string;
  tenantId?: string;
  alreadyInstalled: boolean;
}

function readInstallResponse(body: unknown): AgentInstallResponse | undefined {
  if (typeof body !== 'object' || body === null) {
    return;
  }
  const record = body as {agentInstanceId?: unknown; tenantId?: unknown; alreadyInstalled?: unknown};
  if (typeof record.agentInstanceId !== 'string' || record.agentInstanceId.trim() === '') {
    return;
  }
  const tenantId = typeof record.tenantId === 'string' && record.tenantId.trim() !== '' ? record.tenantId : undefined;
  return {
    agentInstanceId: record.agentInstanceId,
    tenantId,
    alreadyInstalled: record.alreadyInstalled === true,
  };
}

function formatInstallResult({
  reinstall,
  alreadyInstalled,
  resolvedVersion,
  packId,
  agentInstanceId,
  tenantId,
}: {
  reinstall: boolean;
  alreadyInstalled: boolean;
  resolvedVersion: string;
  packId: number;
  agentInstanceId: string;
  tenantId?: string;
}): string {
  const identity = [`  agent instance: ${agentInstanceId}`];
  if (tenantId) {
    identity.push(`  tenant: ${tenantId}`);
  }
  const ids = identity.join('\n');
  if (reinstall) {
    return (
      `Reinstalled agent version ${resolvedVersion} of pack ${packId}.\n` +
      `${ids}\n` +
      'Tool grants and triggers rebound to this version.'
    );
  }
  if (alreadyInstalled) {
    return (
      `Agent version ${resolvedVersion} of pack ${packId} is already installed.\n` +
      `${ids}\n` +
      'Reinstall to rebind tool grants and triggers after changing them.'
    );
  }
  return (
    `Installed agent version ${resolvedVersion} of pack ${packId}.\n` +
    `${ids}\n` +
    'Triggers and tool grants copied at install time — reinstall after changing tools or triggers.'
  );
}

export async function handleAgentInstall({
  manifestPath,
  version,
  reinstall,
  yes,
  apiToken,
  apiEndpoint,
}: ArgumentsCamelCase<AgentInstallArgs>) {
  const {
    packId,
    resolvedVersion,
    apiToken: token,
  } = await resolveAgentContext({
    manifestPath,
    version,
    apiToken,
    apiEndpoint,
  });

  if (reinstall) {
    confirmOrFail({
      yes,
      prompt: `Reinstall version ${resolvedVersion}? This rebinds tool grants and triggers (y/N)? `,
      example: 'packs agent install pack.ts --reinstall --yes',
    });
  }

  const response = await postAgentRoute(
    'agentInstall',
    {
      apiToken: token,
      apiEndpoint,
      packId,
      version: resolvedVersion,
      progressVerb: 'installing the agent',
      commandNoun: 'install',
      missingRouteMessage: missingInstallRouteMessage,
    },
    {reinstall: reinstall ?? false},
  );

  let body: unknown;
  try {
    body = await response.json();
  } catch (err: any) {
    return printAndExit(`Agent install failed: the server response was not JSON. ${err}`);
  }
  const install = readInstallResponse(body);
  if (!install) {
    return printAndExit('Agent install failed: the server response did not include an agent instance id.');
  }

  storeAgentInstall(path.dirname(manifestPath), apiEndpoint, {
    packId,
    agentInstanceId: install.agentInstanceId,
    ...(install.tenantId ? {tenantId: install.tenantId} : {}),
  });
  print(
    formatInstallResult({
      reinstall: reinstall ?? false,
      alreadyInstalled: install.alreadyInstalled,
      resolvedVersion,
      packId,
      agentInstanceId: install.agentInstanceId,
      tenantId: install.tenantId,
    }),
  );
}
