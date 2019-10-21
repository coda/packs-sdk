import { PackId } from './types';
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
    Attachment = "attachment"
}
declare type StringHintTypes = ValueType.Attachment | ValueType.Date | ValueType.Time | ValueType.DateTime | ValueType.Duration | ValueType.Embed | ValueType.Html | ValueType.Image | ValueType.Markdown | ValueType.Url;
export declare type NumberHintTypes = ValueType.Date | ValueType.Time | ValueType.DateTime | ValueType.Percent | ValueType.Currency;
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
export interface DateSchema extends NumberSchema {
    codaType: ValueType.Date;
    format?: string;
}
export interface TimeSchema extends NumberSchema {
    codaType: ValueType.Time;
    format?: string;
}
export interface DateTimeSchema extends NumberSchema {
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
    id?: boolean;
    fromKey?: string;
    required?: boolean;
}
export interface ObjectSchemaProperties {
    [key: string]: Schema | (Schema & ObjectSchemaProperty);
}
export declare type GenericObjectSchema = ObjectSchema<string, string>;
export interface Identity {
    packId: PackId;
    name: string;
    dynamicUrl?: string;
    attribution?: AttributionNode[];
}
export interface ObjectSchema<K extends string, L extends string> extends BaseSchema {
    type: ValueType.Object;
    properties: ObjectSchemaProperties & {
        [k in K]: Schema | (Schema & ObjectSchemaProperty);
    } & {
        [k in L]: Schema | (Schema & ObjectSchemaProperty);
    };
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
declare type UndefinedAsOptional<T extends object> = Partial<T> & Pick<T, {
    [K in keyof T]: undefined extends T[K] ? never : K;
}[keyof T]>;
export declare type SchemaType<T extends Schema> = T extends ArraySchema ? Array<TerminalSchemaType<T['items']>> : (T extends GenericObjectSchema ? ObjectSchemaType<T> : TerminalSchemaType<T>);
declare type TerminalSchemaType<T extends Schema> = T extends BooleanSchema ? boolean : (T extends NumberSchema ? number : (T extends StringSchema ? (T['codaType'] extends ValueType.Date ? Date : string) : (T extends ArraySchema ? any[] : (T extends GenericObjectSchema ? {
    [K in keyof T['properties']]: any;
} : never))));
declare type ObjectSchemaType<T extends GenericObjectSchema> = UndefinedAsOptional<{
    [K in keyof T['properties']]: T['properties'][K] extends Schema & {
        required: true;
    } ? (TerminalSchemaType<T['properties'][K]>) : (TerminalSchemaType<T['properties'][K]> | undefined);
}>;
export declare type ValidTypes = boolean | number | string | object | boolean[] | number[] | string[] | object[];
export declare function generateSchema(obj: ValidTypes): Schema;
export declare function makeSchema<T extends Schema>(schema: T): T;
export declare function makeObjectSchema<K extends string, L extends string>(schema: ObjectSchema<K, L>): ObjectSchema<K, L>;
export declare function normalizeSchema<T extends Schema>(schema: T): T;
export declare function makeReferenceSchemaFromObjectSchema(schema: GenericObjectSchema): GenericObjectSchema;
export declare enum SchemaIdPrefix {
    Identity = "I"
}
export declare type SchemaId = string;
export declare function getSchemaId(schema: Schema | undefined): SchemaId | undefined;
export {};
