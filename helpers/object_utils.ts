export function deepFreeze<T extends {}>(obj: T): Readonly<T> {
  Object.freeze(obj);

  for (const k of Object.keys(obj)) {
    const key = k as keyof T;
    if (
      obj[key] !== null &&
      (typeof obj[key] === 'object' || typeof obj[key] === 'function') &&
      !Object.isFrozen(obj[key])
    ) {
      deepFreeze(obj[key]);
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
