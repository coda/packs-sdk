A **column format** is a custom column type that you apply to any column in any Coda table. A column format tells Coda to interpret the value in a cell by executing a **formula** using that value, typically looking up data related to that value from an external API.

For example, the Weather pack has a column format `Current Weather`; when applied to a column, if you type a city or address into a cell in that column, that location will be used as an input to a formula that fetches the current weather at that location, and the resulting object with weather info will be shown in the cell.
