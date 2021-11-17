# Interface: CustomAuthentication

Authenticate for custom, non-standard API authentication schemes by inserting one or more arbitrary secret values
into the request (the body, URL, headers, or form data) using template replacement.

Some APIs use non-standard authentication schemes which often require secret credentials to be put in specific places
in the request URL or request body. Custom authentication supports many of these cases by allowing you as the pack
author to define one or more secret values that the user or you as the pack author must provide (depending on
user or system authentication). When constructing a network request, you may indicate where these values should
be inserted by our fetcher service using the syntax described below (similar to templating engines).

{% raw %}
To insert the credentials, simply put `{{<paramName>-<invocationToken>}}` as a string anywhere in your request,
where `<paramName>` is the name of the parameter defined in the params mapping and `<invocationToken>` is the
secret invocation-specific token provided within the [ExecutionContext](ExecutionContext.md). The invocation
token is required for security reasons.
{% endraw %}

**`example`**
```
{% raw %}
// Suppose you're using an API that requires a secret id in the request URL,
// and a different secret value in the request body. You can define a Custom
// authentication configuration with two params:
// params: [{name: 'secretId', description: 'Secret id'},
//          {name: 'secretValue', description: 'Secret value'}])
// The user or the pack author will be prompted to specify a value for each
// of these when setting up an account.
// In the `execute` body of your formula, you can specify where those values
// are inserted in the request using the template replacement syntax shown
// above.
//
// A real-world example of an API that would require this is the Plaid API
// (https://plaid.com/docs/api/products/#auth).
// See the use of `secret`, `client_id`, and `access_token` parameters in the
// body.
execute: async function([], context) {
  let secretIdTemplateName = "secretId-" + context.invocationToken;
  let urlWithSecret = "/api/entities/{{" + secretIdTemplateName + "}}"
  let secretValueTemplateName = "secretValue-" + context.invocationToken;
  let secretHeader = 'Authorization  {{"' + secretValueTemplateName + '"}}';
  let bodyWithSecret = JSON.stringify({
    key: "{{" + secretValueTemplateName + "}}",
    otherBodyParam: "foo",
  });

  let response = await context.fetcher.fetch({
    method: "GET",
    url: urlWithSecret,
    body: bodyWithSecret,
    headers: {
      'X-Custom-Authorization-Header': secretHeader,
    },
  });
  // ...
}
{% endraw %}
```

## Hierarchy

- `BaseAuthentication`

  ↳ **`CustomAuthentication`**

## Properties

### defaultConnectionType

• `Optional` **defaultConnectionType**: [`DefaultConnectionType`](../enums/DefaultConnectionType.md)

Indicates the defualt manner in which a user's account is expected to be used by this pack,
e.g. is this account used for retrieving data, taking actions, or both.
See https://help.coda.io/en/articles/4587167-what-can-coda-access-with-packs#h_40472431f0

#### Inherited from

BaseAuthentication.defaultConnectionType

#### Defined in

[types.ts:233](https://github.com/coda/packs-sdk/blob/main/types.ts#L233)

___

### endpointDomain

• `Optional` **endpointDomain**: `string`

When requiresEndpointUrl is set to true this should be the root domain that all endpoints share.
For example, this value would be "example.com" if specific endpoints looked like {custom-subdomain}.example.com.

For packs that make requests to multiple domains (uncommon), this should be the domain within
[networkDomains](PackDefinition.md#networkdomains) that this configuration applies to.

#### Inherited from

BaseAuthentication.endpointDomain

#### Defined in

[types.ts:255](https://github.com/coda/packs-sdk/blob/main/types.ts#L255)

___

### getConnectionName

• `Optional` **getConnectionName**: [`MetadataFormula`](../types/MetadataFormula.md)

A function that is called when a user sets up a new account, that returns a name for
the account to label that account in the UI. The users credentials are applied to any
fetcher requests that this function makes. Typically, this function makes an API call
to an API's "who am I" endpoint and returns a username.

If omitted, or if the function returns an empty value, the account will be labeled
with the creating user's Coda username.

#### Inherited from

BaseAuthentication.getConnectionName

#### Defined in

[types.ts:216](https://github.com/coda/packs-sdk/blob/main/types.ts#L216)

___

### instructionsUrl

• `Optional` **instructionsUrl**: `string`

A link to a help article or other page with more instructions about how to set up an account for this pack.

#### Inherited from

BaseAuthentication.instructionsUrl

#### Defined in

[types.ts:238](https://github.com/coda/packs-sdk/blob/main/types.ts#L238)

___

### params

• **params**: [`CustomAuthParameter`](CustomAuthParameter.md)[]

An array of parameters that must be provided for new connection accounts to authenticate this pack.
These parameters can then be referenced via the [CustomAuthParameter.name](CustomAuthParameter.md#name) property for template
replacement inside the constructed network request.

#### Defined in

[types.ts:530](https://github.com/coda/packs-sdk/blob/main/types.ts#L530)

___

### postSetup

• `Optional` **postSetup**: [`SetEndpoint`](SetEndpoint.md)[]

One or more setup steps to run after the user has set up the account, before completing installation of the pack.
This is not common.

#### Inherited from

BaseAuthentication.postSetup

#### Defined in

[types.ts:261](https://github.com/coda/packs-sdk/blob/main/types.ts#L261)

___

### requiresEndpointUrl

• `Optional` **requiresEndpointUrl**: `boolean`

If true, indicates this has pack has a specific endpoint domain for each account, that is used
as the basis of HTTP requests. For example, API requests are made to <custom-subdomain>.example.com
rather than example.com. If true, the user will be prompted to provide their specific endpoint domain
when creating a new account.

#### Inherited from

BaseAuthentication.requiresEndpointUrl

#### Defined in

[types.ts:246](https://github.com/coda/packs-sdk/blob/main/types.ts#L246)

___

### type

• **type**: [`Custom`](../enums/AuthenticationType.md#custom)

Identifies this as Custom authentication.

#### Defined in

[types.ts:524](https://github.com/coda/packs-sdk/blob/main/types.ts#L524)
