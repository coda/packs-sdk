---
nav: Call an API
description: Learn how to call an external API from within a Pack.
icon: material/api
hide:
- toc
cSpell:words: exchangerate
---

# Learn to call an API

One of the primary use cases for a Pack is to integrate with an external API, allowing users to bring in data or functionality not native to Coda. In this tutorial you'll create a formula that makes a request to an API and uses the response to calculate the result.

!!! abstract "Goal"
    Build a `ToUSD` formula that uses an external API to convert currency values to US dollars.

Before starting this tutorial, make sure you have completed:

- One of the **Get started** tutorials, either [In your browser][quickstart_web] or [On your local machine][quickstart_cli].
- The [Basic formula tutorial][tutorial_formula], which covers how to build formulas.


## :material-api: Select the API

When building a Pack around data from an external API, it's usually best to first select the API and examine its capabilities and requirements, as those may have a large influence on the design of your formula.

For this Pack we'll be using the API provided by [exchangerate.host][exchangerate_home], which is free to use and doesn't require any keys or credentials. As shown in their documentation, you can get the latest exchange rates using the following URL:

```
https://api.exchangerate.host/latest?base=USD
```

By default this returns the exchange rate for a single Euro, but we can change the starting currency and amount using URL query parameters:

```
https://api.exchangerate.host/latest?base=CAD&amount=100
```

The endpoint returns a JSON response, which includes the conversion rate for all of the currencies it supports:

```js
{
  "success": true,
  "base": "CAD",
  "date": "2022-06-09",
  "rates": {
    "AED": 292.51651,
    "AFN": 7076.688907,
    // ...
    "USD": 79.659392,
  }
}
```

Here we see that 100 Canadian dollars converts to 79 US dollars (at the time this request was made.) This will provide us the information we need to build our formula.


## :material-ruler-square-compass: Design the formula

Looking at the inputs and outputs to the API, we could imagine a formula that takes an amount and currency code as input and returns a converted amount as a number.

```
ToUSD(100, "CAD") ==> $79.65
```


## :fontawesome-solid-laptop-code: Write the code

Now that we've got our API selected and formula designed we're ready to dive into coding.

=== ":material-numeric-1-circle: Scaffold the formula"

    <section class="tutorial-row" markdown>
    <div markdown>

    Add the standard Pack boilerplate, including the import and Pack declaration.

    Define a formula called `ToUSD` which takes an `amount` and `from` parameter.

    For the result type use `Number`, with the value hint `Currency` to get it to render with a dollar sign.

    Hard-code the `execute` function to return zero for now, which we'll replace later with the real value fetched from the API.

    </div>
    <div markdown>

    ```ts
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.addFormula({
      name: "ToUSD",
      description: "Convert a currency to US dollars.",
      parameters: [
        coda.makeParameter({
          type: coda.ParameterType.Number,
          name: "amount",
          description: "The amount to convert."
        }),
        coda.makeParameter({
          type: coda.ParameterType.String,
          name: "from",
          description: "The currency to convert from."
        }),
      ],
      resultType: coda.ValueType.Number,
      codaType: coda.ValueHintType.Currency,
      execute: async function ([amount, from], context) {
        // TODO
        return 0;
      },
    });
    ```

    </div>
    </section>


=== ":material-numeric-2-circle: Build the URL"

    <section class="tutorial-row" markdown>
    <div markdown>

    With the formula scaffold in place, let's focus in on the `execute` function.

    First we'll need to build the URL to send the request to. While it's possible to construct it manually, the utility function `coda.withQueryParameters` is easier to use and handles all of the encoding and edge cases.

    The first parameter to `coda.withQueryParameters` is the base URL, and the second is a set of key-value pairs to be placed into the query string. This code will return a URL ending with `?base=<from>&amount=<amount>`.

    </div>
    <div markdown>

    ```{.ts hl_lines="2-7"}
    execute: async function ([amount, from], context) {
      let baseUrl =
          "https://api.exchangerate.host/latest";
      let url = coda.withQueryParams(baseUrl, {
        base: from,
        amount: amount,
      });
    },
    ```

    </div>
    </section>


=== ":material-numeric-3-circle: Make the request"

    <section class="tutorial-row" markdown>
    <div markdown>

    To make the request to the API you need to use the `fetcher` object, which lives within the formula's `context`. Its `fetch` method takes a set of key-value pairs that configure the request.

    Set the HTTP method to `GET` and the URL to the one we previously constructed.

    Fetcher requests are asynchronous, meaning that `fetch` only starts the request, but doesn't wait for it to finish. To do that use the `await` keyword, which tells our code to pause until the API responds.

    The response from the API is captured in the `response` variable, which you'll use later.

    </div>
    <div markdown>

    ```{.ts hl_lines="8-11"}
    execute: async function ([amount, from], context) {
      let baseUrl =
          "https://api.exchangerate.host/latest";
      let url = coda.withQueryParams(baseUrl, {
        base: from,
        amount: amount,
      });
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url
      });
    },
    ```

    </div>
    </section>


=== ":material-numeric-4-circle: Return the result"

    <section class="tutorial-row" markdown>
    <div markdown>

    The fetcher response includes lots of information about what the API sent back, but in this case we're interested in the `body` only. When Coda detects that the response is JSON it will automatically parse it for you.

    Referring back to the raw API response we saw earlier, the information you need is in the `rates` sub-object under the key `USD`. Since the response is already parsed you can "dot" into that value and return it.

    </div>
    <div markdown>

    ```{.ts hl_lines="12-13"}
    execute: async function ([amount, from], context) {
      let baseUrl =
          "https://api.exchangerate.host/latest";
      let url = coda.withQueryParams(baseUrl, {
        base: from,
        amount: amount,
      });
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url
      });
      let json = response.body;
      return json.rates.USD;
    },
    ```

    </div>
    </section>


=== ":material-numeric-5-circle: Allow access to the domain"

    <section class="tutorial-row" markdown>
    <div markdown>

    For security and transparency reasons, Coda requires that all Packs declare which domains they make requests to. Before your Pack will function property you must add that declaration to your code.

    The function `pack.addNetworkDomain` adds a domain to the Pack's declaration. This line can be added anywhere in your code after the boilerplate, but it's usually done at the top of the file.

    Your Pack is allowed to access any sub-domains off of this domain, so it's best to select the root domain of the URLs you are making requests to. In this case, use the root domain `exchangerate.host` instead of narrower API-specific domain of `api.exchangerate.host`.

    </div>
    <div markdown>

    ```{.ts hl_lines="4"}
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.addNetworkDomain("exchangerate.host");

    pack.addFormula({
      // ...
    });
    ```

    </div>
    </section>

---

### Try it out

Now that the Pack is written, let's see it in action.

<section class="tutorial-row" markdown>
<div markdown>

Build the Pack and install it in a doc. Add the `ToUSD` formula to the page and fill in the parameters.

If everything is working correctly you should get back the currency value converted to dollars.

</div>
<div markdown>

<img src="../../../images/tutorial_fetcher_result.png" srcset="../../../images/tutorial_fetcher_result_2x.png 2x" class="screenshot" alt="The formula working in a doc.">

</div>
</section>

!!! tip "Bonus points"
    Try adding [autocomplete][autocomplete] on the `from` parameter to provide the user with the list of supported currency codes, and [throw an error][uservisibleerror] if they input an invalid one.

??? example "View the full code"
    ```ts
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.addNetworkDomain("exchangerate.host");

    pack.addFormula({
      name: "ToUSD",
      description: "Convert a currency to US dollars.",
      parameters: [
        coda.makeParameter({
          type: coda.ParameterType.Number,
          name: "amount",
          description: "The amount to convert."
        }),
        coda.makeParameter({
          type: coda.ParameterType.String,
          name: "from",
          description: "The currency to convert from."
        }),
      ],
      resultType: coda.ValueType.Number,
      codaType: coda.ValueHintType.Currency,
      execute: async function ([amount, from], context) {
        let baseUrl =
            "https://api.exchangerate.host/latest";
        let url = coda.withQueryParams(baseUrl, {
          base: from,
          amount: amount,
        });
        let response = await context.fetcher.fetch({
          method: "GET",
          url: url
        });
        let json = response.body;
        return json.rates.USD;
      },
    });
    ```


## :material-view-list: View the logs

Coda logs every API request that your Pack makes, and examining those logs can be very useful when troubleshooting.

=== ":material-numeric-1-circle: Open the logs"

    <section class="tutorial-row" markdown>
    <div markdown>

    In the Pack's side panel click the **View logs** button to bring up the Pack Maker Tools. If you have navigated away from the Pack's panel, click {{ coda.pack_panel_clicks }}.

    </div>
    <div markdown>

    <img src="../../../images/tutorial_fetcher_panel.png" srcset="../../../images/tutorial_fetcher_panel_2x.png 2x" class="screenshot" alt="Where to fine the open logs button in the panel">

    </div>
    </section>


=== ":material-numeric-2-circle: View the request log entry"

    <section class="tutorial-row" markdown>
    <div markdown>

    Find the most recent invocation of your formula (that isn't from the cache) and expand it to reveal the log entry for the fetch request.

    Expanding that log entry reveals additional metadata about the request, including the response code and duration.

    </div>
    <div markdown>

    <img src="../../../images/tutorial_fetcher_logs.png" srcset="../../../images/tutorial_fetcher_logs_2x.png 2x" class="screenshot" alt="The fetch request showing in the logs.">

    </div>
    </section>


=== ":material-numeric-3-circle: View the HTTP response"

    <section class="tutorial-row" markdown>
    <div markdown>

    Click the link **Show HTTP request details** under the log entry to bring up a dialog containing the full HTTP request and response. Expand the response body to inspect the JSON structure that was returned by the API.

    </div>
    <div markdown>

    <img src="../../../images/tutorial_fetcher_http.png" srcset="../../../images/tutorial_fetcher_http_2x.png 2x" class="screenshot" alt="The raw HTTP request and response.">

    </div>
    </section>


## :material-fast-forward: Next steps

Now that you have an understanding of how to call an external API, here are some more resources you can explore:

- [Fetcher guide][fetcher] - More in-depth information about how to use the fetcher.
- [Sample code][samples_fetcher] - A collection of sample Packs that show how to use the fetcher.
- [Pack maker tools guide][pmt] - More information on how to view the logs for your Pack.


[quickstart_web]: ../get-started/web.md
[quickstart_cli]: ../get-started/cli.md
[tutorial_formula]: formula.md
[exchangerate_home]: https://exchangerate.host/
[fetcher]: ../../guides/basics/fetcher.md
[samples_fetcher]: ../../samples/topic/fetcher.md
[pmt]: ../../guides/development/pack-maker-tools.md
[autocomplete]: ../../guides/basics/parameters/autocomplete.md
[uservisibleerror]: ../../reference/sdk/classes/core.UserVisibleError.md
