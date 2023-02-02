---
nav: Fetcher
description: Samples that show how to fetch data from an external source.
icon: fontawesome/solid/cloud-arrow-down
---

# Fetcher samples

Communicating with an API or external server is done through the `Fetcher`, a custom interface for making HTTP requests. The fetcher is made available through the `context` object passed in to formulas. The fetcher can only send requests to URLs that have have a domain name that's been registered using `addNetworkDomain`. The fetcher runs asynchronously, and is typically run within an `async` function that will `await` the result.


[Learn More](../../../guides/basics/fetcher){ .md-button }

## Template (GET)


```ts
{% raw %}
let response = await context.fetcher.fetch({
  method: "GET",
  url: "<The URL to fetch>",
});
let data = response.body;
{% endraw %}
```
## Template (POST)


```ts
{% raw %}
let payload = {
  // Whatever JSON structure the API expects.
};
let response = await context.fetcher.fetch({
  method: "POST",
  url: "<The URL to send the request to>",
  body: JSON.stringify(payload),
});
let data = response.body;
{% endraw %}
```
## JSON Array (Bacon Ipsum)


```ts
{% raw %}
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
{% endraw %}
```

