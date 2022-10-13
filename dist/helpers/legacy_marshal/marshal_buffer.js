import { LegacyCodaMarshalerType } from './constants';
import { LegacyMarshalingInjectedKeys } from './constants';
export function marshalBuffer(val) {
    var _a;
    // Usually `val instanceof Buffer` would be sufficient (e.g. imported as a regular module) to decide
    // if `val` is a Buffer. In the compiled bundle, however there might be multiple instances of Buffer
    // class as each build piece (e.g. bundle/thunk/etc) may come with its own buffer shim. Using
    // `Buffer?.isBuffer` (which checks `val._isBuffer`) would allow us to bridge the gap.
    if (val instanceof Buffer || ((_a = global.Buffer) === null || _a === void 0 ? void 0 : _a.isBuffer(val))) {
        return {
            data: [...Uint8Array.from(val)],
            [LegacyMarshalingInjectedKeys.CodaMarshaler]: LegacyCodaMarshalerType.Buffer,
        };
    }
}
export function unmarshalBuffer(val) {
    if (typeof val !== 'object' || val[LegacyMarshalingInjectedKeys.CodaMarshaler] !== LegacyCodaMarshalerType.Buffer) {
        return;
    }
    return Buffer.from(val.data);
}
