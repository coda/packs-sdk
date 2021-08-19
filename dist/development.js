"use strict";
// Exports for development-related code.
//
// These are kept separate from index.ts to avoid these utilities winding up in pack bundles.
Object.defineProperty(exports, "__esModule", { value: true });
exports.newMockSyncExecutionContext = exports.newMockExecutionContext = exports.newJsonFetchResponse = exports.executeFormulaOrSyncWithVM = exports.executeSyncFormulaFromPackDefSingleIteration = exports.executeSyncFormulaFromPackDef = exports.executeMetadataFormula = exports.executeFormulaFromPackDef = void 0;
var execution_1 = require("./testing/execution");
Object.defineProperty(exports, "executeFormulaFromPackDef", { enumerable: true, get: function () { return execution_1.executeFormulaFromPackDef; } });
var execution_2 = require("./testing/execution");
Object.defineProperty(exports, "executeMetadataFormula", { enumerable: true, get: function () { return execution_2.executeMetadataFormula; } });
var execution_3 = require("./testing/execution");
Object.defineProperty(exports, "executeSyncFormulaFromPackDef", { enumerable: true, get: function () { return execution_3.executeSyncFormulaFromPackDef; } });
var execution_4 = require("./testing/execution");
Object.defineProperty(exports, "executeSyncFormulaFromPackDefSingleIteration", { enumerable: true, get: function () { return execution_4.executeSyncFormulaFromPackDefSingleIteration; } });
// TODO(huayang): this needs to be documented in README once it's ready to be used efficiently.
var execution_5 = require("./testing/execution");
Object.defineProperty(exports, "executeFormulaOrSyncWithVM", { enumerable: true, get: function () { return execution_5.executeFormulaOrSyncWithVM; } });
var mocks_1 = require("./testing/mocks");
Object.defineProperty(exports, "newJsonFetchResponse", { enumerable: true, get: function () { return mocks_1.newJsonFetchResponse; } });
var mocks_2 = require("./testing/mocks");
Object.defineProperty(exports, "newMockExecutionContext", { enumerable: true, get: function () { return mocks_2.newMockExecutionContext; } });
var mocks_3 = require("./testing/mocks");
Object.defineProperty(exports, "newMockSyncExecutionContext", { enumerable: true, get: function () { return mocks_3.newMockSyncExecutionContext; } });
