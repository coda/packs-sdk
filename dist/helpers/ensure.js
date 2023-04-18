"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureNever = exports.assertCondition = exports.ensureExists = exports.ensureNonEmptyString = exports.ensureUnreachable = void 0;
const api_1 = require("../api");
/**
 * Helper for TypeScript to make sure that handling of code forks is exhaustive,
 * most commonly with a `switch` statement.
 *
 * @example
 * ```
 * enum MyEnum {
 *   Foo = 'Foo',
 *   Bar = 'Bar',
 * }
 *
 * function handleEnum(value: MyEnum) {
 *   switch(value) {
 *     case MyEnum.Foo:
 *       return 'foo';
 *     case MyEnum.Bar:
 *       return 'bar';
 *     default:
 *       // This code is unreachable since the two cases above are exhaustive.
 *       // However, if a third value were added to MyEnum, TypeScript would flag
 *       // an error at this line, informing you that you need to update this piece of code.
 *       return ensureUnreachable(value);
 *   }
 * }
 * ```
 */
function ensureUnreachable(value, message) {
    throw new Error(message || `Unreachable code hit with value ${String(value)}`);
}
exports.ensureUnreachable = ensureUnreachable;
/**
 * Helper to check that a given value is a string, and is not the empty string.
 * If the value is not a string or is empty, an error will be raised at runtime.
 */
function ensureNonEmptyString(value, message) {
    if (typeof value !== 'string' || value.length === 0) {
        throw new (getErrorConstructor(message))(message || `Expected non-empty string for ${String(value)}`);
    }
    return value;
}
exports.ensureNonEmptyString = ensureNonEmptyString;
/**
 * Helper to check that a given value is defined, that is, is neither `undefined` nor `null`.
 * If the value is `undefined` or `null`, an error will be raised at runtime.
 *
 * This is typically used to inform TypeScript that you expect a given value to always exist.
 * Calling this function refines a type that can otherwise be null or undefined.
 */
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
/**
 * Helper to apply a TypeScript assertion to subsequent code. TypeScript can infer
 * type information from many expressions, and this helper applies those inferences
 * to all code that follows call to this function.
 *
 * See https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions
 *
 * @example
 * ```
 * function foo(value: string | number) {
 *   assertCondtion(typeof value === 'string');
 *   // TypeScript would otherwise compalin, because `value` could have been number,
 *   // but the above assertion refines the type based on the `typeof` expression.
 *   return value.toUpperCase();
 * }
 * ```
 */
function assertCondition(condition, message) {
    if (!condition) {
        throw new (getErrorConstructor(message))(message || 'Assertion failed');
    }
}
exports.assertCondition = assertCondition;
/**
 * Helper to check that a given type is empty/never at compile time.
 * In particular, useful to check whether a given a object is empty via `ensureNever<keyof typeof obj>()`.
 */
function ensureNever(_) { }
exports.ensureNever = ensureNever;
