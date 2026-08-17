---
nav: Design guidance
description: How to design your connector so that it's easy to use and support.
---

# Design your connector

Connectors don't include traditional user interface elements like dialogs or sidebars. Instead your building blocks are reached through each product's existing interfaces.

- **:superhuman-go: Go** — Go calls them while working through a task.
- **:superhuman-docs: Docs** — Users reach them from places like the formula editor.

However there are still many subtle design choices to make when building your connector, and they can have a real impact on usability. This page aims to provide the guidance you need to create a connector that meets the needs and expectations of Superhuman users.


## General guidance

No matter what kind of connector you are building, there are some basic rules to keep in mind.


### Build building blocks

Unlike other types of integrations, a connector doesn't prescribe an exact end-to-end experience. Instead it provides a new set of building blocks that get combined in ways you don't control.

- **:superhuman-go: Go** — Go chains them together to satisfy a request.
- **:superhuman-docs: Docs** — Users assemble them into their own docs.

These building blocks need to provide sufficient flexibility so that they can be combined in novel and bespoke ways.

- Prefer parameters over hard-coding specific patterns.
  {: .yes}
- Return [structured data][data_types], so the results can be chained together.
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

### Design around use cases

Build your building blocks around the things people actually do with the product. A single building block should accomplish a task someone would recognize, even when that takes several API calls behind the scenes. This pays off in both products.

- **:superhuman-go: Go** — Go has fewer opportunities to chain calls together incorrectly.
- **:superhuman-docs: Docs** — A user reaches for one formula instead of assembling three.

An API is organized around how a service stores its data, so a thin wrapper with one building block per endpoint is usually the wrong shape. Think of the connector as an extension of the product's user experience, focussing on the key data and tasks that users care about.

- Combine the API calls that make up a single task into one building block.
  {: .yes}
- Name building blocks after what someone is trying to accomplish, not the endpoint behind them.
  {: .yes}
- Avoid using technical jargon when naming building blocks, parameters, or outputs.
  {: .no}
- Hide implementation details, like API versions and payload formats.
  {: .no}

<section class="tutorial-row" markdown>
<div markdown>
!!! failure "Don't"
    ```
    CreateCustomerRecord("Acme")
    CreateOwnerRecord("v2",
      "{\"email\": \"ada@acme.com\"}")
    LinkOwnerToCustomer(customerId, ownerId)
    ```
</div>
<div markdown>
!!! success "Do"
    ```
    AddCustomer("Acme", "ada@acme.com")
    ```
</div>
</section>


### Less is more

Developers love to have expansive APIs that provide complete access to all features, but too much choice causes problems in both products.

- **:superhuman-go: Go** — It's harder for Go to pick the right building block for a task.
- **:superhuman-docs: Docs** — Users are overwhelmed by the number of options.

When designing a connector, focus on the 20% of functionality that will meet the needs of 80% of your users. Omit more advanced options or features at first, addressing them if/when there is sufficient demand.

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

When building a connector you don't need to worry about name collisions, and accessibility is more important than completeness or accuracy. When choosing a name, prefer simple nouns or verbs and remove any extraneous detail.

- Don't include the connector or company name.
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


### Write clear descriptions

Every building block has a `description` field, and the value you set there has an impact on it's usability.

- **:superhuman-go: Go** — The LLM reads descriptions to decide which building block to call and how to fill in its parameters.
- **:superhuman-docs: Docs** — They become the documentation users see while working with your connector.

Setting detailed descriptions has benefits in both cases, and it's worth investing time in writing good ones.

- Say what the building block does and when someone would reach for it, not how it's implemented.
  {: .yes}
- Add descriptions for parameters and schemas as well, making it clear what data needs to be passed in and what data is returned.
  {: .yes}

<section class="tutorial-row" markdown>
<div markdown>
!!! failure "Don't"
    ```
    name: "Tasks",
    description: "Tasks",
    ```
</div>
<div markdown>
!!! success "Do"
    ```
    name: "Tasks",
    description: `
      Lists the tasks in a project, optionally
      limited to those due within a given time
      frame.
    `,
    ```
</div>
</section>


## API Integration

A common use case for connectors is integrating with another application or service using their API. While each integration is unique, there are certain patterns and conventions that can be useful to understand. This section includes some tips for designing a connector around an existing API.


### Check for an MCP server

!!! go "Go only"

    MCP servers are only supported in :superhuman-go: Go.

Before designing tools by hand, check whether the service already publishes a hosted [MCP server][mcp]. Connecting to one gives Go that service's tools without you defining any of them, and the service keeps them current as their API changes. It's the shortest path to a working integration.

Build the tools yourself when there's no MCP server available, when the connector also needs to work in :superhuman-docs: Docs, or when you want to expose a smaller and more focused set of tools than the server provides. The rest of this section covers that case.


### Select collections

Most REST APIs are organized into collections, usually corresponding specific types of items in the application. An API can contain dozens of collections, but as per the general guidance above it's best to start with the handful of core ones that are most valuable to users.

??? example "Example: Todoist"

    The [Todoist API][todoist_reference] includes collections for Projects, Sections, Tasks, Comments, and Labels. While a power user may want to leverage all of that information, for most users Projects and Tasks are the core entities they'll want to work with.


### Design the schema

Examine the data returned for each item in the collection and determine what to expose. Select the fields most important to users and start there. You can always add more fields later without breaking anything.

When designing your schema, select user-friendly names for your properties. The field in the API may use technical terminology or refer to an older name no longer in use by the product.

??? example "Example: Todoist task schema"

    The Todoist API returns up to 20 fields for a task, but for most use cases only a few are required. Additionally the name "content" is replaced with "name".

    === "API response"
        ```json
        --8<-- "samples/packs/todoist/simple.ts:json"
        ```
    === "Schema"
        ```ts
        --8<-- "samples/packs/todoist/simple.ts:schema"
        ```


### Add building blocks

For each collection, add a set of building blocks that allow users to work with them. Which ones to prioritize depends on where your connector runs.

- **:superhuman-go: Go** — Start with formulas and actions, which become tools Go can call directly. Sync tables help when Go needs to search across a whole collection, but they're a larger investment.
- **:superhuman-docs: Docs** — Start with a sync table, which puts the whole collection in front of users, then add formulas and actions around it.

The exact set may vary from collection to collection, so use the guidance below as a starting point.

=== "Formula"

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

=== "Action"

    !!! abstract "Requirements"
        - [x] The API has a endpoints for manipulating the collection, for instance:
            - Creating an item (ex: `POST /tasks`)
            - Updating an item (ex: `PUT /tasks/123`)
            - Deleting an item (ex: `DELETE /tasks/123`)
            - Performing a custom action (ex: `POST /tasks/123:notify`)

    An [action formula][actions] lets items be updated from within Superhuman. Any API calls that have side effects (change the state of the app being integrated with) should be exposed as action formulas, since regular formulas can be re-executed at any time and aren't gated behind a user confirmation.

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

=== "Sync table"

    !!! abstract "Requirements"
        - [x] The API has an endpoint for retrieving all the items in the collection (ex: `GET /tasks`).

    A [sync table][sync_tables] brings a whole collection into Superhuman and keeps it up to date. In :superhuman-go: Go the records also need to be [indexed][indexing] before they can be searched.

    - If the API endpoint support filtering the results, consider exposing those as parameters on the sync table to allow for faster, more targeted syncs.
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


[data_types]: ./basics/data-types.md
[parameters_optional]: ./basics/parameters/index.md#optional-parameters
[sync_tables]: ./blocks/sync-tables/index.md
[indexing]: ./blocks/sync-tables/indexing/index.md
[sync_table_continuations]: ./blocks/sync-tables/index.md#longrunning
[formulas]: ./blocks/formulas.md
[actions]: ./blocks/actions.md
[mcp]: ./blocks/mcp.md
[todoist_reference]: https://developer.todoist.com/rest/v2/#overview
[formulas_naming]: ./blocks/formulas.md#naming
[actions_naming]: ./blocks/actions.md#naming
[sync_tables_naming]: ./blocks/sync-tables/index.md#naming
