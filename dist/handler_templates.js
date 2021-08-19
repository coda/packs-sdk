"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateObjectResponseHandler = exports.transformBody = exports.generateRequestHandler = void 0;
const clone_1 = __importDefault(require("clone"));
const ensure_1 = require("./helpers/ensure");
const schema_1 = require("./schema");
const schema_2 = require("./schema");
const url_1 = require("./helpers/url");
function generateParamMap(keys, nameToValueMap, optionalNames) {
    const map = {};
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
function generateQueryParamMap(keys, nameToValueMap, optionalNames) {
    const map = {};
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
function formatString(template, params) {
    let result = template;
    for (const [key, value] of Object.entries(params)) {
        result = result.replace(`{${key}}`, value);
    }
    return result;
}
function generateRequestHandler(request, parameters) {
    const { url, queryParams, nameMapping: paramNameMapping, bodyTemplate, bodyParams, method, headers, transforms, } = request;
    // Generate a map from index to name that we will use to bind args to the appropriate spots.
    const indexToNameMap = new Map();
    const names = new Set();
    const optionalNames = new Set();
    // TODO: Remove this cast once TS understands an array of size 0 in the typedef.
    parameters.forEach((arg, index) => {
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
    return function requestHandler(params) {
        const nameMapping = {};
        params.forEach((param, index) => {
            const paramName = ensure_1.ensureExists(indexToNameMap.get(index));
            const paramTransform = transforms ? transforms[paramName] : undefined;
            if (paramTransform) {
                const transformResult = paramTransform(param);
                if (transformResult && typeof transformResult === 'object') {
                    // Merge these results into the name mapping since we are splaying out results.
                    Object.assign(nameMapping, transformResult);
                }
                else {
                    nameMapping[paramName] = transformResult;
                }
            }
            else {
                nameMapping[paramName] = param;
            }
        });
        // We don't know a priori which params are used within the URL, so generate a map for all of them.
        const baseUrl = formatString(url, generateQueryParamMap(Object.keys(nameMapping), nameMapping));
        const fullUrl = hasQueryParams
            ? url_1.withQueryParams(baseUrl, generateQueryParamMap(ensure_1.ensureExists(queryParams), nameMapping, optionalNames))
            : baseUrl;
        let body;
        if (bodyTemplate) {
            body = clone_1.default(bodyTemplate);
        }
        if (hasBodyParams) {
            const currentBodyParams = generateParamMap(ensure_1.ensureExists(bodyParams), nameMapping, optionalNames);
            // Merge the param if needed.
            body = body ? { ...body, ...currentBodyParams } : currentBodyParams;
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
exports.generateRequestHandler = generateRequestHandler;
function mapKeys(obj, schema) {
    if (!(schema && schema_2.isObject(schema))) {
        return obj;
    }
    const { properties } = schema;
    // Look at the properties of the schema and invert any keys if present.
    const remappedKeys = new Map();
    for (const key in properties) {
        if (properties.hasOwnProperty(key) && properties[key].fromKey) {
            remappedKeys.set(ensure_1.ensureExists(properties[key].fromKey), key);
        }
    }
    const remappedObject = {};
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
        if (Array.isArray(currentValue) && schema_1.isArray(keySchema) && schema_2.isObject(keySchema.items)) {
            remappedObject[newKey] = currentValue.map(val => mapKeys(val, keySchema.items));
        }
        else if (typeof currentValue === 'object' && schema_2.isObject(keySchema)) {
            remappedObject[newKey] = mapKeys(currentValue, keySchema);
        }
    }
    return remappedObject;
}
function transformBody(body, schema) {
    if (schema_1.isArray(schema) && schema_2.isObject(schema.items)) {
        const objects = body;
        const mappedObjs = objects.map(obj => mapKeys(obj, schema.items));
        return mappedObjs;
    }
    if (schema_2.isObject(schema)) {
        return mapKeys(body, schema);
    }
    return body;
}
exports.transformBody = transformBody;
function generateObjectResponseHandler(response) {
    const { projectKey, schema } = response;
    return function objectResponseHandler(resp, runtimeSchema) {
        const { body } = resp;
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
exports.generateObjectResponseHandler = generateObjectResponseHandler;
