"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarshalingInjectedKeys = exports.CodaMarshalerType = void 0;
var CodaMarshalerType;
(function (CodaMarshalerType) {
    CodaMarshalerType["Error"] = "Error";
    CodaMarshalerType["Object"] = "Object";
})(CodaMarshalerType || (exports.CodaMarshalerType = CodaMarshalerType = {}));
var MarshalingInjectedKeys;
(function (MarshalingInjectedKeys) {
    MarshalingInjectedKeys["CodaMarshaler"] = "__coda_marshaler__";
    MarshalingInjectedKeys["ErrorClassName"] = "__error_class_name__";
    MarshalingInjectedKeys["ErrorClassType"] = "__error_class_type__";
})(MarshalingInjectedKeys || (exports.MarshalingInjectedKeys = MarshalingInjectedKeys = {}));
