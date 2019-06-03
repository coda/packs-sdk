import {$Omit} from './type_utils';
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
  Email = 'email',
  Percent = 'percent',
  Currency = 'currency',
  Image = 'image',
  Url = 'url',
  Markdown = 'markdown',
  Html = 'html',
  Embed = 'embed',
}

type StringHintTypes =
  | ValueType.Date
  | ValueType.Email
  | ValueType.Embed
  | ValueType.Html
  | ValueType.Image
  | ValueType.Markdown
  | ValueType.Url
  ;
export type NumberHintTypes = ValueType.Date | ValueType.Percent | ValueType.Currency;

interface BaseSchema {
  description?: string;
}

export interface BooleanSchema extends BaseSchema {
  type: ValueType.Boolean;
}

export interface NumberSchema extends BaseSchema {
  type: ValueType.Number;
  codaType?: NumberHintTypes;
}

export interface StringSchema extends BaseSchema {
  type: ValueType.String;
  codaType?: StringHintTypes | $Omit<Identity, 'attribution'>;
}

export interface ArraySchema extends BaseSchema {
  type: ValueType.Array;
  items: Schema;
}

export interface ObjectSchemaProperty {
  // TODO(alexd): Remove these once we've hoisted these up.
  id?: boolean;
  primary?: boolean;
  fromKey?: string;
  required?: boolean;
}

interface ObjectSchemaProperties {
  [key: string]: Schema | (Schema & ObjectSchemaProperty);
}

export type GenericObjectSchema = ObjectSchema<string>;

export interface Identity {
  packId: PackId;
  name: string;
  attribution?: AttributionNode[];
}

export interface ObjectSchema<K extends string> extends BaseSchema {
  type: ValueType.Object;
  properties: ObjectSchemaProperties & {[k in K]: Schema | (Schema & ObjectSchemaProperty)};
  id?: K;
  primary?: K;
  featured?: K[];
  identity?: Identity;
}

export interface SyncObjectSchema<K extends string> extends ObjectSchema<K> {
  id: K;
  primary: K;
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
  anchorUrl: string;
  anchorText: string;
}

interface ImageAttributionNode {
  type: AttributionNodeType.Image;
  anchorUrl: string;
  imageUrl: string;
}

type AttributionNode = TextAttributionNode | LinkAttributionNode | ImageAttributionNode;
export function makeAttributionNode<T extends AttributionNode>(node: T): T {
  return node;
}

export type Schema = BooleanSchema | NumberSchema | StringSchema | ArraySchema | ObjectSchema<string>;

export function isObject(val?: Schema): val is ObjectSchema<string> {
  return Boolean(val && val.type === ValueType.Object);
}

export function isArray(val?: Schema): val is ArraySchema {
  return Boolean(val && val.type === ValueType.Array);
}

type UndefinedAsOptional<T extends object> = Partial<T> &
  Pick<T, {[K in keyof T]: undefined extends T[K] ? never : K}[keyof T]>;

// NOTE(oleg): recursive types currently break due to https://github.com/Microsoft/TypeScript/issues/30188
// so we don't support resolution of union types or arrays beyond the first layer.
export type SchemaType<T extends Schema> = T extends ArraySchema
  ? Array<TerminalSchemaType<T['items']>>
  : (T extends ObjectSchema<string> ? ObjectSchemaType<T> : TerminalSchemaType<T>);
type TerminalSchemaType<T extends Schema> = T extends BooleanSchema
  ? boolean
  : (T extends NumberSchema
    ? number
    : (T extends StringSchema
      ? (T['codaType'] extends ValueType.Date ? Date : string)
      : (T extends ArraySchema
        ? any[]
        : (T extends ObjectSchema<string> ? {[K in keyof T['properties']]: any} : never))));
type ObjectSchemaType<T extends ObjectSchema<string>> = UndefinedAsOptional<
  {
    [K in keyof T['properties']]: T['properties'][K] extends Schema & {required: true}
    ? (TerminalSchemaType<T['properties'][K]>)
    : (TerminalSchemaType<T['properties'][K]> | undefined)
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
    return {type: ValueType.Object, properties} as ObjectSchema<string>;
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

export function makeObjectSchema<T extends string>(schema: ObjectSchema<T>): ObjectSchema<T> {
  return schema;
}

export function makeSyncObjectSchema<T extends string>(schema: SyncObjectSchema<T>): SyncObjectSchema<T> {
  return schema;
}

export function normalizeSchema<T extends Schema>(schema: T): T {
  if (isArray(schema)) {
    return {
      type: ValueType.Array,
      items: normalizeSchema(schema.items),
    } as T;
  } else if (isObject(schema)) {
    const normalized: ObjectSchemaProperties = {};
    const {id, primary, featured} = schema;
    for (const key of Object.keys(schema.properties)) {
      const normalizedKey = pascalcase(key);
      const props = schema.properties[key];
      const {primary: primaryKey, required, fromKey} = props as ObjectSchemaProperty;
      normalized[normalizedKey] = Object.assign(normalizeSchema(props), {
        primary: primaryKey,
        required,
        fromKey: fromKey || (normalizedKey !== key ? key : undefined),
      });
    }
    return {
      type: ValueType.Object,
      id: id ? pascalcase(id) : undefined,
      featured: featured ? featured.map(pascalcase) : undefined,
      primary: primary ? pascalcase(primary) : undefined,
      properties: normalized,
      identity: schema.identity,
    } as T;
  }
  return schema;
}

export enum SchemaIdPrefix {
  Identity = 'I',
}

export type SchemaId = string;

// Return a canonical ID for the schema
export function getSchemaId(schema: Schema | undefined): SchemaId | undefined {
  if (!(isObject(schema) && schema.identity)) {
    return;
  }
  return `${SchemaIdPrefix.Identity}:${schema.identity.packId}:${schema.identity.name}`;
}
