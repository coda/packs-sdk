export declare function marshalError(err: any, marshalFn: (val: any) => any): object | undefined;
export declare function unmarshalError(val: {
    [key: string]: any | undefined;
}, unmarshalFn: (val: any) => any): Error | undefined;
