export function deepFreeze(obj) {
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
/**
 * Returns whether the value is actually defined, i.e. is anything other than null or undefined.
 */
export function isDefined(obj) {
    return !isNil(obj);
}
/**
 * Returns whether the value has not been defined, i.e. is null or undefined.
 */
export function isNil(obj) {
    return typeof obj === 'undefined' || obj === null;
}
export function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}
/**
 * Returns whether the value is a Promise.
 */
export function isPromise(obj) {
    return obj && typeof obj === 'object' && 'then' in obj;
}
