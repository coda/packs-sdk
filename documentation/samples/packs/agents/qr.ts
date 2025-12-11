import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.addNetworkDomain("api.qrserver.com");

// When the user clicks on the agent, immediately run this skill to generate a
// QR code using the URL of the current page.
pack.setBenchInitializationSkill({
  name: "CurrentPageQRCode",
  displayName: "Current Page QR Code",
  description: "Generate a QR containing the URL fo the current page.",
  prompt: `
    Generate a QR code, using the URL of the current page as the text.
    Reply with a summary, and the resulting image rendered in markdown format.
  `,
  tools: [
    {
      type: coda.ToolType.Pack,
      formulas: [
        { formulaName: "QRCode" },
      ],
    },
  ],
});

pack.addFormula({
  name: "QRCode",
  description: "Generate a QR code for the text supplied.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "text",
      description: "The text to encode in the QR code.",
    }),
  ],
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.ImageReference,
  execute: async function (args, context) {
    let [text] = args;
    return coda.withQueryParams("https://api.qrserver.com/v1/create-qr-code/", {
      data: text,
      size: "512x512",
    });
  },
});
