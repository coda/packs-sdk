"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarshalingInjectedKeys = exports.CodaMarshalerType = void 0;
var CodaMarshalerType;
(function (CodaMarshalerType) {
    CodaMarshalerType["Error"] = "Error";
    CodaMarshalerType["Buffer"] = "Buffer";
    CodaMarshalerType["Number"] = "Number";
    CodaMarshalerType["Date"] = "Date";
})(CodaMarshalerType = exports.CodaMarshalerType || (exports.CodaMarshalerType = {}));
var MarshalingInjectedKeys;
(function (MarshalingInjectedKeys) {
    MarshalingInjectedKeys["CodaMarshaler"] = "__coda_marshaler__";
    MarshalingInjectedKeys["ErrorClassName"] = "__error_class_name__";
    MarshalingInjectedKeys["ErrorClassType"] = "__error_class_type__";
})(MarshalingInjectedKeys = exports.MarshalingInjectedKeys || (exports.MarshalingInjectedKeys = {}));
