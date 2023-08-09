import { CodaMarshalerType } from './constants';
import { MarshalingInjectedKeys } from './constants';
export declare enum TransformType {
    Buffer = "Buffer",
    Error = "Error"
}
export interface PostTransform {
    type: TransformType;
    path: string[];
}
export interface MarshaledValue {
    encoded: any;
    postTransforms: PostTransform[];
    [MarshalingInjectedKeys.CodaMarshaler]: CodaMarshalerType.Object;
}
export declare function isMarshaledValue(val: any): boolean;
export declare function marshalValuesForLogging(val: any[]): MarshaledValue[];
export declare function marshalValue(val: any): MarshaledValue;
export declare function marshalValueToStringForSameOrHigherNodeVersion(val: any, { useUnsafeVersionCompatibilityHack }: {
    useUnsafeVersionCompatibilityHack: boolean;
}): string;
export declare function unmarshalValueFromString(marshaledValue: string): any;
export declare function unmarshalValue(marshaledValue: any): any;
export declare function wrapErrorForSameOrHigherNodeVersion(err: Error, { useUnsafeVersionCompatibilityHack }: {
    useUnsafeVersionCompatibilityHack: boolean;
}): Error;
export declare function unwrapError(err: Error): Error;
export declare function marshalError(err: any): object | undefined;
export declare function unmarshalError(val: {
    [key: string]: any | undefined;
}): Error | undefined;
