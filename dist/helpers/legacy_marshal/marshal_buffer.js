"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmarshalBuffer = exports.marshalBuffer = void 0;
const constants_1 = require("./constants");
const constants_2 = require("./constants");
function marshalBuffer(val) {
    var _a;
    // Usually `val instanceof Buffer` would be sufficient (e.g. imported as a regular module) to decide
    // if `val` is a Buffer. In the compiled bundle, however there might be multiple instances of Buffer
    // class as each build piece (e.g. bundle/thunk/etc) may come with its own buffer shim. Using
    // `Buffer?.isBuffer` (which checks `val._isBuffer`) would allow us to bridge the gap.
    if (val instanceof Buffer || ((_a = global.Buffer) === null || _a === void 0 ? void 0 : _a.isBuffer(val))) {
        return {
            data: [...Uint8Array.from(val)],
            [constants_2.LegacyMarshalingInjectedKeys.CodaMarshaler]: constants_1.LegacyCodaMarshalerType.Buffer,
        };
    }
}
exports.marshalBuffer = marshalBuffer;
function unmarshalBuffer(val) {
    if (typeof val !== 'object' || val[constants_2.LegacyMarshalingInjectedKeys.CodaMarshaler] !== constants_1.LegacyCodaMarshalerType.Buffer) {
        return;
    }
    return Buffer.from(val.data);
}
exports.unmarshalBuffer = unmarshalBuffer;
