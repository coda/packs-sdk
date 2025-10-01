export declare function deepFreeze<T extends {}>(obj: T): Readonly<T>;
/**
 * Returns whether the value is actually defined, i.e. is anything other than null or undefined.
 */
export declare function isDefined<T>(obj: T | null | undefined): obj is T;
/**
 * Returns whether the value has not been defined, i.e. is null or undefined.
 */
export declare function isNil<T>(obj: T | null | undefined): obj is null | undefined;
export declare function deepCopy<T>(obj: T): T;
/**
 * Returns whether the value is a Promise.
 */
export declare function isPromise<T>(obj: any): obj is Promise<T>;
/**
 * Type helper to ensure that a given type can only contain keys from another given type.
 * Prevents extraneous keys from being allowable.
 */
export type Exact<T, U> = T & Record<Exclude<keyof T, keyof U>, never>;
