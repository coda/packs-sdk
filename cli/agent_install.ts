import type {ArgumentsCamelCase} from 'yargs';
import {buildAgentRouteUrl} from './agent_api';
import {confirmOrFail} from './confirm';
import {postAgentRoute} from './agent_api';
import {print} from '../testing/helpers';
import {resolveAgentContext} from './agent_api';

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

  await postAgentRoute(
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

  // TODO: once the server contract lands, read an `alreadyInstalled` field on the
  // success body to tell "already installed, nothing changed" apart from a fresh install.
  if (reinstall) {
    print(
      `Reinstalled agent version ${resolvedVersion} of pack ${packId}.\n` +
        'Tool grants and triggers rebound to this version.',
    );
  } else {
    print(
      `Installed agent version ${resolvedVersion} of pack ${packId}.\n` +
        'Triggers and tool grants copied at install time — reinstall after changing tools or triggers.',
    );
  }
}
