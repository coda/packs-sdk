import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the Okta API, using a custom token prefix and
// account-specific endpoints.
// See https://developer.okta.com/docs/reference/core-okta-api/#authentication
pack.setUserAuthentication({
  type: coda.AuthenticationType.CustomHeaderToken,
  headerName: "Authorization",
  tokenPrefix: "SSWS",

  // Ask users for their Okta subdomain.
  requiresEndpointUrl: true,
  endpointDomain: "okta.com",

  // Determines the display name of the connected account.
  getConnectionName: async function(context) {
    // Retrieve the endpoint that the user set.
    let endpoint = context.endpoint;
    let url = endpoint + "/api/v1/org";
    let response = await context.fetcher.fetch({
      method: "GET",
      url: url,
    });
    return response.body.companyName;
  },
});

// Allow the pack to make requests to Okta.
pack.addNetworkDomain("okta.com");
