import { ensureExists } from './ensure';
/** @hidden */
export function objectSchemaHelper(schema) {
    return new ObjectSchemaHelper(schema);
}
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
    get attribution() {
        var _a, _b;
        return (_a = this._schema.attribution) !== null && _a !== void 0 ? _a : (_b = this._schema.identity) === null || _b === void 0 ? void 0 : _b.attribution;
    }
}
/** @hidden */
export function paramDefHelper(def) {
    return new ParamDefHelper(def);
}
class ParamDefHelper {
    constructor(def) {
        this._def = def;
    }
    get defaultValue() {
        var _a;
        return (_a = this._def.suggestedValue) !== null && _a !== void 0 ? _a : this._def.defaultValue;
    }
}
export function setEndpointHelper(step) {
    return new SetEndpointHelper(step);
}
class SetEndpointHelper {
    constructor(step) {
        this._step = step;
    }
    get getOptions() {
        var _a;
        return ensureExists((_a = this._step.getOptions) !== null && _a !== void 0 ? _a : this._step.getOptionsFormula);
    }
}
export function setEndpointDefHelper(step) {
    return new SetEndpointDefHelper(step);
}
class SetEndpointDefHelper {
    constructor(step) {
        this._step = step;
    }
    get getOptions() {
        var _a;
        return ensureExists((_a = this._step.getOptions) !== null && _a !== void 0 ? _a : this._step.getOptionsFormula);
    }
}
export function postSetupMetadataHelper(metadata) {
    return new PostSetupMetadataHelper(metadata);
}
class PostSetupMetadataHelper {
    constructor(metadata) {
        this._metadata = metadata;
    }
    get getOptions() {
        var _a;
        return ensureExists((_a = this._metadata.getOptions) !== null && _a !== void 0 ? _a : this._metadata.getOptionsFormula);
    }
}
