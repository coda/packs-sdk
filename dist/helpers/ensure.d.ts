export declare function ensureUnreachable(value: never, message?: string): never;
export declare function ensureNonEmptyString(value: string | null | undefined, message?: string): string;
export declare function ensureExists<T>(value: T | null | undefined, message?: string): T;
export declare function assertCondition(condition: any, message?: string): asserts condition;
