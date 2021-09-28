import type { $Values } from './type_utils';
import type { PackId } from './types';
/**
 * The set of primitive value types that can be used as return values for formulas
 * or in object schemas.
 */
export declare enum ValueType {
    Boolean = "boolean",
    Number = "number",
    String = "string",
    Array = "array",
    Object = "object"
}
/**
 * Synthetic types that instruct Coda how to coerce values from primitives at ingestion time.
 */
export declare enum ValueHintType {
    Date = "date",
    Time = "time",
    DateTime = "datetime",
    Duration = "duration",
    Person = "person",
    Percent = "percent",
    Currency = "currency",
    ImageReference = "image",
    ImageAttachment = "imageAttachment",
    Url = "url",
    Markdown = "markdown",
    Html = "html",
    Embed = "embed",
    Reference = "reference",
    Attachment = "attachment",
    Slider = "slider",
    Scale = "scale"
}
export declare const StringHintValueTypes: readonly [ValueHintType.Attachment, ValueHintType.Date, ValueHintType.Time, ValueHintType.DateTime, ValueHintType.Duration, ValueHintType.Embed, ValueHintType.Html, ValueHintType.ImageReference, ValueHintType.ImageAttachment, ValueHintType.Markdown, ValueHintType.Url];
export declare const NumberHintValueTypes: readonly [ValueHintType.Date, ValueHintType.Time, ValueHintType.DateTime, ValueHintType.Percent, ValueHintType.Currency, ValueHintType.Slider, ValueHintType.Scale];
export declare const ObjectHintValueTypes: readonly [ValueHintType.Person, ValueHintType.Reference];
export declare type StringHintTypes = typeof StringHintValueTypes[number];
export declare type NumberHintTypes = typeof NumberHintValueTypes[number];
export declare type ObjectHintTypes = typeof ObjectHintValueTypes[number];
interface BaseSchema {
    description?: string;
}
export interface BooleanSchema extends BaseSchema {
    type: ValueType.Boolean;
}
export declare type NumberSchema = CurrencySchema | BaseNumberSchema | SliderSchema | ScaleSchema | NumericSchema | NumericDateSchema | NumericTimeSchema | NumericDateTimeSchema;
export interface BaseNumberSchema extends BaseSchema {
    type: ValueType.Number;
}
export interface NumericSchema extends BaseNumberSchema {
    codaType?: ValueHintType.Percent;
    precision?: number;
    useThousandsSeparator?: boolean;
}
export interface NumericDateSchema extends BaseNumberSchema {
    codaType: ValueHintType.Date;
    format?: string;
}
export interface NumericTimeSchema extends BaseNumberSchema {
    codaType: ValueHintType.Time;
    format?: string;
}
export interface NumericDateTimeSchema extends BaseNumberSchema {
    codaType: ValueHintType.DateTime;
    dateFormat?: string;
    timeFormat?: string;
}
export declare enum CurrencyFormat {
    Currency = "currency",
    Accounting = "accounting",
    Financial = "financial"
}
export interface CurrencySchema extends BaseNumberSchema {
    codaType: ValueHintType.Currency;
    precision?: number;
    /***
     * A three-letter ISO 4217 currency code, e.g. USD or EUR.
     * If the currency code is not supported by Coda, the value will be rendered using USD.
     */
    currencyCode?: string;
    format?: CurrencyFormat;
}
export interface SliderSchema extends BaseNumberSchema {
    codaType: ValueHintType.Slider;
    minimum?: number | string;
    maximum?: number | string;
    step?: number | string;
}
export declare enum ScaleIconSet {
    Star = "star",
    Circle = "circle",
    Fire = "fire",
    Bug = "bug",
    Diamond = "diamond",
    Bell = "bell",
    ThumbsUp = "thumbsup",
    Heart = "heart",
    Chili = "chili",
    Smiley = "smiley",
    Lightning = "lightning",
    Currency = "currency",
    Coffee = "coffee",
    Person = "person",
    Battery = "battery",
    Cocktail = "cocktail",
    Cloud = "cloud",
    Sun = "sun",
    Checkmark = "checkmark",
    LightBulb = "lightbulb"
}
export interface ScaleSchema extends BaseNumberSchema {
    codaType: ValueHintType.Scale;
    maximum: number;
    icon: ScaleIconSet;
}
interface BaseDateSchema extends BaseSchema {
    type: ValueType.Number | ValueType.String;
}
export interface DateSchema extends BaseDateSchema {
    codaType: ValueHintType.Date;
    format?: string;
}
export interface TimeSchema extends BaseDateSchema {
    codaType: ValueHintType.Time;
    format?: string;
}
export interface DateTimeSchema extends BaseDateSchema {
    codaType: ValueHintType.DateTime;
    dateFormat?: string;
    timeFormat?: string;
}
export declare enum DurationUnit {
    Days = "days",
    Hours = "hours",
    Minutes = "minutes",
    Seconds = "seconds"
}
export interface DurationSchema extends StringSchema<ValueHintType.Duration> {
    precision?: number;
    maxUnit?: DurationUnit;
}
export interface StringSchema<T extends StringHintTypes = StringHintTypes> extends BaseSchema {
    type: ValueType.String;
    codaType?: T;
}
export interface ArraySchema<T extends Schema = Schema> extends BaseSchema {
    type: ValueType.Array;
    items: T;
}
export interface ObjectSchemaProperty {
    fromKey?: string;
    required?: boolean;
}
export declare type ObjectSchemaProperties<K extends string = never> = {
    [K2 in K | string]: Schema & ObjectSchemaProperty;
};
export declare type GenericObjectSchema = ObjectSchema<string, string>;
export interface IdentityDefinition {
    name: string;
    dynamicUrl?: string;
    attribution?: AttributionNode[];
    packId?: PackId;
}
export interface Identity extends IdentityDefinition {
    packId: PackId;
}
export interface ObjectSchemaDefinition<K extends string, L extends string> extends BaseSchema {
    type: ValueType.Object;
    properties: ObjectSchemaProperties<K | L>;
    id?: K;
    primary?: K;
    codaType?: ObjectHintTypes;
    featured?: L[];
    identity?: IdentityDefinition;
}
export declare type ObjectSchemaDefinitionType<K extends string, L extends string, T extends ObjectSchemaDefinition<K, L>> = ObjectSchemaType<T>;
export interface ObjectSchema<K extends string, L extends string> extends ObjectSchemaDefinition<K, L> {
    identity?: Identity;
}
export declare enum AttributionNodeType {
    Text = 1,
    Link = 2,
    Image = 3
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
declare type AttributionNode = TextAttributionNode | LinkAttributionNode | ImageAttributionNode;
export declare function makeAttributionNode<T extends AttributionNode>(node: T): T;
export declare type Schema = BooleanSchema | NumberSchema | StringSchema | ArraySchema | GenericObjectSchema;
export declare function isObject(val?: Schema): val is GenericObjectSchema;
export declare function isArray(val?: Schema): val is ArraySchema;
declare type PickOptional<T, K extends keyof T> = Partial<T> & {
    [P in K]: T[P];
};
interface StringHintTypeToSchemaTypeMap {
    [ValueHintType.Date]: Date | string | number;
}
declare type StringHintTypeToSchemaType<T extends StringHintTypes | undefined> = T extends keyof StringHintTypeToSchemaTypeMap ? StringHintTypeToSchemaTypeMap[T] : string;
declare type SchemaWithNoFromKey<T extends ObjectSchemaDefinition<any, any>> = {
    [K in keyof T['properties'] as T['properties'][K] extends {
        fromKey: string;
    } ? never : K]: T['properties'][K];
};
declare type SchemaFromKeyWildCard<T extends ObjectSchemaDefinition<any, any>> = {
    [K in keyof T['properties'] as T['properties'][K] extends {
        fromKey: string;
    } ? string : never]: any;
};
declare type ObjectSchemaNoFromKeyType<T extends ObjectSchemaDefinition<any, any>, P extends SchemaWithNoFromKey<T> = SchemaWithNoFromKey<T>> = PickOptional<{
    [K in keyof P]: SchemaType<P[K]>;
}, $Values<{
    [K in keyof P]: P[K] extends {
        required: true;
    } ? K : never;
}>>;
declare type ObjectSchemaType<T extends ObjectSchemaDefinition<any, any>> = ObjectSchemaNoFromKeyType<T> & SchemaFromKeyWildCard<T>;
export declare type SchemaType<T extends Schema> = T extends BooleanSchema ? boolean : T extends NumberSchema ? number : T extends StringSchema ? StringHintTypeToSchemaType<T['codaType']> : T extends ArraySchema ? Array<SchemaType<T['items']>> : T extends GenericObjectSchema ? ObjectSchemaType<T> : never;
export declare type ValidTypes = boolean | number | string | object | boolean[] | number[] | string[] | object[];
export declare function generateSchema(obj: ValidTypes): Schema;
export declare function makeSchema<T extends Schema>(schema: T): T;
export declare const PlaceholderIdentityPackId = -1;
export declare function makeObjectSchema<K extends string, L extends string, T extends ObjectSchemaDefinition<K, L>>(schemaDef: T): T & {
    identity?: Identity;
};
export declare function normalizeSchemaKey(key: string): string;
export declare function normalizeSchema<T extends Schema>(schema: T): T;
/**
 * Convenience for creating a reference object schema from an existing schema for the
 * object. Copies over the identity, id, and primary from the schema, and the subset of
 * properties indicated by the id and primary.
 * A reference schema can always be defined directly, but if you already have an object
 * schema it provides better code reuse to derive a reference schema instead.
 */
export declare function makeReferenceSchemaFromObjectSchema(schema: GenericObjectSchema, identityName?: string): GenericObjectSchema;
export {};
