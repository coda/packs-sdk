export function deepFreeze<T extends {}>(obj: T): Readonly<T> {
  Object.freeze(obj);

  for (const k of Object.keys(obj)) {
    const key = k as keyof T;
    const value = obj[key];
    if (value !== null && (typeof value === 'object' || typeof value === 'function') && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  }

  return obj;
}

/**
 * Returns whether the value is actually defined, i.e. is anything other than null or undefined.
 */
export function isDefined<T>(obj: T | null | undefined): obj is T {
  return !isNil(obj);
}

/**
 * Returns whether the value has not been defined, i.e. is null or undefined.
 */
export function isNil<T>(obj: T | null | undefined): obj is null | undefined {
  return typeof obj === 'undefined' || obj === null;
}

export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Returns whether the value is a Promise.
 */
export function isPromise<T>(obj: any): obj is Promise<T> {
  return obj && typeof obj === 'object' && 'then' in obj;
}
