export declare function marshalValueForAnyNodeVersion(val: any): string;
/**
 * Use unmarshalValueFromString() instead. It can determine what type of marshaling was used and
 * call the correct unmarshal function, which gives us more flexibility to swap between marshaling
 * types in the future.
 */
export declare function internalUnmarshalValueForAnyNodeVersion(marshaledValue: string | undefined): any;
export declare function legacyWrapError(err: Error): Error;
export declare function legacyUnwrapError(err: Error): Error;
