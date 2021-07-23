import util from 'util';
export interface CodaError {
  statusCode: number;
  statusMessage: string;
  message: string;
}

export function isCodaError(value: any): value is CodaError {
  return value && 'statusCode' in value && typeof value.statusCode === 'number' && value.statusCode >= 400;
}

export function tryParseSystemError(error: any) {
  // NB(alan): this should only be hit for Coda developers trying to use the CLI with their development server.
  if (error.errno === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
    return 'Run `export NODE_TLS_REJECT_UNAUTHORIZED=0` and rerun your command.';
  }
  return '';
}

export function formatError(obj: any): string {
  return util.inspect(obj, false, null, true);
}
