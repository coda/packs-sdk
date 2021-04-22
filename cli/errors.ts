import util from 'util';
export interface CodaError {
  statusCode: number;
  statusMessage: string;
  message: string;
}

export function isCodaError(value: any): value is CodaError {
  return value && 'statusCode' in value && typeof value.statusCode === 'number' && value.statusCode >= 400;
}

export function formatError(obj: any): string {
  return util.inspect(obj, false, null, true);
}
