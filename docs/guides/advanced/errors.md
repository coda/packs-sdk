---
nav: Error handling
description: Handle exceptions and display error messages to users.
---

# Handling errors

Dealing with errors is a common task when building a Pack. These errors can come from outside sources such as an API, or you may have to create them yourself when users pass invalid inputs.


## Fetcher errors

When the fetcher receives a response from the API indicating there was a problem it throws an exception. You can detect and handle these exceptions if there are known error cases, or if left unhandled a generic error message will be shown to the user. More information about these errors can be found in the [Fetching remote data guide][fetcher].


## User-visible errors

By default an unhandled exception in your code will be presented to the user as a generic error message.

```ts
pack.addFormula({
  name: "CreateOrder",
  description: "Create a new order.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "sku",
      description: "The SKU of the item to order.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "quantity",
      description: "The number of items to order.",
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([sku, quantity], context) {
    if (quantity < 0) {
      throw new Error("The quantity must be greater than zero.");
    }
    // ...
  },
});
```

<img src="../../../images/errors_generic.png" srcset="../../../images/errors_generic_2x.png 2x" class="screenshot" alt="Generic error message.">

When you want to provide a more specific error message, throw a `UserVisibleError` exception instead.

```{.ts hl_lines="5"}
pack.addFormula({
  // ...
  execute: async function ([sku, quantity], context) {
    if (quantity < 0) {
      throw new coda.UserVisibleError("The quantity must be greater than zero.");
    }
    // ...
  },
});
```

<img src="../../../images/errors_user_visible.png" srcset="../../../images/errors_user_visible_2x.png 2x" class="screenshot" alt="User-visible error message.">

When the error originates from an API or library, you can catch the error and throw a `UserVisibleError` one instead.

```ts
pack.addFormula({
  // ...
  execute: async function ([sku, quantity], context) {
    let response;
    try {
      response = await context.fetcher.fetch({
        method: "POST",
        url: "https://api.example.com/orders",
        form: { sku: sku, quantity: String(quantity) },
      });
    } catch (error) {
      // If the error came from the API (400 status code).
      if (error.statusCode === 400) {
        // Use the message field in the response, or fallback to generic one.
        let message = error.body?.message ?? "Invalid parameters.";
        throw new coda.UserVisibleError(message);
      }
      // If the error wasn't from the API, just re-throw it.
      throw error;
    }
    // ...
  },
});
```


## Common error handling function

Some Packs include multiple formulas that call the same API, and it can be useful to share error handling logic between them. This can be done by using the `onError` field of the formula to specify a common error handling function. If running the `execute` function results in an error, it will first be sent to the `onError` function before being returned to the doc.

```{.ts hl_lines="4 18 29-38"}
pack.addFormula({
  name: "CreateOrder",
  // ...
  onError: handleError,
  execute: async function ([sku, quantity], context) {
    let response = await context.fetcher.fetch({
      method: "POST",
      url: "https://api.example.com/orders",
      form: { sku: sku, quantity: String(quantity) },
    });
    return response.body.id;
  },
});

pack.addFormula({
  name: "CreateInvoice",
  // ...
  onError: handleError,
  execute: async function ([orderId], context) {
    let response = await context.fetcher.fetch({
      method: "POST",
      url: "https://api.example.com/invoice",
      form: { orderId: orderId },
    });
    return response.body.id;
  },
});

function handleError(error) {
  // If the error came from the API and indicates a problem with the request.
  if (error.statusCode === 400) {
    // Use the message field in the response, or fallback to generic one.
    let message = error.body?.message ?? "Invalid parameters.";
    throw new coda.UserVisibleError(message);
  }
  // If the error wasn't from the API, just re-throw it.
  throw error;
}
```


[fetcher]: ../basics/fetcher.md#errors
