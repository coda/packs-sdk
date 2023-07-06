"use strict";
/**
 * The core components of the Pack SDK. These functions and types are used to
 * define your Pack, it's building blocks, and their logic.
 *
 * This module is imported using the following code:
 *
 * ```ts
 * import * as coda from "@codahq/packs-sdk";
 * ```
 *
 * @module core
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSchema = exports.makeReferenceSchemaFromObjectSchema = exports.makeObjectSchema = exports.makeAttributionNode = exports.generateSchema = exports.ValueType = exports.ValueHintType = exports.ScaleIconSet = exports.PropertyLabelValueTemplate = exports.LinkDisplayType = exports.ImageOutline = exports.ImageCornerStyle = exports.EmailDisplayType = exports.DurationUnit = exports.CurrencyFormat = exports.AttributionNodeType = exports.ensureUnreachable = exports.ensureNonEmptyString = exports.ensureExists = exports.assertCondition = exports.SvgConstants = exports.getEffectivePropertyKeysFromSchema = exports.withQueryParams = exports.joinUrl = exports.getQueryParams = exports.simpleAutocomplete = exports.makeSimpleAutocompleteMetadataFormula = exports.autocompleteSearchObjects = exports.makeParameter = exports.makeTranslateObjectFormula = exports.makeSyncTable = exports.makeFormula = exports.makeEmptyFormula = exports.makeDynamicSyncTable = exports.makePropertyOptionsFormula = exports.makeMetadataFormula = exports.UserVisibleError = exports.Type = exports.MissingScopesError = exports.StatusCodeError = exports.PrecannedDateRange = exports.ParameterType = exports.NetworkConnection = exports.UpdateOutcome = exports.ConnectionRequirement = exports.OptionsType = exports.PackDefinitionBuilder = exports.newPack = exports.PostSetupType = exports.AuthenticationType = void 0;
exports.TokenExchangeCredentialsLocation = exports.ValidFetchMethods = exports.withIdentity = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "AuthenticationType", { enumerable: true, get: function () { return types_1.AuthenticationType; } });
var types_2 = require("./types");
Object.defineProperty(exports, "PostSetupType", { enumerable: true, get: function () { return types_2.PostSetupType; } });
var builder_1 = require("./builder");
Object.defineProperty(exports, "newPack", { enumerable: true, get: function () { return builder_1.newPack; } });
var builder_2 = require("./builder");
Object.defineProperty(exports, "PackDefinitionBuilder", { enumerable: true, get: function () { return builder_2.PackDefinitionBuilder; } });
var api_types_1 = require("./api_types");
Object.defineProperty(exports, "OptionsType", { enumerable: true, get: function () { return api_types_1.OptionsType; } });
var api_types_2 = require("./api_types");
Object.defineProperty(exports, "ConnectionRequirement", { enumerable: true, get: function () { return api_types_2.ConnectionRequirement; } });
var api_1 = require("./api");
Object.defineProperty(exports, "UpdateOutcome", { enumerable: true, get: function () { return api_1.UpdateOutcome; } });
var api_types_3 = require("./api_types");
Object.defineProperty(exports, "NetworkConnection", { enumerable: true, get: function () { return api_types_3.NetworkConnection; } });
var api_types_4 = require("./api_types");
Object.defineProperty(exports, "ParameterType", { enumerable: true, get: function () { return api_types_4.ParameterType; } });
var api_types_5 = require("./api_types");
Object.defineProperty(exports, "PrecannedDateRange", { enumerable: true, get: function () { return api_types_5.PrecannedDateRange; } });
var api_2 = require("./api");
Object.defineProperty(exports, "StatusCodeError", { enumerable: true, get: function () { return api_2.StatusCodeError; } });
var api_3 = require("./api");
Object.defineProperty(exports, "MissingScopesError", { enumerable: true, get: function () { return api_3.MissingScopesError; } });
var api_types_6 = require("./api_types");
Object.defineProperty(exports, "Type", { enumerable: true, get: function () { return api_types_6.Type; } });
var api_4 = require("./api");
Object.defineProperty(exports, "UserVisibleError", { enumerable: true, get: function () { return api_4.UserVisibleError; } });
// Formula definition helpers
var api_5 = require("./api");
Object.defineProperty(exports, "makeMetadataFormula", { enumerable: true, get: function () { return api_5.makeMetadataFormula; } });
var api_6 = require("./api");
Object.defineProperty(exports, "makePropertyOptionsFormula", { enumerable: true, get: function () { return api_6.makePropertyOptionsFormula; } });
var api_7 = require("./api");
Object.defineProperty(exports, "makeDynamicSyncTable", { enumerable: true, get: function () { return api_7.makeDynamicSyncTable; } });
var api_8 = require("./api");
Object.defineProperty(exports, "makeEmptyFormula", { enumerable: true, get: function () { return api_8.makeEmptyFormula; } });
var api_9 = require("./api");
Object.defineProperty(exports, "makeFormula", { enumerable: true, get: function () { return api_9.makeFormula; } });
var api_10 = require("./api");
Object.defineProperty(exports, "makeSyncTable", { enumerable: true, get: function () { return api_10.makeSyncTable; } });
var api_11 = require("./api");
Object.defineProperty(exports, "makeTranslateObjectFormula", { enumerable: true, get: function () { return api_11.makeTranslateObjectFormula; } });
var api_12 = require("./api");
Object.defineProperty(exports, "makeParameter", { enumerable: true, get: function () { return api_12.makeParameter; } });
var api_13 = require("./api");
Object.defineProperty(exports, "autocompleteSearchObjects", { enumerable: true, get: function () { return api_13.autocompleteSearchObjects; } });
var api_14 = require("./api");
Object.defineProperty(exports, "makeSimpleAutocompleteMetadataFormula", { enumerable: true, get: function () { return api_14.makeSimpleAutocompleteMetadataFormula; } });
var api_15 = require("./api");
Object.defineProperty(exports, "simpleAutocomplete", { enumerable: true, get: function () { return api_15.simpleAutocomplete; } });
// URL helpers.
var url_1 = require("./helpers/url");
Object.defineProperty(exports, "getQueryParams", { enumerable: true, get: function () { return url_1.getQueryParams; } });
var url_2 = require("./helpers/url");
Object.defineProperty(exports, "joinUrl", { enumerable: true, get: function () { return url_2.join; } });
var url_3 = require("./helpers/url");
Object.defineProperty(exports, "withQueryParams", { enumerable: true, get: function () { return url_3.withQueryParams; } });
// Schema helpers.
var schema_1 = require("./helpers/schema");
Object.defineProperty(exports, "getEffectivePropertyKeysFromSchema", { enumerable: true, get: function () { return schema_1.getEffectivePropertyKeysFromSchema; } });
// SVG constants.
var svg_1 = require("./helpers/svg");
Object.defineProperty(exports, "SvgConstants", { enumerable: true, get: function () { return svg_1.SvgConstants; } });
// General Utilities
var ensure_1 = require("./helpers/ensure");
Object.defineProperty(exports, "assertCondition", { enumerable: true, get: function () { return ensure_1.assertCondition; } });
var ensure_2 = require("./helpers/ensure");
Object.defineProperty(exports, "ensureExists", { enumerable: true, get: function () { return ensure_2.ensureExists; } });
var ensure_3 = require("./helpers/ensure");
Object.defineProperty(exports, "ensureNonEmptyString", { enumerable: true, get: function () { return ensure_3.ensureNonEmptyString; } });
var ensure_4 = require("./helpers/ensure");
Object.defineProperty(exports, "ensureUnreachable", { enumerable: true, get: function () { return ensure_4.ensureUnreachable; } });
var schema_2 = require("./schema");
Object.defineProperty(exports, "AttributionNodeType", { enumerable: true, get: function () { return schema_2.AttributionNodeType; } });
var schema_3 = require("./schema");
Object.defineProperty(exports, "CurrencyFormat", { enumerable: true, get: function () { return schema_3.CurrencyFormat; } });
var schema_4 = require("./schema");
Object.defineProperty(exports, "DurationUnit", { enumerable: true, get: function () { return schema_4.DurationUnit; } });
var schema_5 = require("./schema");
Object.defineProperty(exports, "EmailDisplayType", { enumerable: true, get: function () { return schema_5.EmailDisplayType; } });
var schema_6 = require("./schema");
Object.defineProperty(exports, "ImageCornerStyle", { enumerable: true, get: function () { return schema_6.ImageCornerStyle; } });
var schema_7 = require("./schema");
Object.defineProperty(exports, "ImageOutline", { enumerable: true, get: function () { return schema_7.ImageOutline; } });
var schema_8 = require("./schema");
Object.defineProperty(exports, "LinkDisplayType", { enumerable: true, get: function () { return schema_8.LinkDisplayType; } });
var schema_9 = require("./schema");
Object.defineProperty(exports, "PropertyLabelValueTemplate", { enumerable: true, get: function () { return schema_9.PropertyLabelValueTemplate; } });
var schema_10 = require("./schema");
Object.defineProperty(exports, "ScaleIconSet", { enumerable: true, get: function () { return schema_10.ScaleIconSet; } });
var schema_11 = require("./schema");
Object.defineProperty(exports, "ValueHintType", { enumerable: true, get: function () { return schema_11.ValueHintType; } });
var schema_12 = require("./schema");
Object.defineProperty(exports, "ValueType", { enumerable: true, get: function () { return schema_12.ValueType; } });
var schema_13 = require("./schema");
Object.defineProperty(exports, "generateSchema", { enumerable: true, get: function () { return schema_13.generateSchema; } });
var schema_14 = require("./schema");
Object.defineProperty(exports, "makeAttributionNode", { enumerable: true, get: function () { return schema_14.makeAttributionNode; } });
var schema_15 = require("./schema");
Object.defineProperty(exports, "makeObjectSchema", { enumerable: true, get: function () { return schema_15.makeObjectSchema; } });
var schema_16 = require("./schema");
Object.defineProperty(exports, "makeReferenceSchemaFromObjectSchema", { enumerable: true, get: function () { return schema_16.makeReferenceSchemaFromObjectSchema; } });
var schema_17 = require("./schema");
Object.defineProperty(exports, "makeSchema", { enumerable: true, get: function () { return schema_17.makeSchema; } });
var schema_18 = require("./schema");
Object.defineProperty(exports, "withIdentity", { enumerable: true, get: function () { return schema_18.withIdentity; } });
// Exports for intermediate entities we want included in the TypeDoc documentation
// but otherwise wouldn't care about including as top-level exports of the SDK
var api_types_7 = require("./api_types");
Object.defineProperty(exports, "ValidFetchMethods", { enumerable: true, get: function () { return api_types_7.ValidFetchMethods; } });
var types_3 = require("./types");
Object.defineProperty(exports, "TokenExchangeCredentialsLocation", { enumerable: true, get: function () { return types_3.TokenExchangeCredentialsLocation; } });
