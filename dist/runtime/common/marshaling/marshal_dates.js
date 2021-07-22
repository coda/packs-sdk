"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmarshalDate = exports.marshalDate = void 0;
const constants_1 = require("./constants");
const config_1 = require("./config");
const existingToJSON = Date.prototype.toJSON;
// Date toJSON returns a string that can't identify its type. We had to convert this into an object instead.
Date.prototype.toJSON = function () {
    if (!config_1.isMarshaling()) {
        return existingToJSON.call(this);
    }
    return {
        date: existingToJSON.call(this),
        [constants_1.MarshalingInjectedKeys.IsDate]: true,
    };
};
function marshalDate(val) {
    if (val instanceof Date) {
        // native Date defines its toJSON() function, which runs before serializer.
        throw new Error('Unexpected Date');
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
