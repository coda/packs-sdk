"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fakeDefinitionToMetadata = exports.fakeDefinitionToDefinition = void 0;
function fakeDefinitionToDefinition(def) {
    return def;
}
exports.fakeDefinitionToDefinition = fakeDefinitionToDefinition;
function fakeDefinitionToMetadata(def) {
    const { formulas: originalFormulas, defaultAuthentication: originalDefaultAuthentication, formats: originalFormats, syncTables: originalSyncTables } = def, packMetadata = __rest(def, ["formulas", "defaultAuthentication", "formats", "syncTables"]);
    let formulas;
    if (Array.isArray(originalFormulas)) {
        formulas = originalFormulas.map(formula => {
            const { execute } = formula, formulaMetadata = __rest(formula, ["execute"]);
            return formulaMetadata;
        });
    }
    else {
        // TODO: @alan-fang delete once all packs have been migrated to use formulaNamespace
        formulas = {};
        for (const namespace of Object.keys(originalFormulas || {})) {
            formulas[namespace] = originalFormulas[namespace].map(formula => {
                const { execute } = formula, formulaMetadata = __rest(formula, ["execute"]);
                return formulaMetadata;
            });
        }
    }
    const formats = [];
    for (let _a of originalFormats || []) {
        const { matchers } = _a, format = __rest(_a, ["matchers"]);
        formats.push(Object.assign(Object.assign({}, format), { matchers: (matchers || []).map(m => m.toString()) }));
    }
    let defaultAuthentication = originalDefaultAuthentication;
    if (originalDefaultAuthentication &&
        'getConnectionName' in originalDefaultAuthentication &&
        originalDefaultAuthentication.getConnectionName) {
        const _b = originalDefaultAuthentication.getConnectionName, { execute } = _b, connNameFormula = __rest(_b, ["execute"]);
        defaultAuthentication = Object.assign(Object.assign({}, originalDefaultAuthentication), { getConnectionName: Object.assign({}, connNameFormula) });
    }
    const syncTables = [];
    for (let _c of originalSyncTables || []) {
        const { getter, getSchema } = _c, others = __rest(_c, ["getter", "getSchema"]);
        const { execute } = getter, otherGetter = __rest(getter, ["execute"]);
        syncTables.push(Object.assign({ getter: Object.assign({}, otherGetter), hasDynamicSchema: Boolean(getSchema) }, others));
    }
    return Object.assign(Object.assign({ formulas,
        formats,
        syncTables }, (defaultAuthentication && { defaultAuthentication })), packMetadata);
}
exports.fakeDefinitionToMetadata = fakeDefinitionToMetadata;
