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
  const json = await err.response.json();
  return formatError(json);
}

export function formatError(obj: any): string {
  return util.inspect(obj, false, null, true);
}
