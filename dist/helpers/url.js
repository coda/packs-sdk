"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.join = exports.getQueryParams = exports.withQueryParams = void 0;
const ensure_1 = require("./ensure");
const qs_1 = __importDefault(require("qs"));
const url_parse_1 = __importDefault(require("url-parse"));
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
function withQueryParams(url, params) {
    if (!params) {
        return url;
    }
    const parsedUrl = (0, url_parse_1.default)(url);
    // Merge the params together
    const updatedParams = Object.assign({}, qs_1.default.parse(parsedUrl.query, { ignoreQueryPrefix: true }), params);
    parsedUrl.set('query', qs_1.default.stringify(JSON.parse(JSON.stringify(updatedParams)), { addQueryPrefix: true }));
    return parsedUrl.toString();
}
exports.withQueryParams = withQueryParams;
/**
 * Helper to take a URL string and return the parameters (if any) as a JavaScript object.
 *
 * @example
 * ```
 * // Returns `{token: "asdf", limit: "5"}`
 * let params = getQueryParams("/someApi/someEndpoint?token=asdf&limit=5");
 * ```
 */
function getQueryParams(url) {
    const parsedUrl = (0, url_parse_1.default)(url);
    // Merge the params together
    return qs_1.default.parse(parsedUrl.query, { ignoreQueryPrefix: true });
}
exports.getQueryParams = getQueryParams;
/**
 * Joins all the tokens into a single URL string separated by '/'. Zero length tokens cause errors.
 * @param tokens Zero or more tokens to be combined. If token doesn't end with '/', one will be added as the separator
 */
function join(...tokens) {
    if (!tokens || !tokens.length) {
        return '';
    }
    const combinedTokens = [];
    for (const token of tokens) {
        (0, ensure_1.ensureNonEmptyString)(token);
        if (combinedTokens.length === 0) {
            combinedTokens.push(token);
        }
        else {
            // Ensure tokens (other than the first) don't have leading slashes
            combinedTokens.push(token.replace(/^\/+/, ''));
        }
        if (!token.endsWith('/')) {
            combinedTokens.push('/');
        }
    }
    const combined = combinedTokens.join('');
    if (!tokens[tokens.length - 1].endsWith('/')) {
        // User didn't provide token with /, strip out the last one
        return combined.slice(0, combined.length - 1);
    }
    return combined;
}
exports.join = join;
