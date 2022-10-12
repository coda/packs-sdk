To return structured data in a Pack you must first define the shape of that data using a schema. Schemas describe the type of data that will be returned, as well as metadata about how Coda should render it, but not the data itself. Pack formulas and sync tables specify which schema they are using and return data that matches it.

The most common form of schema you'll need to define are object schemas. They are often used to bundle together multiple pieces of data returned by an API.
