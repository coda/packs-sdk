import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// A formula that demonstrates how to generate an SVG that adapts to the user's
// dark mode setting in Coda.
pack.addFormula({
  name: "HelloDarkMode",
  description: "Generates an image that adapts to the dark mode setting.",
  parameters: [],
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.ImageReference,
  execute: async function ([], context) {
    // When loading your image in dark mode, Coda will append the URL fragment
    // "#DarkMode". Instead of hard-coding that value, it's safer to retrieve
    // it from the SDK.
    let darkModeId = coda.SvgConstants.DarkModeFragmentId;
    // Generate the SVG markup. Prefer using a library for this when possible.
    let svg = `
      <svg viewBox="0 0 36 10" xmlns="http://www.w3.org/2000/svg">
        <!-- Add the dark mode ID to the root of the SVG. -->
        <g id="${darkModeId}">
          <text x="0" y="8" font-family="Courier" font-size="10" fill="black">
            Hello World!
          </text>
        </g>
        <style>
          /* Create a style rule that will be applied when the dark mode
             fragment is applied. */
          #${darkModeId}:target text { fill: white; }
        </style>
      </svg>
    `.trim();
    // Encode the markup as base64.
    let encoded = Buffer.from(svg).toString("base64");
    // Return the SVG as a data URL (using the dark mode prefix).
    return coda.SvgConstants.DataUrlPrefixWithDarkModeSupport + encoded;
  },
});
