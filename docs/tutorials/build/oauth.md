---
title: Using OAuth2
description: Learn how to access private data in an API using OAuth2.
icon: material/shield-key
hide:
- toc
---

# Learn to authenticate with an API using OAuth2

<section class="tutorial-row" markdown>
<div markdown>

Before a Pack can use an API to fetch private data, it must first be given access by the user. The most popular technology for granting that authorization is OAuth2.

In this tutorial you'll create a formula that access a user's tasks in the Todoist application, using their API and OAuth2.

</div>
<div markdown>

!!! abstract "Goal"
    Build a `Tasks` formula that retrieves the user's open tasks in Todoist, using OAuth2.

</div>
</section>

Before starting this tutorial, make sure you have completed:

- One of the **Get started** tutorials, either [In your browser][quickstart_web] or [On your local machine][quickstart_cli].
- The [Call an API tutorial][tutorial_fetcher], which covers how to call make an HTTP request.


## :material-shield-key: What is OAuth2?

[OAuth][oauth] is a standard way for a user to connect one application to another, without needing to share their password. [OAuth2][oauth2] is the most recent version of the protocol, and has been widely adopted across the industry.

To learn about why OAuth was created an how it works at a high level, we recommend watching one of the following videos:

- ["What is OAuth and why does it matter?"][youtube_oktadev]
- ["What is OAuth really all about"][youtube_javabrains]


## :material-book-open-variant: Read the API docs

Although OAuth2 is a standard, there is a lot of variation in how APIs choose to implement it. When working with a new API, first consult their OAuth2 documentation carefully to determine the specific requirements.

Todoist describes their OAuth2 support [in their developer docs][todoist_oauth]. There are a few key pieces of information you need to obtain from their documentation:


=== ":material-numeric-1-circle: Authorization URL"

    <section class="tutorial-row" markdown>
    <div markdown>

    To start the OAuth2 flow, the user is directed to the website of the API provider to sign in and/or grant access to the application. The URL to open in the user's browser is called the authorization URL.

    For Todoist this URL is

    ```
    https://todoist.com/oauth/authorize
    ```

    The `client_id`, `scope`, and `state` parameters mentioned in the documentation will be added automatically by the Pack.

    </div>
    <div markdown>

    <a href="https://developer.todoist.com/guides/#step-1-authorization-request">
      <img src="../../../images/tutorial_oauth_authorization_url.png" srcset="../../../images/tutorial_oauth_authorization_url_2x.png 2x" class="screenshot" alt="The documentation for the authorization URL.">
    </a>

    </div>
    </section>

=== ":material-numeric-2-circle: Token URL"

    <section class="tutorial-row" markdown>
    <div markdown>

    After the user approves the access request, the Pack is given a temporary code that can be exchanged for an access token. To perform that exchange the Pack makes a request to the API's token URL.

    For Todoist this URL is

    ```
    https://todoist.com/oauth/access_token
    ```

    The `client_id`, `client_secret`, and `code` parameters mentioned in the documentation will be added automatically by the Pack.

    </div>
    <div markdown>

    <a href="https://developer.todoist.com/guides/#step-3-token-exchange">
      <img src="../../../images/tutorial_oauth_token_url.png" srcset="../../../images/tutorial_oauth_token_url_2x.png 2x" class="screenshot" alt="The documentation for the token URL.">
    </a>

    </div>
    </section>


=== ":material-numeric-3-circle: Scopes"

    <section class="tutorial-row" markdown>
    <div markdown>

    Many APIs allow the application to request access to only a limited set of permissions, which are shown to the user when approving access. A scope is an identifier that corresponds to a given permission or set of permissions in the API.

    The Todoist API supports a few different scopes. When building a Pack it's usually best to request the most narrow scope that allows your Pack to function. Our Pack only requires reading the user's tasks, so the `data:read` scope is sufficient.

    </div>
    <div markdown>

    <a href="https://developer.todoist.com/guides/#step-1-authorization-request">
      <img src="../../../images/tutorial_oauth_scopes.png" srcset="../../../images/tutorial_oauth_scopes_2x.png 2x" class="screenshot" alt="The documentation for the scopes.">
    </a>

    </div>
    </section>

=== ":material-numeric-4-circle: Additional requirements"

    <section class="tutorial-row" markdown>
    <div markdown>

    While the [OAuth2 standard][oauth_standard] provides a common foundation, many providers add their own unique requirements that need to be accounted for. Learning to spot these can be difficult, especially if you are new to OAuth2 and don't know what "normal" OAuth2 entails.

    The Todoist API deviates from the standard by requiring that scopes be comma-separated, instead of the default space-separated. Although we currently only plan to use one scope, this is important to note if our Pack later requires additional permissions.

    </div>
    <div markdown>

    <a href="https://developer.todoist.com/guides/#step-1-authorization-request">
      <img src="../../../images/tutorial_oauth_scope_comma.png" srcset="../../../images/tutorial_oauth_scope_comma_2x.png 2x" class="screenshot" alt="The documentation for the scope separator.">
    </a>

    </div>
    </section>


## :material-application-edit: Register your application

Every application needs to identify itself during the OAuth2 flow, so that the user knows who they are granting access to. This is done using a client ID and secret, which are provided when you register your application with the API provider.

Most API providers host a developer console for creating and managing applications, and you should consult the API documentation to determine the exact steps required.

=== ":material-numeric-1-circle: Open console"

    <section class="tutorial-row" markdown>
    <div markdown>

    Open the Todoist [App Management Console][todoist_console] and sign in with your Todoist account.

    Click the **Create a new app** button to start the process of registering an application.

    </div>
    <div markdown>

    <img src="../../../images/tutorial_oauth_console.png" srcset="../../../images/tutorial_oauth_console_2x.png 2x" class="screenshot" alt="The Todoist app management console">

    </div>
    </section>


=== ":material-numeric-2-circle: Create application"

    <section class="tutorial-row" markdown>
    <div markdown>

    Enter a name for your application in the **App name** field. This will be shown later to the user when they are approving access.

    For the **App service URL** enter `https://coda.io` for now. Once your Pack is complete, change it to the URL of the listing page for your Pack.

    Click the **Create app** button.

    </div>
    <div markdown>

    <img src="../../../images/tutorial_oauth_create.png" srcset="../../../images/tutorial_oauth_create_2x.png 2x" class="screenshot" alt="Creating a new application in the console">

    </div>
    </section>


=== ":material-numeric-3-circle: Edit settings"

    <section class="tutorial-row" markdown>
    <div markdown>

    The settings screen for your application includes the client ID and secret you'll need during the OAuth2 flow. You'll have to enter those into the Pack Studio later.

    It's important to set the **OAuth redirect URL** field. This is the URL that the user's browser is sent to after they approve access. All packs use the same value for this URL:

    ```
    https://coda.io/packsAuth/oauth2
    ```

    Click the **Save settings** button to save your changes.

    </div>
    <div markdown>

    <img src="../../../images/tutorial_oauth_settings.png" srcset="../../../images/tutorial_oauth_settings_2x.png 2x" class="screenshot" alt="The settings for the new application">

    </div>
    </section>


## :material-ruler-square-compass: Design the formula

You're just about ready to start writing code, but before diving in let's design the formula behavior.

The [Todoist API documentation][todoist_tasks] provides an endpoint for listing tasks, which doesn't require any parameters. The API returns a bunch of metadata for each task, but for simplicity let's just return the text of the task itself.

```
Tasks() ==> ["Pick up milk", "Walk the dog", "Clean the bathroom"]
```


## :fontawesome-solid-laptop-code: Write the code

Now that we've got the OAuth2 URLs, scopes, client ID and secret we're ready to start coding the Pack.

=== ":material-numeric-1-circle: Scaffold the formula"

    <section class="tutorial-row" markdown>
    <div markdown>

    Add the standard Pack boilerplate and declare the network domain. Define a formula called `Tasks` which doesn't take any parameters.

    For the result type use `Array` since we will be returning a list of tasks, specifying in the `items` field that each item in the array will be a `String`.

    </div>
    <div markdown>

    ```ts
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.addNetworkDomain("todoist.com");

    pack.addFormula({
      name: "Tasks",
      description: "A list of your current tasks.",
      parameters: [],
      resultType: coda.ValueType.Array,
      items: { type: coda.ValueType.String },
      execute: async function ([], context) {
        // TODO
        return [];
      },
    });
    ```

    </div>
    </section>


=== ":material-numeric-2-circle: Fetch the data"

    <section class="tutorial-row" markdown>
    <div markdown>

    Make a GET request to the Tasks endpoint to retrieve the user's active tasks. This returns an array of task objects in the response body.

    For each task object, extract the task's text content from the `content` field and return that array as the formula result.

    </div>
    <div markdown>

    ```{.ts hl_lines="9-18"}
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.addNetworkDomain("todoist.com");

    pack.addFormula({
      // ..
      execute: async function ([], context) {
        let response = await context.fetcher.fetch({
          method: "GET",
          url: "https://api.todoist.com/rest/v1/tasks",
        });
        let tasks = response.body;
        let results = [];
        for (let task of tasks) {
          results.push(task.content)
        }
        return results;
      },
    });
    ```

    </div>
    </section>


=== ":material-numeric-3-circle: Add OAuth config"

    <section class="tutorial-row" markdown>
    <div markdown>

    Coda handles all of the OAuth logic for Packs, all you need to do is define some settings. This starts by adding an authorization configuration to the Pack.

    Use `setUserAuthentication` here, since we want each user to sign in with their own Todoist account. Then specify the type of authentication to use as `OAuth2`.

    </div>
    <div markdown>

    ```{.ts hl_lines="4-6"}
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.setUserAuthentication({
      type: coda.AuthenticationType.OAuth2,
    });

    pack.addFormula({
      // ...
    });
    ```

    </div>
    </section>


=== ":material-numeric-4-circle: Set OAuth URLs"

    <section class="tutorial-row" markdown>
    <div markdown>

    To handle the OAuth flow, Coda needs to know the URLs the provider has for granting authorization and generating tokens.

    Set the `authorizationURL` and `tokenUrl` fields using the values found in the Todoist API documentation.

    </div>
    <div markdown>

    ```{.ts hl_lines="6-7"}
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.setUserAuthentication({
      type: coda.AuthenticationType.OAuth2,
      authorizationUrl: "https://todoist.com/oauth/authorize",
      tokenUrl: "https://todoist.com/oauth/access_token",
    });

    pack.addFormula({
      // ...
    });
    ```

    </div>
    </section>


=== ":material-numeric-5-circle: Set scopes"

    <section class="tutorial-row" markdown>
    <div markdown>

    You must also specify which scopes to request, if any. The `scopes` field accepts an array of scope strings, although in this case we only need a single scope.

    We also learned from the API documentation that Todoist uses a non-standard scope separator. Luckily the Pack SDK supports this variation, and it can be configured using the `scopeDelimiter` field.

    </div>
    <div markdown>

    ```{.ts hl_lines="8-9"}
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.setUserAuthentication({
      type: coda.AuthenticationType.OAuth2,
      authorizationUrl: "https://todoist.com/oauth/authorize",
      tokenUrl: "https://todoist.com/oauth/access_token",
      scopes: ["data:read"],
      scopeDelimiter: ",",
    });

    pack.addFormula({
      // ...
    });
    ```

    </div>
    </section>

---

### Build the Pack

All the code is written, but we're not ready to start using the Pack just yet. Build a new version of the Pack before moving on to the next step.

??? example "View the full code"
    ```ts
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.addNetworkDomain("todoist.com");

    pack.setUserAuthentication({
      type: coda.AuthenticationType.OAuth2,
      authorizationUrl: "https://todoist.com/oauth/authorize",
      tokenUrl: "https://todoist.com/oauth/access_token",
      scopes: ["data:read"],
      scopeDelimiter: ",",
    });

    pack.addFormula({
      name: "Tasks",
      description: "A list of your current tasks.",
      parameters: [],
      resultType: coda.ValueType.Array,
      items: { type: coda.ValueType.String },
      execute: async function ([], context) {
        let response = await context.fetcher.fetch({
          method: "GET",
          url: "https://api.todoist.com/rest/v1/tasks",
        });
        let tasks = response.body;
        let results = [];
        for (let task of tasks) {
          results.push(task.content)
        }
        return results;
      },
    });
    ```


## :material-key-plus: Add credentials

In the software world it's a best practice to keep your credentials separate from your code. This makes it easier to share your code with others, and allows you to update credentials quickly in they are compromised and need to be reset.

The code we've written so far includes only public information about the OAuth flow, but the last step is to enter the private credentials (client ID and secret) associated with your Todoist application.


=== ":material-numeric-1-circle: Open Pack settings"

    <section class="tutorial-row" markdown>
    <div markdown>

    Click on the **Settings** tab on the left side of the Pack Studio to bring up the settings for your Pack.

    Click the **Add OAuth Credentials** button. If you don't see this button, make sure you have built a new version of your Pack that includes the OAuth configuration code.

    </div>
    <div markdown>

    <img src="../../../images/tutorial_oauth_pack_settings.png" srcset="../../../images/tutorial_oauth_pack_settings_2x.png 2x" class="screenshot" alt="The Pack settings">

    </div>
    </section>


=== ":material-numeric-2-circle: Set credentials"

    <section class="tutorial-row" markdown>
    <div markdown>

    Enter the client ID and secret you received when you registered you application with Todoist.

    Click the **Save** button.

    </div>
    <div markdown>

    <img src="../../../images/tutorial_oauth_pack_credentials.png" srcset="../../../images/tutorial_oauth_pack_credentials_2x.png 2x" class="screenshot" alt="Entering the OAuth credentials">

    </div>
    </section>


## :fontawesome-solid-user-check: Sign in

Now that the Pack is built and the credentials set, we're finally ready to sign in and try it in a doc.


=== ":material-numeric-1-circle: Sign-in prompt"

    <section class="tutorial-row" markdown>
    <div markdown>

    Packs with per-user authentication require that you sign in before you can add it to a doc.

    Click the **Sign in to add to doc** button.

    </div>
    <div markdown>

    <img src="../../../images/tutorial_oauth_signin.png" srcset="../../../images/tutorial_oauth_signin_2x.png 2x" class="screenshot" alt="Prompted to sign in to the Pack on install">

    </div>
    </section>


=== ":material-numeric-2-circle: Approving access"

    <section class="tutorial-row" markdown>
    <div markdown>

    Coda opens the Todoist website in a new tab and shows the access prompt. The permissions listed reflect the scopes requested by the Pack.

    Click the **Agree** button.

    </div>
    <div markdown>

    <img src="../../../images/tutorial_oauth_authorize.png" srcset="../../../images/tutorial_oauth_authorize_2x.png 2x" class="screenshot" alt="Authorize access to your Todoist account">

    </div>
    </section>


=== ":material-numeric-3-circle: Complete setup"

    <section class="tutorial-row" markdown>
    <div markdown>

    After approving access, the Todoist tab will close and you'll be back in your Coda doc.

    Depending on the features of your Pack, users may need to make additional decisions about how their account is used. For this Pack there are no choices to make.

    Click the **Complete setup** button.

    </div>
    <div markdown>

    <img src="../../../images/tutorial_oauth_complete.png" srcset="../../../images/tutorial_oauth_complete_2x.png 2x" class="screenshot" alt="Complete the account connection">

    </div>
    </section>

---

### Try it out

<section class="tutorial-row" markdown>
<div markdown>

Add the `Tasks()` formula to the doc. If everything is working correctly you should see a list of tasks from your Todoist account.

You'll notice that it takes in an account as a parameter, and it should auto-select the account you just connected. This account parameter will appear before any other parameters you defined for the formula.

</div>
<div markdown>

<img src="../../../images/tutorial_oauth_formula.png" srcset="../../../images/tutorial_oauth_formula_2x.png 2x" class="screenshot" alt="Use the formula in a doc">

</div>
</section>


## :material-fast-forward: Next steps

Now that you have an understanding of how to use OAuth2 in Packs, here are some more resources you can explore:

- [Authentication guide][authentication] - More in-depth information about how to setup authentication in a Pack, including OAuth2.
- [Sample code][samples_apis] - A collection of sample Packs that use OAuth2 to connect to various popular APIs.


[quickstart_web]: ../get-started/web.md
[quickstart_cli]: ../get-started/cli.md
[tutorial_fetcher]: fetcher.md
[oauth]: https://oauth.net/
[oauth2]: https://oauth.net/2/
[youtube_oktadev]: https://www.youtube.com/watch?v=KT8ybowdyr0&t=227s
[youtube_javabrains]: https://www.youtube.com/watch?v=t4-416mg6iU
[todoist_oauth]: https://developer.todoist.com/guides/#oauth
[todoist_console]: https://developer.todoist.com/appconsole.html
[oauth_standard]: https://datatracker.ietf.org/doc/html/rfc6749
[todoist_tasks]: https://developer.todoist.com/rest/v1/#get-active-tasks
[authentication]: ../../guides/advanced/authentication/index.md
[samples_apis]: ../../samples/topic/apis.md
