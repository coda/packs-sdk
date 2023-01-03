---
description: Make HTTP requests to external APIs and services using the custom Fetcher interface.
---

# Fetching remote data

Many Packs use cases require fetching data from an outside source such as an API, which is done using the custom [`Fetcher`][Fetcher] interface. Other methods for making network requests in JavaScript (such as `XMLHttpRequest` or libraries like `axios` or `jQuery`) are not supported.

[View Sample Code][samples]{ .md-button }


## Network domains {: #network-domains}

Before you can start making any requests using the fetcher, your Pack must declare which domain names it is going to communicate with. This can be done using the [`addNetworkDomain()`][addNetworkDomain] method of the pack:

```ts
pack.addNetworkDomain("example.com");
```

The fetcher can to communicate with URLs on that domain and all sub-domains. It's usually best select the root domain of the service you are working with. For example, if you want to make requests to `api.example.com`, add the network domain `example.com`, in case you later determine you need to access related content on `images.example.com`, etc.

By default a Pack is only allowed to register a single domain. This is done to limit abuse potential and provide transparency to users. If you want to combine data from multiple sources we recommend building multiple Packs and using the features of a Coda doc to bring them together. If however your use case requires making requests to multiple domains from a single Pack you may request an exemption by [contacting support][support_network_domains].

The following domains don't need to be declared as a network domain in your Pack:

- `codahosted.io` (used to host image and file attachments in Coda docs)
- `coda-us-west-2-prod-blobs-upload.s3.us-west-2.amazonaws.com` (used by [temporary blob storage][temporaryblobstorage])

!!! info "Multiple domains and authentication"
    If you make requests to multiple network domains and utilize [per-user authentication][auth_user], you'll need to set the [`networkDomain`][baseauthentication_networkdomain] field of the authentication configuration to specify which domain it should be appied to. Authentication credentials can only be applied to a single domain.


## Accessing the fetcher

The fetcher is made available in the `execute` function of a formula through the [`context`][ExecutionContext] object. This object is the second parameter of the `execute` function, after the array of formula parameters set by the user:

```ts
pack.addFormula({
  // ...
  execute: async ([foo, bar], context) => {
    let fetcher = context.fetcher;
    // ...
  },
});
```

In metadata formulas, such as those that determine autocomplete choices or connection names, the context is the only parameter:

```ts
coda.makeParameter({
  // ...
  autocomplete: async (context) => {
    let fetcher = context.fetcher;
    // ...
  },
}),
```


## Making requests

The fetcher has only one method, [`fetch`][fetch], which accepts an object containing the settings of the request. The `method` and `url` fields are required, with other fields like `headers` and `body` as optional. You can see the full list of supported fields in the [`FetchRequest` interface][FetchRequest].

```ts
context.fetcher.fetch({
  method: "GET",
  url: "https://www.example.com",
});
```

By default the fetcher runs asynchronously, meaning that the code will continue on to the next line even if the server hasn't responded yet. You can get the fetcher to behave synchronously the using the [`async`/`await`][async_await] paradigm. Make sure the outer function is declared using the `async` keyword and then use the `await` keyword to tell your code to wait for the server's response before continuing on.

```ts
pack.addFormula({
  // ...
  execute: async ([], context) => {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://www.example.com",
    });
    // Any following code won't run until the response is received.
  },
});
```

!!! info "Only HTTPS supported"
    The fetcher only supports the HTTP protocol, and requires that the connection be secured with SSL. Specifically only the protocol `https://` is supported.


### In parallel

If you want to make multiple requests in parallel you can instead kick off all of your requests, wait for them all to finish, and then look at the results. This requires some understanding of [Promises][promises], but basically follows a pattern like:

```ts
pack.addFormula({
  // ...
  execute: async ([], context) => {
    let urls = [
      // The URLs to fetch in parallel.
    ];
    let requests = [];
    for (let url of urls) {
      // Kick off the request.
      let request = context.fetcher.fetch({
        method: "GET",
        url: url,
      });
      requests.push(request);
    }
    // Wait for all the requests to finish.
    let responses = await Promise.all(requests);

    for (let response of responses) {
      // Do something with the response.
    }
  },
});
```


## Sending data

Many API requests involve sending data to an external server, usually using a `POST` or `PUT` request. To do so using the fetcher, just set the `method` property to the desired method and pass the data you want to send in `body` property. You'll usually want to set a `Content-Type` header as well, which tells the server what format the data is in.

```ts
let response = await context.fetcher.fetch({
  method: "POST",
  url: "https://httpbin.org/post",
  headers: {
    "Content-Type": "text/plain",
  },
  body: "This is some plain text.",
});
```


### JSON

Sending JSON is just like sending text above, except you typically define the payload as a JavaScript object first and then convert it into a string using [`JSON.stringify()`][stringify]. In addition, you'll need to set the `Content-Type` header to `application/json`.

```ts
let payload = {
  foo: "bar",
};
let response = await context.fetcher.fetch({
  method: "POST",
  url: "https://httpbin.org/post",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});
```


### Form data

To send data to a server that expects form input (`application/x-www-form-urlencoded`) use the `form` property of the request. Pass a set of key-value pairs representing the form fields, ensuring that all of the values are strings. The fetcher will format and encode the data, pass it in the body, and set the correct `Content-Type` header.

```ts
let response = await context.fetcher.fetch({
  method: "POST",
  url: "https://httpbin.org/post",
  form: {
    name: "Alice",
    active: String(true),
    days: String(15),
  },
});
```

Sending attachments (`multipart/form-data`) is not supported.


### URL query parameters

To send data in the URL query parameters, simply append those parameters to the URL passed to the fetcher. For example, `https://www.example.com?foo=bar&thing=true`. The SDK provides a helper function, [`coda.withQueryParams()`][withQueryParams] that simplifies the process of encoding and appending query parameters to a URL.

```ts
let url = coda.withQueryParams("https://www.example.com", {
  foo: "bar",
  thing: true,
});
let response = await context.fetcher.fetch({
  method: "GET",
  url: url,
});
```


### Binary {: #binary-body}

You can send binary data in the body of a request by passing a [Node.js `Buffer`][buffer] in the `body` field of the request. These buffers can be constructed manually, but are most often are the result of [downloading binary content](#binary-response) from another endpoint.

```ts
let data = "SGVsbG8gV29ybGQh";
let buffer = Buffer.from(data, "base64");
let response = await context.fetcher.fetch({
  method: "POST",
  url: "https://www.example.com/upload",
  headers: {
    "Content-Type": "text/plain",
  },
  body: buffer,
});
```

Sending binary data along with other types of content (`multipart/form-data`) is not supported.


## Working with responses

If your request was successful it will return a [`FetchResponse`][fetchresponse] object, which contains the status code, headers, and body of the response. Depending on the format of the response (determined by the `Content-Type` header) the body may already be parsed for you.


### Text

Except for the special content types described below, the response body will be returned as plain text.

```ts
let response = await context.fetcher.fetch({
  method: "GET",
  url: "https://www.example.com", // Returns an HTML page.
});
let html = response.body;
let bodyStart = html.indexOf('<body>');
```


### JSON

Responses with the content type `application/json` will be automatically parsed into a JavaScript object. This allows you to start accessing the data without needing to first call `JSON.parse()`.

```ts
let response = await context.fetcher.fetch({
  method: "GET",
  url: "https://api.exchangerate.host/latest?format=json",
});
let parsed = response.body;
// How you access data in the parsed JSON object depends on the contents.
let rate = parsed.rates["USD"];
```


### XML

Responses with the content type `application/xml` or `text/xml` will be automatically parsed into a JavaScript object, using the library [xml2js][xml2js]. Specifically, every XML element is converted into a JavaScript object, where the keys are the name of child elements and the values are the contents of those elements. Even when an element only contains a single value it is always returned within an array. The special key `$` reserved for attributes on the element. For example:

=== "Original XML"
    ```xml
    <basket pending="true">
      <item quantity="1">
        <name>Bread</name>
        <cost>$5</cost>
      </item>
      <item quantity="5">
        <name>Apple</name>
        <cost>$1</cost>
      </item>
    </basket>
    ```
=== "Parsed JSON"
    ```json
    {
      "$": {
        "pending": "true"
      },
      "item": [
        {
          "$": {
            "quantity": "1"
          },
          "name": [ "Bread" ],
          "cost": [ "$5" ]
        },
        {
          "$": {
            "quantity": "5"
          },
          "name": [ "Apple" ],
          "cost": [ "$1" ]
        }
      ]
    }
    ```

During development it is a good idea to log the parsed JavaScript object, so that you can more clearly understand the structure of the parsed XML.

```ts
let response = await context.fetcher.fetch({
  method: "GET",
  // Open this URL in your browser to see what the data looks like.
  url: "https://api.exchangerate.host/latest?format=xml",
});
let parsed = response.body;

// Log the parsed XML, for reference when developing.
console.log(parsed);

let usd = parsed.data.find(item => item.code[0] === "USD")
let rate = usd.rate[0];
```


### Binary {: #binary-response}

When fetching binary data, enable the request option `isBinaryResponse` to let the fetcher know that it shouldn't try to parse the server response. When binary responses are enabled the `body` field of the response object will contain a [Node.js `Buffer`][buffer].

```ts
let response = await context.fetcher.fetch({
  method: "GET",
  url: "https://cataas.com/cat", // Returns a random cat image.
  isBinaryResponse: true,
});
let buffer = response.body;
let byteLength = buffer.length;
```


### Errors

When a request fails (a response code of 300 or higher) the fetch will fail with a [`StatusCodeError`][status_code_error] exception. This exception contains useful information about the failed request, including the full response body.

```ts
let response;
try {
  response = await context.fetcher.fetch({
    method: "GET",
    // Open this URL in your browser to see what the data looks like.
    url: `https://dog.ceo/api/breed/snoopy/images`,
  });
} catch (error) {
  // If the request failed because of a non-200 status code.
  if (error.statusCode) {
    // Cast the error as a StatusCodeError, for better intellisense.
    let statusError = error as coda.StatusCodeError;
    // If the API returned an error message in the body, show it to the user.
    let message = statusError.body?.message;
    if (message) {
      throw new coda.UserVisibleError(message);
    }
  }
  // The request failed for some other reason. Re-throw the error so that it
  // bubbles up.
  throw error;
}
```


### Headers {: #headers}

The HTTP headers returned can be accessed using the `headers` field of the response. The header names are normalized (changed to lowercase) for convenience, so you can access them consistently regardless of how they are sent by the server.

```
let contentType = response.headers["content-type"].toString();
```

Unless it's a known safe header, all the header values will be redacted by Coda (contain the value `<<<REDACTED by Coda>>>` instead of the actual value). To request that a specific header be unredacted you will need to [contact support][support].

!!! info "Multiple header values"
    A server may return multiple headers with the same name. In this case, the header value will be a string array instead of a single string. As per [the spec][spec_headers], this should only happen for headers that return comma-separated values. Adding a `.toString()` call after retrieving the header value is an easy way to collapse both cases down to a single string.


## Authentication

The [authentication][authentication] you configure for your Pack is automatically applied to fetcher requests, with no extra code needed. For example, if you have set up `HeaderBearer` authentication, an `Authorization` header with the user's token will be automatically added to your fetcher requests. This is only done for formulas that use a connected account: those that have a `connectionRequirement` of `REQUIRED`, or `OPTIONAL` and the user opted to selected an account.

To disable this behavior for a specific request within a formula, set the `fetch` option `disableAuthentication: true`.

```ts
let response = await context.fetcher.fetch({
  method: "GET",
  url: `https://www.example.com`,
  disableAuthentication: true, // No auth will be applied to this request.
});
```

## Caching

For performance reasons responses for HTTP `GET` requests are cached by default. See the [caching guide][caching] for more information.


## Rate limits {: #rate-limits}

Making a request to an external API can be expensive, either due to quotas, computing resources, or monetary cost. To help prevent your code from making too many expensive API calls you can set up rate limits for your Pack. To configure these, open the Pack editor and click on **Settings** > **Add rate limits**.

<img src="../../../images/rate_limits.png" srcset="../../../images/rate_limits_2x.png 2x" class="screenshot" alt="Rate limit dialog.">

You can set a total rate limit across all users of your Pack, or if your Pack uses [authentication][authentication] you can also set a per-user rate limit. When the limit is reached your formula will pause for a bit to see if more quota becomes available, and if not eventually fail with an error.


## IP addresses

HTTP requests originating from Packs can come from a few different IP addresses. While we strive to keep the set of addresses consistent, they may be subject to change over time. You can query the current set of IP addresses by doing a DNS lookup on the domain `egress.coda.io`.

```sh
dig +short egress.coda.io
```


[Fetcher]: ../../reference/sdk/interfaces/core.Fetcher.md
[samples]: ../../samples/topic/fetcher.md
[addNetworkDomain]: ../../reference/sdk/classes/core.PackDefinitionBuilder.md#addnetworkdomain
[support]: ../../support/index.md
[support_network_domains]: ../../support/index.md#network-domains
[ExecutionContext]: ../../reference/sdk/interfaces/core.ExecutionContext/
[fetch]: ../../reference/sdk/interfaces/core.Fetcher.md#fetch
[FetchRequest]: ../../reference/sdk/interfaces/core.FetchRequest.md
[async_await]: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await
[promises]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
[fetchresponse]: ../../reference/sdk/interfaces/core.FetchResponse.md
[xml2js]: https://www.npmjs.com/package/xml2js
[status_code_error]: ../../reference/sdk/classes/core.StatusCodeError.md
[buffer]: https://nodejs.org/en/knowledge/advanced/buffers/how-to-use-buffers/
[withQueryParams]: ../../reference/sdk/functions/core.withQueryParams.md
[stringify]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
[formula_cache]: ../blocks/formulas.md#caching
[authentication]: ../basics/authentication/index.md
[spec_headers]: https://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.2
[baseauthentication_networkdomain]: ../../reference/sdk/interfaces/core.BaseAuthentication.md#networkdomain
[auth_user]: ../basics/authentication/index.md#user
[temporaryblobstorage]: ../../reference/sdk/interfaces/core.TemporaryBlobStorage.md
[caching]: ../advanced/caching.md
