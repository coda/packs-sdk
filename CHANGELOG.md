# Changelog
This changelog keeps track of all changes to the packs-sdk. We follow conventions from [keepachangelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]
- **Breaking Change** ValueHintType.Url will now create a column of type "Link" instead of "Text".
- Added ValueHintType.Email for new column type "Email".

## [0.8.2]

- Added `coda whoami` command to see API token details.
- Added `coda link` command to set up upload for an existing Pack ID instead of creating a new one.
- Added `StringEmbedSchema` to handle configuration on how embed values appear in docs
- Added "coda clone <packId>", similar to "coda init" but for packs that were already created in the Pack Studio.

## 0.8.1

- Removed postinstall to avoid patching failure for npm 6 or older versions.

## 0.8.0

- **Breaking Change** The connection requirement for metadata formulas now defaults to optional instead of required. If your pack is using sematic versions, this will likely lead to a major version bump in your next release.
- **Breaking Change** Updated `coda upload` to use new parameters to tag the source of Pack version uploads as coming from the CLI.
- An optional "description" field is added to sync table definition, that will be used to display in the UI.
- You no longer need to use the `--fetch` flag with `coda execute` to use a real fetcher. Set `--no-fetch` to use a mock fetcher (the old default behavior).
- OAuth2 authentication now supports a `scopeDelimiter` option for non-compliant APIs that use something other than a space to delimit OAuth scopes in authorization URLs.
- Deprecated `hidden` field is now fully removed on formula parameter.

## 0.7.3

- Fixed a typo that broke local fetcher testing with a pack using the `AuthenticationType.Custom` authentication.
- Fixed a bug where `examples` using array parameters would fail upload validation.
- Fixed an inconsistency where `SetEndpoint.getOptionsFormulas` required using the obsolete `makeMetadataFormula` wrapper instead of allowing you to provide a raw function.
- Formulas that use optional parameters can specify `undefined` for an omitted parameter in `examples`.

## 0.7.2

- Fixed missing schema description in compiled metadata.
- Fixed the fetcher to properly recognize more XML content type headers and parse those responses int objects using `xml2js`.
  - Previously only `text/xml` and `application/xml` were recognized, but headers like `application/atom+xml` were ignored and response bodies returned as strings.
- Fixed `coda init` and `coda execute` to stop throwing errors on Windows.

## 0.7.1

- Update internal authentication mechanisms for interacting with AWS. Not currently available externally.
- `makeObjectSchema` no longer requires you to redundantly specify `type: ValueType.Object` in your schema definition.
- Added support for `AuthenticationType.Custom` which formalizes the ability to use templating to insert secret credentials onto network requests that previously relied on `AuthenticationType.WebBasic`. This enables authenticating with APIs that use non-standard authentication methods. See an example of using this new authentication method below.
  ```typescript
  // pack authentication
  pack.setSystemAuthentication({
    type: AuthenticationType.Custom,
    params: [{name: 'secretId', description: 'Secret id'},
            {name: 'secretValue', description: 'Secret value'}])
  });
  // ...
  // in a formula or sync table
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
      }
    });
  }
  ```

## 0.7.0

- Pack bundle format is changed to IIFE to fix occasional stacktrace misinterpretation. Previously compiled bundles will still be supported but may suffer from inaccurate sourcemap issue until the pack is built with the new SDK.

## 0.6.0

- **Breaking Change** Column Formats must now use only real Regex objects in their `matchers` array.

- If your pack uses fake timers (to simulate setTimeout) you can now store this as a persistent
  build option. Previously, you had to remember to include the flag --timerStrategy=fake any time
  you used any of the `coda` CLI commands. Now you can run
  `coda setOption path/to/pack.ts timerStrategy fake` and it will store the option persistently
  in your `.coda-pack.json` file and use it for all builds.

## 0.5.0

- **Breaking Change** `context.logger` has been removed. It has been redundant with `console.log`
  for a while, so we've eliminated the unnecessary extra interface to avoid confusion.
  (Also `console.trace/debug/warn/info/error` are all valid.)

- Formula return types are now strong-typed (except if you are using the fromKey attribute of object properties).

- CLI `coda execute` now defaults to run with vm. To execute without vm, use `--no-vm`.

- Bug fix: Numeric and string `codaType` properties are no longer erroneously removed in upload validation.

- CLI: You may omit a Pack version in your definition, either by using the pack builder (`coda.newPack()`)
  or using the `BasicPackDefinition` type (if you are using TypeScript). When you upload your pack,
  the next available version number will be selected and assigned on your behalf. This behavior matches
  what happens in the web editor.

- CLI: `coda release` no longer requires an explicit Pack version to release a Pack version (if no Pack version is supplied, the latest version is marked for release instead).

## 0.4.6

- Bug fix: Executing sync table formulas via CLI now validates results correctly.

## 0.4.5

- Make a few testing functions (e.g. `executeFormulaFromPackDef`) optionally typed.

- Update `StatusCodeError` constructor, which now requires the fetch request.

## 0.4.4

- Fixed a bug where using `pack.setSystemAuthentication()` would add a required connection
  parameter to every formula.

## 0.4.3

- Fixed a bug where using `setUserAuthentication()` with `AuthenticationType.None` would
  inadvertently make accounts required.

- Fixed a TypeScript bug where using `setUserAuthentication()` with authentication types like OAuth2 would give
  TypeScript errors even for valid definitions.

- Parse XML fetcher responses to JSON for respones with content type `application/xml`. Previously only `text/xml` worked.

## 0.4.2

Fixed a bug preventing `coda init` from working.

## 0.4.1

The pack builder now sets a default connection (account) requirement when you specify authentication.
Normally, to indicate on a particular formula or sync table that an account is required,
you manually specify a `connectionRequirement` option. To simplify the common case, when you
call `pack.setUserAuthentication()` or `pack.setSystemAuthentication()`, all of the formulas
and sync tables in your pack will be set to use `ConnectionRequirement.Required` unless
that formula/sync explicitly defines a different `connectionRequirement`.

If you wish to use a different default, you can supply a `defaultConnectionRequirement` option
to `setUserAuthentication()` or `setSystemAuthentication()`.

```typescript
export const pack = newPack();

// Implicitly sets all formulas and sync tables to use `connectionRequirement: ConnectionRequirement.Required`.
pack.setUserAuthentication({type: AuthenticationType.HeaderBearerToken});
// OR, to use a different default:
pack.setUserAuthentication({
  type: AuthenticationType.HeaderBearerToken,
  defaultConnectionRequirememnt: ConnectionRequirement.None,
});

pack.addFormula(...);
pack.addSyncTable(...);
```

## 0.4.0

### TypedStandardFormula renamed to Formula (TypeScript only)

The type `TypedStandardFormula`, which is the type used for the `formulas` array in main
`PackVersionDefinition` type has been renamed `Formula` to be simpler and more intuitive.

## 0.3.1

### Metadata formulas no longer need to be wrapped in `makeMetadataFormula()`.

Packs support various kinds of "metadata formulas", which aren't explicitly callable by the user
but provide supporting functionality to the pack. Examples of these include `getConnectionName`
in the authentication section of a pack def, `autocomplete` for formula and sync parameters,
and `getSchema` for dynamic sync tables.

You now need only provide the JavaScript function that implements your metadata formula,
and the SDK will wrap it in `makeMetadataFormula()` on your behalf.

```typescript
// Old
makeParameter({type: ParameterTypeString, name: 'p', autocomplete: makeMetadataFormula(async (context, search) => ...)});

// New
makeParameter({type: ParameterTypeString, name: 'p', autocomplete: async (context, search) => ...});
```

```typescript
// Old
export const pack: PackVersionDefinition = {
  defaultAuthentication: {
    type: AuthenticationType.HeaderBearerToken,
    getConnectionName: makeMetadataFormula(async (context, search) => {
      ...
    }),
  },
  ...
};

// New
export const pack = newPack();

pack.setUserAuthentication({
  type: AuthenticationType.HeaderBearerToken,
  getConnectionName: async (context, search) => {
    ...
  },
  ...
};
```

Additionally, if you are only using hardcoded values for your autocomplete options,
you may specify them directly without needing to wrap them in a function. The SDK
will create a function on your behalf that searches over the given options.

```typescript
makeParameter({
  ...
  autocomplete: ['apple', 'banana'],
});

// Or

makeParameter({
  ...
  autocomplete: [{display: 'Apple', value: 1}, {display: 'Banana', value: 2}],
});
```

The one caveat is that if you need to override the default `connectionRequirement` for
a metadata formula, you will still need to use `makeMetadataFormula(fn, {connectionRequirement})`
to provide that override. This is very rare, but it is sometimes needed for autocomplete formulas
that need not use authentication even when the parent formula does.

## 0.3.0

### Clarity around sync table identities

`makeSyncTable()` now takes a top-level field `identityName`, replacing the `identity` field
on the sync table's schema. To migrate, you can simply remove the `identity` field of your
schema and move the identity name string to the new `identityName` value.

The identity name is essentially the unique id for a sync table. It is also used if you want
to return objects from other syncs or formulas that reference rows in this single table.
To do that, you would use this identity name in the `identity` field of the schema
for that other formula/sync.

```typescript
// Old
makeSyncTable({
  name: 'MySync',
  schema: makeObjectSchema({
    identity: {name: 'MyIdentity'},
    ...
  }),
  formula: ...
});

// New
makeSyncTable({
  name: 'MySync',
  identityName: 'MyIdentity',
  schema: makeObjectSchema({
    ...
  }),
  formula: ...
});
```

## 0.2.0

### `makeSyncTable()` now accepts a single parameter dictionary instead of having some positional parameters first.

This eliminates an inconsistency between this function and most similar wrapper functions elsewhere in the SDK.

To migrate existing usage:

```typescript
// Old
makeSyncTable('Name', {<schema>}, {<formula>});

// New
makeSynctable({name: 'Name', schema: {<schema>}, formula: {<formula>}});
```

If you wish to continue using the old syntax (temporarily while we still support it), you can simply update
your imports to this and leave your code unchanged:

```typescript
import {makeSyncTableLegacy as makeSyncTable} from '@codahq/packs-sdk/dist/legacy_exports';
```

The new syntax has also been applied to the pack builder's `addSyncTable()` method.

### `makeParameter()` type input change

The recently-introduced wrapper `makeParameter()` used a confusing input enum for the parameter type
that was largely drawn from an internal representation parameters. It has been changed to use a new
enum that is specific to parameters.

```typescript
// Old
makeParameter({type: Type.string, name: 'param', ...});
// New
makeParameter({type: ParameterType.String, name: 'param', ...});

// Old
makeParameter({arrayType: Type.string, name: 'param', ...});
// New
makeParameter({type: ParameterType.StringArray, name: 'param', ...});
```

## 0.1.0

Beginning of alpha versioning.
