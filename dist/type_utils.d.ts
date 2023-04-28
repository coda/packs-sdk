/** Returns the codomain for a map-like type. */
export declare type $Values<S> = S[keyof S];
/** Omits properties over a union type, only if the union member has that property. */
export declare type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;
