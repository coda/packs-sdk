"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSetupMetadataHelper = exports.setEndpointDefHelper = exports.setEndpointHelper = exports.paramDefHelper = exports.objectSchemaHelper = void 0;
const ensure_1 = require("../helpers/ensure");
const ensure_2 = require("../helpers/ensure");
function objectSchemaHelper(schema) {
    return new ObjectSchemaHelper(schema);
}
exports.objectSchemaHelper = objectSchemaHelper;
class ObjectSchemaHelper {
    constructor(schema) {
        this._schema = schema;
        this._checkAgainstAllProperties(schema);
    }
    // This method doesn't do anything, but it gives developers a chance to double-check if they've forgotten
    // to update a client of ObjectSchemaHelper when they add a new property to ObjectSchemaDefinition.
    // For example, coda.makeReferenceSchemaFromObjectSchema() depends on ObjectSchemaHelper so if you
    // add a new schema option related to property options you would likely need to add it to ObjectSchemaHelper
    // and propagate it through coda.makeReferenceSchemaFromObjectSchema() also.
    _checkAgainstAllProperties(schema) {
        const { 
        // Properties needed by ObjectSchemaHelper clients.
        id, idProperty, primary, displayProperty, featuredProperties, featured, identity, options, properties, type, attribution, codaType, requireForUpdates, 
        // Properties not needed by ObjectSchemaHelper clients.
        includeUnknownProperties, titleProperty, linkProperty, subtitleProperties, snippetProperty, imageProperty, description, createdAtProperty, createdByProperty, modifiedAtProperty, modifiedByProperty, userEmailProperty, userIdProperty, groupIdProperty, memberGroupIdProperty, versionProperty, index, parent, ...rest } = schema;
        (0, ensure_2.ensureNever)();
    }
    get id() {
        var _a;
        return (_a = this._schema.idProperty) !== null && _a !== void 0 ? _a : this._schema.id;
    }
    get primary() {
        var _a;
        return (_a = this._schema.displayProperty) !== null && _a !== void 0 ? _a : this._schema.primary;
    }
    get featured() {
        var _a;
        return (_a = this._schema.featuredProperties) !== null && _a !== void 0 ? _a : this._schema.featured;
    }
    get identity() {
        return this._schema.identity;
    }
    get options() {
        return this._schema.options;
    }
    get properties() {
        return this._schema.properties;
    }
    get type() {
        return this._schema.type;
    }
    get attribution() {
        var _a, _b;
        return (_a = this._schema.attribution) !== null && _a !== void 0 ? _a : (_b = this._schema.identity) === null || _b === void 0 ? void 0 : _b.attribution;
    }
    get codaType() {
        return this._schema.codaType;
    }
    get requireForUpdates() {
        return this._schema.requireForUpdates;
    }
    get titleProperty() {
        var _a;
        return (_a = this._schema.titleProperty) !== null && _a !== void 0 ? _a : this._schema.displayProperty;
    }
}
function paramDefHelper(def) {
    return new ParamDefHelper(def);
}
exports.paramDefHelper = paramDefHelper;
class ParamDefHelper {
    constructor(def) {
        this._def = def;
    }
    get defaultValue() {
        var _a;
        return (_a = this._def.suggestedValue) !== null && _a !== void 0 ? _a : this._def.defaultValue;
    }
}
function setEndpointHelper(step) {
    return new SetEndpointHelper(step);
}
exports.setEndpointHelper = setEndpointHelper;
class SetEndpointHelper {
    constructor(step) {
        this._step = step;
    }
    get getOptions() {
        var _a;
        return (0, ensure_1.ensureExists)((_a = this._step.getOptions) !== null && _a !== void 0 ? _a : this._step.getOptionsFormula);
    }
}
function setEndpointDefHelper(step) {
    return new SetEndpointDefHelper(step);
}
exports.setEndpointDefHelper = setEndpointDefHelper;
class SetEndpointDefHelper {
    constructor(step) {
        this._step = step;
    }
    get getOptions() {
        var _a;
        return (0, ensure_1.ensureExists)((_a = this._step.getOptions) !== null && _a !== void 0 ? _a : this._step.getOptionsFormula);
    }
}
function postSetupMetadataHelper(metadata) {
    return new PostSetupMetadataHelper(metadata);
}
exports.postSetupMetadataHelper = postSetupMetadataHelper;
class PostSetupMetadataHelper {
    constructor(metadata) {
        this._metadata = metadata;
    }
    get getOptions() {
        var _a;
        return (0, ensure_1.ensureExists)((_a = this._metadata.getOptions) !== null && _a !== void 0 ? _a : this._metadata.getOptionsFormula);
    }
}
