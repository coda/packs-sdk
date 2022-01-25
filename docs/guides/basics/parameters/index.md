---
title: Parameters
---

# Accept input with parameters

The primary mechanism for passing data from the user or document into your Pack is via parameters. You define the parameters in your code and the user fills them with values when they use your Pack. The same parameter mechanism is used by formulas, actions, and sync tables.

[View Sample Code][samples]{ .md-button }

## Using parameters

In the formula editor parameters are entered as comma-separated values, while in the action dialog or sync table side panel they presented as input boxes.

=== "In the formula editor"
    <img src="../../../images/parameter_formula.png" srcset="../../../images/parameter_formula_2x.png 2x" class="screenshot" alt="Parameters in the formula editor">
=== "In the action builder"
    <img src="../../../images/parameter_action.png" srcset="../../../images/parameter_action_2x.png 2x" class="screenshot" alt="Parameters in the action builder">
=== "In the sync table settings"
    <img src="../../../images/parameter_sync.png" srcset="../../../images/parameter_sync_2x.png 2x" class="screenshot" alt="Parameters in the sync table settings">

## Defining parameters

The [`parameters`][parameters] property of a formula contains the array of parameter definitions, each one containing information about the parameter. The helper function [`makeParameter()`][makeParameter] is used to create these definitions, and a `type`, `name`, and `description` are required.

```ts
coda.makeParameter({
  type: coda.ParameterType.String,
  name: "type",
  description: "The type of cookie.",
})
```

See [`ParamDef`][ParamDef] for the full set of properties you can define for a parameter.

## Accessing parameter values

At runtime, the values set by the user are passed to the formula's `execute` function as the first argument, bundled up as an array.

```ts
pack.addFormula({
  // ...
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "type",
      description: "The type of cookie.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "num",
      description: "How many cookies.",
    }),
  ],
  // ...
  execute: async function ([type, num], context) {
    // ...
  },
});
```

The order that you define the parameters determines the order they are passed into the `execute` function. The names of the parameters don't need to match the variable names you use for them in the `execute` function, but it's usually more readable to keep them the same.

??? "Array destructuring"
    In the code above, and across our other samples, we typically use [array destructuring][destructuring_assignment] to pull values out of the parameter array and assign them to variables. You could alternatively do that within the body of the `execute` function:

    ```ts
    execute: async function (parameters, context) {
      let word = parameters[0];
      let count = parameters[1];
    },
    ```


## Parameter types {: #types}

When defining a parameter you must specify what type of data the parameter will accept. The enum [`ParameterType`][ParameterType] lists all of the allowed parameter types.


### Plain text

Use the `String` parameter to pass a plain text value to your formula. Coda will automatically apply the [`ToText()`][ToText] formula to the input and pass it to the `execute` function as a [JavaScript String][mdn_string].

String parameters are compatible with almost every column type in Coda, as most have a text representation. At times a string parameter may be better than a more semantically accurate type, as it allows you to access the value as shown to the user.


### Rich text

Use the `Html` parameter type to pass text values with formatting included. Coda will convert the formatting to an equivalent block of HTML markup, and pass it to the `execute` function as a [JavaScript String][mdn_string].

Like string parameters, HTML parameters can accept a wide array of column types. The generated HTML may be quite different than how it displays in Coda however, and is closer to what you'd get if you pasted that value into another rich text editor.

!!! warning "HTML markup may change"
    The generated HTML for a given value is not a stable API surface that you should rely on. We may change it at any time without warning, so we don't recommend that you parse it to extract information. Use it for display purposes only.


### Numbers

Use the `Number` parameter type to pass a number to your formula. Coda will automatically apply the [`ToNumber()`][ToNumber] formula to the input and pass it to the `execute` function as a [JavaScript Number][mdn_number].

The number equivalent for some column types may not be obvious. Specifically:

- **Percent** values will be converted into the equivalent fraction. For example, "75%" will be passed as `0.75`.
- **Date** and **Date and time** values will be converted into the number of days since 1899-12-30[^1]. For example, "1955-11-12" will be passed as `20405`.
- **Time** and **Duration** values will be converted into a number of days. For example, "12 hrs" will be passed as `0.5`.


### Booleans

Use the `Boolean` parameter type to pass a boolean (true/false) to your formula. Coda will pass the value to the `execute` function as a [JavaScript Boolean][mdn_boolean].


### Dates

Use the `Date` parameter type to pass a date value to your formula. Coda will automatically apply the [`ToDateTime()`][ToDateTime] formula to the input and pass it to the `execute` function as a [JavaScript Date][mdn_date].

JavaScript Date objects can only represent a specific moment at time. This means that they can't easily represent less specific concepts like a day (regardless of time), a time (regardless of day), or duration. Coda handles those column types using the following logic:

- **Date** values will be converted into a datetime representing midnight on that day in the document's timezone.
- **Time** and **Duration** values will be converted a datetime that is that much time past the [Unix epoch][unix_epoch] (00:00:00 UTC on 1 January 1970). For example, "12 hours" will be passed as `"1899-12-30T17:00:00.000Z"`.

!!! info Dates and timezones
    TODO: All dates and times in a document are relative to it's configured timezone.


### Corresponding column types

| Column type   | Supported | Recommended   | Notes                                               |
| ------------- | --------- | ------------- | --------------------------------------------------- |
| Text          | ✅ Yes    | `String`      | Use `Html` if the formatting is important.          |
| Select list   | ✅ Yes    | `StringArray` | Works for both single and multi-value select lists. |
| Number        | ✅ Yes    | `Number`      |                                                     |
| Percent       | ✅ Yes    | `Number`      | Passed as a fraction.                               |
| Currency      | ✅ Yes    | `Number`      | Use `String` to get currency symbol.                |
| Slider        | ✅ Yes    | `Number`      |                                                     |
| Scale         | ✅ Yes    | `Number`      |                                                     |
| Date          | ✅ Yes    | `String`      | See the [Dates & times][dates] guide.               |
| Time          | ✅ Yes    | `Number`      | See the [Dates & times][dates] guide.               |
| Date and time | ✅ Yes    | `Date`        | See the [Dates & times][dates] guide.               |
| Duration      | ✅ Yes    | `Number`      | See the [Dates & times][dates] guide.               |
| Checkbox      | ✅ Yes    | `Boolean`     |                                                     |
| People        | ❌ No     |               |                                                     |
| Reaction      | ❌ No     |               |                                                     |
| Button        | ❌ No     |               |                                                     |
| Image         | ✅ Yes    | `ImageArray`  | Image column can contain multiple images.           |
| Image URL     | ✅ Yes    | `Image`       |                                                     |
| File          | ❌ No     |               |                                                     |
| Lookup        | ❌ No     |               |                                                     |


## Optional parameters

By default all parameters you define are required. To make a parameter optional simply add `optional: true` to your parameter definition. Optional parameters are shown to the user but not required in order for the formula to execute.  Optional parameters must be defined after all of the required parameters, and like required parameters their order is reflected in the Coda formula editor and the array of values passed to the `execute` function.


```ts
pack.addFormula({
  // ...
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "name",
      description: "The person's name.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "suffix",
      description: "A suffix, like 'MD' or 'Jr'.",
      optional: true,
    }),
  ],
  // ...
  execute: async function ([name, suffix], context) {
    // ...
  },
});
```

Optional parameters that have not been set by the user will default to the JavaScript value `undefined` in your `execute` function. When you initialize your parameter variables in the `execute` function you can assign a default value that will get used when the parameter has not been explicitly set by the user.

```ts
--8<-- "examples/parameter/scream.ts"
```

When using a formula with optional parameters, the user may choose to set those parameters by name, instead of by position. This can be useful when they want to skip over some optional parameters that appear earlier in the list.

```ts
Scream("What is this", character: "?")
```

In this case the `text` and `character` parameters would be set, but the `volume` parameter would be undefined, and therefore use it's default value of `3`.


## Suggested values

As a convenience to users of your Pack, you can provide a suggested value for a parameter. When they use your formula the default will be pre-populated in the formula editor, action dialog, etc. The user is then free to edit or replace it this value.

To add a suggested value to a parameter set the field `defaultValue` to the value you'd like to use. The suggested value must be of the same type as the parameter, for example a number parameter must have a number as it's suggested default value.

```ts
coda.makeParameter({
  type: coda.ParameterType.Number,
  name: "days",
  description: "How many days of data to fetch.",
  defaultValue: 30,
})
```

Currently suggested values are only used for required parameters, and setting them for optional parameters has no effect.


## Accepting multiple values

For some formulas you may want to allow the user to enter multiple values for a parameter. You could use an array parameter for this case but a more user-friendly approach may be to use variable argument (vararg) parameters. These are parameters that you allow the user to repeat as many times as needed.

```
Foo(List("A", "B", "C"))  # A string array parameter.
Foo("A", "B", "C")        # A string variable argument parameter.
```

They are defined using the `varargParameters` property and accept the same parameter objects. The values set by the user are passed in to the `execute` just like normal parameters, only there is an unknown number of them. The easiest way to access them is by using [JavaScript's "rest" syntax][mdn_rest], which captures the remaining values into an array.

```ts
pack.addFormula({
  // ...
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "name",
      description: "The person's name.",
    }),
  ],
  varargParameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "nickname",
      description: "A nickname for the person.",
    }),
  ],
  // ...
  execute: async function ([name, ...nicknames], context) {
    // ...
  },
});
```

There are some important differences between vararg parameters and standard parameters:

- They appear at the end of the formula, after all standard parameters.
- Unlike standard parameters they are optional by default, and cannot by made required.
- You can't provide a default value, since the user must always enter an explicit value.
- You can have more than one, but if so the user is required to enter complete sets of values. For example, if you have two vararg parameters `a` and `b`, the user can't provide a value for `a` without also providing a value for `b`. These pairs of parameters can then be repeated multiple times: `Foo("a1", "b1", "a2", "b2")`.

??? bug "Not available in actions builder or sync table settings"
    At the moment, vararg parameters can only be set in the formula editor. In the action dialog users can switch from the default structured builder to the formula editor, but there is no way to set them for sync tables. <!-- go/bug/20828 -->

```ts
--8<-- "examples/parameter/steps.ts"
```


## Autocomplete

If you have a parameter that accepts a limited set of values it's usually best to provide those options using autocomplete. See the [Autocomplete guide][autocomplete] for more information.


## Reusing parameters

It's often the case that many formulas in a Pack use the same parameter. For example, the [Google Calendar Pack][calendar_pack] has many formulas have a parameter for the calendar to operate on. Rather than redefine the same parameter for each formula, it can be more efficient to define the shared parameter once outside of a formula and then reuse it multiple times.


```ts
const ProjectParam = coda.makeParameter({
  type: coda.ParameterType.String,
  name: "projectId",
  description: "The ID of the project.",
});

pack.addFormula({
  name: "GetProject",
  description: "Get a project.",
  parameters: [
    ProjectParam,
  ],
  // ...
});

pack.addFormula({
  name: "GetTask",
  description: "Get a task within a project.",
  parameters: [
    ProjectParam,
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "taskId",
      description: "The ID of the task.",
    }),
  ],
  // ...
});
```


## Date range parameters

Parameters of the type `DateArray` are often used for date ranges, with the first date representing the start of the range and the second date representing the end. When a `DateArray` parameter is used in an action or sync table the the input box displays a date range picker to make it easier for the user to select a range.

<img src="../../../images/parameter_daterange.png" srcset="../../../images/parameter_daterange_2x.png 2x" class="screenshot" alt="Date array parameters displayed as a date range picker">

These parameters also support a special set of [suggested values](#suggested-values) that represent date ranges relative to the current date. These are available in the [`PrecannedDateRange`][PrecannedDateRange] enumeration.

```ts
coda.makeParameter({
  type: coda.ParameterType.DateArray,
  name: "dateRange",
  description: "The date range over which data should be fetched.",
  defaultValue: coda.PrecannedDateRange.Last30Days,
})
```


[^1]: The representation is known as ["serial number"][serial_number] and is common to all major spreadsheet applications.

[samples]: ../../../samples/topic/parameter.md
[parameters]: ../../../reference/sdk/interfaces/PackFormulaDef.md#parameters
[makeParameter]: ../../../reference/sdk/functions/makeParameter.md
[ParamDef]: ../../../reference/sdk/interfaces/ParamDef.md
[destructuring_assignment]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
[mdn_rest]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#assigning_the_rest_of_an_array_to_a_variable
[autocomplete]: autocomplete.md
[PrecannedDateRange]: ../../../reference/sdk/enums/PrecannedDateRange.md
[calendar_pack]: https://coda.io/packs/google-calendar-1003/documentation
[ParameterType]: ../../../reference/sdk/enums/ParameterType.md
[ToText]: https://coda.io/formulas#ToText
[ToNumber]: https://coda.io/formulas#ToNumber
[ToDateTime]: https://coda.io/formulas#ToDateTime
[mdn_string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[mdn_number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[mdn_boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[mdn_date]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
[serial_number]: http://www.cpearson.com/excel/datetime.htm
[unix_epoch]: https://en.wikipedia.org/wiki/Unix_time
[dates]: ../../advanced/dates.md
