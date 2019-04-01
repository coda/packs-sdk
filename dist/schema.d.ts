import { PackId } from './types';
export declare enum ValueType {
    Boolean = "boolean",
    Number = "number",
    String = "string",
    Array = "array",
    Object = "object",
    Date = "date",
    Percent = "percent",
    Currency = "currency",
    Image = "image",
    Url = "url",
    Markdown = "markdown",
    Html = "html",
    Embed = "embed"
}
export declare type StringHintTypes = ValueType.Image | ValueType.Date | ValueType.Url | ValueType.Markdown | ValueType.Html | ValueType.Embed;
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
export interface ObjectSchema extends BaseSchema {
    type: ValueType.Object;
    properties: ObjectSchemaProperties;
    identity?: {
        packId: PackId;
        name: string;
        attribution?: AttributionNode[];
    };
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
export declare type Schema = BooleanSchema | NumberSchema | StringSchema | ArraySchema | ObjectSchema;
export declare function isObject(val?: Schema): val is ObjectSchema;
export declare function isArray(val?: Schema): val is ArraySchema;
declare type UndefinedAsOptional<T extends object> = Partial<T> & Pick<T, {
    [K in keyof T]: undefined extends T[K] ? never : K;
}[keyof T]>;
export declare type SchemaType<T extends Schema> = T extends BooleanSchema ? boolean : (T extends NumberSchema ? number : (T extends StringSchema ? (T['codaType'] extends ValueType.Date ? Date : string) : (T extends ArraySchema ? ArraySchemaType<T> : (T extends ObjectSchema ? ObjectSchemaType<T> : never))));
interface ArraySchemaType<T extends ArraySchema> extends Array<SchemaType<T['items']>> {
}
declare type ObjectSchemaType<T extends ObjectSchema> = UndefinedAsOptional<{
    [K in keyof T['properties']]: T['properties'][K] extends Schema & {
        required: true;
    } ? (SchemaType<T['properties'][K]>) : (SchemaType<T['properties'][K]> | undefined);
}>;
export declare type ValidTypes = boolean | number | string | object | boolean[] | number[] | string[] | object[];
export declare function generateSchema(obj: ValidTypes): Schema;
export declare function makeSchema<T extends Schema>(schema: T): T;
export declare function normalizeSchema(schema: Schema): Schema;
export {};
