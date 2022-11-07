---
nav: Column formats
description: Automatically apply a formula to a user's input to display it in a different format.
---

# Add custom column formats

A column format is a custom column type that you can apply to any column in any Coda table. It changes how the values within that column are interpreted and displayed, while still allowing users to quickly edit the underlying value.

[View Sample Code][samples]{ .md-button }


## Using column formats

Column formats provided by Packs appear as choices in the **Column type** menu.

<img src="../../../images/column_format_menu.png" srcset="../../../images/column_format_menu_2x.png 2x" class="screenshot" alt="Pack column formats in the column type menu">


## Creating column formats

A column format is just a thin wrapper around an existing formula in your Pack, instructing Coda to run that formula on the column values before rendering them. The column format itself is just metadata, deferring the actual work of calculating the column value to the formula.

```ts
pack.addColumnFormat({
  name: "Reversed Text",
  instructions: "Whatever text you enter into this column will be reversed.",
  // The formula specified below will be run on the content of the column to
  // determine it's display value. The formula must be defined within the same
  // Pack.
  formulaName: "Reverse",
});

pack.addFormula({
  name: "Reverse",
  // ...
});
```

If you aren't already familiar with creating formulas, read the [Formulas guide][formulas] first.

!!! warning
    Changing the formula used by the column format will break any existing docs that use it.


## Naming

Unlike other building blocks, column format names can include spaces and special characters. We recommend following these conventions:

- Select a singular noun corresponding the output in the cell. For example, `Task` or `Event`.
  {: .yes}
- For multiple words, use spaces and title case. For example, `Progress Bar` or `Reversed Text`.
  {: .yes}
- Don't include the Pack name in the name of the column format. For example, use `Task` instead of `TodoistTask`.
  {: .no}

!!! info
    You can change the name of the column format without breaking existing docs that use it.


## Parameters

When the column format is applied to a cell, the value of the cell will be passed as the first parameter to the specified formula. The formula can have additional parameters defined, but they must be optional as they won't have a value passed.

Users can only enter text into the cell, but Coda will attempt to coerce them into the type of the first parameter. For example, if your column format formula accepts a `Date` parameter, the user can enter the date as a string and Coda will parse that string into a `Date` object and pass that to your formula.


## Results

Column formats can return any supported data type, and it will become the effective type for that column. When the cell is being edited, or if there is an error applying the column format, the underlying string value will be shown instead. See the [Data types guide][data-types] for more information on the type of values that can be returned.


## Authentication

Column formats can use authentication to access private resources. The account used by the column format is configured within the options menu of the column.

<img src="../../../images/column_format_options.png" srcset="../../../images/column_format_options_2x.png 2x" class="screenshot" alt="Selecting the account in the column format options">


## Automatic formatting {: #matchers}

When creating a new column, Coda tries to guess the type of the column based on the first data entered. Column formats from Packs can be included in this process by declaring matchers. Matchers are [regular expressions][mdn_regex] that define which cell values the column format should be applied to. If one of the regular expressions matches the cell value the column format will be applied automatically.

```ts
pack.addColumnFormat({
  name: "Task",
  formulaName: "Task",
  // If the first values entered into a new column match these patterns then
  // this column format will be automatically applied.
  matchers: [
    new RegExp("^https://todoist.com/app/project/[0-9]+/task/([0-9]+)$"),
    new RegExp("^https://todoist.com/showTask\\?id=([0-9]+)"),
  ],
});
```

Currently only URL patterns are fully supported, and the Pack must declare a corresponding [network domain][fetcher_network_domain].

Only Packs already installed in the document will have their matchers used. If multiple column formats both match the cell input then Coda will choose one arbitrarily. If the user doesn't want to use the column format they can manually change it afterwords.


## Link formatting

If your column format has [matchers](#matchers) defined it can also affect how links are displayed on the canvas. When editing the display settings for a link, if it matches a column format there will be a new option to display it using the Pack.

<img src="../../../images/column_format_canvas.png" srcset="../../../images/column_format_canvas_2x.png 2x" class="screenshot" alt="Selecting the account in the column format options">

When selected, this will wrap the link in a call to the formula that backs the column format. For example, using the Todoist column format above, a Todoist URL would be wrapped in a `=Task()` formula.


[samples]: ../../samples/topic/column-format.md
[formulas]: formulas.md
[parameters]: ../basics/parameters/index.md
[data-types]: ../basics/data-types.md
[mdn_regex]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
[fetcher_network_domain]: ../basics/fetcher.md#network-domains
