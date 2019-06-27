"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qs_1 = __importDefault(require("qs"));
const url_parse_1 = __importDefault(require("url-parse"));
const ensure_1 = require("./ensure");
function withQueryParams(url, params) {
    if (!params) {
        return url;
    }
    const parsedUrl = url_parse_1.default(url);
    // Merge the params together
    const updatedParams = Object.assign({}, qs_1.default.parse(parsedUrl.query, { ignoreQueryPrefix: true }), params);
    parsedUrl.set('query', qs_1.default.stringify(JSON.parse(JSON.stringify(updatedParams)), { addQueryPrefix: true }));
    return parsedUrl.toString();
}
exports.withQueryParams = withQueryParams;
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
        ensure_1.ensureNonEmptyString(token);
        combinedTokens.push(token);
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
