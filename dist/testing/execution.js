"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newExecutionContext = exports.executeSyncFormulaFromPackDef = exports.executeSyncFormula = exports.executeFormulaFromCLI = exports.executeFormulaFromPackDef = exports.executeFormula = void 0;
const coercion_1 = require("./coercion");
const mocks_1 = require("./mocks");
const mocks_2 = require("./mocks");
const validation_1 = require("./validation");
const validation_2 = require("./validation");
const uuid_1 = require("uuid");
function executeFormula(formula, params, context = mocks_1.newMockExecutionContext(), { validateParams: shouldValidateParams = true, validateResult: shouldValidateResult = true } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (shouldValidateParams) {
            validation_1.validateParams(formula, params);
        }
        const result = yield formula.execute(params, context);
        if (shouldValidateResult) {
            validation_2.validateResult(formula, result);
        }
        return result;
    });
}
exports.executeFormula = executeFormula;
function executeFormulaFromPackDef(packDef, formulaNameWithNamespace, params, context, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const formula = findFormula(packDef, formulaNameWithNamespace);
        return executeFormula(formula, params, context, options);
    });
}
exports.executeFormulaFromPackDef = executeFormulaFromPackDef;
function executeFormulaFromCLI(args, module) {
    return __awaiter(this, void 0, void 0, function* () {
        const formulaNameWithNamespace = args[0];
        if (!module.manifest) {
            // eslint-disable-next-line no-console
            console.log('Manifest file must export a variable called "manifest" that refers to a PackDefinition.');
            return process.exit(1);
        }
        try {
            const formula = findFormula(module.manifest, formulaNameWithNamespace);
            const params = coercion_1.coerceParams(formula, args.slice(1));
            const result = yield executeFormula(formula, params);
            // eslint-disable-next-line no-console
            console.log(result);
        }
        catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
            process.exit(1);
        }
    });
}
exports.executeFormulaFromCLI = executeFormulaFromCLI;
function executeSyncFormula(formula, params, context = mocks_2.newSyncExecutionContext(), { validateParams: shouldValidateParams = true, validateResult: shouldValidateResult = true, maxIterations: maxIterations = 1000, } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (shouldValidateParams) {
            validation_1.validateParams(formula, params);
        }
        const result = [];
        let iterations = 1;
        do {
            const response = yield formula.execute(params, context);
            result.push(...response.result);
            context.sync.continuation = response.continuation;
            iterations++;
        } while (context.sync.continuation && iterations <= maxIterations);
        if (shouldValidateResult) {
            validation_2.validateResult(formula, result);
        }
        return result;
    });
}
exports.executeSyncFormula = executeSyncFormula;
function executeSyncFormulaFromPackDef(packDef, syncFormulaName, params, context, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const formula = findSyncFormula(packDef, syncFormulaName);
        return executeSyncFormula(formula, params, context, options);
    });
}
exports.executeSyncFormulaFromPackDef = executeSyncFormulaFromPackDef;
function newExecutionContext() {
    // TODO(jonathan): Add a mock fetcher.
    return {
        invocationLocation: {
            protocolAndHost: 'https://coda.io',
        },
        timezone: 'America/Los_Angeles',
        invocationToken: uuid_1.v4(),
        fetcher: {
            fetch: (request) => {
                throw new Error('Not yet implemented');
            },
        },
        temporaryBlobStorage: {
            storeUrl: (url, opts) => {
                throw new Error('Not yet implemented');
            },
            storeBlob: (blobData, contentType, opts) => {
                throw new Error('Not yet implemented');
            },
        },
    };
}
exports.newExecutionContext = newExecutionContext;
function findFormula(packDef, formulaNameWithNamespace) {
    if (!packDef.formulas) {
        throw new Error(`Pack definition for ${packDef.name} (id ${packDef.id}) has no formulas.`);
    }
    const [namespace, name] = formulaNameWithNamespace.split('::');
    if (!(namespace && name)) {
        throw new Error(`Formula names must be specified as FormulaNamespace::FormulaName, but got "${formulaNameWithNamespace}".`);
    }
    const formulas = packDef.formulas[namespace];
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
function findSyncFormula(packDef, syncFormulaName) {
    if (!packDef.syncTables) {
        throw new Error(`Pack definition for ${packDef.name} (id ${packDef.id}) has no sync tables.`);
    }
    for (const syncTable of packDef.syncTables) {
        const syncFormula = syncTable.getter;
        if (syncFormula.name === syncFormulaName) {
            return syncFormula;
        }
    }
    throw new Error(`Pack definition for ${packDef.name} (id ${packDef.id}) has no sync formula "${syncFormulaName}" in its sync tables.`);
}
