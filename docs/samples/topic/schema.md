---
nav: Schemas
description: Samples that show how to define a schema, to represent rich objects.
icon: material/format-list-group
---

# Schema samples

To return structured data in a Pack you must first define the shape of that data using a schema. Schemas describe the type of data that will be returned, as well as metadata about how Coda should render it, but not the data itself. Pack formulas and sync tables specify which schema they are using and return data that matches it.

The most common form of schema you'll need to define are object schemas. They are often used to bundle together multiple pieces of data returned by an API.


[Learn More](../../../guides/advanced/schemas){ .md-button }

## Template (Object Schema)
The basic structure of an object schema.

```ts
{% raw %}
const MySchema = coda.makeObjectSchema({
  properties: {
    property1: { type: coda.ValueType.String },
    property2: { type: coda.ValueType.Number },
    // Add more properties here.
  },
  displayProperty: "property1", // Which property above to display by default.
});
{% endraw %}
```
## For formula
An object schema used by a formula. This sample defines the schema for information about the daylight at a given location.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Define a schema for the information about the daylight at a given location.
const SunSchema = coda.makeObjectSchema({
  properties: {
    daylight: {
      description: "How much daylight there will be.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Duration,
    },
    sunriseUTC: {
      description: "When the sun will rise (in UTC).",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Time,
    },
    sunsetUTC: {
      description: "When the sun will set (in UTC).",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Time,
    },
  },
  // Which of the properties defined above will be shown inside the chip.
  displayProperty: "daylight",
});
{% endraw %}
```
## For sync table
An object schema used by a sync table. This sample defines the schema for the information about a spell in Dungeons and Dragons.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Schema that defines the a spell object.
let SpellSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  properties: {
    name: {
      description: "The spell name.",
      type: coda.ValueType.String,
    },
    description: {
      description: "A description of the spell.",
      type: coda.ValueType.String,
    },
    higher_level: {
      description: "A description for casting the spell at a higher level.",
      type: coda.ValueType.String,
    },
    level: {
      description: "The level of the spell.",
      type: coda.ValueType.Number,
    },
    range: {
      description: "The range of the spell.",
      type: coda.ValueType.String,
    },
    material: {
      description: "The material component for the spell to be cast.",
      type: coda.ValueType.String,
    },
    duration: {
      description: "How long the spell effect lasts.",
      type: coda.ValueType.String,
      // Not using the Duration value hint, since this can contain values like
      // "Instantaneous".
    },
    casting_time: {
      description: "How long it takes for the spell to activate.",
      type: coda.ValueType.String,
      // Not using the Duration value hint, since this can contain values like
      // "1 action".
    },
    attack_type: {
      description: "The attack type of the spell.",
      type: coda.ValueType.String,
    },
    damage_type: {
      description: "The damage type of the spell.",
      type: coda.ValueType.String,
    },
    index: {
      description: "A unique identifier for the spell.",
      type: coda.ValueType.String,
    },
  },
  displayProperty: "name",
  idProperty: "index",
  featuredProperties: ["description", "level", "range"],
});
{% endraw %}
```
## With self-reference
An object schema used by a sync table, that includes a row reference to itself. This sample defines the schema for a task in Todoist, where tasks can have parent tasks.

```ts
{% raw %}
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
    taskId: { type: coda.ValueType.String, required: true },
  },
  displayProperty: "name",
  idProperty: "taskId",
  // For reference schemas, set identity.name the value of identityName on the
  // sync table being referenced.
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
      type: coda.ValueType.String,
      required: true,
    },
    // Add a reference to the sync'ed row of the parent task.
    // References only work in sync tables.
    parentTask: TaskReferenceSchema,
  },
  displayProperty: "name",
  idProperty: "taskId",
  featuredProperties: ["description", "url"],
});
{% endraw %}
```

