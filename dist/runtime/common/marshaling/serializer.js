"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserialize = exports.serialize = void 0;
let serialize;
exports.serialize = serialize;
let deserialize;
exports.deserialize = deserialize;
if (process.env.IS_THUNK) {
    exports.serialize = serialize = codaInternal.serializer.serialize;
    exports.deserialize = deserialize = codaInternal.serializer.deserialize;
}
else {
    const v8 = require('v8');
    exports.serialize = serialize = (value) => v8.serialize(value).toString('base64');
    exports.deserialize = deserialize = (value) => v8.deserialize(Buffer.from(value, 'base64'));
}
