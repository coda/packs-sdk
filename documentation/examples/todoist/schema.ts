/* eslint-disable @typescript-eslint/no-unused-vars */
// BEGIN
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// A reference to a synced Task. Usually you can use
// `coda.makeReferenceSchemaFromObjectSchema` to generate these from the primary
// schema, but that doesn't work in this case since a task itself can contain
// a reference to a parent task.
const TaskReferenceSchema = coda.makeObjectSchema({
  codaType: coda.ValueHintType.Reference,
  properties: {
    name: { type: coda.ValueType.String, required: true },
    taskId: { type: coda.ValueType.Number, required: true },
  },
  primaryProperty: "name",
  idProperty: "taskId",
  identity: {
    name: "Task",
  },
});

// A schema defining a Task object.
const TaskSchema = coda.makeObjectSchema({
  properties: {
    name: {
      description: "The name of the task.",
      type: coda.ValueType.String,
      required: true,
    },
    description: {
      description: "A detailed description of the task.",
      type: coda.ValueType.String,
    },
    url: {
      description: "A link to the task in the Todoist app.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
    },
    taskId: {
      description: "The ID of the task.",
      type: coda.ValueType.Number,
      required: true,
    },
    // Add a reference to the sync'ed row of the parent task.
    // References only work in sync tables.
    parentTask: TaskReferenceSchema,
  },
  primaryProperty: "name",
  idProperty: "taskId",
  featuredProperties: ["description", "url"],
  identity: {
    name: "Task",
  },
});
