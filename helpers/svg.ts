/** Constants for working with SVG images. */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SvgConstants {
  /** ID of the node in a returned SVG file that is targeted when Dark Mode is enabled in Coda. */
  export const DarkModeFragmentId = 'DarkMode';

  /** Prefix to use for base-64 encoded SVGs returned by formulas. */
  export const DataUrlPrefix = 'data:image/svg+xml;base64,';

  /** Prefix to use for base-64 encoded SVGs (that support Dark Mode) returned by formulas. */
  export const DataUrlPrefixWithDarkModeSupport = 'data:image/svg+xml;supportsDarkMode=1;base64,';
}
