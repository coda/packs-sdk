import {UserVisibleError} from '../api';

export function ensureUnreachable(value: never, message?: string): never {
  throw new Error(message || `Unreachable code hit with value ${String(value)}`);
}

export function ensureNonEmptyString(value: string | null | undefined, message?: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new (getErrorConstructor(message))(message || `Expected non-empty string for ${String(value)}`);
  }
  return value;
}

export function ensureExists<T>(value: T | null | undefined, message?: string): T {
  if (typeof value === 'undefined' || value === null) {
    throw new (getErrorConstructor(message))(message || `Expected value for ${String(value)}`);
  }
  return value;
}

function getErrorConstructor(message?: string): typeof Error | typeof UserVisibleError {
  return message ? UserVisibleError : Error;
}

export function assertCondition(condition: any, message?: string): asserts condition {
  if (!condition) {
    throw new (getErrorConstructor(message))(message || 'Assertion failed');
  }
}
