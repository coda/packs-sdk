import type * as coda from "@codahq/packs-sdk";

async function snippet(context: coda.ExecutionContext) {
  // BEGIN
  let response = await context.fetcher.fetch({
    method: "GET",
    url: "${1:https://example.com}",
  });
  let data = response.body;
  // END
}
