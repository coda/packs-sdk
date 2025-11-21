---
nav: Actions
description: Use actions to create, update, or delete records in APIs and external data sources.
---

# Add custom actions for buttons and automations

In Coda users can take actions directly within their documents, using native [buttons][help_buttons] and [automations][help_automations]. Packs can provide custom actions which users can use when building out their doc. These actions often use the [fetcher][fetcher] to send data to an external API, but they can also be used for other one-time calculations.

[View Sample Code][samples]{ .md-button }


## Using actions

Actions provided by Packs appear as choices in the button and automation dialogs along-side built-in actions. Actions can also be used in the formula editor for those buttons and automations.

=== "In a button"
    <img src="../../../images/actions_button.png" srcset="../../../images/actions_button_2x.png 2x" class="screenshot" alt="Selecting an action for a button">
=== "In an automation"
    <img src="../../../images/actions_automation.png" srcset="../../../images/actions_automation_2x.png 2x" class="screenshot" alt="Selecting an action for an automation">
=== "In the formula editor"
    <img src="../../../images/actions_formula.png" srcset="../../../images/actions_formula_2x.png 2x" class="screenshot" alt="Using actions in the formula editor.">


## Creating actions

Actions are just a special type of formula, and to create an action simply add a formula to your Pack with the property `isAction: true`.

```ts
pack.addFormula({
  name: "DoSomething",
  description: "Does something neat.",
  isAction: true,
  execute: async function ([], context) {
    // ...
  },
});
```

If you aren't already familiar with creating formulas, read the [Formulas guide][formulas] first. The rest of this guide will clarify how action formulas differ from calculation formulas.


## Naming

Like all formulas, action formula names can only contain letters, numbers, and underscores. We also recommend following these conventions:

- Select a verb-noun pair that corresponds to the corresponding action and target of the action. For example, `DeleteFile` or `AddTask`.<br>
  {: .yes}
- If you Pack primarily works with a single type of item, you may omit the noun. For example, `Tweet` or `MarkComplete`.<br>
  {: .yes}
- For multiple words, use upper camel case. For example, `SendEmail` or `CreateBugReport`.
  {: .yes}
- Don't include the Pack name in the name of the column format. For example, use `CreateTask` instead of `CreateTodoistTask`.
  {: .no}

!!! warning
    Changing the name of an action formula will break any existing docs that use it. When creating your Pack select your names carefully.


## Parameters

Parameters in actions work the same as they do in other formulas, but may appear differently depending on the context. The button and automation configuration dialogs by default will present the parameters as input boxes, although the user has the option to switch the formula editor as well. See the [Parameters guide][parameters] for more information and examples.


## Results

Although actions are typically used to send data rather than calculate a value, like all formulas they are required to return a result. When the action is used by a button in a table column, the result can be stored in another column of the same table. This allows other formulas or conditional formatting to check that column and know when the action is complete.

If your action is creating an item in an external API you could return the URL or ID of the new item.

```ts
pack.addFormula({
  name: "AddThing",
  description: "Add a new thing.",
  resultType: coda.ValueType.String,
  isAction: true,
  execute: async function ([], context) {
    let response = await context.fetcher.fetch({ method: "POST", url: "..." });
    // Return values are optional but recommended. Returning a URL or other
    // unique identifier is recommended when creating a new entity.
    return response.body.url;
  },
});
```

In some cases there is no meaningful result, in which case the convention is to return the string "OK". See the [Data types guide][data-types] for more information on the type of values that can be returned.


## Authentication

Actions can use authentication to access private resources, but unlike other formulas they aren't required to always use a specific user account. For actions, the account parameter will include the special option "User's private account". When this option is selected, each user that presses the button will take the action using one of their connected accounts, or be prompted to create an account if they don't have one set up already.

<img src="../../../images/actions_private_account.png" srcset="../../../images/actions_private_account_2x.png 2x" class="screenshot" alt="Private account option for actions">


## Caching & recalculation

Unlike other formulas, actions are never cached or automatically recalculated. The action is only run when the button is pressed or automation triggered, and the code is run each time, even if the inputs haven't changed.


## Update sync table rows {:#sync}

It's common for a Pack to have a [sync table][sync_table] that brings in records from an external API, and an action that allows the user to update those records. The changes made by the action will be reflected in the table the next time it syncs, but you can update the row immediately by selecting the correct return value for your formula.

If an action formula returns a [schema][schemas] with an identity matching an existing sync table, Coda will look up the corresponding row in the table and update it with the returned object. Use the helper function `coda.withIdentity()` to add the identity information to the schema.

```ts
const TaskSchema = coda.makeObjectSchema({
  // ...
});

pack.addSyncTable({
  name: "Tasks",
  schema: TaskSchema,
  identityName: "Task",
  // ...
});

pack.addFormula({
  name: "UpdateTask",
  description: "Updates the name of a task.",
  // ...
  resultType: coda.ValueType.Object,
  schema: coda.withIdentity(TaskSchema, "Task"),
  isAction: true,
  execute: async function ([taskId, name], context) {
    // Call the API to update the task and get back the updated content.
    let task = updateTask(taskId, name, context);
    // The existing row will be updated with this value.
    return task;
  },
});
```

The returned object is merged into the existing row, such that any top-level properties that are undefined or null in the response will retain their previously synced value. It currently isn't possible to reset a top-level property to a blank state.

[View Sample Code][samples_action_todoist]{ .md-button }


### Handling dynamic schemas {: #dynamic-schemas}

Action formulas must declare the schema of the object they return, which presents a challenge when trying to update rows in sync tables that use the `getSchema` method to [dynamically generate their schemas][getSchema]. It's possible to work around this incompatibility however, as long as there is a predictable `idProperty` for the dynamic schema.

Create a "base schema" for your action formula to use, which at a minimum includes an `idProperty` (and the corresponding property definition). Additionally, set the schema field [`includeUnknownProperties`][includeUnknownProperties] to true. This tells Coda not to strip out extra data in the response that doesn't match a defined property, allowing it to flow through to the sync table.

```ts
const BaseTaskSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String },
  },
  idProperty: "id",
  includeUnknownProperties: true,
});

pack.addSyncTable({
  name: "Tasks",
  schema: BaseTaskSchema,
  identityName: "Task",
  dynamicOptions: {
    getSchema: async function (context) {
      // Extend BaseTaskSchema with additional properties.
    },
  },
  // ...
});

pack.addFormula({
  name: "UpdateTask",
  // ...
  resultType: coda.ValueType.Object,
  schema: coda.withIdentity(BaseTaskSchema, "Task"),
  isAction: true,
  execute: async function ([taskId, name], context) {
    let task = updateTask(taskId, name, context);
    // Return the updated task, which can include values corresponding to the
    // dynamic properties.
    return task;
  },
});
```

!!! warning "Remove unused fields"
    When you enable the `includeUnknownProperties` feature, all of the data returned by the formula or sync table ends up in the object chip, even when it doesn't match any schema property in the sync table. Only the fields corresponding to properties will be available to "dot" into in the Coda formula language however. You should therefore remove any data from the API response that you don't intend the user to see.


### Handling dynamic URLs

Dynamic sync tables have dynamic schemas, and therefore need to use the technique [described above](#dynamic-schemas) to update their rows from an action. However they have the additional complication that they are not uniquely identified by an `identityName` alone, but in combination with their specific dynamic URL. While it is possible to set the `identity.dynamicUrl` field of the schema, hardcoding it to a specific URL isn't likely to be useful.

While there is no solution for the general case, there is for the common case where a button appears in a column of the same table. As long as the `identity.name` of the schema matches that of the dynamic sync table containing the button, the dynamic URL will be automatically populated and the row update will work. Using that same action elsewhere in the doc however will not update the existing row.


[help_buttons]: https://help.coda.io/en/articles/2033889-overview-of-buttons
[help_automations]: https://help.coda.io/en/articles/2423860-automations-in-coda
[fetcher]: ../basics/fetcher.md
[samples]: ../../samples/topic/action.md
[formulas]: formulas.md
[parameters]: ../basics/parameters/index.md
[data-types]: ../basics/data-types.md
[sync_table]: sync-tables/index.md
[schemas]: ../advanced/schemas.md
[two_way_sync]: ../advanced/two-way-sync.md
[data_type_object]: ../basics/data-types.md#objects
[getSchema]: ../blocks/sync-tables/dynamic.md#get-schema
[includeUnknownProperties]: ../../reference/sdk/core/interfaces/ObjectSchemaDefinition.md#includeunknownproperties
[samples_action_todoist]: ../../samples/topic/action.md#update-row-in-sync-table
