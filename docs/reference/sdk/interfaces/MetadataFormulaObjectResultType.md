# Interface: MetadataFormulaObjectResultType<T\>

The return type for a metadata formula that should return a different display to the user
than is used internally.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` \| `number` = `string` \| `number` |

## Properties

### display

• **display**: `string`

The value displayed to the user in the UI.

#### Defined in

<<<<<<< HEAD
[api.ts:887](https://github.com/coda/packs-sdk/blob/main/api.ts#L887)
=======
[api.ts:895](https://github.com/coda/packs-sdk/blob/main/api.ts#L895)
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))

___

### hasChildren

• `Optional` **hasChildren**: `boolean`

If true, indicates that this result has child results nested underneath it.
This option only applies to [DynamicSyncTableOptions.listDynamicUrls](DynamicSyncTableOptions.md#listdynamicurls).
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

<<<<<<< HEAD
[api.ts:918](https://github.com/coda/packs-sdk/blob/main/api.ts#L918)
=======
[api.ts:926](https://github.com/coda/packs-sdk/blob/main/api.ts#L926)
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))

___

### value

• **value**: `T`

The value used for the formula argument when the user selects this option.

#### Defined in

<<<<<<< HEAD
[api.ts:889](https://github.com/coda/packs-sdk/blob/main/api.ts#L889)
=======
[api.ts:897](https://github.com/coda/packs-sdk/blob/main/api.ts#L897)
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))
