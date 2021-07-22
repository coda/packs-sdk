"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataFormulaType = exports.FormulaType = void 0;
var FormulaType;
(function (FormulaType) {
    FormulaType["Standard"] = "Standard";
    FormulaType["Sync"] = "Sync";
    FormulaType["Metadata"] = "Metadata";
})(FormulaType = exports.FormulaType || (exports.FormulaType = {}));
var MetadataFormulaType;
(function (MetadataFormulaType) {
    MetadataFormulaType["GetConnectionName"] = "GetConnectionName";
    MetadataFormulaType["GetConnectionUserId"] = "GetConnectionUserId";
    MetadataFormulaType["ParameterAutocomplete"] = "ParameterAutocomplete";
    MetadataFormulaType["PostSetupSetEndpoint"] = "PostSetupSetEndpoint";
    MetadataFormulaType["SyncListDynamicUrls"] = "SyncListDynamicUrls";
    MetadataFormulaType["SyncGetDisplayUrl"] = "SyncGetDisplayUrl";
    MetadataFormulaType["SyncGetTableName"] = "SyncGetTableName";
    MetadataFormulaType["SyncGetSchema"] = "SyncGetSchema";
})(MetadataFormulaType = exports.MetadataFormulaType || (exports.MetadataFormulaType = {}));
