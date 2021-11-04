import {ensureNonEmptyString} from './ensure';
import qs from 'qs';
import urlParse from 'url-parse';

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
export function withQueryParams(url: string, params?: {[key: string]: any}): string {
  if (!params) {
    return url;
  }

  const parsedUrl = urlParse(url);
  // Merge the params together
  const updatedParams = Object.assign({}, qs.parse(parsedUrl.query as any, {ignoreQueryPrefix: true}), params);
  parsedUrl.set('query', qs.stringify(JSON.parse(JSON.stringify(updatedParams)), {addQueryPrefix: true}));
  return parsedUrl.toString();
}

/**
 * Helper to take a URL string and return the parameters (if any) as a JavaScript object.
 *
 * @example
 * ```
 * // Returns `{token: "asdf", limit: "5"}`
 * let params = getQueryParams("/someApi/someEndpoint?token=asdf&limit=5");
 * ```
 */
export function getQueryParams(url: string): {[key: string]: any} {
  const parsedUrl = urlParse(url);
  // Merge the params together
  return qs.parse(parsedUrl.query as any, {ignoreQueryPrefix: true});
}

/**
 * Joins all the tokens into a single URL string separated by '/'. Zero length tokens cause errors.
 * @param tokens Zero or more tokens to be combined. If token doesn't end with '/', one will be added as the separator
 */
export function join(...tokens: string[]): string {
  if (!tokens || !tokens.length) {
    return '';
  }

  const combinedTokens: string[] = [];
  for (const token of tokens) {
    ensureNonEmptyString(token);

    if (combinedTokens.length === 0) {
      combinedTokens.push(token);
    } else {
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
