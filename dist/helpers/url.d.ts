export declare function withQueryParams(url: string, params?: {
    [key: string]: any;
}): string;
export declare function getQueryParams(url: string): {
    [key: string]: any;
};
/**
 * Joins all the tokens into a single URL string separated by '/'. Zero length tokens cause errors.
 * @param tokens Zero or more tokens to be combined. If token doesn't end with '/', one will be added as the separator
 */
export declare function join(...tokens: string[]): string;
