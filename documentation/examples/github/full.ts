import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Regular expression used to parse repo URLs.
const RepoUrlRegex = new RegExp("^https://github.com/([^/]+)/([^/]+)");

// How many items to fetch per-page when making API list requests.
const PageSize = 50;

// Allow the Pack to access the GitHub domain.
pack.addNetworkDomain("github.com");

// Setup per-user authentication using GitHub's OAuth2.
// Remember to set your client ID and secret in the "Settings" tab.
// See https://docs.github.com/en/developers/apps/building-oauth-apps
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://github.com/login/oauth/authorize",
  tokenUrl: "https://github.com/login/oauth/access_token",
  tokenPrefix: "token",
  scopes: ["repo", "user"],

  // Determines the name of the GitHub account that was connected.
  getConnectionName: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://api.github.com/user",
    });
    return response.body.login;
  },
});

// A schema that defines a repo object.
const RepoSchema = coda.makeObjectSchema({
  properties: {
    repoId: { type: coda.ValueType.Number, fromKey: "id" },
    name: { type: coda.ValueType.String },
    fullName: { type: coda.ValueType.String, fromKey: "full_name" },
    description: { type: coda.ValueType.String },
    url: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
      fromKey: "html_url",
    },
    watchers: { type: coda.ValueType.Number, fromKey: "watchers_count" },
    forks: { type: coda.ValueType.Number, fromKey: "forks_count" },
    stars: { type: coda.ValueType.Number, fromKey: "stargazers_count" },
  },
  displayProperty: "name",
  idProperty: "repoId",
  featuredProperties: ["description", "watchers", "forks", "stars"],
});

// A formula to fetch information about a repo.
pack.addFormula({
  name: "Repo",
  description: "Get information about a repo from it's URL.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "url",
      description: "The URL of the repo.",
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: RepoSchema,
  execute: async function ([url], context) {
    let { owner, name } = parseRepoUrl(url);
    let response = await context.fetcher.fetch({
      method: "GET",
      url: `https://api.github.com/repos/${owner}/${name}`,
    });
    let repo = response.body;
    return repo;
  },
});

// A column format that automatically applies the Repo() formula.
pack.addColumnFormat({
  name: "Repo",
  instructions: "Show details about a GitHub repo, given a URL.",
  formulaName: "Repo",
  matchers: [RepoUrlRegex],
});

// An action formula that allows a user to star a repo.
pack.addFormula({
  name: "Star",
  description: "Add a star to a repo.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "url",
      description: "The URL of the repo.",
    }),
  ],
  resultType: coda.ValueType.Boolean,
  isAction: true,
  execute: async function ([url], context) {
    let { owner, name } = parseRepoUrl(url);
    let response = await context.fetcher.fetch({
      method: "PUT",
      url: `https://api.github.com/user/starred/${owner}/${name}`,
    });
    return true;
  },
});

// A sync table that lists all of the user's repos.
pack.addSyncTable({
  name: "Repos",
  description: "All of the repos that the user has access to.",
  identityName: "Repo",
  schema: RepoSchema,
  formula: {
    name: "SyncRepos",
    description: "Sync the repos.",
    parameters: [],
    execute: async function ([], context) {
      // Get the page to start from.
      let page = (context.sync.continuation?.page as number) || 1;

      // Fetch a page of repos from the GitHub API.
      let url = coda.withQueryParams("https://api.github.com/user/repos", {
        page: page,
        per_page: PageSize,
      });
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });
      let repos = response.body;

      // If there were some results, re-run this formula for the next page.
      let continuation;
      if (repos.length > 0) {
        continuation = { page: page + 1 };
      }

      // Return the repos and the continuation (if any).
      return {
        result: repos,
        continuation: continuation,
      };
    },
  },
});

// A helper function that parses a repo URL and returns the owner and name.
function parseRepoUrl(url) {
  let match = url.match(RepoUrlRegex);
  if (!match) {
    throw new coda.UserVisibleError("Invalid repo URL: " + url);
  }
  return {
    owner: match[1],
    name: match[2],
  };
}
