"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marshalDate = marshalDate;
exports.unmarshalDate = unmarshalDate;
const constants_1 = require("./constants");
const constants_2 = require("./constants");
function marshalDate(val) {
    if (val instanceof Date) {
        return {
            date: val.toJSON(),
            [constants_2.LegacyMarshalingInjectedKeys.CodaMarshaler]: constants_1.LegacyCodaMarshalerType.Date,
        };
    }
}
function unmarshalDate(val) {
    if (typeof val !== 'object' || val[constants_2.LegacyMarshalingInjectedKeys.CodaMarshaler] !== constants_1.LegacyCodaMarshalerType.Date) {
        return;
    }
    return new Date(Date.parse(val.date));
}
