---
title: "MetadataFormulaObjectResultType"
---
# Interface: MetadataFormulaObjectResultType

[core](../modules/core.md).MetadataFormulaObjectResultType

The return type for a metadata formula that should return a different display to the user
than is used internally.

## Properties

### display

• **display**: `string`

The value displayed to the user in the UI.

#### Defined in

[api.ts:1016](https://github.com/coda/packs-sdk/blob/main/api.ts#L1016)

___

### hasChildren

• `Optional` **hasChildren**: `boolean`

If true, indicates that this result has child results nested underneath it.
This option only applies to [listDynamicUrls](core.DynamicSyncTableOptions.md#listdynamicurls).
When fetching options for entities that can be used as dynamic URLs for a dynamic sync table,
some APIs may return data in a hierarchy rather than a flat list of options.

For example, if your dynamic sync table synced data from a Google Drive file,
you might return a list of folders, and then a user could click on a folder
to view the files within it. When returning folder results, you would set
`hasChildren: true` on them, but omit that on the file results.

Leaf nodes, that is those without `hasChildren: true`, are ultimately selectable
to create a table. Selecting a result with `hasChildren: true` will invoke
`listDynamicUrls` again with `value` as the second argument.

That is, your dynamic sync table definition might include:

```
listDynamicUrls: async function(context, parentValue) {
  ...
}
```

`parentValue` will be undefined the initial time that `listDynamicUrls`
is invoked, but if you return a result with `hasChildren: true` and the user
clicks on it, `listDynamicUrls` will be invoked again, with `parentValue`
as the `value` of the result that was clicked on.

#### Defined in

[api.ts:1047](https://github.com/coda/packs-sdk/blob/main/api.ts#L1047)

___

### value

• **value**: `string` \| `number`

The value used for the formula argument when the user selects this option.

#### Defined in

[api.ts:1018](https://github.com/coda/packs-sdk/blob/main/api.ts#L1018)
