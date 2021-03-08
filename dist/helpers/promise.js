"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defer = void 0;
function defer() {
    let _fulfill;
    let _reject;
    let _isPending = true;
    let _rejectError;
    const promise = new Promise((fnFulfill, fnReject) => {
        _fulfill = fnFulfill;
        _reject = fnReject;
    });
    return {
        fulfill(result) {
            _isPending = false;
            _fulfill(result);
        },
        reject(err) {
            if (_isPending) {
                _rejectError = err;
                _isPending = false;
            }
            _reject(err);
        },
        promise,
        isPending() {
            return _isPending;
        },
        isFulfilled() {
            return !_isPending && !_rejectError;
        },
        reason() {
            if (!_rejectError) {
                throw new Error('Not rejected');
            }
            return _rejectError;
        },
    };
}
exports.defer = defer;
