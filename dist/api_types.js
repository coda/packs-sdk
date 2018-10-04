"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Type;
(function (Type) {
    Type[Type["string"] = 0] = "string";
    Type[Type["number"] = 1] = "number";
    Type[Type["object"] = 2] = "object";
    Type[Type["boolean"] = 3] = "boolean";
    Type[Type["date"] = 4] = "date";
})(Type = exports.Type || (exports.Type = {}));
function isArrayType(obj) {
    return obj && obj.type === 'array' && typeof obj.items === 'number';
}
exports.isArrayType = isArrayType;
exports.stringArray = {
    type: 'array',
    items: Type.string,
};
exports.numberArray = {
    type: 'array',
    items: Type.number,
};
exports.booleanArray = {
    type: 'array',
    items: Type.boolean,
};
exports.dateArray = {
    type: 'array',
    items: Type.date,
};
