"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmarshalBuffer = exports.marshalBuffer = void 0;
const constants_1 = require("./constants");
const config_1 = require("./config");
const existingToJSON = Buffer.prototype.toJSON;
Buffer.prototype.toJSON = function () {
    if (!config_1.isMarshaling()) {
        return existingToJSON.call(this);
    }
    return {
        ...existingToJSON.call(this),
        [constants_1.MarshalingInjectedKeys.IsBuffer]: true,
    };
};
function marshalBuffer(val) {
    if (val instanceof Buffer) {
        // native Buffer defines its toJSON() function, which runs before serializer.
        throw new Error('Unexpected Buffer');
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
