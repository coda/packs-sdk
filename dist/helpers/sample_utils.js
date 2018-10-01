"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
function fakeDefinitionToDefinition(def) {
    const { formulas: originalFormulas } = def, rest = __rest(def, ["formulas"]);
    const formulas = originalFormulas && { loader: () => Promise.resolve(originalFormulas) };
    const legacyFormulasLoader = originalFormulas && (() => Promise.resolve(originalFormulas));
    return Object.assign({ formulas, legacyFormulasLoader }, rest);
}
exports.fakeDefinitionToDefinition = fakeDefinitionToDefinition;
function fakeDefinitionToMetadata(def) {
    const { formulas: originalFormulas, formats: originalFormats } = def, packMetadata = __rest(def, ["formulas", "formats"]);
    const formulas = {};
    for (const namespace of Object.keys(originalFormulas || {})) {
        formulas[namespace] = originalFormulas[namespace].map(formula => {
            const { execute } = formula, formulaMetadata = __rest(formula, ["execute"]);
            return formulaMetadata;
        });
    }
    const formats = [];
    for (let _a of formats || []) {
        const { matchers } = _a, format = __rest(_a, ["matchers"]);
        formats.push(Object.assign({}, format, { matchers: matchers.map(m => m.toString()) }));
    }
    return Object.assign({ formulas, formats }, packMetadata);
}
exports.fakeDefinitionToMetadata = fakeDefinitionToMetadata;
