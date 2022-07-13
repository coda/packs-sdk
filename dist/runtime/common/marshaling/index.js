"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrapError = exports.wrapError = exports.unmarshalValue = exports.marshalValue = void 0;
const marshal_errors_1 = require("./marshal_errors");
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
const MaxTraverseDepth = 100;
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
    const maybeError = (0, marshal_errors_1.marshalError)(val);
    if (maybeError) {
        postTransforms.push({
            type: 'Error',
            path: [...pathPrefix],
        });
        return { val: maybeError, hasModifications: true };
    }
    if (val instanceof Buffer || ((_a = global.Buffer) === null || _a === void 0 ? void 0 : _a.isBuffer(val))) {
        // Theoretically it should be possible to pass an array buffer
        // through structured copy with some transfer options, but it's
        // simpler to just encode it as a string.
        postTransforms.push({
            type: 'Buffer',
            path: [...pathPrefix],
        });
        return { val: val.toString('base64'), hasModifications: true };
    }
    if (Array.isArray(val)) {
        const maybeModifiedArray = [];
        let someItemHadModifications = false;
        val.forEach((item, index) => {
            pathPrefix.push(index.toString());
            const { val: itemVal, hasModifications } = fixUncopyableTypes(item, pathPrefix, postTransforms, depth + 1);
            if (hasModifications) {
                someItemHadModifications = true;
            }
            maybeModifiedArray.push(itemVal);
            pathPrefix.pop();
        });
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
        if (hadModifications) {
            return { val: maybeModifiedObject, hasModifications: true };
        }
    }
    return { val, hasModifications: false };
}
function marshalValue(val) {
    const postTransforms = [];
    const { val: encodedVal } = fixUncopyableTypes(val, [], postTransforms, 0);
    const result = {
        encoded: encodedVal,
        postTransforms,
    };
    return result;
}
exports.marshalValue = marshalValue;
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
    let result = marshaledValue.encoded;
    for (const transform of marshaledValue.postTransforms) {
        if (transform.type === 'Buffer') {
            result = applyTransform(result, transform.path, (raw) => Buffer.from(raw, 'base64'));
        }
        else if (transform.type === 'Error') {
            result = applyTransform(result, transform.path, (raw) => (0, marshal_errors_2.unmarshalError)(raw));
        }
        else {
            throw new Error(`Not a valid type to unmarshal: ${transform.type}`);
        }
    }
    return result;
}
exports.unmarshalValue = unmarshalValue;
function wrapError(err) {
    // TODO(huayang): we do this for the sdk.
    // if (err.name === 'TypeError' && err.message === `Cannot read property 'body' of undefined`) {
    //   err.message +=
    //     '\nThis means your formula was invoked with a mock fetcher that had no response configured.' +
    //     '\nThis usually means you invoked your formula from the commandline with `coda execute` but forgot to ' +
    //     'add the --fetch flag ' +
    //     'to actually fetch from the remote API.';
    // }
    return new Error(marshalValue(err));
}
exports.wrapError = wrapError;
function unwrapError(err) {
    try {
        const unmarshaledValue = unmarshalValue(err.message);
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
