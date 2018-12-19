/** Returns the codomain for a map-like type. */
export type $Values<S> = S[keyof S];

// https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-378589263
/** Returns the base type with the specified keys excluded. */
export type $Omit<T, K extends string | number | symbol> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;

/** Omits subproperties K2 within properties K of T. */
export type $OmitNested<T, K extends string | number | symbol, K2 extends string | number | symbol> = {
  [P in keyof T]: P extends K ? $Omit<T[P], K2> : T[P]
};

// NOTE(oleg): we have to do this in two passes to work around circular dependencies.
// See https://github.com/Microsoft/TypeScript/issues/3496
export type $JsonSerialized<T> = T extends number | boolean | string | RegExp
  ? $_JsonSerialized<T>
  : (T extends Array<infer S> ? S[] : {[K in keyof T]: $JsonSerialized<T[K]>});

type $_JsonSerialized<T> = T extends number
  ? T
  : T extends boolean
  ? boolean
  : T extends string
  ? T
  : T extends RegExp
  ? string
  : T extends []
  ? $_JsonSerializedArray<T[0]>
  : T extends {}
  ? {[K in keyof T]: $_JsonSerialized<T[K]>}
  : never;
// tslint:disable-next-line:class-name
interface $_JsonSerializedArray<T> extends Array<$_JsonSerialized<T>> {}
