import {PackId} from './types';
import {ensureExists} from './helpers/ensure';
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
  Time = 'time',
  DateTime = 'datetime',
  Duration = 'duration',
  Person = 'person',
  Percent = 'percent',
  Currency = 'currency',
  Image = 'image',
  Url = 'url',
  Markdown = 'markdown',
  Html = 'html',
  Embed = 'embed',
  Reference = 'reference',
  Attachment = 'attachment',
  Slider = 'slider',
  Scale = 'scale',
}

type StringHintTypes =
  | ValueType.Attachment
  | ValueType.Date
  | ValueType.Time
  | ValueType.DateTime
  | ValueType.Duration
  | ValueType.Embed
  | ValueType.Html
  | ValueType.Image
  | ValueType.Markdown
  | ValueType.Url;
export type NumberHintTypes =
  | ValueType.Date
  | ValueType.Time
  | ValueType.DateTime
  | ValueType.Percent
  | ValueType.Currency
  | ValueType.Slider
  | ValueType.Scale;
export type ObjectHintTypes = ValueType.Person | ValueType.Reference;

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

export interface NumericSchema extends NumberSchema {
  codaType?: ValueType.Percent; // Can also be undefined if it's a vanilla number
  precision?: number;
  useThousandsSeparator?: boolean;
}

export enum CurrencyFormat {
  Currency = 'currency',
  Accounting = 'accounting',
  Financial = 'financial',
}

export interface CurrencySchema extends NumberSchema {
  codaType: ValueType.Currency;
  precision?: number;
  currencyCode?: string;
  format?: CurrencyFormat;
}

export interface SliderSchema extends NumberSchema {
  codaType: ValueType.Slider;
  minimum?: number | string;
  maximum?: number | string;
  step?: number | string;
}

export interface ScaleSchema extends NumberSchema {
  codaType: ValueType.Scale;
  maximum: number;
  icon: string;
}

interface BaseDateSchema extends BaseSchema {
  type: ValueType.Number | ValueType.String;
}

export interface DateSchema extends BaseDateSchema {
  codaType: ValueType.Date;
  // A Moment date format string, such as 'MMM D, YYYY', that corresponds to a supported Coda date column format.
  format?: string;
}

export interface TimeSchema extends BaseDateSchema {
  codaType: ValueType.Time;
  // A Moment time format string, such as 'HH:mm:ss', that corresponds to a supported Coda time column format.
  format?: string;
}

export interface DateTimeSchema extends BaseDateSchema {
  codaType: ValueType.DateTime;
  // A Moment date format string, such as 'MMM D, YYYY', that corresponds to a supported Coda date column format.
  dateFormat?: string;
  // A Moment time format string, such as 'HH:mm:ss', that corresponds to a supported Coda time column format.
  timeFormat?: string;
}

export enum DurationUnit {
  Days = 'days',
  Hours = 'hours',
  Minutes = 'minutes',
  Seconds = 'seconds',
}

export interface DurationSchema extends StringSchema {
  codaType: ValueType.Duration;
  precision?: number;
  maxUnit?: DurationUnit;
}

export interface StringSchema extends BaseSchema {
  type: ValueType.String;
  codaType?: StringHintTypes;
}

export interface ArraySchema extends BaseSchema {
  type: ValueType.Array;
  items: Schema;
}

export interface ObjectSchemaProperty {
  // TODO(alexd): Remove these once we've hoisted these up.
  id?: boolean;
  fromKey?: string;
  required?: boolean;
}

export interface ObjectSchemaProperties {
  [key: string]: Schema | (Schema & ObjectSchemaProperty);
}

export type GenericObjectSchema = ObjectSchema<string, string>;

export interface Identity {
  packId: PackId;
  name: string;
  dynamicUrl?: string;
  attribution?: AttributionNode[];
}

export interface ObjectSchema<K extends string, L extends string> extends BaseSchema {
  type: ValueType.Object;
  properties: ObjectSchemaProperties &
    {[k in K]: Schema | (Schema & ObjectSchemaProperty)} &
    {[k in L]: Schema | (Schema & ObjectSchemaProperty)};
  id?: K;
  primary?: K;
  codaType?: ObjectHintTypes;
  featured?: L[];
  identity?: Identity;
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

export type Schema = BooleanSchema | NumberSchema | StringSchema | ArraySchema | GenericObjectSchema;

export function isObject(val?: Schema): val is GenericObjectSchema {
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
  : (T extends GenericObjectSchema ? ObjectSchemaType<T> : TerminalSchemaType<T>);
type TerminalSchemaType<T extends Schema> = T extends BooleanSchema
  ? boolean
  : (T extends NumberSchema
      ? number
      : (T extends StringSchema
          ? (T['codaType'] extends ValueType.Date ? Date : string)
          : (T extends ArraySchema
              ? any[]
              : (T extends GenericObjectSchema ? {[K in keyof T['properties']]: any} : never))));
type ObjectSchemaType<T extends GenericObjectSchema> = UndefinedAsOptional<
  {
    [K in keyof T['properties']]: T['properties'][K] extends Schema & {required: true}
      ? (TerminalSchemaType<T['properties'][K]>)
      : (TerminalSchemaType<T['properties'][K]> | undefined);
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
    return {type: ValueType.Object, properties} as GenericObjectSchema;
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

export function makeObjectSchema<K extends string, L extends string>(schema: ObjectSchema<K, L>): ObjectSchema<K, L> {
  return schema;
}

function normalizeKey(key: string): string {
  // Colons cause problems in our formula handling.
  return pascalcase(key).replace(/:/g, '_');
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
      const normalizedKey = normalizeKey(key);
      const props = schema.properties[key];
      const {required, fromKey} = props as ObjectSchemaProperty;
      normalized[normalizedKey] = Object.assign(normalizeSchema(props), {
        required,
        fromKey: fromKey || (normalizedKey !== key ? key : undefined),
      });
    }
    const normalizedSchema = {
      type: ValueType.Object,
      id: id ? normalizeKey(id) : undefined,
      featured: featured ? featured.map(normalizeKey) : undefined,
      primary: primary ? normalizeKey(primary) : undefined,
      properties: normalized,
      identity: schema.identity,
      codaType: schema.codaType,
    } as T;

    return normalizedSchema;
  }
  return schema;
}

// Convenience for creating a reference object schema from an existing schema for the
// object. Copies over the identity, id, and primary from the schema, and the subset of
// properties indicated by the id and primary.
// A reference schema can always be defined directly, but if you already have an object
// schema it provides better code reuse to derive a reference schema instead.
export function makeReferenceSchemaFromObjectSchema(schema: GenericObjectSchema): GenericObjectSchema {
  const {type, id, primary, identity, properties} = schema;
  ensureExists(identity);
  const validId = ensureExists(id);
  const referenceProperties: ObjectSchemaProperties = {[validId]: properties[validId]};
  if (primary && primary !== id) {
    referenceProperties[primary] = properties[primary];
  }
  return {
    codaType: ValueType.Reference,
    type,
    id,
    identity,
    primary,
    properties: referenceProperties,
  };
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
