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
export declare function ensureUnreachable(value: never, message?: string): never;
/**
 * Helper to check that a given value is a string, and is not the empty string.
 * If the value is not a string or is empty, an error will be raised at runtime.
 */
export declare function ensureNonEmptyString(value: string | null | undefined, message?: string): string;
/**
 * Helper to check that a given value is defined, that is, is neither `undefined` nor `null`.
 * If the value is `undefined` or `null`, an error will be raised at runtime.
 *
 * This is typically used to inform TypeScript that you expect a given value to always exist.
 * Calling this function refines a type that can otherwise be null or undefined.
 */
export declare function ensureExists<T>(value: T | null | undefined, message?: string): T;
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
export declare function assertCondition(condition: any, message?: string): asserts condition;
/**
 * Helper to check that a given type is empty/never at compile time.
 * In particular, useful to check whether a given a object is empty via `ensureNever<keyof typeof obj>()`.
 */
export declare function ensureNever<T extends never>(_?: T): void;
