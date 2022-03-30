"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPromise = exports.deepCopy = exports.isNil = exports.isDefined = exports.deepFreeze = void 0;
function deepFreeze(obj) {
    Object.freeze(obj);
    for (const k of Object.keys(obj)) {
        const key = k;
        if (obj[key] !== null &&
            (typeof obj[key] === 'object' || typeof obj[key] === 'function') &&
            !Object.isFrozen(obj[key])) {
            deepFreeze(obj[key]);
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
function isPromise(obj) {
    // This method should generally be avoided but can be used for high throughput / performance
    // sensitive cases where avoiding wrapping of a value inside a Promise and conditionally handling
    // both cases (non-Promise and Promise) leads to performance gains.  I.e. limit this to formula engine
    return obj && typeof obj === 'object' && 'then' in obj;
}
exports.isPromise = isPromise;
