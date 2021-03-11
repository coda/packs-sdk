"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapError = exports.findFormula = exports.executeFormulaWithRawParams = void 0;
const coercion_1 = require("./coercion");
async function executeFormulaWithRawParams(manifest, formulaName, rawParams, context) {
    const formula = findFormula(manifest, formulaName);
    const params = coercion_1.coerceParams(formula, rawParams);
    // can't do validation for now due to the dependency of 'url' package (node), see tryParseUrl.
    // validateParams(formula, params);
    let result;
    try {
        result = await formula.execute(params, context);
    }
    catch (err) {
        throw wrapError(err);
    }
    // validateResult(formula, result);
    return result;
}
exports.executeFormulaWithRawParams = executeFormulaWithRawParams;
function findFormula(packDef, formulaNameWithNamespace) {
    const packFormulas = packDef.formulas;
    if (!packFormulas) {
        throw new Error(`Pack definition for ${packDef.name} (id ${packDef.id}) has no formulas.`);
    }
    // TODO: @alan-fang remove namespace requirement
    const [namespace, name] = formulaNameWithNamespace.split('::');
    if (!(namespace && name)) {
        throw new Error(`Formula names must be specified as FormulaNamespace::FormulaName, but got "${formulaNameWithNamespace}".`);
    }
    const formulas = Array.isArray(packFormulas) ? packFormulas : packFormulas[namespace];
    if (!formulas || !formulas.length) {
        throw new Error(`Pack definition for ${packDef.name} (id ${packDef.id}) has no formulas for namespace "${namespace}".`);
    }
    for (const formula of formulas) {
        if (formula.name === name) {
            return formula;
        }
    }
    throw new Error(`Pack definition for ${packDef.name} (id ${packDef.id}) has no formula "${name}" in namespace "${namespace}".`);
}
exports.findFormula = findFormula;
function wrapError(err) {
    if (err.name === 'TypeError' && err.message === `Cannot read property 'body' of undefined`) {
        err.message +=
            '\nThis means your formula was invoked with a mock fetcher that had no response configured.' +
                '\nThis usually means you invoked your formula from the commandline with `coda execute` but forgot to add the --fetch flag ' +
                'to actually fetch from the remote API.';
    }
    return err;
}
exports.wrapError = wrapError;
