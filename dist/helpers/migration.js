"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectSchemaHelper = exports.objectSchemaHelper = void 0;
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
        return (_a = this._schema.primaryProperty) !== null && _a !== void 0 ? _a : this._schema.primary;
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
