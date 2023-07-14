"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacyMarshalingInjectedKeys = exports.LegacyCodaMarshalerType = void 0;
var LegacyCodaMarshalerType;
(function (LegacyCodaMarshalerType) {
    LegacyCodaMarshalerType["Error"] = "Error";
    LegacyCodaMarshalerType["Buffer"] = "Buffer";
    LegacyCodaMarshalerType["Number"] = "Number";
    LegacyCodaMarshalerType["Date"] = "Date";
})(LegacyCodaMarshalerType || (exports.LegacyCodaMarshalerType = LegacyCodaMarshalerType = {}));
var LegacyMarshalingInjectedKeys;
(function (LegacyMarshalingInjectedKeys) {
    LegacyMarshalingInjectedKeys["CodaMarshaler"] = "__coda_marshaler__";
    LegacyMarshalingInjectedKeys["ErrorClassName"] = "__error_class_name__";
    LegacyMarshalingInjectedKeys["ErrorClassType"] = "__error_class_type__";
})(LegacyMarshalingInjectedKeys || (exports.LegacyMarshalingInjectedKeys = LegacyMarshalingInjectedKeys = {}));
