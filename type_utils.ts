/** Returns the codomain for a map-like type. */
export type $Values<S> = S[keyof S];

// https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-378589263
/** Returns the base type with the specified keys excluded. */
export type $Omit<T, K extends string | number | symbol> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;

/** Omits subproperties K2 within properties K of T. */
export type $OmitNested<T, K extends string | number | symbol, K2 extends string | number | symbol> = {
  [P in keyof T]: P extends K ? $Omit<T[P], K2> : T[P]
};
