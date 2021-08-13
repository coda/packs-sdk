"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmarshalBuffer = exports.marshalBuffer = void 0;
const constants_1 = require("./constants");
const constants_2 = require("./constants");
function marshalBuffer(val) {
    // Buffer is not provided by IVM. If the bundle is not browserified, global.Buffer will be undefined.
    if (val instanceof Buffer) {
        return {
            data: [...Uint8Array.from(val)],
            [constants_2.MarshalingInjectedKeys.CodaMarshaler]: constants_1.CodaMarshalerType.Buffer,
        };
    }
}
exports.marshalBuffer = marshalBuffer;
function unmarshalBuffer(val) {
    if (typeof val !== 'object' || val[constants_2.MarshalingInjectedKeys.CodaMarshaler] !== constants_1.CodaMarshalerType.Buffer) {
        return;
    }
    return Buffer.from(val.data);
}
exports.unmarshalBuffer = unmarshalBuffer;
