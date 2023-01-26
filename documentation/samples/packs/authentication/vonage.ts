import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the Vonage API, using an API key and secret
// in the request body.
// See https://developer.vonage.com/en/api/sms
pack.setUserAuthentication({
  type: coda.AuthenticationType.Custom,
  params: [
    { name: "api_key", description: "API key." },
    { name: "api_secret", description: "API secret." },
  ],
});

pack.addFormula({
  name: "SendSMS",
  description: "Sends an SMS message.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "from",
      description: "The phone number to send from.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "to",
      description: "The phone number to send to.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "text",
      description: "The text of the message.",
    }),
  ],
  resultType: coda.ValueType.String,
  isAction: true,
  execute: async function ([from, to, text], context) {
    // Create the placeholders for the API key and secret.
    let invocationToken = context.invocationToken;
    let apiKeyPlaceholder = "{{api_key-" + invocationToken + "}}";
    let apiSecretPlaceholder = "{{api_secret-" + invocationToken + "}}";

    // Construct the JSON request body.
    let body = {
      from: from,
      to: to,
      text: text,
      // These placeholders will be automatically replaced with the user's key
      // and secret before the request is made.
      api_key: apiKeyPlaceholder,
      api_secret: apiSecretPlaceholder,
    };

    let response = await context.fetcher.fetch({
      method: "POST",
      url: "https://rest.nexmo.com/sms/json",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    let message = response.body.messages[0];
    if (message.status !== "0") {
      throw new coda.UserVisibleError(message["error-text"]);
    }
    return message["message-id"];
  },
});

// Allow the pack to make requests to Vonage (former Nexmo).
pack.addNetworkDomain("nexmo.com");
