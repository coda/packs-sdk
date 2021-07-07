"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const coda = __importStar(require("../../../index"));
const pack = coda.newPack();
// BEGIN
pack.addFormula({
    resultType: coda.ValueType.Object,
    name: 'MyFormula',
    description: '',
    schema: coda.makeObjectSchema({
        type: coda.ValueType.Object,
        id: 'idPropertyName',
        primary: 'displayPropertyName',
        identity: {
            name: 'entityName',
        },
        properties: {
            idPropertyName: { type: coda.ValueType.String },
            displayPropertyName: { type: coda.ValueType.Number },
            otherProperty: { type: coda.ValueType.String },
        },
    }),
    parameters: [
        coda.makeParameter({
            type: coda.ParameterType.String,
            name: 'myParam',
            description: '',
        }),
    ],
    execute([param]) {
        return {
            idPropertyName: param,
            displayPropertyName: 123,
            otherProperty: 'other property!',
        };
    },
});
