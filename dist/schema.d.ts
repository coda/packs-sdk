import { $Omit } from './type_utils';
import { PackId } from './types';
export declare enum ValueType {
    Boolean = "boolean",
    Number = "number",
    String = "string",
    Array = "array",
    Object = "object",
    Date = "date",
    Email = "email",
    Percent = "percent",
    Currency = "currency",
    Image = "image",
    Url = "url",
    Markdown = "markdown",
    Html = "html",
    Embed = "embed"
}
declare type StringHintTypes = ValueType.Date | ValueType.Email | ValueType.Embed | ValueType.Html | ValueType.Image | ValueType.Markdown | ValueType.Url;
export declare type NumberHintTypes = ValueType.Date | ValueType.Percent | ValueType.Currency;
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
    id?: boolean;
    primary?: boolean;
    fromKey?: string;
    required?: boolean;
}
interface ObjectSchemaProperties {
    [key: string]: Schema | (Schema & ObjectSchemaProperty);
}
export declare type GenericObjectSchema = ObjectSchema<string>;
export interface Identity {
    packId: PackId;
    name: string;
    attribution?: AttributionNode[];
}
export interface ObjectSchema<K extends string> extends BaseSchema {
    type: ValueType.Object;
    properties: ObjectSchemaProperties & {
        [k in K]: Schema | (Schema & ObjectSchemaProperty);
    };
    id?: K;
    primary?: K;
    identity?: Identity;
}
export interface SyncObjectSchema<K extends string> extends ObjectSchema<K> {
    id: K;
    primary: K;
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
export declare type Schema = BooleanSchema | NumberSchema | StringSchema | ArraySchema | ObjectSchema<string>;
export declare function isObject(val?: Schema): val is ObjectSchema<string>;
export declare function isArray(val?: Schema): val is ArraySchema;
declare type UndefinedAsOptional<T extends object> = Partial<T> & Pick<T, {
    [K in keyof T]: undefined extends T[K] ? never : K;
}[keyof T]>;
export declare type SchemaType<T extends Schema> = T extends ArraySchema ? Array<TerminalSchemaType<T['items']>> : (T extends ObjectSchema<string> ? ObjectSchemaType<T> : TerminalSchemaType<T>);
declare type TerminalSchemaType<T extends Schema> = T extends BooleanSchema ? boolean : (T extends NumberSchema ? number : (T extends StringSchema ? (T['codaType'] extends ValueType.Date ? Date : string) : (T extends ArraySchema ? any[] : (T extends ObjectSchema<string> ? {
    [K in keyof T['properties']]: any;
} : never))));
declare type ObjectSchemaType<T extends ObjectSchema<string>> = UndefinedAsOptional<{
    [K in keyof T['properties']]: T['properties'][K] extends Schema & {
        required: true;
    } ? (TerminalSchemaType<T['properties'][K]>) : (TerminalSchemaType<T['properties'][K]> | undefined);
}>;
export declare type ValidTypes = boolean | number | string | object | boolean[] | number[] | string[] | object[];
export declare function generateSchema(obj: ValidTypes): Schema;
export declare function makeSchema<T extends Schema>(schema: T): T;
export declare function makeObjectSchema<T extends string>(schema: ObjectSchema<T>): ObjectSchema<T>;
export declare function makeSyncObjectSchema<T extends string>(schema: SyncObjectSchema<T>): SyncObjectSchema<T>;
export declare function normalizeSchema<T extends Schema>(schema: T): T;
export declare enum SchemaIdPrefix {
    Identity = "I"
}
export declare type SchemaId = string;
export declare function getSchemaId(schema: Schema | undefined): SchemaId | undefined;
export {};
