"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetEndpointDefHelper = exports.setEndpointDefHelper = exports.SetEndpointHelper = exports.setEndpointHelper = exports.ObjectSchemaHelper = exports.objectSchemaHelper = void 0;
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
    get properties() {
        return this._schema.properties;
    }
    get type() {
        return this._schema.type;
    }
}
exports.ObjectSchemaHelper = ObjectSchemaHelper;
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
exports.SetEndpointHelper = SetEndpointHelper;
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
exports.SetEndpointDefHelper = SetEndpointDefHelper;
