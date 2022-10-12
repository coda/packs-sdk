"use strict";
/**
 * Internal components of the Pack SDK. You should not rely on these, since these can
 * change without warning.
 *
 * @module internal
 * @hidden
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.legacyImports = exports.transformBody = exports.normalizePropertyValuePathIntoSchemaPath = exports.normalizeSchemaKey = exports.normalizeSchema = exports.objectSchemaHelper = exports.postSetupMetadataHelper = exports.paramDefHelper = exports.isArrayType = exports.isObject = exports.isArray = exports.unmarshalValueFromString = exports.unmarshalError = exports.marshalError = exports.marshalValueToString = exports.legacyUnmarshalValue = exports.legacyMarshalValue = void 0;
var legacy_marshal_1 = require("./helpers/legacy_marshal");
Object.defineProperty(exports, "legacyMarshalValue", { enumerable: true, get: function () { return legacy_marshal_1.legacyMarshalValue; } });
var legacy_marshal_2 = require("./helpers/legacy_marshal");
Object.defineProperty(exports, "legacyUnmarshalValue", { enumerable: true, get: function () { return legacy_marshal_2.legacyUnmarshalValue; } });
var marshaling_1 = require("./runtime/common/marshaling");
Object.defineProperty(exports, "marshalValueToString", { enumerable: true, get: function () { return marshaling_1.marshalValueToString; } });
var marshaling_2 = require("./runtime/common/marshaling");
Object.defineProperty(exports, "marshalError", { enumerable: true, get: function () { return marshaling_2.marshalError; } });
var marshaling_3 = require("./runtime/common/marshaling");
Object.defineProperty(exports, "unmarshalError", { enumerable: true, get: function () { return marshaling_3.unmarshalError; } });
var marshaling_4 = require("./runtime/common/marshaling");
Object.defineProperty(exports, "unmarshalValueFromString", { enumerable: true, get: function () { return marshaling_4.unmarshalValueFromString; } });
var schema_1 = require("./schema");
Object.defineProperty(exports, "isArray", { enumerable: true, get: function () { return schema_1.isArray; } });
var schema_2 = require("./schema");
Object.defineProperty(exports, "isObject", { enumerable: true, get: function () { return schema_2.isObject; } });
var api_types_1 = require("./api_types");
Object.defineProperty(exports, "isArrayType", { enumerable: true, get: function () { return api_types_1.isArrayType; } });
// Schema manipulation / transformation
var migration_1 = require("./helpers/migration");
Object.defineProperty(exports, "paramDefHelper", { enumerable: true, get: function () { return migration_1.paramDefHelper; } });
var migration_2 = require("./helpers/migration");
Object.defineProperty(exports, "postSetupMetadataHelper", { enumerable: true, get: function () { return migration_2.postSetupMetadataHelper; } });
var migration_3 = require("./helpers/migration");
Object.defineProperty(exports, "objectSchemaHelper", { enumerable: true, get: function () { return migration_3.objectSchemaHelper; } });
var schema_3 = require("./schema");
Object.defineProperty(exports, "normalizeSchema", { enumerable: true, get: function () { return schema_3.normalizeSchema; } });
var schema_4 = require("./schema");
Object.defineProperty(exports, "normalizeSchemaKey", { enumerable: true, get: function () { return schema_4.normalizeSchemaKey; } });
var schema_5 = require("./schema");
Object.defineProperty(exports, "normalizePropertyValuePathIntoSchemaPath", { enumerable: true, get: function () { return schema_5.normalizePropertyValuePathIntoSchemaPath; } });
// Fetcher helpers
var handler_templates_1 = require("./handler_templates");
Object.defineProperty(exports, "transformBody", { enumerable: true, get: function () { return handler_templates_1.transformBody; } });
exports.legacyImports = __importStar(require("./legacy_exports"));
