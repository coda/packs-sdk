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
const coda = __importStar(require("../../index"));
const pack = coda.newPack();
// BEGIN
pack.addSyncTable({
    name: 'MySyncTable',
    identityName: 'EntityName',
    schema: coda.makeObjectSchema({
        type: coda.ValueType.Object,
        id: 'idColumn',
        primary: 'displayColumn',
        properties: {
            idColumn: { type: coda.ValueType.String },
            displayColumn: { type: coda.ValueType.String },
            otherColumn: { type: coda.ValueType.Number },
        },
    }),
    formula: {
        name: 'SyncTable',
        description: 'Creates a sync table',
        connectionRequirement: coda.ConnectionRequirement.None,
        parameters: [coda.makeParameter({ type: coda.ParameterType.String, name: 'myParam', description: 'My description' })],
        execute: async ([param], context) => {
            const response = await context.fetcher.fetch({ method: 'GET', url: 'coda.io' });
            return {
                result: [
                    {
                        idColumn: 'Example1',
                        displayColumn: response.body,
                        otherColumn: param,
                    },
                ],
            };
        },
    },
});
