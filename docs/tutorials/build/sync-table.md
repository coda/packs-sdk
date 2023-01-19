---
nav: Sync table
description: Learn how to build a sync table of external data.
icon: material/table-sync
hide:
- toc
cSpell:words: Gutendex gutendex
---

# Learn to build a sync table

Sync tables are special tables that pull in rows from an external API or data source. In this tutorial you'll learn how to build a basic sync table, including multiple types of data, filtering, and pagination.

!!! abstract "Goal"
    Build a `Books` sync table that lists the books available in the Project Gutenberg archive.

Before starting this tutorial, make sure you have completed:

- One of the **Get started** tutorials, either [In your browser][quickstart_web] or [On your local machine][quickstart_cli].
- The [Call an API tutorial][tutorial_fetcher], which covers how to call make an HTTP request.


## :material-api: Understand the API

[Project Gutenberg][gutenberg] is a library of over 60,000 free eBooks, with a website to browse and download them. They don't offer an API to access the data in their collection, but the related project [Gutendex][gutendex] does. It provides one endpoint, which lists the available books

```
https://gutendex.com/books
```

It supports a variety for query parameters for filtering the results, for example by topic:

```
https://gutendex.com/books?topic=Cooking
```

The endpoint returns a JSON response which includes some metadata about the query and the details of the matching books:

```js
{
  "count": 308,
  "next": "https://gutendex.com/books/?page=2&topic=Cooking",
  "previous": null,
  "results": [
    {
      "id": 29728,
      "title": "Cookery and Dining in Imperial Rome",
      "authors": [
        {
          "name": "Apicius",
          "birth_year": null,
          "death_year": null
        }
      ],
      "translators": [
        {
          "name": "Vehling, Joseph Dommers",
          "birth_year": 1879,
          "death_year": 1950
        }
      ],
      "subjects": [
        "Cookbooks",
        "Cooking, Roman -- Early works to 1800"
      ],
      "bookshelves": [
        "Cookbooks and Cooking"
      ],
      "languages": [
        "en"
      ],
      "copyright": false,
      "media_type": "Text",
      "formats": {
        "text/plain; charset=utf-8": "https://www.gutenberg.org/files/29728/29728-0.txt",
        "application/x-mobipocket-ebook": "https://www.gutenberg.org/ebooks/29728.kindle.images",
        "application/rdf+xml": "https://www.gutenberg.org/ebooks/29728.rdf",
        "application/epub+zip": "https://www.gutenberg.org/ebooks/29728.epub.images",
        "text/plain; charset=us-ascii": "https://www.gutenberg.org/files/29728/29728.txt",
        "text/html": "https://www.gutenberg.org/ebooks/29728.html.images",
        "text/html; charset=iso-8859-1": "https://www.gutenberg.org/files/29728/29728-h/29728-h.htm",
        "text/plain; charset=iso-8859-1": "https://www.gutenberg.org/files/29728/29728-8.txt",
        "image/jpeg": "https://www.gutenberg.org/cache/epub/29728/pg29728.cover.small.jpg",
        "application/zip": "https://www.gutenberg.org/files/29728/29728-h.zip"
      },
      "download_count": 2308
    },
    // ... 31 more results ...
  ]
}
```

Here you can see that there are 308 books on the topic of cooking, returned in pages of 32 at a time. The `next` link provides the URL you can use to fetch the next page of results in the set. The `next` link is null when there are no pages left to fetch:

```
https://gutendex.com/books/?page=10&topic=Cooking
```

```js
{
  "count": 308,
  "next": null,
  "previous": "https://gutendex.com/books/?page=9&topic=Cooking",
  "results": [
    // ...
  ]
}
```

Many APIs paginate their data like this, since most platforms have a maximum HTTP response size and they need to provide a way to fetch the full set.


## :material-ruler-square-compass: Design the sync table

The goal is to create a sync table called "Books" that has a row for each book in the collection. Optionally allow users to filter the collection down to a specific topic. For each book include the following columns:

- Title
- Authors
- Subjects
- Link
- Thumbnail

The API returns more data than that, but you don't need to expose it all in our sync table.


## :material-crane: Scaffold the sync table

Start by scaffolding out the structure of the sync table, coming back to some of the details later.

=== ":material-numeric-1-circle: Add the boilerplate"

    <section class="tutorial-row" markdown>
    <div markdown>

    Add the standard Pack boilerplate and declare the network domain.

    Then add a sync table definition to your Pack using the `addSyncTable()` method. This method takes in a set of [key-value pairs][javascript_key_value] that configure the various settings of the sync table.

    </div>
    <div markdown>

    ```ts
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.addNetworkDomain("gutendex.com");

    pack.addSyncTable({

    });
    ```

    </div>
    </section>

=== ":material-numeric-2-circle: Set the properties"

    <section class="tutorial-row" markdown>
    <div markdown>

    The first key-value pairs to set are the name and description of the sync table, both of which will be visible to users of the Pack. For the name use a plural noun corresponding to what the rows represent, "Books" in this case.

    Next set the field `identityName`. This acts as the unique ID for this sync table, which is used for creating references between sync tables. It is not visible to the user, but the normal convention is to use the singular version of the sync table name.

    </div>
    <div markdown>

    ```{.ts hl_lines="7-9"}
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.addNetworkDomain("gutendex.com");

    pack.addSyncTable({
      name: "Books",
      description: "Lists books in the collection.",
      identityName: "Book",
    });
    ```

    </div>
    </section>

=== ":material-numeric-3-circle: Set the schema"

    <section class="tutorial-row" markdown>
    <div markdown>

    The sync table's schema defines the structure of each row in the table. You'll define the schema in a later step, but for now just pencil in a name.

    </div>
    <div markdown>

    ```{.ts hl_lines="10"}
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.addNetworkDomain("gutendex.com");

    pack.addSyncTable({
      name: "Books",
      description: "Lists books in the collection.",
      identityName: "Book",
      schema: BookSchema,  // TODO: Define this schema.
    });
    ```

    </div>
    </section>

=== ":material-numeric-4-circle: Add the sync formula"

    <section class="tutorial-row" markdown>
    <div markdown>

    A sync table definition contains a formula definition, known as the sync formula, which does the actual fetching of the data. It's similar to regular formula, but with a few key differences:

    - The name and description are never shown to the user (but are still required).
    - It doesn't declare a `resultType`, since it returns a special type used by sync tables.

    You'll write the syncing logic later, so for now just place a TODO comment in the code.

    </div>
    <div markdown>

    ```{.ts hl_lines="11-18"}
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.addNetworkDomain("gutendex.com");

    pack.addSyncTable({
      name: "Books",
      description: "Lists books in the collection.",
      identityName: "Book",
      schema: BookSchema,  // TODO: Define this schema.
      formula: {
        name: "SyncBooks",
        description: "Syncs the books.",
        parameters: [],
        execute: async function (args, context) {
          // TODO: Write sync logic.
        },
      },
    });
    ```

    </div>
    </section>

---

You now have the basic structure of the sync table itself. Your code still won't build at this point, but it's a good start!


## :material-table-sync: Write the sync formula

With the structure set up, you can now write the code that fetches the rows.

=== ":material-numeric-1-circle: Define a topic parameter"

    <section class="tutorial-row" markdown>
    <div markdown>

    To allow users to optionally filter the collection by subject, add a `topic` parameter to the sync formula. This will be displayed as an option in the sync table's side panel.

    </div>
    <div markdown>

    ```{.ts hl_lines="7-12"}
    pack.addSyncTable({
      // ...
      formula: {
        name: "SyncBooks",
        description: "Syncs the books.",
        parameters: [
          coda.makeParameter({
            type: coda.ParameterType.String,
            name: "topic",
            description: "Limit books to this topic.",
            optional: true,
          }),
        ],
        execute: async function (args, context) {
          // TODO: Write sync logic.
        },
      },
    });
    ```

    </div>
    </section>

=== ":material-numeric-2-circle: Fetch the data"

    <section class="tutorial-row" markdown>
    <div markdown>

    Move on to the `execute` function, which is run every time the table needs to sync.

    First retrieve the value of the `topic` parameter, if set. Then use it to construct the API URL to fetch.

    Finally, use the fetcher to make a request to that URL.

    </div>
    <div markdown>

    ```{.ts hl_lines="6-14"}
    pack.addSyncTable({
      // ...
      formula: {
        // ...
        execute: async function (args, context) {
          let [topic] = args;
          let baseUrl = "https://gutendex.com/books";
          let url = coda.withQueryParams(baseUrl, {
            topic: topic,
          });
          let response = await context.fetcher.fetch({
            method: "GET",
            url: url,
          });
        },
      },
    });
    ```

    </div>
    </section>

=== ":material-numeric-3-circle: Return the rows"

    <section class="tutorial-row" markdown>
    <div markdown>

    Now that you have the API response you need to extract the row data from it. The rows you want to return are in the JSON response body under the key `results`.

    The sync table expects the rows to be returned in an object, under the key `result`. The return value for a sync table must always match this pattern.

    </div>
    <div markdown>

    ```{.ts hl_lines="15-18"}
    pack.addSyncTable({
      // ...
      formula: {
        // ...
        execute: async function (args, context) {
          let [topic] = args;
          let baseUrl = "https://gutendex.com/books";
          let url = coda.withQueryParams(baseUrl, {
            topic: topic,
          });
          let response = await context.fetcher.fetch({
            method: "GET",
            url: url,
          });
          let rows = response.body.results;
          return {
            result: rows,
          };
        },
      },
    });
    ```

    </div>
    </section>

---

Your Pack can now fetch the matching books and return them as rows. The code still won't build until you define the schema, so onwards!


## :material-format-list-group: Define the schema

The schema is essentially a blueprint for each row in the sync table, describing what data will be stored, the type of that data, etc. The rows returned by the sync formula are compared to the schema, and only the matching fields are shown in the document.

=== ":material-numeric-1-circle: Create schema definition"

    <section class="tutorial-row" markdown>
    <div markdown>

    When scaffolding you set the sync table's schema to be `BookSchema`, and now you have to create that schema.

    Schemas must be defined in the code before the sync tables that use them.

    There are different types of schemas, but a sync table must use an object schema. Create one using `coda.makeObjectSchema`.

    </div>
    <div markdown>

    ```{.ts hl_lines="6-8"}
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.addNetworkDomain("gutendex.com");

    const BookSchema = coda.makeObjectSchema({

    });

    pack.addSyncTable({
      name: "Books",
      description: "Lists books in the collection.",
      identityName: "Book",
      schema: BookSchema,
      // ...
    });
    ```

    </div>
    </section>

=== ":material-numeric-2-circle: Define title property"

    <section class="tutorial-row" markdown>
    <div markdown>

    An object schema primarily contains property definitions, which describe the different pieces of data being stored in the schema. Create a `properties` object to hold these properties.

    One piece of data you'll want to store for each row is the title of the book. To create that property, add a new key-value pair to the `properties` object. The key (left side) determines two things:

    1. How users will access the property's value in the doc.
    1. Where Coda can find that value in the rows your sync formula returned.

    Your sync formula is currently returning the API data as-is, and it returns the title under the key `title`. That's also a great name to expose to our users, so use it as the key of the property.

    The value (right side) is another schema definition, describing what type of data that property will hold. Create a simple schema with the type `String`, since the title is a text value.

    </div>
    <div markdown>

    ```{.ts hl_lines="2-4"}
    const BookSchema = coda.makeObjectSchema({
      properties: {
        title: { type: coda.ValueType.String },
      },
    });
    ```

    </div>
    </section>

=== ":material-numeric-3-circle: Define book ID property"

    <section class="tutorial-row" markdown>
    <div markdown>

    In order to function correctly a sync table's schema must include at least one property which is a unique identifier for that row. A book's title isn't guaranteed to be unique, but luckily the API response includes an `id` field you can use.

    It's a best practice to avoid creating a property named exactly `id`, but instead use the pattern `{thing}Id`, or `bookId` in this case. When the name of the property differs from the key in the API response, use the `fromKey` field of the schema to connect them.

    </div>
    <div markdown>

    ```{.ts hl_lines="4-7"}
    const BookSchema = coda.makeObjectSchema({
      properties: {
        title: { type: coda.ValueType.String },
        bookId: {
          type: coda.ValueType.Number,
          fromKey: "id",
        },
      },
    });
    ```

    </div>
    </section>

=== ":material-numeric-4-circle: Configure schema settings"

    <section class="tutorial-row" markdown>
    <div markdown>

    In addition the properties themselves, the schema contains various settings.

    The `displayProperty` setting is used to specify which of the properties you defined should be used as the display value. It will be shown within the chip in the first column of the row, which by default is also the display column of the table. For this schema the `title` property would make a good display value.

    The `idProperty` setting is used to specify which of the properties contains the unique ID for the row. The `bookId` property was created for this purpose.

    </div>
    <div markdown>

    ```{.ts hl_lines="9-10"}
    const BookSchema = coda.makeObjectSchema({
      properties: {
        title: { type: coda.ValueType.String },
        bookId: {
          type: coda.ValueType.Number,
          fromKey: "id",
        },
      },
      displayProperty: "title",
      idProperty: "bookId",
    });
    ```

    </div>
    </section>

---

### Try it out

Now that the schema is finished you're finally ready to see the sync table in action.

<section class="tutorial-row" markdown>
<div markdown>

Build the Pack and install it in a doc. Drag the **Books** table on to the page and click the **Sync now** button.

If everything is working correctly you should get a table with 32 books in it. Hovering over the chip in the first column will show the title and ID of the book.

To filter to a specific topic, open the sync option for the table, click **Add criteria** > **Topic**, enter a topic (like "Cooking") and click **Sync now**.

</div>
<div markdown>

<img src="../../../images/tutorial_sync_table_build1.png" srcset="../../../images/tutorial_sync_table_build1_2x.png 2x" class="screenshot" alt="The resulting sync table with name and ID fields">

</div>
</section>

??? example "View the full code"
    ```ts
    --8<-- "samples/packs/tutorials/sync-table/build1.ts"
    ```


## :material-table-plus: Extend the schema

Now that you have the basics working, extend the schema to include the full set of data you want to sync. To do that, edit the `BookSchema` definition and add more entries to the `properties` object.

=== ":material-numeric-1-circle: Add subjects"

    <section class="tutorial-row" markdown>
    <div markdown>

    The API response includes the subjects the book pertains to:

    ```js
    "subjects": [
      "Cookbooks",
      "Cooking, Roman -- Early works to 1800"
    ],
    ```

    Since this is a list of strings, set the type to `Array`. Then in the `items` property specify another schema which represents each item, a `String` in this case.

    </div>
    <div markdown>

    ```{.ts hl_lines="4-7"}
    const BookSchema = coda.makeObjectSchema({
      properties: {
        // ...
        subjects: {
          type: coda.ValueType.Array,
          items: { type: coda.ValueType.String }
        },
      },
      // ...
    });
    ```

    </div>
    </section>

=== ":material-numeric-2-circle: Add authors"

    <section class="tutorial-row" markdown>
    <div markdown>

    The API response also includes the authors of the book (there can be more than one), each of which is a rich object:

    ```js
    "authors": [
      {
        "name": "Beeton, Mrs. (Isabella Mary)",
        "birth_year": 1836,
        "death_year": 1865
      }
    ],
    ```

    To represent this, you'll need to define an additional object schema, `AuthorSchema`, and then set this property to be an array of that schema.

    You'll define `AuthorSchema` in the next step, but for now just set it as if it already exists.

    </div>
    <div markdown>

    ```{.ts hl_lines="8-11"}
    const BookSchema = coda.makeObjectSchema({
      properties: {
        // ...
        subjects: {
          type: coda.ValueType.Array,
          items: { type: coda.ValueType.String }
        },
        authors: {
          type: coda.ValueType.Array,
          items: AuthorSchema,
        },
      },
      // ...
    });
    ```

    </div>
    </section>

=== ":material-numeric-3-circle: Define author schema"

    <section class="tutorial-row" markdown>
    <div markdown>

    Just like `BookSchema` must be defined before the sync table where it is used, so must `AuthorSchema` be defined before it is used in `BookSchema`.

    Define the properties for each author to match the data returned in the API, using `fromKey` when you want to expose a different name to users.

    The schema needs `displayProperty` set to determine which property to show in the chip, but it doesn't need `idProperty` set since it's not being used as a sync table row (just a sub-object inside of row).

    </div>
    <div markdown>

    ```{.ts hl_lines="1-14"}
    const AuthorSchema = coda.makeObjectSchema({
      properties: {
        name: { type: coda.ValueType.String },
        born: {
          type: coda.ValueType.Number,
          fromKey: "birth_year",
        },
        died: {
          type: coda.ValueType.Number,
          fromKey: "death_year",
        },
      },
      displayProperty: "name",
    });

    const BookSchema = coda.makeObjectSchema({
      // ...
    });
    ```

    </div>
    </section>

=== ":material-numeric-4-circle: Add thumbnail and link"

    <section class="tutorial-row" markdown>
    <div markdown>

    Next add the thumbnail image for each book, as well as a link to the book on the Project Gutenberg website.

    These fields don't exist in the row data exactly as needed, but you can define "synthetic" properties that you populate manually in the `execute` function (you'll do that in the next step).

    Define a `thumbnail` and `link` property, setting the `codaType` field to instruct Coda to display these as Image URL and Link columns respectively.

    </div>
    <div markdown>

    ```{.ts hl_lines="16-23"}
    const AuthorSchema = coda.makeObjectSchema({
      // ...
    });

    const BookSchema = coda.makeObjectSchema({
      properties: {
        // ...
        subjects: {
          type: coda.ValueType.Array,
          items: { type: coda.ValueType.String }
        },
        authors: {
          type: coda.ValueType.Array,
          items: AuthorSchema,
        },
        thumbnail: {
          type: coda.ValueType.String,
          codaType: coda.ValueHintType.ImageAttachment,
        },
        link: {
          type: coda.ValueType.String,
          codaType: coda.ValueHintType.Url,
        },
      },
      // ...
    });
    ```

    </div>
    </section>

=== ":material-numeric-5-circle: Populate thumbnail and link"

    <section class="tutorial-row" markdown>
    <div markdown>

    The API response includes the thumbnail of the book, nested under the `formats` field:

    ```js
    "formats": {
      // ...
      "image/jpeg": "https://www.gutenberg.org/cache/epub/29728/pg29728.cover.small.jpg",
    },
    ```

    You can't use `fromKey` to reach down into a sub-object, so you'll need to "pull up" this field into the main object.

    As for the link, you can manually construct it using the ID of the book.

    In the formulas `execute` formula loop over each row before returning it, modifying it as needed. When defining these fields, you need to make sure the names match those of the properties defined in the previous step.

    </div>
    <div markdown>

    ```{.ts hl_lines="12-16"}
    execute: async function (args, context) {
      let [topic] = args;
      let baseUrl = "https://gutendex.com/books";
      let url = coda.withQueryParams(baseUrl, {
        topic: topic,
      });
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });
      let rows = response.body.results;
      for (let row of rows) {
        row.thumbnail = row.formats["image/jpeg"];
        row.link =
          "https://www.gutenberg.org/ebooks/" + row.id;
      }
      return {
        result: rows,
      };
    },
    ```

    </div>
    </section>

=== ":material-numeric-6-circle: Set featured columns"

    <section class="tutorial-row" markdown>
    <div markdown>

    Now that you have a bunch of properties in `BookSchema` it's a good idea to set the `featuredProperties` of the schema.

    These are the properties that Coda should automatically display as column in the sync table. All properties are available in the object chip in the first column of the table, but featuring the most important properties makes it easier for users to discover them.

    </div>
    <div markdown>

    ```{.ts hl_lines="11-13"}
    const AuthorSchema = coda.makeObjectSchema({
      // ...
    });

    const BookSchema = coda.makeObjectSchema({
      properties: {
        // ...
      },
      displayProperty: "title",
      idProperty: "bookId",
      featuredProperties: [
        "authors", "subjects", "link", "thumbnail"
      ],
    });
    ```

    </div>
    </section>

---

### Try it out

Let's see how your sync table looks with these additional properties.

<section class="tutorial-row" markdown>
<div markdown>

Rebuild the Pack. Remove the existing **Books** sync table from the doc and drag it in again (featured columns are only used when you first drag in the table). Click **Sync now**.

If everything is working correctly you should have additional columns in your table, correctly populated with the author, subjects, link and thumbnail.

The author column displays as a chip, since it's a rich object itself, and hovering over it reveals the information within.

</div>
<div markdown>

<img src="../../../images/tutorial_sync_table_build2.png" srcset="../../../images/tutorial_sync_table_build2_2x.png 2x" class="screenshot" alt="The resulting sync table with more fields">

</div>
</section>

??? example "View the full code"
    ```ts
    --8<-- "samples/packs/tutorials/sync-table/build2.ts"
    ```


## :material-page-previous-outline: Sync more pages

The sync table is working great, but it still only includes the first 32 results. To get the full set of data you'll need to fetch multiple pages of results from the API.

While you could attempt to do this in a loop, the sync formula can only run for at most one minute, which may not be enough time to fetch all of the pages. Instead you should utilize a feature of sync tables called "continuations".

When the sync formula returns a continuation along with the rows, it tells Coda that the sync isn't complete yet and to run the sync formula again. You can store data in the continuation which will be passed to the next execution, allowing you to continue where you left off.

To tell Coda that the sync is complete simply pass an `undefined` continuation.

=== ":material-numeric-1-circle: Return continuation"

    <section class="tutorial-row" markdown>
    <div markdown>

    If there is another page of results available, this API will include a `next` field in the API response. This field contains the API URL to use to fetch the next page.

    ```js
    "next": "https://gutendex.com/books/?page=2&topic=Cooking",
    ```

    When there are no more pages left, the `next` field will be blank.

    Towards the end of the `execute` function, define an empty (`undefined`) continuation. This will be the fallback, which will stop the sync.

    Then include a test to see if the sync should continue, in this case if the `next` field is not empty. If so, populate the continuation object.

    What to store inside the continuation is completely at your discretion. In this case store the value of the `next` URL, under the key `url`.

    Finally, return the continuation along with the rows at the end of the function.

    </div>
    <div markdown>

    ```{.ts hl_lines="17-22 25"}
    execute: async function (args, context) {
      let [topic] = args;
      let baseUrl = "https://gutendex.com/books";
      let url = coda.withQueryParams(baseUrl, {
        topic: topic,
      });
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });
      let rows = response.body.results;
      for (let row of rows) {
        row.thumbnail = row.formats["image/jpeg"];
        row.link =
          "https://www.gutenberg.org/ebooks/" + row.id;
      }
      let continuation;
      if (response.body.next) {
        continuation = {
          url: response.body.next
        };
      }
      return {
        result: rows,
        continuation: continuation,
      };
    },
    ```

    </div>
    </section>

=== ":material-numeric-2-circle: Read continuation"

    <section class="tutorial-row" markdown>
    <div markdown>

    The Pack is now returning the continuation appropriately, but unless you use the value stored within the Pack will keep fetching the first page of results over and over again.

    The continuation object is passed into the formula in `context.sync.continuation`. This value will be `undefined` for the first execution, and populated for all following executions.

    If it's populated, retrieve the URL saved into it at the end of the last execution. Cast the value as a `string` since that's what you stored in it. Use it instead of the URL constructed above to continue where you left off.

    </div>
    <div markdown>

    ```{.ts hl_lines="7-9"}
    execute: async function (args, context) {
      let [topic] = args;
      let baseUrl = "https://gutendex.com/books";
      let url = coda.withQueryParams(baseUrl, {
        topic: topic,
      });;
      if (context.sync.continuation) {
        url = context.sync.continuation!.url as string;
      }
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });
      let rows = response.body.results;
      for (let row of rows) {
        row.thumbnail = row.formats["image/jpeg"];
        row.link =
          "https://www.gutenberg.org/ebooks/" + row.id;
      }
      let continuation;
      if (response.body.next) {
        continuation = {
          url: response.body.next
        };
      }
      return {
        result: rows,
        continuation: continuation,
      };
    },
    ```

    </div>
    </section>

---

### Try it out

Now that you've added in continuations, see if you can fetch the full set of results.

<section class="tutorial-row" markdown>
<div markdown>

Rebuild the Pack and then click refresh icon (:material-refresh:) in the sync table.

If everything is working correctly you should have more than 32 rows in your sync table.

The Pack maker tools will show multiple executions of the sync formula, with those after the first marked as continuations.

!!! info "Truncated results"
    Sync tables have a maximum number of rows they can store, which varies depending on what Coda plan you are subscribed to. When your sync hits that limit the sync formula will be terminated, even if you returned another continuation.

</div>
<div markdown>

<img src="../../../images/tutorial_sync_table_build3.png" srcset="../../../images/tutorial_sync_table_build3_2x.png 2x" class="screenshot" alt="The resulting sync table with more rows">

</div>
</section>

??? example "View the full code"
    ```ts
    --8<-- "samples/packs/tutorials/sync-table/build3.ts"
    ```

## :material-fast-forward: Next steps

Now that you have an understanding of how to build a sync table, here are some more resources you can explore:

- [Sync tables guide][sync_table] - More in-depth information about how sync tables work.
- [Sample code][samples_sync_table] - A collection of sample Packs that contain sync tables.
- [Schemas guide][schemas] - Designing a schema are a core part of building a sync table, and this guide covers schemas in more depth.


[gutenberg]: https://www.gutenberg.org
[quickstart_web]: ../get-started/web.md
[quickstart_cli]: ../get-started/cli.md
[tutorial_fetcher]: fetcher.md
[gutendex]: https://gutendex.com
[javascript_key_value]: https://javascript.info/object
[sync_table]: ../../guides/blocks/sync-tables/index.md
[samples_sync_table]: ../../samples/topic/sync-table.md
[schemas]: ../../guides/advanced/schemas.md
