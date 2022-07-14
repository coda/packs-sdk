import {CodaMarshalerType} from './constants';
import {MarshalingInjectedKeys} from './constants';
import {marshalError} from './marshal_errors';
import {unmarshalError} from './marshal_errors';
import v8 from 'v8';

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

const MaxTraverseDepth = 100;

enum TransformType {
  Buffer = 'Buffer',
  Error = 'Error',
}
interface PostTransform {
  type: TransformType;
  path: string[];
}
interface MarshaledValue {
  encoded: any;
  postTransforms: PostTransform[];
  [MarshalingInjectedKeys.CodaMarshaler]: CodaMarshalerType.Object;
}

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

  const maybeError = marshalError(val, marshalValue);
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

function isMarshaledValue(val: any): boolean {
  return typeof val === 'object' && MarshalingInjectedKeys.CodaMarshaler in val;
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
      result = applyTransform(result, transform.path, (raw: any) => unmarshalError(raw, unmarshalValue));
    } else {
      throw new Error(`Not a valid type to unmarshal: ${transform.type}`);
    }
  }

  return result;
}

// NOTE(dweitzman): Unlike marshalValue, wrapError() loses the types of things like null vs
// undefined, whether an object is a Date or a Set, and it can't handle NaN/Infinity. This is
// because wrapError needs to encode the object as a string which we do using JSON.stringify(),
// losing some that information in the process.
export function wrapError(err: Error): Error {
  // TODO(huayang): we do this for the sdk.
  // if (err.name === 'TypeError' && err.message === `Cannot read property 'body' of undefined`) {
  //   err.message +=
  //     '\nThis means your formula was invoked with a mock fetcher that had no response configured.' +
  //     '\nThis usually means you invoked your formula from the commandline with `coda execute` but forgot to ' +
  //     'add the --fetch flag ' +
  //     'to actually fetch from the remote API.';
  // }

  return new Error(v8.serialize(marshalValue(err)).toString('base64'));
}

export function unwrapError(err: Error): Error {
  try {
    const unmarshaledValue = unmarshalValue(v8.deserialize(Buffer.from(err.message, 'base64')));
    if (unmarshaledValue instanceof Error) {
      return unmarshaledValue;
    }
    return err;
  } catch (_) {
    return err;
  }
}
