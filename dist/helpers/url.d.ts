/**
 * Helper to create a new URL by appending parameters to a base URL.
 *
 * The input URL may or may not having existing parameters.
 *
 * @example
 * ```
 * // Returns `"/someApi/someEndpoint?token=asdf&limit=5"`
 * let url = withQueryParams("/someApi/someEndpoint", {token: "asdf", limit: 5});
 * ```
 */
export declare function withQueryParams(url: string, params?: {
    [key: string]: any;
}): string;
/**
 * Helper to take a URL string and return the parameters (if any) as a JavaScript object.
 *
 * @example
 * ```
 * // Returns `{token: "asdf", limit: "5"}`
 * let params = getQueryParams("/someApi/someEndpoint?token=asdf&limit=5");
 * ```
 */
export declare function getQueryParams(url: string): {
    [key: string]: any;
};
/**
 * Joins all the tokens into a single URL string separated by '/'. Zero length tokens cause errors.
 * @param tokens Zero or more tokens to be combined. If token doesn't end with '/', one will be added as the separator
 */
export declare function join(...tokens: string[]): string;
