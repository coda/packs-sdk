"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manifest = void 0;
const types_1 = require("../../types");
const formulas_1 = require("./formulas");
const formulas_2 = require("./formulas");
const formulas_3 = require("./formulas");
exports.manifest = {
    id: 123,
    name: 'MyPack',
    shortDescription: '',
    description: '',
    version: '0.0.1',
    exampleImages: [],
    providerId: 456,
    category: types_1.PackCategory.Fun,
    logoPath: 'logo.png',
    formulas: formulas_2.formulas,
    syncTables: formulas_3.syncTables,
    formats: formulas_1.formats,
};
