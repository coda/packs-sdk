## 0.4.5

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
