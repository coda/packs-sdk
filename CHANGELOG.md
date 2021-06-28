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
