import type * as coda from "@codahq/packs-sdk";

async function snippet(context: coda.ExecutionContext) {
  // BEGIN
  let response = await context.fetcher.fetch({
    method: "GET",
    url: "<The URL to fetch>",
  });
  let data = response.body;
  // END
}
