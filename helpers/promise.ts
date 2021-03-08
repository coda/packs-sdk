export interface Deferrable<R> {
  promise: Promise<R>;
  fulfill(result?: R): void; // result as optional here since TS doesn't treat R as any to support undefined
  reject(err: Error): void;
  isPending(): boolean;
  isFulfilled(): boolean;
  reason(): Error;
}

export function defer<R>(): Deferrable<R> {
  let _fulfill!: (result?: R) => void;
  let _reject!: (err: Error) => void;
  let _isPending: boolean = true;
  let _rejectError: Error | undefined;

  const promise = new Promise<R>((fnFulfill, fnReject) => {
    _fulfill = fnFulfill as (result?: R) => void;
    _reject = fnReject;
  });

  return {
    fulfill(result?: R): void {
      _isPending = false;
      _fulfill(result);
    },
    reject(err: Error): void {
      if (_isPending) {
        _rejectError = err;
        _isPending = false;
      }
      _reject(err);
    },
    promise,
    isPending(): boolean {
      return _isPending;
    },
    isFulfilled(): boolean {
      return !_isPending && !_rejectError;
    },
    reason(): Error {
      if (!_rejectError) {
        throw new Error('Not rejected');
      }
      return _rejectError;
    },
  };
}
