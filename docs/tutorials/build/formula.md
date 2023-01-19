---
nav: Basic formula
description: Learn how to build a basic formula from scratch.
icon: material/function
hide:
- toc
---

# Learn to build a formula

Formulas are one of the most basic building blocks in Coda; used to calculate values, filter tables, and so much more. In this tutorial you'll learn how to build a basic formula that takes in parameters and returns a new value.

!!! abstract "Goal"
    Build a `Reverse` formula that reverses a string of text.

Before starting this tutorial, make sure you have completed one of the **Get started** tutorials, either [In your browser][quickstart_web] or [On your local machine][quickstart_cli].


## :material-ruler-square-compass: Design the formula

Before we start writing any code, let's first think through how we want the formula to look and work. This includes the name, the inputs, the outputs, etc. For a formula that reverses text we could imagine it working like this:

```
Reverse("Hello") ==> "olleH"
```

It's also a good time think through how it should handle edge cases, where the input is different than what we'd normally expect. For example, empty inputs, large amounts of data, etc.

```
Reverse("a") ==> "a"
Reverse("") ==> ""
```

Now that we have a destination in mind, let's get coding!


## :material-crane: Scaffold the formula

We'll start by scaffolding out the structure of the formula. Once we have it looking the way we want we can go back and add the logic later.

=== ":material-numeric-1-circle: Add the Pack boilerplate"

    <section class="tutorial-row" markdown>
    <div markdown>

    For any new Pack you need to start with the boilerplate code that sets it up. This includes an import statement which loads the Pack SDK library, and the creation of our Pack definition.

    </div>
    <div markdown>

    ```ts
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();
    ```

    </div>
    </section>


=== ":material-numeric-2-circle: Add the formula definition"

    <section class="tutorial-row" markdown>
    <div markdown>

    Next add a formula definition to your Pack using the `addFormula()` method. This method takes in a set of [key-value pairs][javascript_key_value] that configure the various settings of the formula.

    </div>
    <div markdown>

    ```{.ts hl_lines="4-6"}
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.addFormula({

    });
    ```

    </div>
    </section>

=== ":material-numeric-3-circle: Set the name and description"

    <section class="tutorial-row" markdown>
    <div markdown>

    The first key-value pairs to set are the name and description of the formula. The name determines how users will call it in the Coda formula language, and the description is help text users can refer to.

    </div>
    <div markdown>

    ```{.ts hl_lines="5-6"}
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.addFormula({
      name: "Reverse",
      description: "Reverses some text.",
    });
    ```

    </div>
    </section>


=== ":material-numeric-4-circle: Create the parameters array"

    <section class="tutorial-row" markdown>
    <div markdown>

    Next define the formula's parameters, which provides information about its expected inputs. Start with an empty array for now and we'll fill it in during the next step.

    </div>
    <div markdown>

    ```{.ts hl_lines="7-9"}
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.addFormula({
      name: "Reverse",
      description: "Reverses some text.",
      parameters: [

      ],
    });
    ```

    </div>
    </section>


=== ":material-numeric-5-circle: Add the parameter definition"

    <section class="tutorial-row" markdown>
    <div markdown>

    Inside the array add a parameter definition for each input (only one in this case). Parameter definitions are created using the function `coda.makeParameter()`. Like the outer formula definition, each parameter definition is itself a set of key-value pairs.

    </div>
    <div markdown>

    ```{.ts hl_lines="8-10"}
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.addFormula({
      name: "Reverse",
      description: "Reverses some text.",
      parameters: [
        coda.makeParameter({

        }),
      ],
    });
    ```

    </div>
    </section>


=== ":material-numeric-6-circle: Set the parameter name and description"

    <section class="tutorial-row" markdown>
    <div markdown>

    Also like formulas, parameters have a name and description. These will be shown in the formula editor to help the user understand what data to pass in the parameter.

    </div>
    <div markdown>

    ```{.ts hl_lines="9-10"}
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.addFormula({
      name: "Reverse",
      description: "Reverses some text.",
      parameters: [
        coda.makeParameter({
          name: "text",
          description: "The text to reverse.",
        }),
      ],
    });
    ```

    </div>
    </section>


=== ":material-numeric-7-circle: Set the parameter type"

    <section class="tutorial-row" markdown>
    <div markdown>

    Each parameter must also specify what type of data it expects. Coda supports a variety of data types, like text, numbers, dates, etc.

    In this case we want to accept text, which is called a "string" in JavaScript. The enumeration `coda.ParameterType` contains all of the supported parameter types.

    </div>
    <div markdown>

    ```{.ts hl_lines="9"}
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.addFormula({
      name: "Reverse",
      description: "Reverses some text.",
      parameters: [
        coda.makeParameter({
          type: coda.ParameterType.String,
          name: "text",
          description: "The text to reverse.",
        }),
      ],
    });
    ```

    </div>
    </section>


=== ":material-numeric-8-circle: Set the result type"

    <section class="tutorial-row" markdown>
    <div markdown>

    We're done with the parameters, but there are more properties of the formula to set. Similar to how parameters must define the type of data they accept, formulas must also define the type of data they return.

    In this case we want the formula to return text, a JavaScript string. The enumeration `coda.ValueType` contains all of the supported result types.

    </div>
    <div markdown>

    ```{.ts hl_lines="14"}
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.addFormula({
      name: "Reverse",
      description: "Reverses some text.",
      parameters: [
        coda.makeParameter({
          type: coda.ParameterType.String,
          name: "text",
          description: "The text to reverse.",
        }),
      ],
      resultType: coda.ValueType.String,
    });
    ```

    </div>
    </section>


=== ":material-numeric-9-circle: Define the execute function"

    <section class="tutorial-row" markdown>
    <div markdown>

    The last part of our scaffolding is the `execute` function, which contains the code that powers the formula. Its job is to transform the inputs into output, based on the desired functionality of your formula.

    This function is run each time your formula is recalculated, for example when it is added to a page or the inputs change.

    </div>
    <div markdown>

    ```{.ts hl_lines="15-17"}
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.addFormula({
      name: "Reverse",
      description: "Reverses some text.",
      parameters: [
        coda.makeParameter({
          type: coda.ParameterType.String,
          name: "text",
          description: "The text to reverse.",
        }),
      ],
      resultType: coda.ValueType.String,
      execute: async function () {

      },
    });
    ```

    </div>
    </section>


=== ":material-numeric-10-circle: Return a placeholder value"

    <section class="tutorial-row" markdown>
    <div markdown>

    We're not going to write out the logic of the `execute` function right now, but the type checking on the code won't be happy unless we return some value that matches the `resultType` we defined.

    For now just return a placeholder string.

    </div>
    <div markdown>

    ```{.ts hl_lines="16"}
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.addFormula({
      name: "Reverse",
      description: "Reverses some text.",
      parameters: [
        coda.makeParameter({
          type: coda.ParameterType.String,
          name: "text",
          description: "The text to reverse.",
        }),
      ],
      resultType: coda.ValueType.String,
      execute: async function () {
        return "Not implemented yet";
      },
    });
    ```

    </div>
    </section>

---

### Try it out

<section class="tutorial-row" markdown>
<div markdown>

With the scaffold complete you can now build your Pack and give it a spin. Install your Pack in a doc and try out one of the use cases you defined at the start.

You should see the name, description, and parameters in the help text, get back the placeholder string as expected.

</div>
<div markdown>

<img src="../../../images/tutorial_formula_scaffold.png" srcset="../../../images/tutorial_formula_scaffold_2x.png 2x" class="screenshot" alt="Working scaffold">

</div>
</section>

??? tip "Tip: Slash command"
    When you write Packs using the Pack Studio web editor you can use the slash command `/addFormula` to generate the scaffolding for you!

    [![How to use the formula slash command][slash_gif]{: .screenshot}][slash_gif]


## :fontawesome-solid-laptop-code: Write the logic

All the code we've written so far has just been a bunch of settings that tell Coda the shape of the formula. Now it's time to get down to business and write the code that actually makes the formula do something useful.


=== ":material-numeric-1-circle: Capture the formula inputs"

    <section class="tutorial-row" markdown>
    <div markdown>

    The `execute` function takes in the formula inputs as parameters. We omitted these while we were scaffolding, so let's add them in now.

    The first parameter is an array containing the values that the user passed into the formula (the arguments, or `args` for short). For example, if they called `Reverse("Hello")` it would be set to `["Hello"]`.

    The second is the formula's execution context, which is a collection of settings and utilities that your formula can use. We won't be using the context in this formula, but it's usually good to have it there in case you need it later.

    </div>
    <div markdown>

    ```{.ts hl_lines="1"}
    execute: async function (args, context) {
      return "Not implemented yet";
    },
    ```

    </div>
    </section>


=== ":material-numeric-2-circle: Unpack the formula arguments"

    <section class="tutorial-row" markdown>
    <div markdown>

    A good first step in your execute function is to unpack the arguments into separate variables. This makes it easier to reference them throughout your code.

    This pattern is called ["destructuring"][mdn_destructuring], and each variable (left side) is populated with the value in the array (right side) at the same position.

    </div>
    <div markdown>

    ```{.ts hl_lines="2"}
    execute: async function (args, context) {
      let [text] = args;
      return "Not implemented yet";
    },
    ```

    </div>
    </section>


=== ":material-numeric-3-circle: Reverse the text"

    <section class="tutorial-row" markdown>
    <div markdown>

    Now that we have the text, let's reverse it. JavaScript arrays have `reverse()` method we can use, but first we'll need to convert the string to an array.

    We can do that using the `split()` method, splitting on an empty string to get one character per item. Note that this approach only works well for letters and numbers; emojis and some special characters will get jumbled, but that's OK for this tutorial.

    After reversing join the pieces back together using the `join()` method, using an empty string as a separator. All of these steps can be chained together and the final result returned.

    </div>
    <div markdown>

    ```{.ts hl_lines="3"}
    execute: async function (args, context) {
      let [text] = args;
      return text.split("").reverse().join("");
    },
    ```

    </div>
    </section>

---

### Try it out

<section class="tutorial-row" markdown>
<div markdown>

Rebuild your Pack, and refresh the formula the formula in the doc. If everything is working correctly you'll now see it reversing text as expected!

</div>
<div markdown>

<img src="../../../images/tutorial_formula_logic.png" srcset="../../../images/tutorial_formula_logic_2x.png 2x" class="screenshot" alt="The logic working.">

</div>
</section>

??? example "View the full code"
    ```ts
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.addFormula({
      name: "Reverse",
      description: "Reverses some text.",
      parameters: [
        coda.makeParameter({
          type: coda.ParameterType.String,
          name: "text",
          description: "The text to reverse.",
        }),
      ],
      resultType: coda.ValueType.String,
      execute: async function (args, context) {
        let [text] = args;
        return text.split("").reverse().join("");
      },
    });
    ```


## :material-plus-box: Add another feature

Our formula is working exactly as planned, but often plans change as you build out a Pack. After some more thought we realize it would be nice to offer the ability to reverse text word-by-word, instead of just character-by-character.

```
Reverse("Hello world") ==> "dlrow olleH"
Reverse("Hello world", byWord: true) ==> "world Hello"
```

Let's update our formula to make this possible.


=== ":material-numeric-1-circle: Add a new parameter"

    <section class="tutorial-row" markdown>
    <div markdown>

    First define a new parameter called `byWord`. The type will be `Boolean`, since we only want people to pass true or false.

    Also set it as `optional`, so that users don't have to specify it if they want the default character-by-character behavior.

    </div>
    <div markdown>

    ```{.ts hl_lines="7-12"}
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "text",
        description: "The text to reverse.",
      }),
      coda.makeParameter({
        type: coda.ParameterType.Boolean,
        name: "byWord",
        description: "Whether to split by word.",
        optional: true,
      }),
    ],
    ```

    </div>
    </section>


=== ":material-numeric-2-circle: Unpack the new argument"

    <section class="tutorial-row" markdown>
    <div markdown>

    The value that users pass to `byWord` will end up in the execute function's `args` parameter, alongside the existing `text` value. Since it's the second parameter to the formula, its value will be the second entry in `args`.

    Unpack the `byWord` argument into its own variable to make it easier to work with. This is done by adding a new variable to the left side of the destructuring assignment (within the square brackets), in the second position.

    </div>
    <div markdown>

    ```{.ts hl_lines="2"}
    execute: async function (args, context) {
      let [text, byWord] = args;
      return text.split("").reverse().join("");
    },
    ```

    </div>
    </section>


=== ":material-numeric-3-circle: Set a default value"

    <section class="tutorial-row" markdown>
    <div markdown>

    Since `byWord` is an optional parameter, users don't have to specify a value for it. In this case your function will receive the special value `undefined`.

    ```
    Reverse("A")  // args is ["A", undefined]
    ```

    To set a default value when the user hasn't supplied one, use an equals sign in the destructuring assignment followed by your chosen default. In this case we'll default to false.

    </div>
    <div markdown>

    ```{.ts hl_lines="2"}
    execute: async function (args, context) {
      let [text, byWord = false] = args;
      return text.split("").reverse().join("");
    },
    ```

    </div>
    </section>


=== ":material-numeric-4-circle: Adjust the logic"

    <section class="tutorial-row" markdown>
    <div markdown>

    Finally, update the logic to support word-by-word reversing. When the user wants to split by word, split on a space character instead of an empty string, and then join the array back together using a space as well.

    </div>
    <div markdown>

    ```{.ts hl_lines="3-7"}
    execute: async function (args, context) {
      let [text, byWord = false] = args;
      let separator = "";
      if (byWord) {
        separator = " ";
      }
      return text.split(separator).reverse().join(separator);
    },
    ```

    </div>
    </section>

---

### Try it out

<section class="tutorial-row" markdown>
<div markdown>

Rebuild your Pack, and try out the new `byWord` parameter in a formula. If everything is working correctly when you set that parameter to true it should now reverse word-by-word.

</div>
<div markdown>

<img src="../../../images/tutorial_formula_feature.png" srcset="../../../images/tutorial_formula_feature_2x.png 2x" class="screenshot" alt="The new feature working.">

</div>
</section>

??? example "View the full code"
    ```ts
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.addFormula({
      name: "Reverse",
      description: "Reverses some text.",
      parameters: [
        coda.makeParameter({
          type: coda.ParameterType.String,
          name: "text",
          description: "The text to reverse.",
        }),
        coda.makeParameter({
          type: coda.ParameterType.Boolean,
          name: "byWord",
          description: "Whether to split by word.",
          optional: true,
        }),
      ],
      resultType: coda.ValueType.String,
      execute: async function (args, context) {
        let [text, byWord = false] = args;
        let separator = "";
        if (byWord) {
          separator = " ";
        }
        return text.split(separator).reverse().join(separator);
      },
    });
    ```


## :material-fast-forward: Next steps

Now that you have an understanding of how to build formulas, here are some more resources you can explore:

- [Formulas guide][formulas] - More in-depth information about how formulas are structured.
- [Sample code][samples_formulas] - A collection of example formulas you can examine or try.
- [Parameters guide][parameters] - An overview of all the available parameter types, and some advanced features.
- [Data types guide][data_types] - Information on the result types that formulas can return.


[quickstart_web]: ../get-started/web.md
[quickstart_cli]: ../get-started/cli.md
[mdn_destructuring]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
[formulas]: ../../guides/blocks/formulas.md
[samples_formulas]: ../../samples/topic/formula.md
[parameters]: ../../guides/basics/parameters/index.md
[data_types]: ../../guides/basics/data-types.md
[javascript_key_value]: https://javascript.info/object
[slash_gif]: ../../images/tutorial_formula_slash.webp
