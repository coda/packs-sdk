import type * as coda from "@codahq/packs-sdk";

async function snippet(context: coda.ExecutionContext) {
  // BEGIN
  let response = await context.fetcher.fetch({
    method: "GET",
    url: "<The URL to fetch>",
    headers: {
      "<HeaderName>": "<HeaderValue>",
      // Add more headers as needed.
    },
  });
  let data = response.body;
  // END
}
