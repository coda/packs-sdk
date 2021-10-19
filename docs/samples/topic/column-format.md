# Column Formats

A **column format** is a custom column type that you apply to any column in any Coda table. A column format tells Coda to interpret the value in a cell by executing a **formula** using that value, typically looking up data related to that value from a third-party API.

For example, the Weather pack has a column format `Current Weather`; when applied to a column, if you type a city or address into a cell in that column, that location will be used an input to a formula that fetches the current weather at that location, and the resulting object with weather info will be shown in the cell.

=== "Column Format with No Matchers"
    ```ts
    // Replace all <text> with your own text
    // A custom column type that you apply to any column in any Coda table.
    pack.addColumnFormat({
      name: "<format name>",
      instructions: "<instruction text that will be visible by Users>",
      formulaName: "<the name of a formula to execute using the column value>",
      formulaNamespace: "Ignore", // this will be deprecated
      // Optional, regular expressions that detect urls that are handeable by this
      // column format. When a user pastes a url that matches any of these, the UI
      // will hint to the user that they can apply this format to their column.
      matchers: [],
    });
    ```
