import type {ArgumentsCamelCase} from 'yargs';
import type {Client} from '../helpers/external-api/coda';
import {assertApiToken} from './helpers';
import {assertPackId} from './helpers';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import {formatResponseError} from './errors';
import {isResponseError} from '../helpers/external-api/coda';
import * as path from 'path';
import {print} from '../testing/helpers';
import {printAndExit} from '../testing/helpers';
import {tryParseSystemError} from './errors';

export interface AgentChatArgs {
  manifestPath: string;
  prompt: string;
  version?: string;
  thread?: string;
  apiToken?: string;
  apiEndpoint: string;
}

export function buildAgentChatUrl(apiEndpoint: string, packId: number, version: string): string {
  return `${formatEndpoint(apiEndpoint)}/apis/v1/packs/${packId}/versions/${version}/agentChat`;
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

function missingServerRouteError(apiEndpoint: string, packId: number, version: string): never {
  return printAndExit(
    'The agent chat endpoint is not available on this server.\n' +
      `  attempted: POST ${buildAgentChatUrl(apiEndpoint, packId, version)}\n` +
      'The server needs a token-authed alias of the streaming agent path ' +
      '(/agentRuntime/executeStreamingAgent).\n' +
      'Until then: packs upload pack.ts, then verify in the browser agent directory.',
  );
}

function printAgentEvent(line: string) {
  let event: unknown;
  try {
    event = JSON.parse(line);
  } catch {
    print(line);
    return;
  }
  if (typeof event === 'string') {
    print(event);
    return;
  }
  if (event && typeof event === 'object' && typeof (event as {text?: unknown}).text === 'string') {
    print((event as {text: string}).text);
    return;
  }
  print(line);
}

export async function handleAgentChat({
  manifestPath,
  prompt,
  version,
  thread,
  apiToken,
  apiEndpoint,
}: ArgumentsCamelCase<AgentChatArgs>) {
  const manifestDir = path.dirname(manifestPath);
  const formattedEndpoint = formatEndpoint(apiEndpoint);
  apiToken = assertApiToken(apiEndpoint, apiToken);
  const packId = assertPackId(manifestDir, apiEndpoint);
  const client = createCodaClient(apiToken, formattedEndpoint);

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
  print(`Chatting with version ${resolvedVersion}${version ? '' : ' (latest)'}.`);

  const url = buildAgentChatUrl(apiEndpoint, packId, resolvedVersion);
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/stream+json',
      },
      body: JSON.stringify({prompt, threadId: thread}),
      signal: AbortSignal.timeout(60000),
    });
  } catch (err: any) {
    const errors = [`Error while chatting with the agent: ${err}`, tryParseSystemError(err)];
    return printAndExit(errors.join('\n'));
  }

  if (!response.ok) {
    const bodyText = await response.text();
    if (response.status === 404 && !isApiErrorBody(bodyText)) {
      return missingServerRouteError(apiEndpoint, packId, resolvedVersion);
    }
    return printAndExit(`Agent chat failed: ${response.status} ${response.statusText}`);
  }

  const body = response.body;
  if (!body) {
    return printAndExit('Agent chat failed: empty response body.');
  }
  const reader = body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';
  for (;;) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    buffer += value;
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (line.trim()) {
        printAgentEvent(line);
      }
    }
  }
  if (buffer.trim()) {
    printAgentEvent(buffer);
  }
}
