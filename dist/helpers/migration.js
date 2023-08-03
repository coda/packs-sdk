"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSetupMetadataHelper = exports.setEndpointDefHelper = exports.setEndpointHelper = exports.paramDefHelper = exports.objectSchemaHelper = void 0;
const ensure_1 = require("../helpers/ensure");
function objectSchemaHelper(schema) {
    return new ObjectSchemaHelper(schema);
}
exports.objectSchemaHelper = objectSchemaHelper;
class ObjectSchemaHelper {
    constructor(schema) {
        this._schema = schema;
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
