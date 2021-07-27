export declare function marshalError(err: any): object | undefined;
export declare function unmarshalError(val: {
    [key: string]: any | undefined;
}): Error | undefined;
