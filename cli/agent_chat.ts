import type {ArgumentsCamelCase} from 'yargs';
import {assertApiToken} from './helpers';
import {assertPackId} from './helpers';
import {formatEndpoint} from './helpers';
import * as path from 'path';
import {print} from '../testing/helpers';
import {printAndExit} from '../testing/helpers';
import {tryParseSystemError} from './errors';

export interface AgentChatArgs {
  manifestPath: string;
  prompt: string;
  agentInstanceId: string;
  tenantId?: string;
  timeout?: number;
  apiToken?: string;
  apiEndpoint: string;
}

export interface AgentChatMessage {
  id: string;
  messageType: string;
  text: string;
  isComplete: boolean;
  createdAt: string;
}

interface TriggerResponse {
  executionId: string;
  chatId: string;
  agentInstanceId: string;
  tenantId: string;
  packId: number;
}

type RunStatus = 'queued' | 'running' | 'idle' | 'done' | 'failed' | 'needs_input';

interface StatusResponse {
  status: RunStatus;
  chatId: string;
  reason?: string;
}

const DEFAULT_TIMEOUT_SECS = 120;
const POLL_INTERVAL_MS = 2000;
const MAX_BACKOFF_MS = 10000;

export function buildTriggerAgentUrl(apiEndpoint: string): string {
  return `${formatEndpoint(apiEndpoint)}/apis/v1/agents/trigger`;
}

export function buildAgentRunStatusUrl(
  apiEndpoint: string,
  tenantId: string,
  agentInstanceId: string,
  chatId: string,
  executionId: string,
): string {
  return (
    `${formatEndpoint(apiEndpoint)}/apis/v1/go/tenants/${tenantId}` +
    `/agentInstances/${agentInstanceId}/chats/${chatId}/runStatus?${new URLSearchParams({executionId})}`
  );
}

export function buildAgentChatMessagesUrl(
  apiEndpoint: string,
  tenantId: string,
  agentInstanceId: string,
  chatId: string,
): string {
  return (
    `${formatEndpoint(apiEndpoint)}/apis/v1/go/tenants/${tenantId}` +
    `/agentInstances/${agentInstanceId}/chats/${chatId}/messages`
  );
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

export function describeRunReason(status: 'failed' | 'needs_input', reason: string | undefined): string {
  if (status === 'failed') {
    switch (reason) {
      case 'quota_exceeded':
        return 'the run exceeded its quota';
      case 'max_attempts_exceeded':
        return 'the run exhausted its attempts';
      case 'non_retriable_error':
        return 'the run hit an error it could not retry';
      default:
        return 'the run failed';
    }
  }
  switch (reason) {
    case 'tool_approval':
      return 'a tool call needs approval in the browser';
    case 'question':
      return 'the agent asked a question — answer it in the browser';
    case 'step_limit':
      return 'the run paused on its step limit with a partial reply below';
    default:
      return 'the run is waiting on input in the browser';
  }
}

// Every completed assistant text, oldest first. A run that writes, calls a
// tool, then wraps up reads like the browser transcript, not just the tail.
export function joinAssistantTexts(messages: AgentChatMessage[]): string | undefined {
  const texts = messages
    .filter(message => message.messageType === 'assistant' && message.isComplete && message.text)
    .sort((left, right) => (left.createdAt < right.createdAt ? -1 : left.createdAt > right.createdAt ? 1 : 0))
    .map(message => message.text);
  return texts.length > 0 ? texts.join('\n\n') : undefined;
}

export function nextBackoffMs(failedAttempts: number): number {
  return Math.min(1000 * 2 ** failedAttempts, MAX_BACKOFF_MS);
}

function assertTriggerResponse(body: unknown): TriggerResponse {
  if (
    typeof body !== 'object' ||
    body === null ||
    typeof (body as {executionId?: unknown}).executionId !== 'string' ||
    typeof (body as {chatId?: unknown}).chatId !== 'string' ||
    typeof (body as {agentInstanceId?: unknown}).agentInstanceId !== 'string' ||
    typeof (body as {tenantId?: unknown}).tenantId !== 'string' ||
    typeof (body as {packId?: unknown}).packId !== 'number'
  ) {
    throw new Error('Trigger response had an unexpected shape.');
  }
  return body as TriggerResponse;
}

function assertStatusResponse(body: unknown): StatusResponse {
  if (
    typeof body !== 'object' ||
    body === null ||
    typeof (body as {status?: unknown}).status !== 'string' ||
    typeof (body as {chatId?: unknown}).chatId !== 'string'
  ) {
    throw new Error('Status response had an unexpected shape.');
  }
  return body as StatusResponse;
}

function assertMessagesResponse(body: unknown): AgentChatMessage[] {
  if (typeof body !== 'object' || body === null || !Array.isArray((body as {messages?: unknown}).messages)) {
    throw new Error('Messages response had an unexpected shape.');
  }
  return (body as {messages: AgentChatMessage[]}).messages;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function readErrorBody(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return '';
  }
}

function isTransientStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

export async function handleAgentChat({
  manifestPath,
  prompt,
  agentInstanceId,
  tenantId: tenantIdFlag,
  timeout,
  apiToken,
  apiEndpoint,
}: ArgumentsCamelCase<AgentChatArgs>) {
  const manifestDir = path.dirname(manifestPath);
  const formattedEndpoint = formatEndpoint(apiEndpoint);
  apiToken = assertApiToken(apiEndpoint, apiToken);
  const packId = assertPackId(manifestDir, apiEndpoint);
  const headers = {Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json'};
  const timeoutSecs = timeout ?? DEFAULT_TIMEOUT_SECS;

  let triggerBody: TriggerResponse;
  try {
    const triggerResponse = await fetch(buildTriggerAgentUrl(apiEndpoint), {
      method: 'POST',
      headers,
      body: JSON.stringify({input: prompt, agentInstanceId}),
      signal: AbortSignal.timeout(30000),
    });
    if (!triggerResponse.ok) {
      const bodyText = await readErrorBody(triggerResponse);
      if (triggerResponse.status === 404 && !isApiErrorBody(bodyText)) {
        return printAndExit(
          'The agent trigger endpoint is not available on this server.\n' +
            'It ships with the agent runtime API — upgrade the server or verify in the browser agent directory.',
        );
      }
      if (triggerResponse.status === 404) {
        return printAndExit(
          'Agent not found or agent triggering is not enabled.\n' +
            '  Check --agentInstanceId (copy it from the installed agent URL) and that triggering is enabled.',
        );
      }
      if (triggerResponse.status === 429) {
        return printAndExit(`Agent is busy, retry later. (${triggerResponse.status} ${triggerResponse.statusText})`);
      }
      return printAndExit(`Agent trigger failed: ${triggerResponse.status} ${triggerResponse.statusText}`);
    }
    triggerBody = assertTriggerResponse(await triggerResponse.json());
  } catch (err: any) {
    const errors = [`Error while triggering the agent: ${err}`, tryParseSystemError(err)];
    return printAndExit(errors.join('\n'));
  }
  const {executionId, chatId} = triggerBody;
  if (triggerBody.packId !== packId) {
    return printAndExit(
      `Agent instance ${agentInstanceId} belongs to pack ${triggerBody.packId}, not pack ${packId}.\n` +
        '  A run has already been queued on that instance. Check it in the browser agent directory.\n' +
        `  execution: ${executionId}\n  chat: ${chatId}\n` +
        '  Install this pack first, or point --agentInstanceId at its install.',
    );
  }
  const tenantId = tenantIdFlag ?? triggerBody.tenantId;
  print(`Run queued for pack ${packId} (execution ${executionId}). Waiting for a reply…`);

  const deadlineMs = Date.now() + timeoutSecs * 1000;
  const statusUrl = buildAgentRunStatusUrl(formattedEndpoint, tenantId, agentInstanceId, chatId, executionId);
  const waitWithinDeadline = (ms: number) => {
    const remainingMs = Math.min(ms, deadlineMs - Date.now());
    return remainingMs > 0 ? sleep(remainingMs) : Promise.resolve();
  };
  let failedAttempts = 0;
  for (;;) {
    if (Date.now() >= deadlineMs) {
      return printAndExit(
        `Timed out waiting for the agent reply after ${timeoutSecs}s.\n` +
          `  execution: ${executionId}\n  chat: ${chatId}\n` +
          '  The run may still be going — check the browser agent directory, or retry with --timeout.',
      );
    }
    let statusResponse: Response;
    try {
      statusResponse = await fetch(statusUrl, {
        headers: {Authorization: `Bearer ${apiToken}`},
        signal: AbortSignal.timeout(Math.max(1, Math.ceil(Math.min(30000, deadlineMs - Date.now())))),
      });
    } catch {
      await waitWithinDeadline(nextBackoffMs(failedAttempts++));
      continue;
    }
    if (!statusResponse.ok) {
      if (isTransientStatus(statusResponse.status)) {
        await waitWithinDeadline(nextBackoffMs(failedAttempts++));
        continue;
      }
      return printAndExit(`Agent status check failed: ${statusResponse.status} ${statusResponse.statusText}`);
    }
    let statusBody: StatusResponse;
    try {
      statusBody = assertStatusResponse(await statusResponse.json());
      failedAttempts = 0;
    } catch (err: unknown) {
      const errors = [`Error while checking the agent run: ${err}`, tryParseSystemError(err)];
      return printAndExit(errors.join('\n'));
    }

    if (statusBody.status === 'queued' || statusBody.status === 'running') {
      await waitWithinDeadline(POLL_INTERVAL_MS);
      continue;
    }
    if (statusBody.status === 'failed') {
      return printAndExit(
        `Agent run failed: ${describeRunReason('failed', statusBody.reason)}. (execution ${executionId})`,
      );
    }
    if (statusBody.status === 'done') {
      const reply = await fetchReply({apiToken, apiEndpoint, tenantId, agentInstanceId, chatId});
      if (reply.error) {
        return printAndExit(
          `Run finished but reading the reply failed (chat ${chatId}): ${reply.error}\n` +
            '  The reply is still in the browser agent directory.',
        );
      }
      if (reply.text) {
        print(reply.text);
        return;
      }
      return printAndExit(
        'The run finished without a text reply.\n  Check the browser agent directory for tool-only output.',
      );
    }
    if (statusBody.status === 'needs_input') {
      const reply = await fetchReply({apiToken, apiEndpoint, tenantId, agentInstanceId, chatId});
      if (reply.error) {
        return printAndExit(
          `Run paused but reading the reply failed (chat ${chatId}): ${reply.error}\n` +
            '  The partial reply is still in the browser agent directory.',
        );
      }
      if (reply.text) {
        print(reply.text);
      }
      print(`Note: ${describeRunReason('needs_input', statusBody.reason)}.`);
      return;
    }
    await waitWithinDeadline(POLL_INTERVAL_MS);
  }
}

async function fetchReply({
  apiToken,
  apiEndpoint,
  tenantId,
  agentInstanceId,
  chatId,
}: {
  apiToken: string;
  apiEndpoint: string;
  tenantId: string;
  agentInstanceId: string;
  chatId: string;
}): Promise<{text?: string; error?: string}> {
  let messagesResponse: Response;
  try {
    messagesResponse = await fetch(
      `${buildAgentChatMessagesUrl(apiEndpoint, tenantId, agentInstanceId, chatId)}?limit=25`,
      {headers: {Authorization: `Bearer ${apiToken}`}, signal: AbortSignal.timeout(30000)},
    );
  } catch (err: any) {
    return {error: `${err}`};
  }
  if (!messagesResponse.ok) {
    return {error: `${messagesResponse.status} ${messagesResponse.statusText}`};
  }
  try {
    const messages = assertMessagesResponse(await messagesResponse.json());
    return {text: joinAssistantTexts(messages)};
  } catch (err: any) {
    return {error: `${err}`};
  }
}
