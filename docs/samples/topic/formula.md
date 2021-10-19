# Formulas

A **formula (including a button)** is a JavaScript function that will be exposed as a Coda formula, that you can use anywhere in a Coda doc that you can use any normal formula. Formulas take basic Coda types as input, like strings, numbers, dates, booleans, and arrays of these types, and return any of these types or objects whose properties are any of these types. Buttons are just a flavor of a formula with the flag `isAction` activated.

=== "Basic Formula"
    ```ts
    // Replace all <text> with your own text
    pack.addFormula({
      // This sets the return type of the formula.
      resultType: coda.ValueType.String,

      // This is the name that will be called in the formula builder.
      // Remember, your formula name cannot have spaces in it.
      name: "<Hello>",
      description: "<A Hello World example.>",

      // If your formula requires one or more inputs, you’ll define them here.
      // Create more parameters with /Parameter.
      parameters: [
        coda.makeParameter({
          type: coda.ParameterType.String,
          name: "<myParam>",
          description: "<My description>",
        }),
      ],

      // Everything inside this execute statement will happen anytime your Coda 
      // formula is called in a doc.
      execute: async function ([myParam], context) {
        // Here, myParam is the first parameter you’ve defined above: the “name” 
        // input.
        return "Hello " + myParam + "!";
      },
    });
    ```
