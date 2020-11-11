import { PackId } from './types';
import { $Values } from './type_utils';
export declare enum ValueType {
    Boolean = "boolean",
    Number = "number",
    String = "string",
    Array = "array",
    Object = "object",
    Date = "date",
    Time = "time",
    DateTime = "datetime",
    Duration = "duration",
    Person = "person",
    Percent = "percent",
    Currency = "currency",
    Image = "image",
    Url = "url",
    Markdown = "markdown",
    Html = "html",
    Embed = "embed",
    Reference = "reference",
    ImageAttachment = "imageAttachment",
    Attachment = "attachment",
    Slider = "slider",
    Scale = "scale"
}
export declare type StringHintTypes = ValueType.Attachment | ValueType.Date | ValueType.Time | ValueType.DateTime | ValueType.Duration | ValueType.Embed | ValueType.Html | ValueType.Image | ValueType.ImageAttachment | ValueType.Markdown | ValueType.Url;
export declare type NumberHintTypes = ValueType.Date | ValueType.Time | ValueType.DateTime | ValueType.Percent | ValueType.Currency | ValueType.Slider | ValueType.Scale;
export declare type ObjectHintTypes = ValueType.Person | ValueType.Reference;
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
    codaType?: ValueType.Percent;
    precision?: number;
    useThousandsSeparator?: boolean;
}
export declare enum CurrencyFormat {
    Currency = "currency",
    Accounting = "accounting",
    Financial = "financial"
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
    format?: string;
}
export interface TimeSchema extends BaseDateSchema {
    codaType: ValueType.Time;
    format?: string;
}
export interface DateTimeSchema extends BaseDateSchema {
    codaType: ValueType.DateTime;
    dateFormat?: string;
    timeFormat?: string;
}
export declare enum DurationUnit {
    Days = "days",
    Hours = "hours",
    Minutes = "minutes",
    Seconds = "seconds"
}
export interface DurationSchema extends StringSchema<ValueType.Duration> {
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
export interface Identity {
    packId: PackId;
    name: string;
    dynamicUrl?: string;
    attribution?: AttributionNode[];
}
export interface ObjectSchema<K extends string, L extends string> extends BaseSchema {
    type: ValueType.Object;
    properties: ObjectSchemaProperties<K | L>;
    id?: K;
    primary?: K;
    codaType?: ObjectHintTypes;
    featured?: L[];
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
    [ValueType.Date]: Date;
}
declare type StringHintTypeToSchemaType<T extends StringHintTypes | undefined> = T extends keyof StringHintTypeToSchemaTypeMap ? StringHintTypeToSchemaTypeMap[T] : string;
export declare type SchemaType<T extends Schema> = T extends BooleanSchema ? boolean : T extends NumberSchema ? number : T extends StringSchema ? StringHintTypeToSchemaType<T['codaType']> : T extends ArraySchema ? Array<SchemaType<T['items']>> : T extends GenericObjectSchema ? PickOptional<{
    [K in keyof T['properties']]: SchemaType<T['properties'][K]>;
}, $Values<{
    [K in keyof T['properties']]: T['properties'][K] extends {
        required: true;
    } ? K : never;
}>> : never;
export declare type ValidTypes = boolean | number | string | object | boolean[] | number[] | string[] | object[];
export declare function generateSchema(obj: ValidTypes): Schema;
export declare function makeSchema<T extends Schema>(schema: T): T;
export declare function makeObjectSchema<K extends string, L extends string, T extends ObjectSchema<K, L>>(schema: T): T;
export declare function normalizeSchema<T extends Schema>(schema: T): T;
export declare function makeReferenceSchemaFromObjectSchema(schema: GenericObjectSchema): GenericObjectSchema;
export declare enum SchemaIdPrefix {
    Identity = "I"
}
export declare type SchemaId = string;
export declare function getSchemaId(schema: Schema | undefined): SchemaId | undefined;
export {};
