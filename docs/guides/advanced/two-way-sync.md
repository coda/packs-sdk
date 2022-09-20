---
nav: Two-way sync
description: Use actions to update records and reflect those updates in a sync table.
---

# Approximating two-way sync

The sync process used by sync tables is one-way only; data is pulled in from an external source and is displayed in a read-only column. It's not possible to directly edit the items in the sync table and sync the changes back out.

You can approximate a two-way sync however using a combinations of additional columns, buttons, and [custom actions][actions]. While most of the setup is at the doc-level, it does require that you build certain features into your Pack.


## Actions updating sync table rows

An action can update a record in an external API, but it won't be reflected in the sync table until the next time it syncs. To update the corresponding row immediately, have your action return an [Object][data_type_object] representing the updated state of the row.

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
    taskId: { type: coda.ValueType.String },
  },
  idProperty: "taskId",
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


[actions]: ../blocks/actions.md
[data_type_object]: ../basics/data-types.md#objects
[schemas]: schemas.md
[getSchema]: ../blocks/sync-tables/dynamic.md#get-schema
[includeUnknownProperties]: ../../reference/sdk/interfaces/core.ObjectSchemaDefinition.md#includeunknownproperties
[samples_action_todoist]: ../../samples/topic/action.md#update-row-in-sync-table
