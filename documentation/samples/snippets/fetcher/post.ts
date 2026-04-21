import type * as sdk from "@codahq/packs-sdk";

async function snippet(context: sdk.ExecutionContext) {
  // BEGIN
  let payload = {
    // TODO: Construct the JSON that the API expects.
  };
  let response = await context.fetcher.fetch({
    method: "POST",
    url: "${1:https://example.com}",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  let data = response.body;
  // END
}
