---
nav: "ObjectArrayFormulaDef"
note: "This file is autogenerated from TypeScript definitions. Make edits to the comments in the TypeScript file and then run `make docs` to regenerate this file."
search:
  boost: 0.1
---
# Interface: ObjectArrayFormulaDef<ParamsT, SchemaT\>

[core](../modules/core.md).ObjectArrayFormulaDef

Inputs to declaratively define a formula that returns a list of objects.
That is, a formula that doesn't require code, which like an [EmptyFormulaDef](core.EmptyFormulaDef.md) uses
a [RequestHandlerTemplate](core.RequestHandlerTemplate.md) to describe the request to be made, but also includes a
[ResponseHandlerTemplate](core.ResponseHandlerTemplate.md) to describe the schema of the returned objects.
These take the place of implementing a JavaScript `execute` function.

This type is generally not used directly, but describes the inputs to [makeTranslateObjectFormula](../functions/core.makeTranslateObjectFormula.md).

## Type parameters

| Name | Type |
| :------ | :------ |
| `ParamsT` | extends [`ParamDefs`](../types/core.ParamDefs.md) |
| `SchemaT` | extends [`Schema`](../types/core.Schema.md) |

## Hierarchy

- `Omit`<[`PackFormulaDef`](core.PackFormulaDef.md)<`ParamsT`, [`SchemaType`](../types/core.SchemaType.md)<`SchemaT`\>\>, ``"execute"``\>

  ↳ **`ObjectArrayFormulaDef`**

## Properties

### cacheTtlSecs

• `Optional` `Readonly` **cacheTtlSecs**: `number`

How long formulas running with the same values should cache their results for.

#### Inherited from

Omit.cacheTtlSecs

___

### connectionRequirement

• `Optional` `Readonly` **connectionRequirement**: [`ConnectionRequirement`](../enums/core.ConnectionRequirement.md)

Does this formula require a connection (aka an account)?

#### Inherited from

Omit.connectionRequirement

___

### description

• `Readonly` **description**: `string`

A brief description of what the formula does.

#### Inherited from

Omit.description

___

### examples

• `Optional` `Readonly` **examples**: { `params`: (`undefined` \| [`PackFormulaValue`](../types/core.PackFormulaValue.md))[] ; `result`: [`PackFormulaResult`](../types/core.PackFormulaResult.md)  }[]

Sample inputs and outputs demonstrating usage of this formula.

#### Inherited from

Omit.examples

___

### extraOAuthScopes

• `Optional` `Readonly` **extraOAuthScopes**: `string`[]

OAuth scopes that the formula needs that weren't requested in the pack's overall authentication
config. For example, a Slack pack can have one formula that needs admin privileges, but non-admins
can use the bulk of the pack without those privileges. Coda will give users help in understanding
that they need additional authentication to use a formula with extra OAuth scopes. Note that
these scopes will always be requested in addition to the default scopes for the pack,
so an end user must have both sets of permissions.

#### Inherited from

Omit.extraOAuthScopes

___

### isAction

• `Optional` `Readonly` **isAction**: `boolean`

Does this formula take an action (vs retrieve data or make a calculation)?
Actions are presented as buttons in the Coda UI.

#### Inherited from

Omit.isAction

___

### isExperimental

• `Optional` `Readonly` **isExperimental**: `boolean`

If specified, the formula will not be suggested to users in Coda's formula autocomplete.
The formula can still be invoked by manually typing its full name.

#### Inherited from

Omit.isExperimental

___

### isSystem

• `Optional` `Readonly` **isSystem**: `boolean`

Whether this is a formula that will be used by Coda internally and not exposed directly to users.
Not for use by packs that are not authored by Coda.

#### Inherited from

Omit.isSystem

___

### name

• `Readonly` **name**: `string`

The name of the formula, used to invoke it.

#### Inherited from

Omit.name

___

### network

• `Optional` `Readonly` **network**: [`Network`](core.Network.md)

**`Deprecated`**

use `isAction` and `connectionRequirement` instead

#### Inherited from

Omit.network

___

### parameters

• `Readonly` **parameters**: `ParamsT`

The parameter inputs to the formula, if any.

#### Inherited from

Omit.parameters

___

### request

• **request**: [`RequestHandlerTemplate`](core.RequestHandlerTemplate.md)

A definition of the request and any parameter transformations to make in order to implement this formula.

___

### response

• **response**: [`ResponseHandlerTemplate`](core.ResponseHandlerTemplate.md)<`SchemaT`\>

A definition of the schema for the object list returned by this function.

___

### validateParameters

• `Optional` **validateParameters**: [`MetadataFormula`](../types/core.MetadataFormula.md)<[`ExecutionContext`](core.ExecutionContext.md), [`ParameterValidationResult`](../types/core.ParameterValidationResult.md)\>

The JavaScript function that implements parameter validation. This is only allowed on sync formulas.

This function takes in parameters and a context containing a [PermissionSyncMode](../enums/core.PermissionSyncMode.md)
and validates the parameters. A formula may want to validate parameters differently
for permissionSyncMode 'PermissionAware' vs 'Personal' vs undefined (which represents a formula).

**`Example`**

```
validateParameters: async function (context, _, params) {
  let {quantity, sku} = ensureExists(params);
  let errors = [];
  if (quantity < 0) {
    errors.push({message: "Must be a positive number.", propertyName: "quantity"});
  }
  if (!isValidSku(context, sku)) {
    errors.push({message: `Product SKU not found.`, propertyName: "sku"});
  }
  if (errors.length > 0) {
    return {
      isValid: false,
      message: "Invalid parameter values.",
      errors,
    };
  }
  return {
    isValid: true,
  };
},
```

#### Inherited from

Omit.validateParameters

___

### varargParameters

• `Optional` `Readonly` **varargParameters**: [`ParamDefs`](../types/core.ParamDefs.md)

Variable argument parameters, used if this formula should accept arbitrary
numbers of inputs.

#### Inherited from

Omit.varargParameters
