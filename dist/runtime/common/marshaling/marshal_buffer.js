"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmarshalBuffer = exports.marshalBuffer = void 0;
const constants_1 = require("./constants");
function marshalBuffer(val) {
    if (val instanceof Buffer) {
        return {
            data: [...Uint8Array.from(val)],
            [constants_1.MarshalingInjectedKeys.IsBuffer]: true,
        };
    }
}
exports.marshalBuffer = marshalBuffer;
function unmarshalBuffer(val) {
    if (typeof val !== 'object' || !val[constants_1.MarshalingInjectedKeys.IsBuffer]) {
        return;
    }
    return Buffer.from(val.data);
}
exports.unmarshalBuffer = unmarshalBuffer;
