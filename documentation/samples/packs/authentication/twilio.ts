import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the Twilio API, using an Account SID and token in
// an "Authorization: Basic ..." header.
// See https://www.twilio.com/docs/usage/requests-to-twilio
pack.setUserAuthentication({
  type: coda.AuthenticationType.WebBasic,
  instructionsUrl: "https://www.twilio.com/docs/sms/api#sms-api-authentication",

  // Use Twilio-specific placeholders for the username and password fields.
  uxConfig: {
    placeholderUsername: "Account SID",
    placeholderPassword: "Auth Token",
  },

  // Determines the display name of the connected account.
  getConnectionName: async function(context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://api.twilio.com/2010-04-01/Accounts.json",
    });
    // Return the name of the main account.
    return response.body.accounts[0].friendly_name;
  },
});

// Allow the pack to make requests to Twilio.
pack.addNetworkDomain("twilio.com");
