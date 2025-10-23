# Changelog

This changelog keeps track of all changes to the Packs SDK. We follow conventions from [keepachangelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [1.12.0] - 2025-10-23

### Changed

- Add LLM-facing instructions to formulas and parameters
- Allow filterableProperties limit override

## [1.11.1] - 2025-10-10

### Changed

- Minify packaged thunk_bundle
- Add LLM-facing instructions to PackTool

## [1.11.0] - 2025-10-01

### Changed

- Made `makeObjectSchema()` strict about rejecting extraneous properties, to better catch bugs when the wrong property name is used for optional properties.

## [1.10.2] - 2025-09-03

### Changed

- Update prompt

## [1.10.1] - 2025-08-06

### Changed

- Dummy change to bump version

## [1.10.0] - 2025-08-06

### Added

- Add `skillEntrypoints` to pack definition
- Add `AssistantMessage` tool
- Add `Rewrite` tool
- Add `Guide` tool

## [1.9.12] - 2025-07-25

### Changed

- Update `filterableProperties` to support person and array of persons

## [1.9.11] - 2025-07-11

### Changed

- Fixed validation to allow pack IDs to be optional in agent skill definitions.

## [1.9.10] - 2025-07-09

### Added

- Add initial `skill` definition to packs sdk

## [1.9.9] - 2025-07-03

### Changed

- Update `filterableProperties` to support arrays of string and number

## [1.9.8] - 2025-07-02

### Changed

- Update `filterableProperties` to support plain strings

## [1.9.7] - 2025-06-16

### Changed

- Bump some dependencies

## [1.9.6] - 2025-06-10

### Changed

- Add `validateParameters` metadata formula to CommonPackFormulaDef
- Add `ValueHintType.Date` as a valid type for the `FilterableProperty` in `IndexDefinition`.
- `AWSAccessKey` auth: fixed bug with double-signing of requests where the URL path contains special characters like spaces.

## [1.9.5] - 2025-05-02

### Changed

- Update `IndexDefinition` to encompass either `CustomIndexDefinition` or `CategorizedIndexDefinition`. `CustomIndexDefinition` will be backwards compatible with releases from before 1.9.4 and refer to the old `IndexDefinition`. The `CategorizedIndexDefinition` will support specific types of indexable content that has been predefined in the sdk.
- Add a new `filteredProperities` field to `schema.index` to specify additional columns that can be used to filter down query results.
- Minor documentation updates.
- Deprecate `PrincipalType.Anyone`.
- Remove `popularityNormProperty` and `authorityNormProperty` from top-level `schema` since they reside primarily in `schema.index`.
- Remove deprecated `popularityRankProperty` from `schema`.

## [1.9.3] - 2025-04-01

### Changed

- Bump various dependencies.
- Add display name property for sync tables.

## [1.9.2] - 2025-03-05

### Changed

- Add `GoogleDwdError` from fetcher service

## [1.9.1] - 2025-02-12

### Changed

- SDK requires node version 20 or higher
- Update `Sync` parameter type names for clarity

### Fixed

- When using `coda execute`, if the Pack fails due to an error the stack trace will be included in the output again.

## [1.8.6] - 2024-12-13

### Changed

- Certain ingestion-specific fields were renamed.
- Added `SyncStateService` to retrieve the row sync state in Coda Brain.

## [1.8.5] - 2024-12-04

### Changed

- Improved `Sync` and `SyncExecutionContext` types to better handle full vs. incremental sync

## [1.8.4] - 2024-11-25

### Changed

- Support connection names for admin authentications

## [1.8.3] - 2024-11-12

### Added

- Added the ability to specify the `cacheTtlSecs` option when using `TemporaryBlobStorage.storeUrl`.

### Changed

- Fix upgraded isolated-vm

## [1.8.2] - 2024-11-08

### Added

- Added support for the authentication type `AWSAssumeRole`, a more secure method of connecting to AWS services.

### Changed

- Improve types for sync formula continuation
- Support onError in sync tables
- Update isolated-vm

## [1.8.1] - 2024-10-29

### Added

- Add new authentication mechanisms for admins.
- Add all users principal type

### Changed

- Remove limit for single row in executeGetPermissions
- Increase max batch size for executeGetPermissions calls

## [1.8.0] - 2024-10-07

### Added

- Add continuation for get permissions request and response

### Changed

- Improve types used for testing, specifically on `MockExecutionContext` returned by `newMockExecutionContext()`.
  `fetcher.fetch`, `temporaryBlobStorage.storeUrl`, and `temporaryBlobStorage.storeBlob` should be stubbed using
  `resolves()` and `rejects()` since the underlying methods return promises
- Fix `untransformBody` helper for array inputs

## [1.7.19] - 2024-09-27

### Changed

- Add unit testing capabilities for update and get permissions

## [1.7.18] - 2024-09-20

### Changed

- Add more pre-release incremental sync support

## [1.7.17] - 2024-09-20

### Changed

- Added internal fields to schema definition

## [1.7.16] - 2024-09-10

### Changed

- Added more invocation context information

## [1.7.15] - 2024-09-04

### Changed

- Internal change to completion
- Updated `fetchOpts` in `TemporaryBlobStorage.storeUrl` to allow setting `headers` for the fetch.
- Update OAuth URL validation

## [1.7.13] - 2024-08-29

### Changed

- Internal Changes relating to permissions

## [1.7.12] - 2024-08-26

### Changed

- Fix inferred schema types when using fromKey

## [1.7.11] - 2024-08-23

### Changed

- Added internal fields to sync formulas and identity

## [1.7.10] - 2024-08-21

### Added

- Adds Last90AndNext90Days PrecannedDateRange

## [1.7.9] - 2024-07-10

## [1.7.8] - 2024-06-25

## [1.7.7] - 2024-04-26

### Fixed

- Fixed an issue where running `coda auth` with the CLI failed to honor the auth options `endpointKey` and `postSetup` for `OAuth2` authentication. For `postSetup` `SetEndpoint` steps it will prompt for the endpoint URL directly rather than list them out.

## [1.7.5] - 2024-02-08

### Added

- `coda execute` now allows for executing metadata formulas and sync updates.
- Sync table schema properties can now specify a `displayName` to be the user-visible column name. Only works on top-level schema properties.

### Changed

- Changed the CLI `execute` command to output the full JSON of a returned object, without any collapsing of deep objects or long arrays.

## [1.7.4] - 2024-01-04

### Fixed

- Propagate the value of `requireForUpdates` in `makeReferenceSchemaFromObjectSchema`.

### Added

- Added `forceCache` to `FetchRequest` to support caching non-GET requests.
- Updated upload validation to correctly throw errors when formula examples are missing the `result` field.

### Changed

- Running `coda execute` on a Pack that uses multiple network domains will fail with a warning unless the new flag `--allowMultipleNetworkDomains` is included. This acts as an early warning to Pack makers and hopefully encourages them to file for approval early before investing too much time into development.

## [1.7.3] - 2023-12-15

### Added

- Added `requireForUpdates` for select list properties to remove the Blank option.

## [1.7.2] - 2023-12-04

### Added

- Added `updateOptions.extraOAuthScopes` to sync tables to support incremental OAuth with 2-way sync.
- Added `width`, `height`, and `shapeStyle` to `ImageSchema`.

### Fixed

- Fixed failing CLI commands when the optional isolated-vm dependency was not present.

## [1.7.1] - 2023-11-15

### Added

- Added `OAuth2ClientCredentials` authentication type as a system authentication type.

## [1.7.0] - 2023-10-24

### Added

- Added `OAuth2ClientCredentials` authentication type to support authenticating with OAuth client credentials.

### Changed

- We deprecated `deferConnectionSetup` in the CodaApiHeaderBearerToken authentication type. The Coda app now defers all connection setup, so this setting has no practical effect anymore.

## [1.6.0] - 2023-10-05

### Added

- For CLI development, there is now a `--allowOlderSdkVersion` param for the `coda upload` command that builds a new version. Coda will soon default to preventing a Pack build to have an older SDK version than the prior version, under the assumption that it most often happens when multiple dev environments conflict with each other. This new option is a bypass for that protection, for the rare case when you actually want to downgrade the SDK.
- Added a new `parameters` property in the `Sync` interface with sync table parameters.

### Changed

- "=" character is no longer supported in sync table identity names.
- Removed support for Node 14

### Fixed

- Schemas with property option JS functions can be used within return types in `addFormula()` without validation errors.

## [1.5.1] - 2023-07-31

### Fixed

- Fixed an error with property options for object properties.

## [1.5.0] - 2023-07-27

### Added

- Started tracking the raw keys of object properties internally as `originalKey`.

## [1.4.1] - 2023-06-23

### Added

- Added `AuthenticationType.MultiHeaderToken`, allowing you to specify multiple headers to include in each request. Previously, if the API you were using required multiple headers, you would need to use `AuthenticationType.Custom`.

## [1.4.0] - 2023-06-12

### Added

- Added the command `coda extensions` to the CLI for installing developer extensions that help with building Packs. Currently it only supports Visual Studio Code (`coda extensions vscode`), creating a code snippets file which provides the same slash commands as the Pack Studio.
- Added support for specifying an API key using `CODA_PACKS_API_KEY` environment variable

### Changed

- Using the empty string as a `tokenPrefix` with OAuth2 authentication will result in no prefix being used in the `Authentication` header. Previously, the empty string would be treated the same as `undefined` which would lead to the default prefix of `Bearer` being used. Note that this change took effect for live packs on April 28, 2023 independently of the SDK version; in this SDK version the behavior changed only here in the CLI execution simulator (the `coda execute` command).
- **Breaking Change** Removed the "autocomplete" property from EmailSchema. It wasn't useful in practice and we want to free up the name "autocomplete" on BaseSchema for better purposes.

## [1.3.4] - 2023-04-17

### Fixed

- Fixed an issue with `placeholder` property being stripped out of the `PropertyIdentifierDetails` schema.

## [1.3.3] - 2023-04-12

### Added

- Added the optional function `searchDynamicUrls` to dynamic sync tables. If defined, a search box will presented to users to allow them to search through all available datasets. It works just like `listDynmaicUrls`, only the 2nd parameter is the search query.

### Changed

- Switched the node package manager from yarn to pnpm. This only affects developers contributing changes to the packs-sdk repo.
- Added optional `placeholder` property to `PropertyIdentifierDetails` definition as a default value for Pack card titles, subtitles, and snippets when value is empty.

### Fixed

- Fixed an issue where the fetcher was converting XML responses to JSON even when setting `isBinaryResponse: true`.
- Fixed an issue where the authentication type `AWSAccessKey` wasn't generating correct signatures when used locally.

## [1.3.0] - 2023-03-02

### Added

- Added an `--apiToken` argument to the `clone`, `create`, `link`, `release`, and `upload` CLI commands. This makes it easier to use the CLI in a CI/CD environment where the API token is passed as an environment variable (GitHub Actions, etc).

### Changed

- Updated `PrecannedDateRange` to match the date range picker in the Coda UI: added `Last90Days`, `Last180Days`, `Last365Days`, `Next90Days`, `Next180Days`, `Next365Days`, `Last7AndNext7Days`, `Last30AndNext30Days`, deprecated `Last3Months`, `Last6Months`, `Next3Months`, and `Next6Months`, and removed `ThisWeekStart`, `ThisMonthStart`, and `ThisYearStart`, which never actually worked.

### Fixed

- Fixed an issue where `coda execute ... --vm=false` wasn't compatible with Node version 19+ (`Cannot set property crypto of #<Object> which has only a getter`).

## [1.2.3] - 2022-12-13

### Added

- Added a new formula parameter type `Markdown` as an alternative to `HTML` for formatted text.

## [1.2.2] - 2022-11-30

### Added

- Added an option `credentialsLocation` to `OAuth2Authentication`, to specify how the client ID and secret should be passed during the token exchange. The default `Automatic` should be sufficient for most OAuth2 providers.

## [1.2.1] - 2022-11-15

### Added

- Added an option `ignoreRedirects` to `FetchRequest`, if you do not want the fetcher to follow HTTP 301/302 redirects and instead want to observe such a response and examine the redirect URL directly (by reading the `Location` header) instead of following it.

## [1.2.0] - 2022-10-20

### Added

- Added helper method `getEffectivePropertyKeysFromSchema`. This method can be used in the sync table formulas to retrieve the user manually selected property keys by `getEffectivePropertyKeysFromSchema(context.sync.schema)`.
- Added a `--maxRows` flag to the `coda execute` command, allowing you to cap a sync execution to a maximum number of rows.

### Changed

- Now `--notes` is a required option in `coda release` command.
- **Breaking Change** Parameter names and sync table names now have strict limitations at build time (alphanumeric characters & underscores).

## [1.1.0] - 2022-09-27

### Added

- Adds support for render hits for progress bars, with the new `ValueHintType.ProgressBar`.
- Also adds in the `showValue` field on `SliderSchema` to indicate whether to show the underlying numeric value associated with a slider.
- Added validation that building blocks of the same type do not share a name.

### Changed

- The `isolated-vm` npm package is no longer a required dependency. It will be installed automatically if your system supports it, otherwise npm will ignore it. When running `coda execute`, if `isolated-vm` is available, your formula will be executed inside of a virtual machine sandbox to better simulate the actual Coda runtime environment for packs. If not available, your formula will still be executed, just not within a sandbox.
- Parameters that are declared as `optional: true` will be inferred as possibly `undefined` in the `execute` method of a formula. Previously, if you had declared, say, a string parameter as optional, the automatic type it would receive as an input to the `execute` method would be `string`, which is inaccurate. It will now be typed as `string | undefined`.

## [1.0.5] - 2022-08-05

### Fixed

- Fixed the CLI compiler throwing for using common node modules.

## [1.0.4] - 2022-08-04

### Changed

- Increased building block description limit to 1000.

### Fixed

- Fixed class name (e.g. `StatusCodeError.name`) which resolved to random values in the final build.

## [1.0.3] - 2022-08-03

### Added

- Added `ImageSchema`, for use with images. Allows packs to set two flags on a formula returning an image: if the image should be rendered with or without an outline, and whether to turn off the rounded corners. If the outline flag `ImageOutline` is not set on a schema, the default is `Solid`, and the image will be rendered with an outline. If the corners flag `ImageCornerStyle` is not set, the default is `Rounded`, and the image will be rendered with rounded corners.
- Added `NumericDurationSchema`, which will allow packs to return `ValueType.Number` values that are interpreted in Coda as a duration in seconds.
- Added autocomplete support for `ParameterType.StringArray` and `ParameterType.SparseStringArray` parameters.

### Changed

- Changed OAuth2 validation to check that authorizationUrl and tokenUrl parse as URLs.
- Limited number of formulas, column formats, and sync tables to 100 each. Added character limits to names and descriptions, and to length of column matchers and network domains.

## [1.0.2] - 2022-07-14

### Added

- Added `MissingScopesError`, for use with OAuth authentication. If a user's connection is missing a scope and the Pack throws a 403 StatusCodeError, Coda will automatically prompt the user to reauthenticate. For APIs that return different status codes, or to be more explicit, the Pack can instead throw this new type of error to trigger the same reauthentication flow.
- Added `pkceChallengeMethod` option to OAuth2 authentication to allow choosing the `code_challenge_method` of PKCE extension. The default value is `S256` but some OAuth providers may only support `plain`.

## [1.0.1] - 2022-06-22

### Added

- Added validation that `networkDomain` does not include slashes since it's a domain, not a path.
- Added parameter type validation for `execute` command.
- Added several implicitly-allowed domains including `codahosted.io` to the `execute` command.

### Changed

- Changed Pack compilation to explicitly target Node version 14, to ensure compatibility with the Packs runtime.

## [1.0.0] - 2022-06-16

### Changed

- The `coda init` command now installs `@codahq/packs-sdk` if it was not previously installed.
- **Breaking Change** The `identityName` field is now required on every sync table, even ones with dynamic schemas.

### Fixed

- Fixed `temporaryBlobStorage.storeBlob` error from CLI built Packs.

## [0.12.1] - 2022-06-06

### Added

- Added rarely-needed OAuth options: `scopeParamName` and `nestedResponseKey`.
- Added `ValueHintType.Toggle` to be used in conjunction with `ValueType.Boolean` to render boolean values as toggles within tables.
- Added `fetchOpts` to `TemporaryBlobStorage.storeUrl` to allow setting `disableAuthentication` for the fetch.

### Changed

- Updated the testing fetcher for `coda execute` to auto-unzip and set the `Accept: */*` request header by default, similar to live behavior.
- Unrecognized properties in array schemas will now generate errors at upload time instead of the fields being silently stripped. While functionally the same, the explicit errors should help catch cases where a maker may expect a property to be recognized (like `codaType`) when it is actually not supported.
- Packs using `CodaApiHeaderBearerToken` can have additional non-Coda network domains as long as the auth is restricted to coda.io, subject the the normal Coda approval for multiple domains.

## [0.12.0] - 2022-05-17

### Added

- Added support for multiple domains in the `networkDomain` parameter of `setUserAuthentication()`.
- Added `useProofKeyForCodeExchange` option to OAuth2 authentication to support PKCE extension. While it's optionally supported by most OAuth2 providers, it might be required by some websites (e.g. Twitter).
- Added new wrappers `newRealFetcherExecutionContext` and `newRealFetcherSyncExecutionContext` to create "real" execution contexts that can be HTTP requests within integration tests. If you want to test a helper function that accepts an `ExecutionContext` or `SyncExecution` context, you can use these. The recommendation is still to use `executeFormulaFromPackDef` or `executeSyncFormulaFromPackDef`, which assume that you are testing your actual full formula implementation and creates a real execution context on your behalf if you pass `useRealFetcher: true`. However, if you wish to directly test a helper function that takes an `ExecutionContext` as a parameter, these wrappers may be of use. Usage:

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
- **Future Breaking Change** The `defaultValue` property of parameter definitions will be renamed to `suggestedValue` to reflect that these are values that do not act as a true default but rather prefill a value when used.
- **Future Breaking Change** Added support for files as parameters with `ParameterType.File`. Previously, files could be used as parameters by using the `ParameterType.Image` parameter type, but an error would show in the formula builder. In the future, this error may be enforced such that only image files will be allowed to be used when a parameter is specified to be a `ParameterType.Image`.

### Removed

- **Breaking Change** Removed dead code related to `defaultConnectionType`. This was an unused feature and should not have been previously referenced.

## [0.9.0] - 2022-03-17

### Added

- Added ValueHintType.Email for new column type "Email".

### Changed

- **Breaking Change** ValueHintType.Url will now create a column of type "Link" instead of "Text".

## 0.8.2 - 2022-03-04

### Added

- Added `coda whoami` command to see API token details.
- Added `coda link` command to set up upload for an existing Pack ID instead of creating a new one.
- Added `StringEmbedSchema` to handle configuration on how embed values appear in docs
- Added "coda clone <packId>", similar to "coda init" but for packs that were already created in the Pack Studio.

## 0.8.1 - 2022-01-19

### Removed

- Removed postinstall to avoid patching failure for npm 6 or older versions.

## 0.8.0 - 2022-01-14

### Added

- An optional "description" field is added to sync table definition, that will be used to display in the UI.
- OAuth2 authentication now supports a `scopeDelimiter` option for non-compliant APIs that use something other than a space to delimit OAuth scopes in authorization URLs.

### Changed

- **Breaking Change** The connection requirement for metadata formulas now defaults to optional instead of required. If your pack is using sematic versions, this will likely lead to a major version bump in your next release.
- **Breaking Change** Updated `coda upload` to use new parameters to tag the source of Pack version uploads as coming from the CLI.
- You no longer need to use the `--fetch` flag with `coda execute` to use a real fetcher. Set `--no-fetch` to use a mock fetcher (the old default behavior).

### Deprecated

- Deprecated `hidden` field is now fully removed on formula parameter.

## 0.7.3 - 2021-12-06

### Changed

- Formulas that use optional parameters can specify `undefined` for an omitted parameter in `examples`.

### Fixed

- Fixed a typo that broke local fetcher testing with a pack using the `AuthenticationType.Custom` authentication.
- Fixed a bug where `examples` using array parameters would fail upload validation.
- Fixed an inconsistency where `SetEndpoint.getOptionsFormulas` required using the obsolete `makeMetadataFormula` wrapper instead of allowing you to provide a raw function.

## 0.7.2 - 2021-11-24

### Fixed

- Fixed missing schema description in compiled metadata.
- Fixed the fetcher to properly recognize more XML content type headers and parse those responses int objects using `xml2js`.
  - Previously only `text/xml` and `application/xml` were recognized, but headers like `application/atom+xml` were ignored and response bodies returned as strings.
- Fixed `coda init` and `coda execute` to stop throwing errors on Windows.

## 0.7.1 - 2021-11-17

### Added

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

### Changed

- Update internal authentication mechanisms for interacting with AWS. Not currently available externally.
- `makeObjectSchema` no longer requires you to redundantly specify `type: ValueType.Object` in your schema definition.

## 0.7.0 - 2021-11-04

### Changed

- Pack bundle format is changed to IIFE to fix occasional stacktrace misinterpretation. Previously compiled bundles will still be supported but may suffer from inaccurate sourcemap issue until the pack is built with the new SDK.

## 0.6.0 - 2021-10-13

### Added

- If your pack uses fake timers (to simulate setTimeout) you can now store this as a persistent
  build option. Previously, you had to remember to include the flag --timerStrategy=fake any time
  you used any of the `coda` CLI commands. Now you can run
  `coda setOption path/to/pack.ts timerStrategy fake` and it will store the option persistently
  in your `.coda-pack.json` file and use it for all builds.

### Changed

- **Breaking Change** Column Formats must now use only real Regex objects in their `matchers` array.

## 0.5.0 - 2021-10-13

### Changed

- **Breaking Change** `context.logger` has been removed. It has been redundant with `console.log`
  for a while, so we've eliminated the unnecessary extra interface to avoid confusion.
  (Also `console.trace/debug/warn/info/error` are all valid.)
- Formula return types are now strong-typed (except if you are using the fromKey attribute of object properties).
- CLI `coda execute` now defaults to run with vm. To execute without vm, use `--no-vm`.
- CLI: You may omit a Pack version in your definition, either by using the pack builder (`coda.newPack()`)
  or using the `BasicPackDefinition` type (if you are using TypeScript). When you upload your pack,
  the next available version number will be selected and assigned on your behalf. This behavior matches
  what happens in the web editor.
- CLI: `coda release` no longer requires an explicit Pack version to release a Pack version (if no Pack version is supplied, the latest version is marked for release instead).

### Fixed

- Bug fix: Numeric and string `codaType` properties are no longer erroneously removed in upload validation.

## 0.4.6 - 2021-08-18

### Fixed

- Bug fix: Executing sync table formulas via CLI now validates results correctly.

## 0.4.5 - 2021-08-02

### Changed

- Make a few testing functions (e.g. `executeFormulaFromPackDef`) optionally typed.
- Update `StatusCodeError` constructor, which now requires the fetch request.

## 0.4.4 - 2021-07-27

### Fixed

- Fixed a bug where using `pack.setSystemAuthentication()` would add a required connection
  parameter to every formula.

## 0.4.3 - 2021-07-26

### Fixed

- Fixed a bug where using `setUserAuthentication()` with `AuthenticationType.None` would
  inadvertently make accounts required.
- Fixed a TypeScript bug where using `setUserAuthentication()` with authentication types like OAuth2 would give
  TypeScript errors even for valid definitions.
- Parse XML fetcher responses to JSON for response with content type `application/xml`. Previously only `text/xml` worked.

## 0.4.2 - 2021-07-14

### Fixed

- Fixed a bug preventing `coda init` from working.

## 0.4.1 - 2021-07-13

### Changed

- The pack builder now sets a default connection (account) requirement when you specify authentication.
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

## 0.4.0 - 2021-07-09

### Changed

- **TypedStandardFormula renamed to Formula (TypeScript only)** -
  The type `TypedStandardFormula`, which is the type used for the `formulas` array in main
  `PackVersionDefinition` type has been renamed `Formula` to be simpler and more intuitive.

## 0.3.1 - 2021-07-01

### Changed

- **Metadata formulas no longer need to be wrapped in `makeMetadataFormula()`** -
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

## 0.3.0 - 2021-06-29

### Changed

- **Clarity around sync table identities** -
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

## 0.2.0 - 2021-06-28

### Changed

- **`makeSyncTable()` now accepts a single parameter dictionary instead of having some positional parameters first** -
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

- **`makeParameter()` type input change** -
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

## 0.1.0 - 2021-06-22

### Added

- Beginning of alpha versioning.

[unreleased]: https://github.com/coda/packs-sdk/compare/v1.12.0...HEAD
[1.7.5]: https://github.com/coda/packs-sdk/compare/v1.7.1...v1.7.5
[1.7.4]: https://github.com/coda/packs-sdk/compare/v1.7.1...v1.7.4
[1.7.3]: https://github.com/coda/packs-sdk/compare/v1.7.1...v1.7.3
[1.7.2]: https://github.com/coda/packs-sdk/compare/v1.7.1...v1.7.2
[1.7.1]: https://github.com/coda/packs-sdk/compare/v1.6.0...v1.7.1
[1.7.0]: https://github.com/coda/packs-sdk/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/coda/packs-sdk/compare/v1.5.1...v1.6.0
[1.5.1]: https://github.com/coda/packs-sdk/compare/v1.4.1...v1.5.1
[1.5.0]: https://github.com/coda/packs-sdk/compare/v1.4.1...v1.5.0
[1.4.1]: https://github.com/coda/packs-sdk/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/coda/packs-sdk/compare/v1.3.4...v1.4.0
[1.3.4]: https://github.com/coda/packs-sdk/compare/v1.3.3...v1.3.4
[1.3.3]: https://github.com/coda/packs-sdk/compare/v1.3.0...v1.3.3
[1.3.0]: https://github.com/coda/packs-sdk/compare/v1.2.3...v1.3.0
[1.2.3]: https://github.com/coda/packs-sdk/compare/v1.2.2...v1.2.3
[1.2.2]: https://github.com/coda/packs-sdk/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/coda/packs-sdk/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/coda/packs-sdk/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/coda/packs-sdk/compare/v1.0.5...v1.1.0
[1.0.5]: https://github.com/coda/packs-sdk/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/coda/packs-sdk/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/coda/packs-sdk/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/coda/packs-sdk/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/coda/packs-sdk/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/coda/packs-sdk/compare/v0.12.1...v1.0.0
[0.12.1]: https://github.com/coda/packs-sdk/compare/v0.12.0...v0.12.1
[0.12.0]: https://github.com/coda/packs-sdk/compare/v0.11.0...v0.12.0
[0.11.0]: https://github.com/coda/packs-sdk/compare/v0.9.0...v0.11.0
[0.9.0]: https://github.com/coda/packs-sdk/compare/v0.8.2...v0.9.0
[1.7.7]: https://github.com/coda/packs-sdk/compare/v1.7.1...v1.7.7
[1.7.8]: https://github.com/coda/packs-sdk/compare/v1.7.1...v1.7.8
[1.7.9]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.7.9
[1.7.12]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.7.12
[1.7.11]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.7.11
[1.7.10]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.7.10
[1.7.13]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.7.13
[1.7.15]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.7.15
[1.8.0]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.8.0
[1.7.19]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.7.19
[1.7.18]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.7.18
[1.7.17]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.7.17
[1.7.16]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.7.16
[1.8.1]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.8.1
[1.8.2]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.8.2
[1.8.3]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.8.3
[1.8.4]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.8.4
[1.8.5]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.8.5
[1.8.6]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.8.6
[1.9.1]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.9.1
[1.9.3]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.9.3
[1.9.2]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.9.2
[1.9.2]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.9.2
[1.9.6]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.9.6
[1.9.5]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.9.5
[1.9.8]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.9.8
[1.9.7]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.9.7
[1.9.9]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.9.9
[1.9.10]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.9.10
[1.9.11]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.9.11
[1.9.12]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.9.12
[1.10.1]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.10.1
[1.10.0]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.10.0
[1.10.2]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.10.2
[1.11.1]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.11.1
[1.11.0]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.11.0

[1.12.0]: https://github.com/coda/packs-sdk/compare/v1.7.8...v1.12.0
