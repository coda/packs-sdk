import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// A formula that generates an image using some input text.
pack.addFormula({
  name: "TextToImage",
  description: "Generates an image using the text provided.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "text",
      description: "The text to include in the image.",
      suggestedValue: "Hello World!",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "color",
      description: "The desired color of the text. Defaults to black.",
      optional: true,
    }),
  ],
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.ImageReference,
  execute: async function ([text, color = "black"], context) {
    // Calculate the width of the generated image required to fit the text.
    // Using a fixed-width font to make this easy.
    let width = text.length * 6;
    // Generate the SVG markup. Prefer using a library for this when possible.
    let svg = `
      <svg viewBox="0 0 ${width} 10" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="8" font-family="Courier" font-size="10" fill="${color}">
          ${text}
        </text>
      </svg>
    `.trim();
    // Encode the markup as base64.
    let encoded = Buffer.from(svg).toString("base64");
    // Return the SVG as a data URL.
    return coda.SvgConstants.DataUrlPrefix + encoded;
  },
});
