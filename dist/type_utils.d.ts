/** Returns the codomain for a map-like type. */
export declare type $Values<S> = S[keyof S];
/** Omits subproperties K2 within properties K of T. */
export declare type $OmitNested<T, K extends string | number | symbol, K2 extends string | number | symbol> = {
    [P in keyof T]: P extends K ? Omit<T[P], K2> : T[P];
};
