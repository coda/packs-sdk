export interface Deferrable<R> {
    promise: Promise<R>;
    fulfill(result?: R): void;
    reject(err: Error): void;
    isPending(): boolean;
    isFulfilled(): boolean;
    reason(): Error;
}
export declare function defer<R>(): Deferrable<R>;
