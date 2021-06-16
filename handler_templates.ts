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
import {ensureExists} from './helpers/ensure';
import {isArray} from './schema';
import {isObject} from './schema';
import {withQueryParams} from './helpers/url';

type ParamMapper<T> = (val: T) => T;

export interface RequestHandlerTemplate {
  url: string;
  method: FetchMethodType;
  headers?: {[header: string]: string};
  nameMapping?: {[functionParamName: string]: string};
  transforms?: {[name: string]: ParamMapper<any>};
  queryParams?: string[];
  bodyTemplate?: object;
  bodyParams?: string[];
}

export interface ResponseHandlerTemplate<T extends Schema> {
  schema?: T;
  projectKey?: string;
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
  const remappedKeys: Map<string, string> = new Map();
  for (const key in properties) {
    if (properties.hasOwnProperty(key) && (properties[key] as ObjectSchemaProperty).fromKey) {
      remappedKeys.set(ensureExists((properties[key] as ObjectSchemaProperty).fromKey), key);
    }
  }

  const remappedObject: {[key: string]: any} = {};
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }

    const newKey = remappedKeys.get(key) || key;
    if (!schema.properties[newKey]) {
      continue;
    }
    remappedObject[newKey] = obj[key];
    const keySchema = schema.properties[newKey];
    const currentValue = remappedObject[newKey];
    if (Array.isArray(currentValue) && isArray(keySchema) && isObject(keySchema.items)) {
      remappedObject[newKey] = currentValue.map(val => mapKeys(val, keySchema.items));
    } else if (typeof currentValue === 'object' && isObject(keySchema)) {
      remappedObject[newKey] = mapKeys(currentValue, keySchema);
    }
  }
  return remappedObject;
}

export function transformBody(body: any, schema: Schema): any {
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

export function generateObjectResponseHandler<T extends Schema>(
  response: ResponseHandlerTemplate<T>,
): (response: FetchResponse, runtimeSchema?: T) => SchemaType<T> {
  const {projectKey, schema} = response;
  return function objectResponseHandler(resp: FetchResponse, runtimeSchema?: T) {
    const {body} = resp;
    if (typeof body !== 'object') {
      // This is an error, we'll flag it during validation.
      return body;
    }

    const projectedBody = projectKey ? body[projectKey] : body;
    if (!projectedBody) {
      // Also an error, we'll flag it during validation.
      return projectedBody;
    }

    // Give precedence to runtime provided schema
    const finalSchema = runtimeSchema || schema;
    if (!finalSchema) {
      return projectedBody;
    }

    return transformBody(projectedBody, finalSchema);
  };
}
