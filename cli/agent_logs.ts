import type {ArgumentsCamelCase} from 'yargs';
import type {PublicApiPackLog} from '../helpers/external-api/v1';
import {PublicApiPackLogType} from '../helpers/external-api/v1';
import {assertApiToken} from './helpers';
import {assertPackId} from './helpers';
import {createCodaClient} from './helpers';
import {formatEndpoint} from './helpers';
import {formatResponseError} from './errors';
import {isResponseError} from '../helpers/external-api/coda';
import * as path from 'path';
import {print} from '../testing/helpers';
import {printAndExit} from '../testing/helpers';
import {resolveAgentVersion} from './agent_api';
import {tryParseSystemError} from './errors';

export interface AgentLogsArgs {
  manifestPath: string;
  tenant?: string;
  instance?: string;
  session?: string;
  limit?: number;
  tail?: boolean;
  apiToken?: string;
  apiEndpoint: string;
}

const TAIL_POLL_INTERVAL_MS = 5000;
const TAIL_MAX_POLLS = 60;

export function redactSecrets(text: string): string {
  return text
    .replace(/(bearer\s+)[^\s"']+/gi, '$1[redacted]')
    .replace(/(api[_-]?key["'\s:=]+)[^\s"',}]+/gi, '$1[redacted]');
}

function describeAgentTurn(log: Extract<PublicApiPackLog, {turnType: string}>): string {
  const parts = [log.turnType];
  if (log.fromAgent || log.toAgent) {
    parts.push(`(${log.fromAgent ?? '?'} → ${log.toAgent ?? '?'})`);
  }
  if (log.name) {
    parts.push(`[${log.name}]`);
  }
  if (log.model) {
    parts.push(`via ${log.model}`);
  }
  if (log.durationMs !== undefined) {
    parts.push(`${log.durationMs}ms`);
  }
  return parts.join(' ');
}

export function formatAgentLog(log: PublicApiPackLog): string {
  if (log.type === PublicApiPackLogType.AgentRuntime) {
    return redactSecrets(describeAgentTurn(log));
  }
  return redactSecrets(`[${log.type}]`);
}

export function firstSessionId(items: PublicApiPackLog[]): string | undefined {
  return items[0]?.context?.agentSessionId;
}

function logKey(item: PublicApiPackLog, fallback: string): string {
  return item.context?.logId ?? fallback;
}

function missingIdentityError(): never {
  return printAndExit(
    'Error: agent logs need a tenant and an agent instance.\n' +
      '  packs agent logs pack.ts --tenant <tenantId> --instance <agentInstanceId>\n' +
      'Find the instance id in the agent builder page URL after installing, and ask your workspace admin for the tenant id.',
  );
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function handleAgentLogs({
  manifestPath,
  tenant,
  instance,
  session,
  limit,
  tail,
  apiToken,
  apiEndpoint,
}: ArgumentsCamelCase<AgentLogsArgs>) {
  const manifestDir = path.dirname(manifestPath);
  const formattedEndpoint = formatEndpoint(apiEndpoint);
  apiToken = assertApiToken(apiEndpoint, apiToken);
  const packId = assertPackId(manifestDir, apiEndpoint);
  if (!tenant || !instance) {
    return missingIdentityError();
  }
  const client = createCodaClient(apiToken, formattedEndpoint);

  let resolvedVersion: string | undefined;
  try {
    resolvedVersion = await resolveAgentVersion(client, packId);
  } catch (err: any) {
    if (isResponseError(err)) {
      return printAndExit(`Error while resolving pack version: ${await formatResponseError(err)}`);
    }
    throw err;
  }

  let sessionId = session;
  if (!sessionId) {
    try {
      const sessions = await client.listAgentSessionIds(tenant, instance, {limit: 1});
      sessionId = firstSessionId(sessions.items);
    } catch (err: any) {
      if (isResponseError(err)) {
        return printAndExit(`Error while listing agent sessions: ${await formatResponseError(err)}`);
      }
      throw err;
    }
    if (!sessionId) {
      return printAndExit('No agent runs yet for this instance.\n  packs agent chat pack.ts "hello"');
    }
  }

  print(`Logs for pack ${packId}${resolvedVersion ? ` version ${resolvedVersion}` : ''}, session ${sessionId}.`);

  const sessionIds = [sessionId];
  const seen = new Set<string>();
  // Cursor per watched session: a shared cursor would let one chatty session
  // advance past another session's unread records, skipping them for good.
  const cursors = new Map<string, string>();
  let polls = 0;
  for (;;) {
    if (tail && !session) {
      // Pick up chat sessions that started since the last poll so --tail follows new runs.
      let fresh;
      try {
        fresh = await client.listAgentSessionIds(tenant, instance, {limit: 10});
      } catch (err: any) {
        if (isResponseError(err)) {
          return printAndExit(`Error while listing agent sessions: ${await formatResponseError(err)}`);
        }
        throw err;
      }
      for (const row of fresh.items) {
        const id = firstSessionId([row]);
        if (id && !sessionIds.includes(id)) {
          sessionIds.push(id);
          print(`Following new session ${id}.`);
        }
      }
    }

    for (const watchedSessionId of sessionIds) {
      // Drain every page before moving the cursor: with newest-first paging,
      // advancing past an undrained page would skip its records forever.
      const items = await fetchSessionLogs(client, {
        tenant,
        instance,
        sessionId: watchedSessionId,
        afterTimestamp: cursors.get(watchedSessionId),
        limit: limit ?? 20,
      });
      for (const item of items) {
        const key = logKey(item, `${item.type}:${item.context?.createdAt ?? ''}`);
        if (seen.has(key)) {
          continue;
        }
        seen.add(key);
        print(formatAgentLog(item));
        const createdAt = item.context?.createdAt;
        if (createdAt && createdAt > (cursors.get(watchedSessionId) ?? '')) {
          cursors.set(watchedSessionId, createdAt);
        }
      }
    }

    if (!tail) {
      return;
    }
    polls += 1;
    if (polls >= TAIL_MAX_POLLS) {
      print('Stopped polling after 5 minutes. Re-run with --tail to continue, or Ctrl-C to exit.');
      return;
    }
    await delay(TAIL_POLL_INTERVAL_MS);
  }
}

async function fetchSessionLogs(
  client: ReturnType<typeof createCodaClient>,
  {
    tenant,
    instance,
    sessionId,
    afterTimestamp,
    limit,
  }: {
    tenant: string;
    instance: string;
    sessionId: string;
    afterTimestamp?: string;
    limit: number;
  },
): Promise<PublicApiPackLog[]> {
  const items: PublicApiPackLog[] = [];
  let pageToken: string | undefined;
  for (;;) {
    let result;
    try {
      result = await client.listAgentLogs(tenant, instance, {
        agentSessionId: sessionId,
        afterTimestamp,
        limit,
        ...(pageToken ? {pageToken} : {}),
      });
    } catch (err: any) {
      if (isResponseError(err)) {
        return printAndExit(`Error while listing agent logs: ${await formatResponseError(err)}`);
      }
      const errors = [`Unexpected error while listing agent logs: ${err}`, tryParseSystemError(err)];
      return printAndExit(errors.join('\n'));
    }
    items.push(...result.items);
    if (!result.nextPageToken) {
      return items;
    }
    pageToken = result.nextPageToken;
  }
}
