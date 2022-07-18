"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrapError = exports.wrapError = exports.unmarshalValue = exports.unmarshalValueFromString = exports.marshalValueToString = exports.marshalValue = void 0;
const constants_1 = require("./constants");
const constants_2 = require("./constants");
const serializer_1 = require("./serializer");
const marshal_errors_1 = require("./marshal_errors");
const serializer_2 = require("./serializer");
const marshal_errors_2 = require("./marshal_errors");
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
var TransformType;
(function (TransformType) {
    TransformType["Buffer"] = "Buffer";
    TransformType["Error"] = "Error";
})(TransformType || (TransformType = {}));
// pathPrefix can be temporarily modified, but needs to be restored to its original value
// before returning.
//
// "hasModifications" is to avoid trying to copy objects that don't need to be copied.
// Only objects containing a buffer or an error should need to be copied.
function fixUncopyableTypes(val, pathPrefix, postTransforms, depth = 0) {
    var _a;
    if (depth >= MaxTraverseDepth) {
        // this is either a circular reference or a super nested value that we mostly likely
        // don't care about marshalling.
        return { val, hasModifications: false };
    }
    if (!val) {
        return { val, hasModifications: false };
    }
    const maybeError = (0, marshal_errors_1.marshalError)(val, marshalValue);
    if (maybeError) {
        postTransforms.push({
            type: TransformType.Error,
            path: [...pathPrefix],
        });
        return { val: maybeError, hasModifications: true };
    }
    if (val instanceof Buffer || ((_a = global.Buffer) === null || _a === void 0 ? void 0 : _a.isBuffer(val))) {
        // Theoretically it should be possible to pass an array buffer
        // through structured copy with some transfer options, but it's
        // simpler to just encode it as a string.
        postTransforms.push({
            type: TransformType.Buffer,
            path: [...pathPrefix],
        });
        return { val: val.toString('base64'), hasModifications: true };
    }
    if (Array.isArray(val)) {
        const maybeModifiedArray = [];
        let someItemHadModifications = false;
        for (let i = 0; i < val.length; i++) {
            const item = val[i];
            pathPrefix.push(i.toString());
            const { val: itemVal, hasModifications } = fixUncopyableTypes(item, pathPrefix, postTransforms, depth + 1);
            if (hasModifications) {
                someItemHadModifications = true;
            }
            maybeModifiedArray.push(itemVal);
            pathPrefix.pop();
        }
        if (someItemHadModifications) {
            return { val: maybeModifiedArray, hasModifications: true };
        }
    }
    if (typeof val === 'object') {
        const maybeModifiedObject = {};
        let hadModifications = false;
        for (const key of Object.getOwnPropertyNames(val)) {
            pathPrefix.push(key);
            const { val: objVal, hasModifications: subValHasModifications } = fixUncopyableTypes(val[key], pathPrefix, postTransforms, depth + 1);
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
            return { val: maybeModifiedObject, hasModifications: true };
        }
    }
    return { val, hasModifications: false };
}
function isMarshaledValue(val) {
    return typeof val === 'object' && constants_2.MarshalingInjectedKeys.CodaMarshaler in val;
}
function marshalValue(val) {
    const postTransforms = [];
    const { val: encodedVal } = fixUncopyableTypes(val, [], postTransforms, 0);
    return {
        encoded: encodedVal,
        postTransforms,
        [constants_2.MarshalingInjectedKeys.CodaMarshaler]: constants_1.CodaMarshalerType.Object,
    };
}
exports.marshalValue = marshalValue;
function marshalValueToString(val) {
    return (0, serializer_2.serialize)(marshalValue(val));
}
exports.marshalValueToString = marshalValueToString;
function unmarshalValueFromString(marshaledValue) {
    return unmarshalValue((0, serializer_1.deserialize)(marshaledValue));
}
exports.unmarshalValueFromString = unmarshalValueFromString;
function applyTransform(input, path, fn) {
    if (path.length === 0) {
        return fn(input);
    }
    else {
        input[path[0]] = applyTransform(input[path[0]], path.slice(1), fn);
        return input;
    }
}
function unmarshalValue(marshaledValue) {
    if (!isMarshaledValue(marshaledValue)) {
        throw Error(`Not a marshaled value: ${JSON.stringify(marshaledValue)}`);
    }
    let result = marshaledValue.encoded;
    for (const transform of marshaledValue.postTransforms) {
        if (transform.type === 'Buffer') {
            result = applyTransform(result, transform.path, (raw) => Buffer.from(raw, 'base64'));
        }
        else if (transform.type === 'Error') {
            result = applyTransform(result, transform.path, (raw) => (0, marshal_errors_2.unmarshalError)(raw, unmarshalValue));
        }
        else {
            throw new Error(`Not a valid type to unmarshal: ${transform.type}`);
        }
    }
    return result;
}
exports.unmarshalValue = unmarshalValue;
// The only way to pass information out of isolated-vm through an uncaught exception is
// in the "message" field, which must be a string. Because of that, we use marshalValueToString()
// instead of just putting a structuredClone()-compatible object into a custom field on a custom
// error type.
function wrapError(err) {
    // TODO(huayang): we do this for the sdk.
    // if (err.name === 'TypeError' && err.message === `Cannot read property 'body' of undefined`) {
    //   err.message +=
    //     '\nThis means your formula was invoked with a mock fetcher that had no response configured.' +
    //     '\nThis usually means you invoked your formula from the commandline with `coda execute` but forgot to ' +
    //     'add the --fetch flag ' +
    //     'to actually fetch from the remote API.';
    // }
    return new Error(marshalValueToString(err));
}
exports.wrapError = wrapError;
function unwrapError(err) {
    try {
        const unmarshaledValue = unmarshalValueFromString(err.message);
        if (unmarshaledValue instanceof Error) {
            return unmarshaledValue;
        }
        return err;
    }
    catch (_) {
        return err;
    }
}
exports.unwrapError = unwrapError;
