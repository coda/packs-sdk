This Pack demonstrates a lightweight integration with [GitHub][github]. There is a lot of functionality provided by the GitHub API, but this sample just provides a few features related to repositories (repos):

- A formula that provides rich data about a repo given its URL.
- A column format that automatically applies that formula to matching URLs.
- An action formula (button) that stars a repo given its URL.
- A sync table that pulls in all of the user's repos.

The Pack uses OAuth2 to connect to a user's GitHub account. A more extensive GitHub sample that is deployed via the CLI is available in the [`packs-examples` repo][github_example].

[github]: https://github.com/
[github_example]: https://github.com/coda/packs-examples/tree/main/examples/github
