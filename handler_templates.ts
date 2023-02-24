import type {FetchMethodType} from './api_types';
import type {FetchRequest} from './api_types';
import type {FetchResponse} from './api_types';
import type {ObjectSchemaProperty} from './schema';
import type {PackFormulaValue} from './api_types';
import type {ParamDef} from './api_types';
import type {ParamDefs} from './api_types';
import type {Schema} from './schema';
import type {SchemaType} from './schema';
import clone from 'clone';
import {deepCopy} from './helpers/object_utils';
import {ensureExists} from './helpers/ensure';
import {isArray} from './schema';
import {isObject} from './schema';
import {withQueryParams} from './helpers/url';

/**
 * Configuration for how to construct an HTTP request for a code-free formula definition
 * created using {@link makeTranslateObjectFormula}.
 *
 * @example
 * ```
 * coda.makeTranslateObjectFormula({
 *   name: "FetchWidget",
 *   description: "Fetches a widget.",
 *   parameters: [
 *     coda.makeParameter({type: coda.ParameterType.String, name: "id"}),
 *     coda.makeParameter({type: coda.ParameterType.String, name: "outputFormat"}),
 *   ],
 *   request: {
 *     method: "GET",
 *     url: "https://example.com/api/widgets/{id}",
 *     nameMapping: {outputFormat: "format"},
 *     transforms: {
 *       format: function(value) {
 *         return value.toLowerCase();
 *       },
 *     },
 *     queryParams: ["format"],
 *   },
 * });
 * ```
 *
 * If the user calls this formula as `FetchWidget("abc123", "JSON")`, this will make a `GET` request to
 * `https://example.com/api/widgets/abc123?format=json`.
 */
export interface RequestHandlerTemplate {
  /**
   * The URL to fetch.
   *
   * The path of the URL can include strong formatting directives that can be replaced with
   * formula parameters, e.g. "https://example.com/api/\{name\}".
   */
  url: string;
  /**
   * The HTTP method (verb) to use, e.g. "GET".
   *
   * If making a POST request or any request that uses a body payload, the body is
   * assumed to be JSON.
   */
  method: FetchMethodType;
  /** Any HTTP headers to include in the request. */
  headers?: {[header: string]: string};
  /**
   * An optional mapping from the name of a formula parameter to the name of a URL parameter
   * or template substitution variable in the body or URL path.
   *
   * Fetcher requests are constructed by inserting the user's parameter values into the URL
   * or body. You may use the formula parameter names to in your insertion templates or
   * as URL parameter names, but you may also use this mapping to rename the formula
   * parameters, if you wish to refer to them differently in your implementation
   * than how you present them to users.
   */
  nameMapping?: {[functionParamName: string]: string};
  /**
   * Optional transformations to apply to formula parameters. By default formula parameters
   * are passed through as-is to wherever you indicate in the fetcher request. However, if
   * you wish to tweak their values before constructing the request, you can apply transformations here.
   * The key is the name of the field, which is either the name of the formula parameter, or
   * the mapped name for that parameter if you specified a {@link nameMapping}.
   * The value is a JavaScript function that takes a user-provided parameter value and returns the value
   * that should be used in the request.
   */
  transforms?: {[name: string]: (val: any) => any};
  /**
   * The names of parameters that should be included in the request URL.
   *
   * That is, if some of the formula parameters should go into the URL and others should go into the body,
   * specify the subset of parameters here that should go into the URL. If all of the formula parameters
   * should become URL parameters, list all of the parameter names here.
   *
   * These are the mapped names if you are using {@link nameMapping}.
   */
  queryParams?: string[];
  /**
   * A base JavaScript object to be used as the body payload. Any parameters named in {@link bodyParams}
   * will be merged into this object, and the resulting object will be stringified and sent as the body.
   */
  bodyTemplate?: object;
  /**
   * The names of parameters that should be included in the request body, if applicable.
   *
   * That is, if some of the formula parameters should go into the URL and others should go into the body,
   * specify the subset of parameters here that should go into the body. If all of the formula parameters
   * should go into the body, list all of the parameter names here.
   *
   * These are the mapped names if you are using {@link nameMapping}.
   */
  bodyParams?: string[];
}

/**
 * Configuration for how to handle the response for a code-free formula definition
 * created using {@link makeTranslateObjectFormula}.
 */
export interface ResponseHandlerTemplate<T extends Schema> {
  /** The schema of the objects being returned. */
  schema?: T;
  /**
   * The key in the response body that indicates the objects of interest.
   *
   * Sometimes the response body is itself an array of objects, allowing you
   * to return the body as-is, but more commonly, the response body is
   * an object where one of its properties is the array of objects of interest,
   * with other properties containing metadata about the response.
   *
   * This allows you to specify a response property name to "project" out
   * the relevant part of the response body.
   *
   * For example, suppose the response body looks like:
   * ```
   * {
   *   items: [{name: "Alice"}, {name: "Bob"}],
   *   nextPageUrl: "/users?page=2",
   * }
   * ```
   *
   * You would set `projectKey: "items"` and the generated formula implementation
   * will return `response.body.items`.
   */
  projectKey?: string;
  /**
   * If specified, will catch HTTP errors and call this function with the error,
   * instead of letting them throw and the formula failing.
   */
  onError?(error: Error): any;
}

interface ParamMap {
  [name: string]: PackFormulaValue;
}

function generateParamMap(keys: string[], nameToValueMap: ParamMap, optionalNames?: Set<string>): ParamMap {
  const map: ParamMap = {};
  keys.forEach(key => {
    let val = nameToValueMap[key];
    if (typeof val === 'undefined') {
      if (optionalNames && optionalNames.has(key)) {
        return;
      }
      // Never pass undefined;
      val = '';
    }
    map[key] = val;
  });
  return map;
}

function generateQueryParamMap(
  keys: string[],
  nameToValueMap: ParamMap,
  optionalNames?: Set<string>,
): {[key: string]: string} {
  const map: {[key: string]: string} = {};
  keys.forEach(key => {
    let val = nameToValueMap[key];
    if (typeof val === 'undefined') {
      if (optionalNames && optionalNames.has(key)) {
        return;
      }
      // Never pass undefined;
      val = '';
    }
    map[key] = encodeURIComponent(String(val));
  });
  return map;
}

// A quick implemenation of string-template. Need to remove the package because it uses the
// `new Function(<code>)` syntax.
function formatString(template: string, params: {[key: string]: string}): string {
  let result = template;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`{${key}}`, value);
  }
  return result;
}

export function generateRequestHandler<ParamDefsT extends ParamDefs>(
  request: RequestHandlerTemplate,
  parameters: ParamDefsT,
): (params: PackFormulaValue[]) => FetchRequest {
  const {
    url,
    queryParams,
    nameMapping: paramNameMapping,
    bodyTemplate,
    bodyParams,
    method,
    headers,
    transforms,
  } = request;

  // Generate a map from index to name that we will use to bind args to the appropriate spots.
  const indexToNameMap: Map<number, string> = new Map();
  const names: Set<string> = new Set();
  const optionalNames: Set<string> = new Set();
  // TODO: Remove this cast once TS understands an array of size 0 in the typedef.
  (parameters as Array<ParamDef<any>>).forEach((arg, index) => {
    // Convert parameter name to internal name, if necessary.
    const name = (paramNameMapping && paramNameMapping[arg.name]) || arg.name;
    if (names.has(name)) {
      throw new Error(`Duplicate name ${name} detected`);
    }
    names.add(name);
    if (arg.optional) {
      optionalNames.add(name);
    }
    indexToNameMap.set(index, name);
  });

  const hasQueryParams = Boolean(queryParams && queryParams.length);
  const hasBodyParams = Boolean(bodyParams && bodyParams.length);

  return function requestHandler(params: PackFormulaValue[]) {
    const nameMapping: ParamMap = {};

    (params as PackFormulaValue[]).forEach((param, index) => {
      const paramName = ensureExists(indexToNameMap.get(index));
      const paramTransform = transforms ? transforms[paramName] : undefined;
      if (paramTransform) {
        const transformResult = paramTransform(param);
        if (transformResult && typeof transformResult === 'object') {
          // Merge these results into the name mapping since we are splaying out results.
          Object.assign(nameMapping, transformResult);
        } else {
          nameMapping[paramName] = transformResult;
        }
      } else {
        nameMapping[paramName] = param;
      }
    });

    // We don't know a priori which params are used within the URL, so generate a map for all of them.
    const baseUrl = formatString(url, generateQueryParamMap(Object.keys(nameMapping), nameMapping));
    const fullUrl = hasQueryParams
      ? withQueryParams(baseUrl, generateQueryParamMap(ensureExists(queryParams), nameMapping, optionalNames))
      : baseUrl;
    let body: object | undefined;
    if (bodyTemplate) {
      body = clone(bodyTemplate);
    }
    if (hasBodyParams) {
      const currentBodyParams = generateParamMap(ensureExists(bodyParams), nameMapping, optionalNames);
      // Merge the param if needed.
      body = body ? {...body, ...currentBodyParams} : currentBodyParams;
    }
    return {
      url: fullUrl,
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    };
  };
}

function mapKeys(obj: {[key: string]: any}, schema?: Schema): object {
  if (!(schema && isObject(schema))) {
    return obj;
  }

  const {properties} = schema;

  // Look at the properties of the schema and invert any keys if present.
  const remappedKeys: Map<string, string[]> = new Map();
  for (const key in properties) {
    if (properties.hasOwnProperty(key) && (properties[key] as ObjectSchemaProperty).fromKey) {
      const fromKey = ensureExists((properties[key] as ObjectSchemaProperty).fromKey);
      remappedKeys.set(fromKey, [...(remappedKeys.get(fromKey) || []), key]);
    }
  }

  const remappedObject: {[key: string]: any} = {};
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }

    const mappedKeys = remappedKeys.get(key) || [key];
    for (const newKey of mappedKeys) {
      if (!schema.properties[newKey] && !schema.includeUnknownProperties) {
        continue;
      }
      remappedObject[newKey] = mappedKeys.length > 1 ? deepCopy(obj[key]) : obj[key];
      const keySchema: Schema & ObjectSchemaProperty | undefined = schema.properties[newKey];
      const currentValue = remappedObject[newKey];
      if (Array.isArray(currentValue) && isArray(keySchema) && isObject(keySchema.items)) {
        remappedObject[newKey] = currentValue.map(val => mapKeys(val, keySchema.items));
      } else if (typeof currentValue === 'object' && isObject(keySchema)) {
        remappedObject[newKey] = mapKeys(currentValue, keySchema);
      }
    }
  }
  return remappedObject;
}

export function transformBody(body: any, schema: Schema | undefined): any {
  if (isArray(schema) && isObject(schema.items)) {
    const objects = body as Array<Record<string, any>>;
    const mappedObjs = objects.map(obj => mapKeys(obj, schema.items));
    return mappedObjs;
  }

  if (isObject(schema)) {
    return mapKeys(body, schema);
  }

  return body;
}

function getUnmapKeyLookup(schema?: Schema): Map<string, string> {
  const remappedKeys: Map<string, string> = new Map();

  if (!(schema && isObject(schema))) {
    return remappedKeys;
  }

  const {properties} = schema;
  for (const key in properties) {
    if (properties.hasOwnProperty(key) && (properties[key] as ObjectSchemaProperty).fromKey) {
      const fromKey = ensureExists((properties[key] as ObjectSchemaProperty).fromKey);
      remappedKeys.set(key, fromKey);
    }
  }
  return remappedKeys;
}

function unmapKeys(obj: {[key: string]: any}, schema?: Schema): object {
  if (!(schema && isObject(schema))) {
    return obj;
  }

  // Look at the properties of the schema and invert any keys if present.
  const remappedKeys = getUnmapKeyLookup(schema);
  const remappedObject: {[key: string]: any} = {};
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }

    const newKey = remappedKeys.get(key) || key;
    if (!schema.properties[key] && !schema.includeUnknownProperties) {
      continue;
    }
    remappedObject[newKey] = deepCopy(obj[key]);
    const keySchema: Schema & ObjectSchemaProperty | undefined = schema.properties[key];
    const currentValue = remappedObject[newKey];
    if (Array.isArray(currentValue) && isArray(keySchema) && isObject(keySchema.items)) {
      remappedObject[newKey] = currentValue.map(val => unmapKeys(val, keySchema.items));
    } else if (typeof currentValue === 'object' && isObject(keySchema)) {
      remappedObject[newKey] = unmapKeys(currentValue, keySchema);
    }
  }
  return remappedObject;
}

export function untransformBody(body: any, schema: Schema | undefined): any {
  if (isArray(schema) && isObject(schema.items)) {
    const objectBody = body as Record<string, any>;
    const mappedObjs = unmapKeys(objectBody, schema.items);
    return mappedObjs;
  }

  if (isObject(schema)) {
    return unmapKeys(body, schema);
  }

  return body;
}

/**
 * Reverses the transformation of schema object keys to the values expected by the pack.
 * Useful when passing in a list of keys from Coda -> Pack, such as when sending the aggregated
 * sync table update payload.
 */
export function untransformKeys(keys: string[], schema: Schema | undefined): string[] {
  const schemaObject = isArray(schema) && isObject(schema.items) ? schema.items : schema;
  const remappedKeys = getUnmapKeyLookup(schemaObject);
  return keys.map(key => remappedKeys.get(key) || key);
}

export function generateObjectResponseHandler<T extends Schema>(
  response: ResponseHandlerTemplate<T>,
): (response: FetchResponse, runtimeSchema?: T) => SchemaType<T> {
  const {projectKey} = response;
  return function objectResponseHandler(resp: FetchResponse) {
    const {body} = resp;
    if (typeof body !== 'object') {
      // This is an error, we'll flag it during validation.
      return body;
    }

    const projectedBody = projectKey ? body[projectKey] : body;
    return projectedBody;
  };
}
