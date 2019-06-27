import qs from 'qs';
import urlParse from 'url-parse';
import {ensureNonEmptyString} from './ensure';

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
