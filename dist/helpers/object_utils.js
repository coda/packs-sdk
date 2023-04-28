"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPromise = exports.deepCopy = exports.isNil = exports.isDefined = exports.deepFreeze = void 0;
function deepFreeze(obj) {
    Object.freeze(obj);
    for (const k of Object.keys(obj)) {
        const key = k;
        const value = obj[key];
        if (value !== null && (typeof value === 'object' || typeof value === 'function') && !Object.isFrozen(value)) {
            deepFreeze(value);
        }
    }
    return obj;
}
exports.deepFreeze = deepFreeze;
/**
 * Returns whether the value is actually defined, i.e. is anything other than null or undefined.
 */
function isDefined(obj) {
    return !isNil(obj);
}
exports.isDefined = isDefined;
/**
 * Returns whether the value has not been defined, i.e. is null or undefined.
 */
function isNil(obj) {
    return typeof obj === 'undefined' || obj === null;
}
exports.isNil = isNil;
function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}
exports.deepCopy = deepCopy;
/**
 * Returns whether the value is a Promise.
 */
function isPromise(obj) {
    return obj && typeof obj === 'object' && 'then' in obj;
}
exports.isPromise = isPromise;
