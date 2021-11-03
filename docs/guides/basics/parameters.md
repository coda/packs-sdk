# Parameters

The primary mechanism for passing data from a Coda document into your Pack is via parameters. You define the parameters in your code and the user fills them with values when they use your Pack. These values are then passed to the formula's `execute` function as the first argument, bundled up as an array.

```ts
pack.addFormula({
  // ...
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "word",
      description: "The word to repeat.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "count",
      description: "How many times to repeat it.",
    }),
  ],
  // ...
  execute: async function ([word, count], context) {
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

Optional parameters that have not been set by the user will default to the JavaScript value `undefined` in your `execute` function. In many cases it's useful to define a default value for optional parameters. The value set in the `defaultValue` field of the parameter determines what is shown to the user, while the value you set in the `execute` function is the what your code will actually use. It's normally best to keep these two defaults the same.

```ts
--8<-- "examples/formula/scream.ts"
```

When using a formula with optional parameters, the user may choose to set those parameters by name, instead of by position. This can be useful when they want to skip over some optional parameters that appear earlier in the list.

```ts
Scream("What is this", character: "?")
```

In this case the `text` and `character` parameters would be set, but the `volume` parameter would be undefined, and therefore use it's default value of `3`.


## Accepting multiple values

For some formulas you may want to allow the user to enter multiple values for a parameter. You could use an array parameter for this case but a more user-friendly approach may be to use variable argument (vararg) parameters. These are parameters that you allow the user to repeat as many times as needed.

```
Foo(List("A", "B", "C"))  # A string array parameter.
Foo("A", "B", "C")        # A string variable argument parameter.
```

They are defined using the `varargParameters` property and accept the same parameter objects. The values set by the user are passed in to the `execute` just like normal parameters, only their is an unknown number of them. The easiest way to access them is by using [JavaScript's "rest" syntax][mdn_rest], which captures the remaining values into an array.

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

There some important difference between about vararg parameters and standard parameters:

- They appear at the end of the formula, after all standard parameters.
- Unlike standard parameters they are optional by default, and cannot by made required.
- You can't provide a default value, since the user must always enter an explicit value.
- You can have more than one, but if so the user is required to enter complete sets of values. For example, if you have two vararg parameters `a` and `b`, the user can't provide a value for `a` without also providing a value for `b`. These pairs of parameters can then be repeated multiple times: `Foo("a1", "b1", "a2", "b2")`.

```ts
--8<-- "examples/formula/steps.ts"
```


## Autocomplete

If you have a parameter that accepts a limited set of values it's usually best to provide those options using autocomplete. See the [Autocomplete guide][autocomplete] for more information.


[destructuring_assignment]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
[mdn_rest]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#assigning_the_rest_of_an_array_to_a_variable
[autocomplete]: ../advanced/autocomplete.md
