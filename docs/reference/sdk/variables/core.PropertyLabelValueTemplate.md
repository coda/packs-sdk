---
nav: "PropertyLabelValueTemplate"
note: "This file is autogenerated from TypeScript definitions. Make edits to the comments in the TypeScript file and then run `make docs` to regenerate this file."
search:
  boost: 0.1
---
# Variable: PropertyLabelValueTemplate

[core](../modules/core.md).PropertyLabelValueTemplate

• `Const` **PropertyLabelValueTemplate**: ``"{VALUE}"``

An identifier for the value of a property for use in the [label](../interfaces/core.PropertyIdentifierDetails.md#label) field.
When used, this will be substituted with the value of the property for the final output of the label.

If not present, the label will be used as-is in the default label format of '{label}: {VALUE}'.
