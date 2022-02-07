import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// When using the fetcher, this is the domain of the API that your pack makes
// fetcher requests to.
pack.addNetworkDomain("baconipsum.com");

// This line adds a new formula to this Pack.
pack.addFormula({
  name: "BaconIpsum",
  description: "Returns meat-themed lorem ipsum copy.",
  parameters: [], // No parameters required.
  resultType: coda.ValueType.String,

  // This function is declared async to that is can wait for the fetcher to
  // complete. The context parameter provides access to the fetcher.
  execute: async function ([], context) {
    let url = "https://baconipsum.com/api/?type=meat-and-filler";

    // The fetcher's fetch method makes the request. The await keyword is used
    // to wait for the API's response before continuing on through the code.
    let response = await context.fetcher.fetch({
      method: "GET",
      url: url,
    });

    // The API returns an array of strings, which is automatically parsed by
    // the fetcher into a JavaScript object.
    let paragraphs = response.body;

    // Return the paragraphs separated by a blank line.
    return paragraphs.join("\n\n");
  },
});
