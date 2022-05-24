---
title: "ObjectSchemaProperty"
---
# Interface: ObjectSchemaProperty

Fields that may be set on a schema property in the [properties](ObjectSchemaDefinition.md#properties) definition
of an object schema.

## Properties

### fromKey

• `Optional` **fromKey**: `string`

The name of a field in a return value object that should be re-mapped to this property.
This provides a way to rename fields from API responses without writing code.

Suppose that you're fetching an object from an API that has a property called "duration".
But in your pack, you'd like the value to be called "durationSeconds" to be more precise.
You could write code in your `execute` function to relabel the field, but you could
also use `fromKey` and Coda will do it for you.

Suppose your `execute` function looked like this:
```
execute: async function(context) {
  const response = await context.fetcher.fetch({method: "GET", url: "/api/some-entity"});
  // Suppose the body of the response looks like {duration: 123, name: "foo"}.
  return response.body;
}
```

You can define your schema like this:
```
coda.makeObjectSchema({
  properties: {
    name: {type: coda.ValueType.String},
    durationSeconds: {type: coda.ValueType.Number, fromKey: "duration"},
  },
});
```

This tells Coda to transform your formula's return value, creating a field "durationSeconds"
whose value comes another field called "duration".

#### Defined in

[schema.ts:708](https://github.com/coda/packs-sdk/blob/main/schema.ts#L708)

___

### required

• `Optional` **required**: `boolean`

When true, indicates that an object return value for a formula that has this schema must
include a non-empty value for this property.

#### Defined in

[schema.ts:713](https://github.com/coda/packs-sdk/blob/main/schema.ts#L713)
