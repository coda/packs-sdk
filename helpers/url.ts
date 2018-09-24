import qs from 'qs';
import urlParse from 'url-parse';

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
