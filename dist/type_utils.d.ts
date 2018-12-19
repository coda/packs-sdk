/** Returns the codomain for a map-like type. */
export declare type $Values<S> = S[keyof S];
/** Returns the base type with the specified keys excluded. */
export declare type $Omit<T, K extends string | number | symbol> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;
/** Omits subproperties K2 within properties K of T. */
export declare type $OmitNested<T, K extends string | number | symbol, K2 extends string | number | symbol> = {
    [P in keyof T]: P extends K ? $Omit<T[P], K2> : T[P];
};
export declare type $JsonSerialized<T> = T extends number | boolean | string | RegExp ? $_JsonSerialized<T> : (T extends Array<infer S> ? S[] : {
    [K in keyof T]: $JsonSerialized<T[K]>;
});
declare type $_JsonSerialized<T> = T extends number ? T : T extends boolean ? boolean : T extends string ? T : T extends RegExp ? string : T extends [] ? $_JsonSerializedArray<T[0]> : T extends {} ? {
    [K in keyof T]: $_JsonSerialized<T[K]>;
} : never;
interface $_JsonSerializedArray<T> extends Array<$_JsonSerialized<T>> {
}
export {};
