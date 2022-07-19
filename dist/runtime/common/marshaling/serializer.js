"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserialize = exports.serialize = void 0;
let serialize;
exports.serialize = serialize;
let deserialize;
exports.deserialize = deserialize;
// Make sure dead code elimination removes the require('v8'), which won't be able to
// compile in the runtime thunk. We have --define:process.env.IS_THUNK=true in the
// Makefile that activates the thunk-specific code.
//
// NOTE(dweitzman): The use of process.env here feels a little weird, but I haven't found
// another way to ensure that esbuild won't complain about undeclared variables or try
// to include the 'v8' module in the thunk.
if (process.env.IS_THUNK) {
    exports.serialize = serialize = codaInternal.serializer.serialize;
    exports.deserialize = deserialize = codaInternal.serializer.deserialize;
}
else {
    const v8 = require('v8');
    exports.serialize = serialize = (value) => v8.serialize(value).toString('base64');
    exports.deserialize = deserialize = (value) => v8.deserialize(Buffer.from(value, 'base64'));
}
