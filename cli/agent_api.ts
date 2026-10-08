import type {Client} from '../helpers/external-api/coda';
import {assertApiToken} from './helpers';
import {assertPackId} from './helpers';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import {formatResponseError} from './errors';
import {isResponseError} from '../helpers/external-api/coda';
import * as path from 'path';
import {printAndExit} from '../testing/helpers';
import {tryParseSystemError} from './errors';

export interface AgentContextArgs {
  manifestPath: string;
  version?: string;
  apiToken?: string;
  apiEndpoint: string;
}

export interface ResolvedAgentContext {
  packId: number;
  resolvedVersion: string;
  apiToken: string;
}

export async function resolveAgentVersion(
  client: Client,
  packId: number,
  requested?: string,
): Promise<string | undefined> {
  if (requested) {
    return requested;
  }
  const {items} = await client.listPackVersions(packId, {limit: 1});
  return items[0]?.packVersion;
}

export async function resolveAgentContext({
  manifestPath,
  version,
  apiToken,
  apiEndpoint,
}: AgentContextArgs): Promise<ResolvedAgentContext> {
  const manifestDir = path.dirname(manifestPath);
  const formattedEndpoint = formatEndpoint(apiEndpoint);
  const token = assertApiToken(apiEndpoint, apiToken);
  const packId = assertPackId(manifestDir, apiEndpoint);
  const client = createCodaClient(token, formattedEndpoint);

  let resolvedVersion: string | undefined;
  try {
    resolvedVersion = await resolveAgentVersion(client, packId, version);
  } catch (err: any) {
    if (isResponseError(err)) {
      return printAndExit(`Error while resolving pack version: ${await formatResponseError(err)}`);
    }
    throw err;
  }
  if (!resolvedVersion) {
    return printAndExit('Error: this pack has no uploaded versions yet.\n  packs upload <manifestFile>');
  }
  return {packId, resolvedVersion, apiToken: token};
}

export function buildAgentRouteUrl(apiEndpoint: string, packId: number, version: string, route: string): string {
  return `${formatEndpoint(apiEndpoint)}/apis/v1/packs/${packId}/versions/${version}/${route}`;
}

export function isApiErrorBody(bodyText: string): boolean {
  let parsed: unknown;
  try {
    parsed = JSON.parse(bodyText);
  } catch {
    return false;
  }
  return (
    typeof parsed === 'object' && parsed !== null && typeof (parsed as {statusCode?: unknown}).statusCode === 'number'
  );
}

export interface PostAgentRouteArgs {
  apiToken: string;
  apiEndpoint: string;
  packId: number;
  version: string;
  progressVerb: string;
  commandNoun: string;
  missingRouteMessage: (url: string) => string;
  accept?: string;
  signal?: AbortSignal;
}

export async function postAgentRoute(route: string, args: PostAgentRouteArgs, body: unknown): Promise<Response> {
  const url = buildAgentRouteUrl(args.apiEndpoint, args.packId, args.version, route);
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${args.apiToken}`,
        'Content-Type': 'application/json',
        ...(args.accept ? {Accept: args.accept} : {}),
      },
      body: JSON.stringify(body),
      ...(args.signal ? {signal: args.signal} : {}),
    });
  } catch (err: any) {
    const errors = [`Error while ${args.progressVerb}: ${err}`, tryParseSystemError(err)];
    return printAndExit(errors.join('\n'));
  }

  if (!response.ok) {
    const bodyText = await response.text();
    if (response.status === 404 && !isApiErrorBody(bodyText)) {
      return printAndExit(args.missingRouteMessage(url));
    }
    return printAndExit(`Agent ${args.commandNoun} failed: ${response.status} ${response.statusText}`);
  }
  return response;
}
