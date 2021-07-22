"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmarshalValue = exports.marshalValue = void 0;
const config_1 = require("./config");
const marshal_buffer_1 = require("./marshal_buffer");
const marshal_dates_1 = require("./marshal_dates");
const marshal_errors_1 = require("./marshal_errors");
const marshal_numbers_1 = require("./marshal_numbers");
const config_2 = require("./config");
const marshal_buffer_2 = require("./marshal_buffer");
const marshal_dates_2 = require("./marshal_dates");
const marshal_errors_2 = require("./marshal_errors");
const marshal_numbers_2 = require("./marshal_numbers");
const customMarshalers = [marshal_errors_1.marshalError, marshal_buffer_1.marshalBuffer, marshal_numbers_1.marshalNumber, marshal_dates_1.marshalDate];
const customUnmarshalers = [marshal_errors_2.unmarshalError, marshal_buffer_2.unmarshalBuffer, marshal_numbers_2.unmarshalNumber, marshal_dates_2.unmarshalDate];
function serializer(_, val) {
    for (const marshaler of customMarshalers) {
        const result = marshaler(val);
        if (result !== undefined) {
            return result;
        }
    }
    return val;
}
function deserializer(_, val) {
    if (val) {
        for (const unmarshaler of customUnmarshalers) {
            const result = unmarshaler(val);
            if (result !== undefined) {
                return result;
            }
        }
    }
    return val;
}
function marshalValue(val) {
    try {
        config_2.startMarshaling();
        return JSON.stringify(val, serializer);
    }
    finally {
        config_1.finishMarshaling();
    }
}
exports.marshalValue = marshalValue;
function unmarshalValue(marshaledValue) {
    if (marshaledValue === undefined) {
        return marshaledValue;
    }
    return JSON.parse(marshaledValue, deserializer);
}
exports.unmarshalValue = unmarshalValue;
