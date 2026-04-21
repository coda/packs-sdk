/* eslint-disable @typescript-eslint/no-unused-vars */
// BEGIN
import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// A reference to a synced Task. Usually you can use
// `sdk.makeReferenceSchemaFromObjectSchema` to generate these from the primary
// schema, but that doesn't work in this case since a task itself can contain
// a reference to a parent task.
const TaskReferenceSchema = sdk.makeObjectSchema({
  codaType: sdk.ValueHintType.Reference,
  properties: {
    name: { type: sdk.ValueType.String, required: true },
    id: { type: sdk.ValueType.String, required: true },
  },
  displayProperty: "name",
  idProperty: "id",
  // For reference schemas, set identity.name the value of identityName on the
  // sync table being referenced.
  identity: {
    name: "Task",
  },
});

// A schema defining a Task object.
const TaskSchema = sdk.makeObjectSchema({
  properties: {
    name: {
      description: "The name of the task.",
      type: sdk.ValueType.String,
      required: true,
    },
    description: {
      description: "A detailed description of the task.",
      type: sdk.ValueType.String,
    },
    url: {
      description: "A link to the task in the Todoist app.",
      type: sdk.ValueType.String,
      codaType: sdk.ValueHintType.Url,
    },
    id: {
      description: "The ID of the task.",
      type: sdk.ValueType.String,
      required: true,
    },
    // Add a reference to the sync'ed row of the parent task.
    // References only work in sync tables.
    parentTask: TaskReferenceSchema,
  },
  displayProperty: "name",
  idProperty: "id",
  featuredProperties: ["description", "url"],
});
