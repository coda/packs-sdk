/** Returns the codomain for a map-like type. */
export type $Values<S> = S[keyof S];
/** Omits properties over a union type, only if the union member has that property. */
export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;
export type Assert<T extends true> = T;
/**
 * Ensures that all possible types of T extend BaseType.
 */
export type EnsureExtends<BaseType, T extends BaseType> = T;
