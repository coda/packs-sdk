"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmarshalDate = exports.marshalDate = void 0;
const constants_1 = require("./constants");
function marshalDate(val) {
    if (val instanceof Date) {
        return {
            date: val.toJSON(),
            [constants_1.MarshalingInjectedKeys.IsDate]: true,
        };
    }
}
exports.marshalDate = marshalDate;
function unmarshalDate(val) {
    if (typeof val !== 'object' || !val[constants_1.MarshalingInjectedKeys.IsDate]) {
        return;
    }
    return new Date(Date.parse(val.date));
}
exports.unmarshalDate = unmarshalDate;
