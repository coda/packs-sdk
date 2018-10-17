"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("../api");
function ensureUnreachable(value, message) {
    throw new Error(message || `Unreachable code hit with value ${String(value)}`);
}
exports.ensureUnreachable = ensureUnreachable;
function ensureNonEmptyString(value, message) {
    if (typeof value !== 'string' || value.length === 0) {
        throw new (getErrorConstructor(message))(message || `Expected non-empty string for ${String(value)}`);
    }
    return value;
}
exports.ensureNonEmptyString = ensureNonEmptyString;
function ensureExists(value, message) {
    if (typeof value === 'undefined' || value === null) {
        throw new (getErrorConstructor(message))(message || `Expected value for ${String(value)}`);
    }
    return value;
}
exports.ensureExists = ensureExists;
function getErrorConstructor(message) {
    return message ? api_1.UserVisibleError : Error;
}
