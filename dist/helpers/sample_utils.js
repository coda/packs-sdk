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
    const { formulas: originalFormulas, defaultAuthentication: originalDefaultAuthentication, legacyFormulasLoader, formats: originalFormats } = def, packMetadata = __rest(def, ["formulas", "defaultAuthentication", "legacyFormulasLoader", "formats"]) // tslint:disable-line:trailing-comma
    ;
    const formulas = {};
    for (const namespace of Object.keys(originalFormulas || {})) {
        formulas[namespace] = originalFormulas[namespace].map(formula => {
            const { execute } = formula, formulaMetadata = __rest(formula, ["execute"]);
            return formulaMetadata;
        });
    }
    const formats = [];
    for (let _a of originalFormats || []) {
        const { matchers } = _a, format = __rest(_a, ["matchers"]);
        formats.push(Object.assign({}, format, { matchers: (matchers || []).map(m => m.toString()) }));
    }
    let defaultAuthentication = originalDefaultAuthentication;
    if (originalDefaultAuthentication &&
        'getConnectionNameFormula' in originalDefaultAuthentication &&
        originalDefaultAuthentication.getConnectionNameFormula) {
        const _b = originalDefaultAuthentication.getConnectionNameFormula, { execute } = _b, connNameFormula = __rest(_b, ["execute"]);
        defaultAuthentication = Object.assign({}, originalDefaultAuthentication, { getConnectionNameFormula: Object.assign({}, connNameFormula) });
    }
    return Object.assign({ formulas, formats, defaultAuthentication }, packMetadata);
}
exports.fakeDefinitionToMetadata = fakeDefinitionToMetadata;
