import {FetchRequest} from './api_types';
import {FetchResponse} from './api_types';
import {ObjectSchemaProperty} from './schema';
import {PackFormulaValue} from './api_types';
import {ParamDef} from './api_types';
import {ParamDefs} from './api_types';
import {Schema} from './schema';
import {SchemaType} from './schema';
import clone from 'clone';
import compileTemplate from 'string-template/compile';
import {ensureExists} from './helpers/ensure';
import {isArray} from './schema';
import {isObject} from './schema';
import {withQueryParams} from './helpers/url';

type ParamMapper<T> = (val: T) => T;

export interface RequestHandlerTemplate {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
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
  excludeExtraneous?: boolean;
  onError?(error: Error): any;
}

interface ParamMap {
  [name: string]: PackFormulaValue;
}

function generateParamMap(keys: string[], nameToValueMap: ParamMap): ParamMap {
  const map: ParamMap = {};
  keys.forEach(key => {
    map[key] = nameToValueMap[key] || '';
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

  const urlTemplate = compileTemplate(url);

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
    const baseUrl = urlTemplate(generateQueryParamMap(Object.keys(nameMapping), nameMapping));
    const fullUrl = hasQueryParams
      ? withQueryParams(baseUrl, generateQueryParamMap(ensureExists(queryParams), nameMapping, optionalNames))
      : baseUrl;
    let body: object | undefined;
    if (bodyTemplate) {
      body = clone(bodyTemplate);
    }
    if (hasBodyParams) {
      const currentBodyParams = generateParamMap(ensureExists(bodyParams), nameMapping);
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

function mapKeys(obj: {[key: string]: any}, excludeExtraneous?: boolean, schema?: Schema): object {
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
    if (excludeExtraneous && !schema.properties[newKey]) {
      continue;
    }
    remappedObject[newKey] = obj[key];
    const keySchema = schema.properties[newKey];
    const currentValue = remappedObject[newKey];
    if (Array.isArray(currentValue) && isArray(keySchema) && isObject(keySchema.items)) {
      remappedObject[newKey] = currentValue.map(val => mapKeys(val, excludeExtraneous, keySchema.items));
    } else if (typeof currentValue === 'object' && isObject(keySchema)) {
      remappedObject[newKey] = mapKeys(currentValue, excludeExtraneous, keySchema);
    }
  }
  return remappedObject;
}

export function generateObjectResponseHandler<T extends Schema>(
  response: ResponseHandlerTemplate<T>,
): (response: FetchResponse) => SchemaType<T> {
  const {projectKey, schema, excludeExtraneous} = response;
  return function objectResponseHandler(resp: FetchResponse) {
    const {body} = resp;
    if (typeof body !== 'object') {
      throw new Error(`Invalid response type ${typeof body} for ${body}`);
    }

    const projectedBody = projectKey ? body[projectKey] : body;
    if (!projectedBody) {
      throw new Error(`Empty value for body, projected ${projectKey}`);
    }

    if (!schema) {
      return projectedBody;
    }

    if (isArray(schema) && isObject(schema.items)) {
      const objects = projectedBody as object[];
      const mappedObjs = objects.map((obj: {[key: string]: any}) => mapKeys(obj, excludeExtraneous, schema.items));
      return mappedObjs;
    }

    if (isObject(schema)) {
      return mapKeys(projectedBody, excludeExtraneous, schema);
    }

    return projectedBody;
  };
}
