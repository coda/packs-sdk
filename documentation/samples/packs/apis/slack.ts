import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the Slack API, using OAuth2.
// See https://api.slack.com/authentication/oauth-v2
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://slack.com/oauth/v2/authorize",
  tokenUrl: "https://slack.com/api/oauth.v2.access",
  scopes: ["users.profile:read"],

  // Slack uses a comma as the scope delimiter.
  scopeDelimiter: ",",

  // Slack uses the standard "scope" parameter for bot scopes.
  // User scopes must be specified in the "user_scope" parameter instead.
  scopeParamName: "user_scope",

  // The user's OAuth tokens are returned in the nested object "authed_user".
  nestedResponseKey: "authed_user",

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://slack.com/api/users.profile.get",
      cacheTtlSecs: 0,
    });
    let profile = response.body.profile;
    return profile.display_name || profile.real_name;
  },
});

// Allow the pack to make requests to Slack.
pack.addNetworkDomain("slack.com");
