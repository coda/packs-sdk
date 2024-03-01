"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SvgConstants = void 0;
/** Constants for working with SVG images. */
// eslint-disable-next-line @typescript-eslint/no-namespace
var SvgConstants;
(function (SvgConstants) {
    /** ID of the node in a returned SVG file that is targeted when Dark Mode is enabled in Coda. */
    SvgConstants.DarkModeFragmentId = 'DarkMode';
    /** Prefix to use for base-64 encoded SVGs returned by formulas. */
    SvgConstants.DataUrlPrefix = 'data:image/svg+xml;base64,';
    /** Prefix to use for base-64 encoded SVGs (that support Dark Mode) returned by formulas. */
    SvgConstants.DataUrlPrefixWithDarkModeSupport = 'data:image/svg+xml;supportsDarkMode=1;base64,';
})(SvgConstants || (exports.SvgConstants = SvgConstants = {}));
