---
nav: Design guidance
description: How to design your Pack so that it's easy to use and support.
---

# Design your Pack

Coda Packs don't include traditional user interface elements like dialogs or sidebars. Instead users interact with your building blocks using standard Coda interfaces, like the formula editor. However there are still many subtle design choices to make when building your Pack, and they can have a real impact on usability.

This page aims to provide the guidance you need to create a Pack that meets the needs and expectations of Coda users.


## General guidance

No matter what kind of Pack you are building, there are some basic rules to keep in mind.


### Build building blocks

Unlike other types of integrations, a Coda Pack doesn’t prescribe an exact end-to-end experience. Instead it provides a new set of building blocks, like formulas or buttons, that a user can deploy to improve their docs. These building blocks need to provide sufficient flexibility so that they can be combined in novel and bespoke ways.

- Prefer parameters over hard-coding specific patterns.
  {: .yes}
- Return [structured data][data_types], so users can chain formulas together.
  {: .yes}

<section class="tutorial-row" markdown>
<div markdown>
!!! failure "Don't"
    ```
    TasksDueWithin7Days() =>

    <ul>
      <li>Send out TPS report - Monday</li>
      <li>Complete training - Wednesday</li>
      <li>Organize team lunch - Friday</li>
    </ul>
    ```
</div>
<div markdown>
!!! success "Do"
    ```
    Tasks(dueWithin: Duration(7)) =>

    [
      {
        description: "Send out TPS report",
        due: "2023-02-20",
      }
      // etc...
    ]
    ```

</div>
</section>

 While building blocks offer great flexibility, you'll still want to show users how to apply them. When you publish, make sure to create a [featured doc][best_practices_featured_doc] that includes some key use cases and demonstrates how your Pack can address them.


### Build for users

The target user for your Pack is akin to a skilled spreadsheet user: they know how to use formulas and think about data, but they likely aren’t developers. When designing your Pack make sure it’s approachable to someone with this level of technical fluency.

When building a Pack that integrates with another application, the simplest approach is to create a thin wrapper on their API. However this may introduce terms and patterns not familiar to non-developers. Instead think of the Pack as an extension of the user experience, but translated from pixels to formulas.

- Avoid using technical jargon when naming build blocks, parameters, or outputs.
  {: .no}
- Hide implementation details from the user, like API versions.
  {: .no}
- Don’t require users to understand technical formats like JSON, XML, etc.
  {: .no}

<section class="tutorial-row" markdown>
<div markdown>
!!! failure "Don't"
    ```
    InsertNewProjectRecord("v5",
      "{\"name\": \"My project\"}")
    ```
</div>
<div markdown>
!!! success "Do"
    ```
    CreateProject("My project")
    ```
</div>
</section>


### Less is more

Developers love to have expansive APIs that provide complete access to all features, but too much choice can be overwhelming for a Pack user. When designing a Pack, focus on the 20% of functionality that will meet the needs of 80% of your users. Omit more advanced options or features at first, addressing them if/when there is sufficient demand.

- Omit obscure advanced options, preferring instead sensible defaults that work well in the majority of cases.
  {: .no}
- Put the most important parameters first, and use [optional parameters][parameters_optional] when a value is not strictly required.
  {: .yes}

<section class="tutorial-row" markdown>
<div markdown>
!!! failure "Don't"
    ```
    AddTask(project, task, labels, reccurence,
      workflow, dueDate)
    ```
</div>
<div markdown>
!!! success "Do"
    ```
    AddTask(task, project, [dueDate])
    ```
</div>
</section>


### Use simple names

When building a Pack you don’t need to worry about name collisions, and accessibility to users is more important than completeness or accuracy. When choosing a name, prefer simple nouns or verbs and remove any extraneous detail.

- Don’t include the Pack or company name.
  {: .no}
- Avoid unnecessary detail in names, unless required to distinguish them.
  {: .no}
- Use names that sound more like ordinary speech.
  {: .yes}
- Prefer single nouns or verbs when feasible.
  {: .yes}

<section class="tutorial-row" markdown>
<div markdown>
!!! failure "Don't"
    ```
    AcmeTasksListAllTasks()
    AcmeTasksCreateFromScannedImageUpload()
    AcmeTasksSetAssignee()
    ```
</div>
<div markdown>
!!! success "Do"
    ```
    Tasks()
    AddFromPhoto()
    Reassign()
    ```
</div>
</section>

You can find more best practices for naming building blocks in the guides for [formulas][formulas_naming], [actions][actions_naming], and [sync tables][sync_tables_naming].


## API Integration

A common use case for Packs is integrating with another application or service using their API. While each integration is unique, there are certain patterns and conventions that can be useful to understand. This section includes some tips for designing a Pack around an existing API.


### Select collections

Most REST APIs are organized into collections, usually corresponding specific types of items in the application. An API can contain dozens of collections, but as per the general guidance above it's best to start with the handful of core ones that are most valuable to users.

??? example "Example: Todoist"

    The [Todoist API][todoist_reference] includes collections for Projects, Sections, Tasks, Comments, and Labels. While a power user may want to leverage all of that information, for most users Projects and Tasks are the core entities they'll want to work with.


### Design the schema

Examine the data returned for each item in the collection and determine what to expose to users in Coda. Select the fields most important to users and start there. You can always add more fields later without breaking anything.

When designing your schema, select user-friendly names for your properties. The field in the API may use technical terminology or refer to an older name no longer in use by the product.

??? example "Example: Todoist task schema"

    The Todoist API returns up to 20 fields for a task, but for most use cases only a few are required. Additionally the name "content" is replaced with "name", and the field "id" renamed to "taskId".

    === "API response"
        ```json
        --8<-- "samples/packs/todoist/simple.ts:json"
        ```
    === "Schema"
        ```ts
        --8<-- "samples/packs/todoist/simple.ts:schema"
        ```


### Add building blocks

For each collection, add a set of building blocks that allow users to work with them. The exact set of building blocks may vary from collection to collection, and use the guidance below as a starting point.

=== ":material-numeric-1-circle: Sync table"

    !!! abstract "Requirements"
        - [x] The API has an endpoint for retrieving all the items in the collection (ex: `GET /tasks`).

    A [sync table][sync_tables] exposes a collection as a special Coda table, allowing users to work with large sets of data using familar conventions.

    - If the API endpoint support filtering the results, consider exposing those as parameters on the sync table to allow for faster, more targetted syncs.
    - If the API paginates the results, use [continuations][sync_table_continuations] to spread the requests over multiple executions and avoid timeouts.

    ??? example "Example: Todoist `Tasks` sync table"

        ```
        GET https://api.todoist.com/rest/v2/tasks?
            project_id=<project ID>&
            section_id=<section ID>&
            label=<label name>&
            filter=<filter string>&
            lang=<language code>&
            ids=<list of IDs>
        ```

        ```ts
        --8<-- "samples/packs/todoist/simple.ts:sync"
        ```

=== ":material-numeric-2-circle: Formula"

    !!! abstract "Requirements"
        - [x] The API has an endpoint for retrieving a specific item by ID (ex: `GET /tasks/123`).
        - [x] The ID of an item is user-visible (or can be obtained from a user-visible URL).

    A "getter" [formula][formulas] allows users to retrieve the details of a specific item, which can then be composed with other formulas or tables.

    - The formula should take the ID and/or URL as a parameter, and return an object matching the defined schema.

    ??? example "Example: Todoist `Task()` formula"

        ```
        GET https://api.todoist.com/rest/v2/tasks/<taskId>
        ```

        ```ts
        --8<-- "samples/packs/todoist/simple.ts:sync"
        ```

=== ":material-numeric-3-circle: Column format"

    !!! abstract "Requirements"
        - [x] The Pack has a "getter" formula (previous section) that only requires a single parameter.

    A [column format][column_formats] makes it easier for users to work with items in tables, enriching simple values with rich data.

    - If the formula accepts a URL, add a matcher for the URL pattern so the column format can be automatically applied.

    ??? example "Example: Todoist `Task` column format"

        ```ts
        --8<-- "samples/packs/todoist/simple.ts:format"
        ```

=== ":material-numeric-4-circle: Action formulas"

    !!! abstract "Requirements"
        - [x] The API has a endpoints for manipulating the collection, for instance:
            - Creating an item (ex: `POST /tasks`)
            - Updating an item (ex: `PUT /tasks/123`)
            - Deleting an item (ex: `DELETE /tasks/123`)
            - Performing a custom action (ex: `POST /tasks/123:notify`)

    An [action formula][actions] allows users to update the items from within their Coda doc, either in buttons or automations. Any API calls that have side effects (change the state of the app being integrated with) should be exposed as action formulas, as regular formulas can be executed at any time by the formula engine.

    - When creating or updating items, use optional parameters to capture the values for individual fields.
    - In addition to a generic update action, consider adding streamlined action formulas for common tasks (ex: `Reassign`, `ChangeAddress`, etc.).

    ??? example "Example: Todoist `AddTask()` action formula"

        ```
        POST https://api.todoist.com/rest/v2/tasks
        {
          "content": "Buy milk"
        }
        ```

        ```ts
        --8<-- "samples/packs/todoist/simple.ts:action"
        ```


[data_types]: ./basics/data-types.md
[parameters_optional]: ./basics/parameters/index.md#optional-parameters
[sync_tables]: ./blocks/sync-tables/index.md
[sync_table_continuations]: ./blocks/sync-tables/index.md#longrunning
[formulas]: ./blocks/formulas.md
[column_formats]: ./blocks/column-formats.md
[actions]: ./blocks/actions.md
[todoist_reference]: https://developer.todoist.com/rest/v2/#overview
[best_practices_featured_doc]: https://coda.io/@joebauer/best-practices-for-launching-your-pack/building-a-great-doc-for-your-pack-15
[formulas_naming]: ./blocks/formulas.md#naming
[actions_naming]: ./blocks/actions.md#naming
[sync_tables_naming]: ./blocks/sync-tables/index.md#naming
