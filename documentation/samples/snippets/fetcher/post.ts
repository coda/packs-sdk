import type * as coda from "@codahq/packs-sdk";

async function snippet(context: coda.ExecutionContext) {
  // BEGIN
  let payload = {
    // Whatever JSON structure the API expects.
  };
  let response = await context.fetcher.fetch({
    method: "POST",
    url: "<The URL to send the request to>",
    body: JSON.stringify(payload),
  });
  let data = response.body;
  // END
}
