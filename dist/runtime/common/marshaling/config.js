"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMarshaling = exports.finishMarshaling = exports.startMarshaling = void 0;
// This file is trying to create a global flag that toJSON overrides know to apply or not.
// It's no-op for some objects but will change the toJSON format for Date.
// The flag is not designed to be used by marshalers running in parallel. It's probably okay
// if marshalers don't yield explicitly. In most cases JS runs with no parallelism.
let _isMarshaling = false;
function startMarshaling() {
    _isMarshaling = true;
}
exports.startMarshaling = startMarshaling;
function finishMarshaling() {
    _isMarshaling = false;
}
exports.finishMarshaling = finishMarshaling;
function isMarshaling() {
    return _isMarshaling;
}
exports.isMarshaling = isMarshaling;
