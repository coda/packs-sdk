import type {ResponseError} from '../helpers/external-api/coda';
import util from 'util';

export function tryParseSystemError(error: any) {
  // NB(alan): this should only be hit for Coda developers trying to use the CLI with their development server.
  if (error.errno === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
    return 'Run `export NODE_TLS_REJECT_UNAUTHORIZED=0` and rerun your command.';
  }
  return '';
}

export async function formatResponseError(err: ResponseError): Promise<string> {
  const {response} = err;
  const status = response.statusText ? `${response.status} ${response.statusText}` : `${response.status}`;
  const body = await tryReadResponseBody(response);
  return body ? `${status}: ${body}` : status;
}

async function tryReadResponseBody(response: ResponseError['response']): Promise<string> {
  let text: string;
  try {
    text = await response.text();
  } catch {
    // The body was unreadable (e.g. already consumed or a network error); fall back to the status alone.
    return '';
  }
  const trimmed = text.trim();
  if (!trimmed) {
    return '';
  }
  // Coda API errors are JSON, so pretty-print them. Non-JSON bodies (proxy/gateway errors,
  // plain text) are surfaced verbatim so the server-side message is never swallowed.
  try {
    return formatError(JSON.parse(trimmed));
  } catch {
    return trimmed;
  }
}

export function formatError(obj: any): string {
  return util.inspect(obj, false, null, true);
}
