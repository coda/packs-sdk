# Changelog

This changelog keeps track of all changes to the Packs SDK. We follow conventions from [keepachangelog](https://keepachangelog.com/en/1.0.0/).

## [1.1.0] - 2022-09-27

- The `isolated-vm` npm package is no longer a required dependency. It will be installed automatically if your system supports it, otherwise npm will ignore it. When running `coda execute`, if `isolated-vm` is available, your formula will be executed inside of a virtual machine sandbox to better simulate the actual Coda runtime environment for packs. If not available, your formula will still be executed, just not within a sandbox.
- Adds support for render hits for progress bars, with the new `ValueHintType.ProgressBar`.
- Also adds in the `showValue` field on `SliderSchema` to indicate whether to show the underlying numeric value associated with a slider.
- Parameters that are declared as `optional: true` will be inferred as possibly `undefined` in the `execute` method of a formula. Previously, if you had declared, say, a string parameter as optional, the automatic type it would receive as an input to the `execute` method would be `string`, which is inaccurate. It will now be typed as `string | undefined`.
- Added validation that building blocks of the same type do not share a name.

## [1.0.5] - 2022-08-05

- Fixed the CLI compiler throwing for using common node modules.

## [1.0.4] - 2022-08-04

- Increased building block description limit to 1000.
- Fixed class name (e.g. `StatusCodeError.name`) which resolved to random values in the final build.

## [1.0.3] - 2022-08-03

- Added `ImageSchema`, for use with images. Allows packs to set two flags on a formula returning an image: if the image should be rendered with or without an outline, and whether to turn off the rounded corners. If the outline flag `ImageOutline` is not set on a schema, the default is `Solid`, and the image will be rendered with an outline. If the corners flag `ImageCornerStyle` is not set, the default is `Rounded`, and the image will be rendered with rounded corners.
- Added `NumericDurationSchema`, which will allow packs to return `ValueType.Number` values that are interpreted in Coda as a duration in seconds.
- Added autocomplete support for `ParameterType.StringArray` and `ParameterType.SparseStringArray` parameters.
- Changed OAuth2 validation to check that authorizationUrl and tokenUrl parse as URLs.
- Limited number of formulas, column formats, and sync tables to 100 each. Added character limits to names and descriptions, and to length of column matchers and network domains.

## [1.0.2] - 2022-07-14

- Added `MissingScopesError`, for use with OAuth authentication. If a user's connection is missing a scope and the Pack throws a 403 StatusCodeError, Coda will automatically prompt the user to reauthenticate. For APIs that return different status codes, or to be more explicit, the Pack can instead throw this new type of error to trigger the same reauthentication flow.
- Added `pkceChallengeMethod` option to OAuth2 authentication to allow choosing the `code_challenge_method` of PKCE extension. The default value is `S256` but some OAuth providers may only support `plain`.

## [1.0.1] - 2022-06-22

- Added validation that `networkDomain` does not include slashes since it's a domain, not a path.
- Changed Pack compilation to explicitly target Node version 14, to ensure compatibility with the Packs runtime.
- Added parameter type validation for `execute` command.
- Added several implicitly-allowed domains including codahosted.io to the `execute` command.

## [1.0.0] - 2022-06-16

- Fixed `temporaryBlobStorage.storeBlob` error from CLI built Packs.
- The `coda init` command now installs `@codahq/packs-sdk` if it was not previously installed.
- **Breaking Change** The `identityName` field is now required on every sync table, even ones with dynamic schemas.

## [0.12.1] - 2022-06-06

### Added

- Added rarely-needed OAuth options: `scopeParamName` and `nestedResponseKey`.
- Added `ValueHintType.Toggle` to be used in conjunction with `ValueType.Boolean` to render boolean values as toggles within tables.
- Added `fetchOpts` to `TemporaryBlobStorage.storeUrl` to allow setting `disableAuthentication` for the fetch.

### Changed

- Updated the testing fetcher for `coda execute` to auto-ungzip and set the `Accept: */*` request header by default, similar to live behavior.
- Unrecognized properties in array schemas will now generate errors at upload time instead of the fields being silently stripped. While functionally the same, the explicit errors should help catch cases where a maker may expect a property to be recognized (like `codaType`) when it is actually not supported.
- Packs using `CodaApiHeaderBearerToken` can have additional non-Coda network domains as long as the auth is restricted to coda.io, subject the the normal Coda approval for multiple domains.

## [0.12.0] - 2022-05-17

### Added

- Added support for multiple domains in the `networkDomain` parameter of `setUserAuthentication()`.
- Added `useProofKeyForCodeExchange` option to OAuth2 authentication to support PKCE extension. While it's optionally supported by most OAuth2 providers, it might be required by some websites (e.g. Twitter).
- Added new wrappers `newRealFetcherExecutionContext` and `newRealFetcherSyncExecutionContext` to create "real" execution contexts that can be HTTP requests within integration tests. If you want to test a helper function that accepts an `ExecutionContext` or `SyncExecution` context, you canuse these. The recomendation is still to use `executeFormulaFromPackDef` or `executeSyncFormulaFromPackDef`, which assume that you are testing your actual full formula implementation and creates a real execution context on your behalf if you pass `useRealFetcher: true`. However, if you wish to directly test a helper function that takes an `ExecutionContext` as a parameter, these wrappers may be of use. Usage:

```typescript
import {newRealFetcherExecutionContext} from '@codahq/packs-sdk/dist/development';
import {pack} from '../pack';

const context = newRealFetcherExecutionContext(pack, require.resolve('../pack'));
await myHelper(context);
```

### Changed

- **Future Breaking Change** Test framework will no longer normalize object output using the schema. (This will continue to work when executing the pack within Coda)
- Added support for making `HEAD` HTTP requests using the fetcher.
- Added `withIdentity` helper to make schemas more reusable for action formulas.

## [0.11.0] - 2022-05-03

### Added

- Added "force" option to `LinkSchema` for `LinkDisplayType.Embed`.
- Added "downloadFilename" option to `storeBlob` and `storeUrl` in `TemporaryBlobStorage` to specify the file name that it should download as when opening the temporary url.
- Added "includeUnknownProperties" option to `makeObjectSchema` that will retain properties on objects that are not defined within the object's schema.
- Added "SparseStringArray", "SparseNumberArray", "SparseBooleanArray", "SparseDateArray", "SparseHtmlArray", "SparseImageArray" and "SparseFileArray" to `ParameterType` that accepts empty values.
- `coda validate` will now print warnings if your Pack definition is using properties or features that will be deprecated in a future SDK version. You may add the `--no-checkDeprecationWarnings` flag if you don't want this output.
- `coda upload` will now print warnings if your Pack definition is using properties or features that will be deprecated in a future SDK version. These are purely to alert you to upcoming changes that will affect you, your Pack will continue to upload and execute in the meantime.

### Changed

- **Breaking Change** Added a validation rule that prevents the usage of varargsParameters for sync table getters which are not currently supported in the UI.
- **Breaking Change** Packs with multiple network domains and user authentication must select only one of those domains to receive the authentication headers/parameters.
- **Breaking Change** The `identityName` field of a sync table formerly silently overrode the `identity.name` of the table's schema (if present). Now, if those 2 values are both present, they must be equal. We recommend only specifying `identity.name` on reference schemas.
- **Breaking Change** Fetcher will automatically decompress responses with a gzip or deflate content encoding.
- **Future Breaking Change** The properties `id`, `primary`, and `featured` of object schemas will be renamed to `idProperty`, `displayProperty`, and `featuredProperties`, respectively, to better clarify that their values refer to property names within the schema. During a migration period, you may use either name; the original names are now marked as deprecated and will be removed at a future date, no earlier than May 1, 2022.
- **Future Breaking Change** Dynamic sync tables will require `identityName` like static sync tables do, and `identityName` will override `identity.name` in dynamic schemas. In fact, `identity` in sync table schemas will be entirely unnecessary, except for the use case of constructing references to objects in other sync tables.
- **Future Breaking Change** `SetEndpoint.getOptionsFormula` has been renamed `SetEndpoint.getOptions` for clarity.
- **Future Breaking Change** The `attribution` property is moving from being a child field on `identity` within an object schema to just being a top-level field on the object schema.
- **Future Breaking Change** The `defaultValue` property of parameter definitions will be renamed to `suggestedValue` to reflect that these are values that do not act as a true default but rather prepopulates a value when used.
- **Future Breaking Change** Added support for files as parameters with `ParameterType.File`. Previously, files could be used as parameters by using the `ParameterType.Image` parameter type, but an error would show in the formula builder. In the future, this error may be enforced such that only image files will be allowed to be used when a parameter is specified to be a `ParameterType.Image`.

### Removed

- **Breaking Change** Removed dead code related to `defaultConnectionType`. This was an unused feature and should not have been previously referenced.

## [0.9.0] - 2022-03-17

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
