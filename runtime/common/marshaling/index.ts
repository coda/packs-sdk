import {CodaMarshalerType} from './constants';
import {MarshalingInjectedKeys} from './constants';
import {MissingScopesError} from '../../../api';
import {StatusCodeError} from '../../../api';
import {deserialize} from './serializer';
import {format} from 'util';
import {internalUnmarshalValueForAnyNodeVersion} from '../../../helpers/legacy_marshal';
import {serialize} from './serializer';

// We rely on the javascript structuredClone() algorithm to copy arguments and results into
// and out of isolated-vm method calls. There are a few types we want to support that aren't
// natively supported by structuredClone();
// - Simple Error types
// - Buffer
//
// We handle these types by having marshalValue() transform them into a copyable representation,
// and then the marshaled format looks like this:
//
// {
//   encoded: {'obj': [{'bufferField': <base64-encoded buffer>}], 'errorField': <encoded error>},
//   postTransforms: [
//     {type: "Buffer", path: ['obj', '0', 'bufferField']},
//     {type: "Error", path: ['errorField']}
//   ]
// }
//
// When we pass these objects into or out of isolated-vm we also need to set "copy: true" to enable
// the structuredClone() algorithm.
//
// marshalValueToString() and wrapError() use base64-encoded output from v8.serialize() to turn the
// structuredClone()-compatible object into a string.

const MaxTraverseDepth = 100;

export enum TransformType {
  Buffer = 'Buffer',
  Error = 'Error',
}
export interface PostTransform {
  type: TransformType;
  path: string[];
}
export interface MarshaledValue {
  encoded: any;
  postTransforms: PostTransform[];
  [MarshalingInjectedKeys.CodaMarshaler]: CodaMarshalerType.Object;
}

enum ErrorClassType {
  System = 'System',
  Coda = 'Coda',
  Other = 'Other',
}

const recognizableSystemErrorClasses: ErrorConstructor[] = [
  Error,
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError,
];

const recognizableCodaErrorClasses: ErrorConstructor[] = [
  // StatusCodeError doesn't have the new StatusCodeError(message) constructor but it's okay.
  StatusCodeError as any,
  MissingScopesError as any,
];

// pathPrefix can be temporarily modified, but needs to be restored to its original value
// before returning.
//
// "hasModifications" is to avoid trying to copy objects that don't need to be copied.
// Only objects containing a buffer or an error should need to be copied.
function fixUncopyableTypes(
  val: any,
  pathPrefix: string[],
  postTransforms: PostTransform[],
  depth: number = 0,
): {val: any; hasModifications: boolean} {
  if (depth >= MaxTraverseDepth) {
    // this is either a circular reference or a super nested value that we mostly likely
    // don't care about marshalling.
    return {val, hasModifications: false};
  }

  if (!val) {
    return {val, hasModifications: false};
  }

  const maybeError = marshalError(val);
  if (maybeError) {
    postTransforms.push({
      type: TransformType.Error,
      path: [...pathPrefix],
    });
    return {val: maybeError, hasModifications: true};
  }

  if (val instanceof Buffer || global.Buffer?.isBuffer(val)) {
    // Theoretically it should be possible to pass an array buffer
    // through structured copy with some transfer options, but it's
    // simpler to just encode it as a string.
    postTransforms.push({
      type: TransformType.Buffer,
      path: [...pathPrefix],
    });
    return {val: val.toString('base64'), hasModifications: true};
  }

  if (ArrayBuffer.isView(val)) {
    // This is to avoid bad data when using maybeChangeWireVersionOnBase64EncodedV8SerializedData.
    // Wire version 14 of v8.serialize writes buffer views differently:
    // https://chromium-review.googlesource.com/c/v8/v8/+/3386802
    //
    // Historically the JSON marshaling didn't support marshaling views, so this is just reverting
    // back to how things were before July 2022:
    // https://github.com/coda/packs-sdk/blob/81ee4c21525b105c2ba873f1b49ecec5cfc06531/test/marshaling_test.ts#L33
    throw new Error(`Cannot marshal buffer views`);
  }

  if (Array.isArray(val)) {
    const maybeModifiedArray: any[] = [];
    let someItemHadModifications = false;
    for (let i = 0; i < val.length; i++) {
      const item = val[i];
      pathPrefix.push(i.toString());
      const {val: itemVal, hasModifications} = fixUncopyableTypes(item, pathPrefix, postTransforms, depth + 1);
      if (hasModifications) {
        someItemHadModifications = true;
      }
      maybeModifiedArray.push(itemVal);
      pathPrefix.pop();
    }
    if (someItemHadModifications) {
      return {val: maybeModifiedArray, hasModifications: true};
    }
  }

  if (typeof val === 'object') {
    const maybeModifiedObject: any = {};
    let hadModifications = false;
    for (const key of Object.getOwnPropertyNames(val)) {
      pathPrefix.push(key);
      const {val: objVal, hasModifications: subValHasModifications} = fixUncopyableTypes(
        val[key],
        pathPrefix,
        postTransforms,
        depth + 1,
      );
      maybeModifiedObject[key] = objVal;
      pathPrefix.pop();
      if (subValHasModifications) {
        hadModifications = true;
      }
    }
    // We don't want to accidentally replace something like a Date object with a simple
    // object, so we only return a copied version if we actually discover a buffer within.
    // Another option here might be to check against a known list of types which structuredClone()
    // supports and skip all this copy logic for known-safe types.
    if (hadModifications) {
      return {val: maybeModifiedObject, hasModifications: true};
    }
  }

  return {val, hasModifications: false};
}

export function isMarshaledValue(val: any): boolean {
  return typeof val === 'object' && MarshalingInjectedKeys.CodaMarshaler in val;
}

export function marshalValuesForLogging(val: any[]): MarshaledValue[] {
  return [marshalValue(format(...val))];
}

export function marshalValue(val: any): MarshaledValue {
  const postTransforms: PostTransform[] = [];
  const {val: encodedVal} = fixUncopyableTypes(val, [], postTransforms, 0);
  return {
    encoded: encodedVal,
    postTransforms,
    [MarshalingInjectedKeys.CodaMarshaler]: CodaMarshalerType.Object,
  };
}

export function marshalValueToStringForSameOrHigherNodeVersion(val: any): string {
  const serialized = serialize(marshalValue(val));

  return serialized;
}

export function unmarshalValueFromString(marshaledValue: string | undefined): any {
  if (marshaledValue === undefined) {
    // Historically marshalValueForAnyNodeVersion could sometimes return "undefined" even
    // those it has a "string" return type, so it's best to keep support for undefined here
    // to handle data from old, already-built packs
    return undefined;
  }

  if (marshaledValue.startsWith('/')) {
    // Looks like a v8-serialized value
    return unmarshalValue(deserialize(marshaledValue));
  }
  // Probably a legacy JSON value
  return internalUnmarshalValueForAnyNodeVersion(marshaledValue);
}

function applyTransform(input: any, path: string[], fn: (encoded: any) => any): any {
  if (path.length === 0) {
    return fn(input);
  } else {
    input[path[0]] = applyTransform(input[path[0]], path.slice(1), fn);
    return input;
  }
}

export function unmarshalValue(marshaledValue: any): any {
  if (!isMarshaledValue(marshaledValue)) {
    throw Error(`Not a marshaled value: ${JSON.stringify(marshaledValue)}`);
  }

  let result = marshaledValue.encoded;
  for (const transform of marshaledValue.postTransforms) {
    if (transform.type === 'Buffer') {
      result = applyTransform(result, transform.path, (raw: string) => Buffer.from(raw, 'base64'));
    } else if (transform.type === 'Error') {
      result = applyTransform(result, transform.path, (raw: any) => unmarshalError(raw));
    } else {
      throw new Error(`Not a valid type to unmarshal: ${transform.type}`);
    }
  }

  return result;
}

// The only way to pass information out of isolated-vm through an uncaught exception is
// in the "message" field, which must be a string. Because of that, we use marshalValueToString()
// instead of just putting a structuredClone()-compatible object into a custom field on a custom
// error type.
export function wrapErrorForSameOrHigherNodeVersion(err: Error): Error {
  // TODO(huayang): we do this for the sdk.
  // if (err.name === 'TypeError' && err.message === `Cannot read property 'body' of undefined`) {
  //   err.message +=
  //     '\nThis means your formula was invoked with a mock fetcher that had no response configured.' +
  //     '\nThis usually means you invoked your formula from the commandline with `coda execute` but forgot to ' +
  //     'add the --fetch flag ' +
  //     'to actually fetch from the remote API.';
  // }

  return new Error(marshalValueToStringForSameOrHigherNodeVersion(err));
}

export function unwrapError(err: Error): Error {
  try {
    const unmarshaledValue = unmarshalValueFromString(err.message);
    if (unmarshaledValue instanceof Error) {
      return unmarshaledValue;
    }
    return err;
  } catch (_) {
    return err;
  }
}

function getErrorClassType(err: Error): ErrorClassType {
  if (recognizableSystemErrorClasses.some(cls => cls === err.constructor)) {
    return ErrorClassType.System;
  }

  if (recognizableCodaErrorClasses.some(cls => cls === err.constructor)) {
    return ErrorClassType.Coda;
  }

  return ErrorClassType.Other;
}

export function marshalError(err: any): object | undefined {
  if (!(err instanceof Error)) {
    return;
  }

  /**
   * typical Error instance has 3 special & common fields that doesn't get serialized in JSON.stringify:
   *  - name
   *  - stack
   *  - message
   */
  const {name, stack, message, ...args} = err;

  const extraArgs: {[key: string]: any} = {...args};
  for (const [k, v] of Object.entries(extraArgs)) {
    extraArgs[k] = marshalValue(v);
  }

  const result = {
    name,
    stack,
    message,
    [MarshalingInjectedKeys.CodaMarshaler]: CodaMarshalerType.Error,
    [MarshalingInjectedKeys.ErrorClassName]: err.constructor.name,
    [MarshalingInjectedKeys.ErrorClassType]: getErrorClassType(err),
    extraArgs,
  };
  return result;
}

function getErrorClass(errorClassType: ErrorClassType, name: string): ErrorConstructor {
  let errorClasses: ErrorConstructor[];
  switch (errorClassType) {
    case ErrorClassType.System:
      errorClasses = recognizableSystemErrorClasses;
      break;
    case ErrorClassType.Coda:
      errorClasses = recognizableCodaErrorClasses;
      break;
    default:
      errorClasses = [];
  }

  return errorClasses.find(cls => cls.name === name) || Error;
}

export function unmarshalError(val: {[key: string]: any | undefined}): Error | undefined {
  if (typeof val !== 'object' || val[MarshalingInjectedKeys.CodaMarshaler] !== CodaMarshalerType.Error) {
    return;
  }

  const {
    name,
    stack,
    message,
    [MarshalingInjectedKeys.ErrorClassName]: errorClassName,
    [MarshalingInjectedKeys.CodaMarshaler]: _,
    [MarshalingInjectedKeys.ErrorClassType]: errorClassType,
    extraArgs,
  } = val;
  const ErrorClass = getErrorClass(errorClassType, errorClassName);
  const error = new ErrorClass();

  error.message = message;
  error.stack = stack;
  // "name" is a bit tricky because native Error class implements it as a getter but not a property.
  // setting name explicitly makes it a property. Some behavior may change (for example, JSON.stringify).
  error.name = name;

  for (const key of Object.keys(extraArgs)) {
    (error as any)[key] = unmarshalValue(extraArgs[key]);
  }

  return error;
}
