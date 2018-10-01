import {PackId} from './types';
import {ensureUnreachable} from './helpers/ensure';
import pascalcase from 'pascalcase';

// Defines a subset of the JSON Object schema for use in annotating API results.
// http://json-schema.org/latest/json-schema-core.html#rfc.section.8.2

export enum ValueType {
  Boolean = 'boolean',
  Number = 'number',
  String = 'string',
  Array = 'array',
  Object = 'object',
  // Synthetic types we will use to coerce values.
  Date = 'date',
  Image = 'image',
  Url = 'url',
  Markdown = 'markdown',
  Html = 'html',
}

export type StringHintTypes = ValueType.Image | ValueType.Date | ValueType.Url | ValueType.Markdown | ValueType.Html;

interface BaseSchema {
  description?: string;
}

export interface BooleanSchema extends BaseSchema {
  type: ValueType.Boolean;
}

export interface NumberSchema extends BaseSchema {
  type: ValueType.Number;
  codaType?: ValueType.Date;
}

export interface StringSchema extends BaseSchema {
  type: ValueType.String;
  codaType?: StringHintTypes;
}

export interface ArraySchema extends BaseSchema {
  type: ValueType.Array;
  items: Schema;
}

interface ObjectSchemaProperties {
  [key: string]: Schema & {
    primary?: boolean;
    fromKey?: string;
    required?: boolean;
  };
}

export enum AttributionNodeType {
  Text = 1,
  Link,
  Image,
}

interface TextAttributionNode {
  type: AttributionNodeType.Text;
  text: string;
}

interface LinkAttributionNode {
  type: AttributionNodeType.Link;
  url: string;
  anchorText: string;
}

interface ImageAttributionNode {
  type: AttributionNodeType.Image;
  url: string;
}

type AttributionNode = TextAttributionNode | LinkAttributionNode | ImageAttributionNode;

export interface ObjectSchema {
  type: ValueType.Object;
  properties: ObjectSchemaProperties;
  identity?: {
    packId: PackId;
    name: string;
    attribution?: AttributionNode[];
  };
}

export type Schema = BooleanSchema | NumberSchema | StringSchema | ArraySchema | ObjectSchema;

export function isObject(val?: Schema): val is ObjectSchema {
  return Boolean(val && val.type === ValueType.Object);
}

export function isArray(val?: Schema): val is ArraySchema {
  return Boolean(val && val.type === ValueType.Array);
}

type UndefinedAsOptional<T extends object> = Partial<T> &
  Pick<T, {[K in keyof T]: undefined extends T[K] ? never : K}[keyof T]>;

export type SchemaType<T extends Schema> = T extends BooleanSchema
  ? boolean
  : (T extends NumberSchema
      ? number
      : (T extends StringSchema
          ? (T['codaType'] extends ValueType.Date ? Date : string)
          : (T extends ArraySchema ? ArraySchemaType<T> : (T extends ObjectSchema ? ObjectSchemaType<T> : never))));
interface ArraySchemaType<T extends ArraySchema> extends Array<SchemaType<T['items']>> {}
type ObjectSchemaType<T extends ObjectSchema> = UndefinedAsOptional<
  {
    [K in keyof T['properties']]: T['properties'][K] extends {required: true}
      ? (SchemaType<T['properties'][K]>)
      : (SchemaType<T['properties'][K]> | undefined)
  }
>;

export type ValidTypes = boolean | number | string | object | boolean[] | number[] | string[] | object[];
export function generateSchema(obj: ValidTypes): Schema {
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      throw new Error('Must have representative value.');
    }
    return {type: ValueType.Array, items: generateSchema(obj[0])};
  }

  if (typeof obj === 'object') {
    const properties: {[key: string]: Schema} = {};
    if (obj === null) {
      throw new Error('No nulls allowed.');
    }
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        properties[key] = generateSchema((obj as any)[key]);
      }
    }
    return {type: ValueType.Object, properties};
  } else if (typeof obj === 'string') {
    return {type: ValueType.String};
  } else if (typeof obj === 'boolean') {
    return {type: ValueType.Boolean};
  } else if (typeof obj === 'number') {
    return {type: ValueType.Number};
  }
  return ensureUnreachable(obj);
}

export function makeSchema<T extends Schema>(schema: T): T {
  return schema;
}

export function normalizeSchema(schema: Schema): Schema {
  if (isArray(schema)) {
    return {
      type: ValueType.Array,
      items: normalizeSchema(schema.items),
    };
  } else if (isObject(schema)) {
    const normalized: ObjectSchemaProperties = {};
    for (const key of Object.keys(schema.properties)) {
      const normalizedKey = pascalcase(key);
      const props = schema.properties[key];
      const {primary, required, fromKey} = props;
      normalized[normalizedKey] = Object.assign(normalizeSchema(props), {
        primary,
        required,
        fromKey: fromKey || (normalizedKey !== key ? key : undefined),
      });
    }
    return {type: ValueType.Object, properties: normalized, identity: schema.identity};
  }
  return schema;
}
