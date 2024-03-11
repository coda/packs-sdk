"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserialize = exports.serialize = void 0;
let serialize;
let deserialize;
// The sdk code may be running in the following environments:
// - isolated-vm:
//   This could either be in testing or in AWS. Either way, v8 helpers were injected to the
//   execution environment with `global.codaInternal.serializer`.
// - browser:
//   This could be any webpack bundle that depends on packs-sdk. In the only special case,
//   this could be the Pack studio tends to load the compiled pack bundle in an iframe in
//   order to extract pack metadata. In any of the situation, serializer is not supposed
//   to be executed.
// - node:
//   This is mainly the coda service code and the Lambda bootstrap code (which is node 14).
//   In node, serializer is basically 'v8'.
//
// While it's easier to define the serialize/deserialize function based on the targeting
// environment, there's a special case (the "dist/bundle.js") where the code would be
// used by both the browser and isolated-vm. It's possible but redundant to generate two
// bundles, one for each targeting environment. Instead, we'll just combine the browser and
// isolated-vm cases into one handler. This case is identified with
//
//   --define:process.env.IN_ISOLATED_VM_OR_BROWSER=true
//
// NOTE(dweitzman): The use of process.env here feels a little weird, but I haven't found
// another way to ensure that esbuild won't complain about undeclared variables or try
// to include the 'v8' module in the thunk.
if (process.env.IN_ISOLATED_VM_OR_BROWSER) {
    exports.serialize = serialize = (value) => {
        if ('codaInternal' in global) {
            // isolated-vm
            return codaInternal.serializer.serialize(value);
        }
        // browser
        throw new Error('Not implemented');
    };
    exports.deserialize = deserialize = (value) => {
        if ('codaInternal' in global) {
            // isolated-vm
            return codaInternal.serializer.deserialize(value);
        }
        // browser
        throw new Error('Not implemented');
    };
}
else {
    // IN_NODE
    const v8 = require('v8');
    exports.serialize = serialize = (value) => v8.serialize(value).toString('base64');
    exports.deserialize = deserialize = (value) => v8.deserialize(Buffer.from(value, 'base64'));
}
