"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmarshalNumber = exports.marshalNumber = void 0;
const constants_1 = require("./constants");
const constants_2 = require("./constants");
function marshalNumber(val) {
    // Most numbers don't need to be marshaled. The only special cases are NaN and Infinity.
    if (typeof val === 'number' && (isNaN(val) || val === Infinity)) {
        return {
            data: val.toString(),
            [constants_2.LegacyMarshalingInjectedKeys.CodaMarshaler]: constants_1.LegacyCodaMarshalerType.Number,
        };
    }
}
exports.marshalNumber = marshalNumber;
function unmarshalNumber(val) {
    if (typeof val !== 'object' || val[constants_2.LegacyMarshalingInjectedKeys.CodaMarshaler] !== constants_1.LegacyCodaMarshalerType.Number) {
        return;
    }
    return Number(val.data);
}
exports.unmarshalNumber = unmarshalNumber;
