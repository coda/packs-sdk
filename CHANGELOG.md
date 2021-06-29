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
import {makeSyncTableLegacy as makeSyncTable} from 'coda-packs-sdk/dist/legacy_exports';
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
