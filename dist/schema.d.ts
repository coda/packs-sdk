import type { OptionsReference } from './api_types';
import type { OptionsType } from './api_types';
import type { PackFormulaResult } from './api_types';
import type { PropertyOptionsMetadataFunction } from './api_types';
/**
 * The set of primitive value types that can be used as return values for formulas
 * or in object schemas.
 */
export declare enum ValueType {
    /**
     * Indicates a JavaScript boolean (true/false) should be returned.
     */
    Boolean = "boolean",
    /**
     * Indicates a JavaScript number should be returned.
     */
    Number = "number",
    /**
     * Indicates a JavaScript string should be returned.
     */
    String = "string",
    /**
     * Indicates a JavaScript array should be returned. The schema of the array items must also be specified.
     */
    Array = "array",
    /**
     * Indicates a JavaScript object should be returned. The schema of each object property must also be specified.
     */
    Object = "object"
}
/**
 * Synthetic types that instruct Coda how to coerce values from primitives at ingestion time.
 */
export declare enum ValueHintType {
    /**
     * Indicates to interpret the value as a date (e.g. March 3, 2021).
     */
    Date = "date",
    /**
     * Indicates to interpret the value as a time (e.g. 5:24pm).
     */
    Time = "time",
    /**
     * Indicates to interpret the value as a datetime (e.g. March 3, 2021 at 5:24pm).
     */
    DateTime = "datetime",
    /**
     * Indicates to interpret the value as a duration (e.g. 3 hours).
     */
    Duration = "duration",
    /**
     * Indicates to interpret the value as an email address (e.g. joe@foo.com).
     */
    Email = "email",
    /**
     * Indicates to interpret and render the value as a Coda person reference. The provided value should be
     * an object whose `id` property is an email address, which Coda will try to resolve to a user
     * and render an @-reference to the user.
     *
     * @example
     * ```
     * makeObjectSchema({
     *   type: ValueType.Object,
     *   codaType: ValueHintType.Person,
     *   id: 'email',
     *   primary: 'name',
     *   properties: {
     *     email: {type: ValueType.String, required: true},
     *     name: {type: ValueType.String, required: true},
     *   },
     * });
     * ```
     */
    Person = "person",
    /**
     * Indicates to interpret and render the value as a percentage.
     */
    Percent = "percent",
    /**
     * Indicates to interpret and render the value as a currency value.
     */
    Currency = "currency",
    /**
     * Indicates to interpret and render the value as an image. The provided value should be a URL that
     * points to an image. Coda will hotlink to the image when rendering it a doc.
     *
     * Using {@link ImageAttachment} is recommended instead, so that the image is always accessible
     * and won't appear as broken if the source image is later deleted.
     */
    ImageReference = "image",
    /**
     * Indicates to interpret and render the value as an image. The provided value should be a URL that
     * points to an image. Coda will ingest the image and host it from Coda infrastructure.
     */
    ImageAttachment = "imageAttachment",
    /**
     * Indicates to interpret and render the value as a URL link.
     */
    Url = "url",
    /**
     * Indicates to interpret a text value as Markdown, which will be converted and rendered as Coda rich text.
     */
    Markdown = "markdown",
    /**
     * Indicates to interpret a text value as HTML, which will be converted and rendered as Coda rich text.
     */
    Html = "html",
    /**
     * Indicates to interpret and render a value as an embed. The provided value should be a URL pointing
     * to an embeddable web page.
     */
    Embed = "embed",
    /**
     * Indicates to interpret and render the value as a Coda @-reference to a table row. The provided value should
     * be an object whose `id` value matches the id of some row in a sync table. The schema where this hint type is
     * used must specify an identity that specifies the desired sync table.
     *
     * Normally a reference schema is constructed from the schema object being referenced using the helper
     * {@link makeReferenceSchemaFromObjectSchema}.
     *
     * @example
     * ```
     * makeObjectSchema({
     *   type: ValueType.Object,
     *   codaType: ValueHintType.Reference,
     *   identity: {
     *     name: "SomeSyncTableIdentity"
     *   },
     *   id: 'identifier',
     *   primary: 'name',
     *   properties: {
     *     identifier: {type: ValueType.Number, required: true},
     *     name: {type: ValueType.String, required: true},
     *   },
     * });
     * ```
     */
    Reference = "reference",
    /**
     * Indicates to interpret and render a value as a file attachment. The provided value should be a URL
     * pointing to a file of a Coda-supported type. Coda will ingest the file and host it from Coda infrastructure.
     */
    Attachment = "attachment",
    /**
     * Indicates to render a numeric value as a slider UI component.
     */
    Slider = "slider",
    /**
     * Indicates to render a numeric value as a scale UI component (e.g. a star rating).
     */
    Scale = "scale",
    /**
     * Indicates to render a numeric value as a progress bar UI component.
     */
    ProgressBar = "progressBar",
    /**
     * Indicates to render a boolean value as a toggle.
     */
    Toggle = "toggle",
    /** @hidden */
    CodaInternalRichText = "codaInternalRichText",
    /**
     * Indicates to render a value as a select list.
     */
    SelectList = "selectList"
}
export declare const StringHintValueTypes: readonly [ValueHintType.Attachment, ValueHintType.Date, ValueHintType.Time, ValueHintType.DateTime, ValueHintType.Duration, ValueHintType.Email, ValueHintType.Embed, ValueHintType.Html, ValueHintType.ImageReference, ValueHintType.ImageAttachment, ValueHintType.Markdown, ValueHintType.Url, ValueHintType.CodaInternalRichText, ValueHintType.SelectList];
export declare const NumberHintValueTypes: readonly [ValueHintType.Date, ValueHintType.Time, ValueHintType.DateTime, ValueHintType.Duration, ValueHintType.Percent, ValueHintType.Currency, ValueHintType.Slider, ValueHintType.ProgressBar, ValueHintType.Scale];
export declare const BooleanHintValueTypes: readonly [ValueHintType.Toggle];
export declare const ObjectHintValueTypes: readonly [ValueHintType.Person, ValueHintType.Reference, ValueHintType.SelectList];
export declare const AutocompleteHintValueTypes: readonly [ValueHintType.SelectList, ValueHintType.Reference];
/** The subset of {@link ValueHintType} that can be used with a string value. */
export type StringHintTypes = (typeof StringHintValueTypes)[number];
/** The subset of {@link ValueHintType} that can be used with a number value. */
export type NumberHintTypes = (typeof NumberHintValueTypes)[number];
/** The subset of {@link ValueHintType} that can be used with a boolean value. */
export type BooleanHintTypes = (typeof BooleanHintValueTypes)[number];
/** The subset of {@link ValueHintType} that can be used with an object value. */
export type ObjectHintTypes = (typeof ObjectHintValueTypes)[number];
/**
 * A function or set of values to return for property options.
 */
export type PropertySchemaOptions<T extends PackFormulaResult> = PropertyOptionsMetadataFunction<T[]> | T[] | OptionsType | OptionsReference;
/**
 * A property with a list of valid options for its value.
 */
export interface PropertyWithOptions<T extends PackFormulaResult> {
    /**
     * A list of values or a formula that returns a list of values to suggest when someone
     * edits this property.
     *
     * @example
     * ```
     * properties: {
     *   color: {
     *      type: coda.ValueType.String,
     *      codaType: coda.ValueHintType.SelectList,
     *      mutable: true,
     *      options: ['red', 'green', 'blue'],
     *   },
     *   user: {
     *      type: coda.ValueType.String,
     *      codaType: coda.ValueHintType.SelectList,
     *      mutable: true,
     *      options: async function (context) {
     *        let url = coda.withQueryParams("https://example.com/userSearch", { name: context.search });
     *        let response = await context.fetcher.fetch({ method: "GET", url: url });
     *        let results = response.body.users;
     *        return results.map(user => {display: user.name, value: user.id})
     *      },
     *   },
     * }
     * ```
     */
    options?: PropertySchemaOptions<T>;
    /**
     * Blocks updates from being sent with a blank value.
     */
    requireForUpdates?: boolean;
}
type PropertyWithAutocompleteWithOptionalDisplay<T extends PackFormulaResult> = PropertyWithOptions<T | {
    display: string;
    value: T;
}>;
interface BaseSchema {
    /**
     * A explanation of this object schema property shown to the user in the UI.
     *
     * If your pack has an object schema with many properties, it may be useful to
     * explain the purpose or contents of any property that is not self-evident.
     */
    description?: string;
}
/**
 * A schema representing a return value or object property that is a boolean.
 */
export interface BooleanSchema extends BaseSchema {
    /** Identifies this schema as relating to a boolean value. */
    type: ValueType.Boolean;
    /** Indicates how to render values in a table. If not specified, renders a checkbox. */
    codaType?: BooleanHintTypes;
}
/**
 * The union of all schemas that can represent number values.
 */
export type NumberSchema = CurrencySchema | SliderSchema | ProgressBarSchema | ScaleSchema | NumericSchema | NumericDateSchema | NumericTimeSchema | NumericDateTimeSchema | NumericDurationSchema;
export interface BaseNumberSchema<T extends NumberHintTypes = NumberHintTypes> extends BaseSchema {
    /** Identifies this schema as relating to a number value. */
    type: ValueType.Number;
    /** An optional type hint instructing Coda about how to interpret or render this value. */
    codaType?: T;
}
/**
 * A schema representing a return value or object property that is a numeric value,
 * i.e. a raw number with an optional decimal precision.
 */
export interface NumericSchema extends BaseNumberSchema {
    /** If specified, instructs Coda to render this value as a percentage. */
    codaType?: ValueHintType.Percent;
    /** The decimal precision. The number will be rounded to this precision when rendered. */
    precision?: number;
    /** If specified, will render thousands separators for large numbers, e.g. `1,234,567.89`. */
    useThousandsSeparator?: boolean;
}
/**
 * A schema representing a return value or object property that is provided as a number,
 * which Coda should interpret as a date. The given number should be in seconds since the Unix epoch.
 */
export interface NumericDateSchema extends BaseNumberSchema<ValueHintType.Date> {
    /** Instructs Coda to render this value as a date. */
    codaType: ValueHintType.Date;
    /**
     * A Moment date format string, such as 'MMM D, YYYY', that corresponds to a supported Coda date column format,
     * used when rendering the value.
     *
     * Only applies when this is used as a sync table property.
     */
    format?: string;
}
/**
 * A schema representing a return value or object property that is provided as a number,
 * which Coda should interpret as a time. The given number should be in seconds since the Unix epoch.
 * While this is a full datetime, only the time component will be rendered, so the date used is irrelevant.
 */
export interface NumericTimeSchema extends BaseNumberSchema<ValueHintType.Time> {
    /** Instructs Coda to render this value as a time. */
    codaType: ValueHintType.Time;
    /**
     * A Moment time format string, such as 'HH:mm:ss', that corresponds to a supported Coda time column format,
     * used when rendering the value.
     *
     * Only applies when this is used as a sync table property.
     */
    format?: string;
}
/**
 * A schema representing a return value or object property that is provided as a number,
 * which Coda should interpret as a datetime. The given number should be in seconds since the Unix epoch.
 */
export interface NumericDateTimeSchema extends BaseNumberSchema<ValueHintType.DateTime> {
    /** Instructs Coda to render this value as a datetime. */
    codaType: ValueHintType.DateTime;
    /**
     * A Moment date format string, such as 'MMM D, YYYY', that corresponds to a supported Coda date column format.
     *
     * Only applies when this is used as a sync table property.
     */
    dateFormat?: string;
    /**
     * A Moment time format string, such as 'HH:mm:ss', that corresponds to a supported Coda time column format,
     * used when rendering the value.
     *
     * Only applies when this is used as a sync table property.
     */
    timeFormat?: string;
}
/**
 * A schema representing a return value or object property that is provided as a number,
 * which Coda should interpret as a duration. The given number should be an amount of days
 * (fractions allowed).
 */
export interface NumericDurationSchema extends BaseNumberSchema<ValueHintType.Duration> {
    /** Instructs Coda to render this value as a duration. */
    codaType: ValueHintType.Duration;
    /**
     * A refinement of {@link DurationSchema.maxUnit} to use for rounding the duration when rendering.
     * Currently only `1` is supported, which is the same as omitting a value.
     */
    precision?: number;
    /**
     * The unit to use for rounding the duration when rendering. For example, if using `DurationUnit.Days`,
     * and a value of 273600 is provided (3 days 4 hours) is provided, it will be rendered as "3 days".
     */
    maxUnit?: DurationUnit;
}
/**
 * Enumeration of formats supported by schemas that use {@link ValueHintType.Currency}.
 *
 * These affect how a numeric value is rendered in docs.
 */
export declare enum CurrencyFormat {
    /**
     * Indicates the value should be rendered as a number with a currency symbol as a prefix, e.g. `$2.50`.
     */
    Currency = "currency",
    /**
     * Indicates the value should be rendered as a number with a currency symbol as a prefix, but padded
     * to allow the numeric values to line up vertically, e.g.
     *
     * ```
     * $       2.50
     * $      29.99
     * ```
     */
    Accounting = "accounting",
    /**
     * Indicates the value should be rendered as a number without a currency symbol, e.g. `2.50`.
     */
    Financial = "financial"
}
/**
 * A schema representing a return value or object property that is an amount of currency.
 */
export interface CurrencySchema extends BaseNumberSchema<ValueHintType.Currency> {
    /** Instructs Coda to render this value as a currency amount. */
    codaType: ValueHintType.Currency;
    /** The decimal precision. The value is rounded to this precision when rendered. */
    precision?: number;
    /**
     * A three-letter ISO 4217 currency code, e.g. USD or EUR.
     * If the currency code is not supported by Coda, the value will be rendered using USD.
     */
    currencyCode?: string;
    /** A render format for further refining how the value is rendered. */
    format?: CurrencyFormat;
}
/**
 * A schema representing a return value or object property that is a number that should
 * be rendered as a slider.
 */
export interface SliderSchema extends BaseNumberSchema<ValueHintType.Slider> {
    /** Instructs Coda to render this value as a slider. */
    codaType: ValueHintType.Slider;
    /** The minimum value selectable by this slider (supports number or formula). */
    minimum?: number | string;
    /** The maximum value selectable by this slider (supports number or formula). */
    maximum?: number | string;
    /** The minimum amount the slider can be moved when dragged (supports number or formula). */
    step?: number | string;
    /** Whether to display the underlying numeric value in addition to the slider. */
    showValue?: boolean;
}
/**
 * A schema representing a return value or object property that is a number that should
 * be rendered as a progress bar.
 */
export interface ProgressBarSchema extends BaseNumberSchema<ValueHintType.ProgressBar> {
    /** Instructs Coda to render this value as a progress bar. */
    codaType: ValueHintType.ProgressBar;
    /** The minimum value selectable by this progress bar (supports number or formula). */
    minimum?: number | string;
    /** The maximum value selectable by this progress bar (supports number or formula). */
    maximum?: number | string;
    /** The minimum amount the progress bar can be moved when dragged (supports number or formula). */
    step?: number | string;
    /** Whether to display the underlying numeric value in addition to the progress bar. */
    showValue?: boolean;
}
/**
 * Icons that can be used with a {@link ScaleSchema}.
 *
 * For example, to render a star rating, use a {@link ScaleSchema} with `icon: coda.ScaleIconSet.Star`.
 */
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
/**
 * A schema representing a return value or object property that is a number that should
 * be rendered as a scale.
 *
 * A scale is a widget with a repeated set of icons, where the number of shaded represents
 * a numeric value. The canonical example of a scale is a star rating, which might show
 * 5 star icons, with 3 of them shaded, indicating a value of 3.
 */
export interface ScaleSchema extends BaseNumberSchema<ValueHintType.Scale> {
    /** Instructs Coda to render this value as a scale. */
    codaType: ValueHintType.Scale;
    /** The number of icons to render. */
    maximum?: number;
    /** The icon to render. */
    icon?: ScaleIconSet;
}
/**
 * Display types that can be used with an {@link EmailSchema}.
 */
export declare enum EmailDisplayType {
    /**
     * Display both icon and email (default).
     */
    IconAndEmail = "iconAndEmail",
    /**
     * Display icon only.
     */
    IconOnly = "iconOnly",
    /**
     * Display email address only.
     */
    EmailOnly = "emailOnly"
}
/**
 * A schema representing a return value or object property that is an email address.
 *
 * An email address can be represented visually as an icon, an icon plus the email address, or
 * the just the email address.  Autocomplete against previously typed domain names is
 * also an option in the user interface.
 */
export interface EmailSchema extends BaseStringSchema<ValueHintType.Email> {
    /** Instructs Coda to render this value as an email address. */
    codaType: ValueHintType.Email;
    /** How the email should be displayed in the UI. */
    display?: EmailDisplayType;
}
/**
 * Display types that can be used with a {@link LinkSchema}.
 */
export declare enum LinkDisplayType {
    /**
     * Display icon only.
     */
    IconOnly = "iconOnly",
    /**
     * Display URL.
     */
    Url = "url",
    /**
     * Display web page title.
     */
    Title = "title",
    /**
     * Display the referenced web page as a card.
     */
    Card = "card",
    /**
     * Display the referenced web page as an embed.
     */
    Embed = "embed"
}
/**
 * A schema representing a return value or object property that is a hyperlink.
 *
 * The link can be displayed in the UI in multiple ways, as per the above enumeration.
 */
export interface LinkSchema extends BaseStringSchema<ValueHintType.Url> {
    /** Instructs Coda to render this value as a hyperlink. */
    codaType: ValueHintType.Url;
    /** How the URL should be displayed in the UI. */
    display?: LinkDisplayType;
    /** Whether to force client embedding (only for LinkDisplayType.Embed) - for example, if user login required. */
    force?: boolean;
}
/**
 * A schema representing a return value or object property that is provided as a string,
 * which Coda should interpret as a date. Coda is able to flexibly parse a number of formal
 * and informal string representations of dates. For maximum accuracy, consider using an
 * ISO 8601 date string (e.g. 2021-10-29): https://en.wikipedia.org/wiki/ISO_8601.
 */
export interface StringDateSchema extends BaseStringSchema<ValueHintType.Date> {
    /** Instructs Coda to render this value as a date. */
    codaType: ValueHintType.Date;
    /**
     * A Moment date format string, such as 'MMM D, YYYY', that corresponds to a supported Coda date column format,
     * used when rendering the value.
     *
     * Only applies when this is used as a sync table property.
     */
    format?: string;
}
/**
 * A schema representing a return value or object property that is provided as a string,
 * which Coda should interpret as an embed value (e.g. a URL). Coda uses an external provider (iframely)
 * to handle all embeds by default. If there is no support for a given embed that you want to use,
 * you will need to use the `force` option which falls back to a generic iframe.
 */
export interface StringEmbedSchema extends BaseStringSchema<ValueHintType.Embed> {
    /** Instructs Coda to render this value as an embed. */
    codaType: ValueHintType.Embed;
    /**
     * Toggle whether to try to force embed the content in Coda. Should be kept to false for most cases.
     *
     * By default, we use an external provider (iframely) that supports and normalizes embeds for different sites.
     * If you are trying to embed an uncommon site or one that is not supported by them,
     * you can set this to `true` to tell Coda to force render the embed. This renders a sandboxed iframe for the embed
     * but requires user consent per-domain to actually display the embed.
     */
    force?: boolean;
}
/**
 * A schema representing a return value or object property that is provided as a string, which Coda should
 * interpret as its internal rich text value. For "canvas column" types, `isCanvas` should be set to `true`.
 * @hidden
 */
export interface CodaInternalRichTextSchema extends BaseStringSchema<ValueHintType.CodaInternalRichText> {
    /**
     * Instructs Coda to render this value as internal rich text.
     * @hidden
     */
    codaType: ValueHintType.CodaInternalRichText;
    /**
     * Whether this is a embedded canvas column type vs. a "normal" text column type.
     * @hidden
     */
    isCanvas?: boolean;
}
/**
 * A schema representing a return value or object property that is provided as a string,
 * which Coda should interpret as a time.
 */
export interface StringTimeSchema extends BaseStringSchema<ValueHintType.Time> {
    /** Instructs Coda to render this value as a date. */
    codaType: ValueHintType.Time;
    /**
     * A Moment time format string, such as 'HH:mm:ss', that corresponds to a supported Coda time column format,
     * used when rendering the value.
     *
     * Only applies when this is used as a sync table property.
     */
    format?: string;
}
/**
 * A schema representing a return value or object property that is provided as a string,
 * which Coda should interpret as a datetime. Coda is able to flexibly a parse number of formal
 * and informal string representations of dates. For maximum accuracy, consider using an
 * ISO 8601 datetime string (e.g. 2021-11-03T19:43:58): https://en.wikipedia.org/wiki/ISO_8601.
 */
export interface StringDateTimeSchema extends BaseStringSchema<ValueHintType.DateTime> {
    /** Instructs Coda to render this value as a date. */
    codaType: ValueHintType.DateTime;
    /**
     * A Moment date format string, such as 'MMM D, YYYY', that corresponds to a supported Coda date column format,
     * used when rendering the value.
     *
     * Only applies when this is used as a sync table property.
     */
    dateFormat?: string;
    /**
     * A Moment time format string, such as 'HH:mm:ss', that corresponds to a supported Coda time column format,
     * used when rendering the value.
     *
     * Only applies when this is used as a sync table property.
     */
    timeFormat?: string;
}
/**
 * State of outline on images that can be used with a {@link ImageSchema}.
 */
export declare enum ImageOutline {
    /** Image is rendered without outline. */
    Disabled = "disabled",
    /** Image is rendered with outline. */
    Solid = "solid"
}
/**
 * State of corners on images that can be used with a {@link ImageSchema}.
 */
export declare enum ImageCornerStyle {
    /** Image is rendered with rounded corners. */
    Rounded = "rounded",
    /** Image is rendered with square corners. */
    Square = "square"
}
/**
 * Image shape styles supported by {@link ImageSchema}.
 */
export declare enum ImageShapeStyle {
    /** Image is rendered normally. */
    Auto = "auto",
    /** Image is rendered as a circle. */
    Circle = "circle"
}
/**
 * A schema representing a return value or object property that is provided as a string,
 * which Coda should interpret as an image.
 */
export interface ImageSchema extends BaseStringSchema<ValueHintType.ImageReference | ValueHintType.ImageAttachment> {
    /** Instructs Coda to render this value as an Image. */
    codaType: ValueHintType.ImageReference | ValueHintType.ImageAttachment;
    /** ImageOutline type specifying style of outline on images. If unspecified, default is Solid. */
    imageOutline?: ImageOutline;
    /** ImageCornerStyle type specifying style of corners on images. If unspecified, default is Rounded. */
    imageCornerStyle?: ImageCornerStyle;
    /** ImageShapeStyle type specifying shape of image. If unspecified, default is Auto. */
    imageShapeStyle?: ImageShapeStyle;
    /** How wide to render the image (supports number or formula). Use 0 for default. */
    width?: number | string;
    /** How tall to render the image (supports number or formula). Use 0 for default. */
    height?: number | string;
}
/**
 * Enumeration of units supported by duration schemas. See {@link DurationSchema.maxUnit}.
 */
export declare enum DurationUnit {
    /**
     * Indications a duration as a number of days.
     */
    Days = "days",
    /**
     * Indications a duration as a number of hours.
     */
    Hours = "hours",
    /**
     * Indications a duration as a number of minutes.
     */
    Minutes = "minutes",
    /**
     * Indications a duration as a number of seconds.
     */
    Seconds = "seconds"
}
/**
 * A schema representing a return value or object property that represents a duration. The value
 * should be provided as a string like "3 days" or "40 minutes 30 seconds".
 */
export interface DurationSchema extends BaseStringSchema<ValueHintType.Duration> {
    /**
     * A refinement of {@link DurationSchema.maxUnit} to use for rounding the duration when rendering.
     * Currently only `1` is supported, which is the same as omitting a value.
     */
    precision?: number;
    /**
     * The unit to use for rounding the duration when rendering. For example, if using `DurationUnit.Days`,
     * and a value of "3 days 4 hours" is provided, it will be rendered as "3 days".
     */
    maxUnit?: DurationUnit;
}
/**
 * A schema representing a value with selectable options.
 */
export interface StringWithOptionsSchema extends BaseStringSchema<ValueHintType.SelectList>, PropertyWithAutocompleteWithOptionalDisplay<string> {
    /** Instructs Coda to render this value as a select list. */
    codaType: ValueHintType.SelectList;
    /** Allow custom, user-entered strings in addition to {@link PropertyWithOptions.options}. */
    allowNewValues?: boolean;
}
export interface BaseStringSchema<T extends StringHintTypes = StringHintTypes> extends BaseSchema {
    /** Identifies this schema as a string. */
    type: ValueType.String;
    /** An optional type hint instructing Coda about how to interpret or render this value. */
    codaType?: T;
}
/**
 * The subset of StringHintTypes that don't have specific schema attributes.
 */
export declare const SimpleStringHintValueTypes: readonly [ValueHintType.Attachment, ValueHintType.Html, ValueHintType.Markdown, ValueHintType.Url, ValueHintType.Email, ValueHintType.CodaInternalRichText];
export type SimpleStringHintTypes = (typeof SimpleStringHintValueTypes)[number];
/**
 * A schema whose underlying value is a string, along with an optional hint about how Coda
 * should interpret that string.
 */
export interface SimpleStringSchema<T extends SimpleStringHintTypes = SimpleStringHintTypes> extends BaseStringSchema<T> {
}
/**
 * The union of schema definition types whose underlying value is a string.
 */
export type StringSchema = StringDateSchema | StringTimeSchema | StringDateTimeSchema | CodaInternalRichTextSchema | DurationSchema | EmailSchema | ImageSchema | LinkSchema | StringEmbedSchema | SimpleStringSchema | StringWithOptionsSchema;
/**
 * A schema representing a return value or object property that is an array (list) of items.
 * The items are themselves schema definitions, which may refer to scalars or other objects.
 */
export interface ArraySchema<T extends Schema = Schema> extends BaseSchema {
    /** Identifies this schema as an array. */
    type: ValueType.Array;
    /** A schema for the items of this array. */
    items: T;
}
/**
 * Fields that may be set on a schema property in the {@link ObjectSchemaDefinition.properties} definition
 * of an object schema.
 */
export interface ObjectSchemaProperty {
    /**
     * The name of a field in a return value object that should be re-mapped to this property.
     * This provides a way to rename fields from API responses without writing code.
     *
     * Suppose that you're fetching an object from an API that has a property called "duration".
     * But in your pack, you'd like the value to be called "durationSeconds" to be more precise.
     * You could write code in your `execute` function to relabel the field, but you could
     * also use `fromKey` and Coda will do it for you.
     *
     * Suppose your `execute` function looked like this:
     * ```
     * execute: async function(context) {
     *   const response = await context.fetcher.fetch({method: "GET", url: "/api/some-entity"});
     *   // Suppose the body of the response looks like {duration: 123, name: "foo"}.
     *   return response.body;
     * }
     * ```
     *
     * You can define your schema like this:
     * ```
     * coda.makeObjectSchema({
     *   properties: {
     *     name: {type: coda.ValueType.String},
     *     durationSeconds: {type: coda.ValueType.Number, fromKey: "duration"},
     *   },
     * });
     * ```
     *
     * This tells Coda to transform your formula's return value, creating a field "durationSeconds"
     * whose value comes another field called "duration".
     */
    fromKey?: string;
    /**
     * Without a `displayName`, a property's key will become the user-visible name. This isn't ideal
     * because the key must also be used by the Coda formula language to refer to the property, requiring
     * lossy transformation.
     *
     * You probably want to set displayName if:
     * - You want a display name with punctuation (e.g., "Version(s)", "Priority/Urgency", "Done?", "Alice's Thing")
     * - Your property key is not appropriate to show to an end-user (e.g., "custom_field_123")
     *
     * Only supported for top-level properties of a sync table.
     */
    displayName?: string;
    /**
     * When true, indicates that an object return value for a formula that has this schema must
     * include a non-empty value for this property.
     */
    required?: boolean;
    /**
     * Whether this object schema property is editable by the user in the UI.
     *
     * Only supported for top-level properties of a sync table.
     */
    mutable?: boolean;
    /**
     * Optional fixed ID for this property, used to support renames of properties over time. If specified,
     * changes to the name of this property will not cause the property to be treated as a new property.
     *
     * Only supported for top-level properties of a sync table.
     *
     * Note that fixedIds must already be present on the existing schema prior to rolling out a name change in a
     * new schema; adding fixedId and a name change in a single schema version change will not work.
     */
    fixedId?: string;
    /**
     * For internal use only, Pack makers cannot set this. It is auto-populated at build time
     * and if somehow there were a value here it would be overwritten.
     * Coda table schemas use a normalized version of a property key, so this field is used
     * internally to track what the Pack maker used as the property key, verbatim.
     * E.g., if a sync table schema had `properties: { 'foo-bar': {type: coda.ValueType.String} }`,
     * then the resulting column name would be "FooBar", but 'foo-bar' will be persisted as
     * the `originalKey`.
     * When we distinguish schema definitions from runtime schemas, this should be non-optional in the
     * runtime interface.
     * @hidden
     */
    originalKey?: string;
}
/**
 * The type of the {@link ObjectSchemaDefinition.properties} in the definition of an object schema.
 * This is essentially a dictionary mapping the name of a property to a schema
 * definition for that property.
 */
export type ObjectSchemaProperties<K extends string = never> = {
    [K2 in K | string]: Schema & ObjectSchemaProperty;
};
/** @hidden */
export type GenericObjectSchema = ObjectSchema<string, string>;
/**
 * An identifier for a schema, allowing other schemas to reference it.
 *
 * You may optionally specify an {@link ObjectSchemaDefinition.identity} when defining an object schema.
 * This signals that this schema represents an important named entity in the context of your pack.
 * Schemas with identities may be referenced by other schemas, in which case Coda
 * will render such values as @-references in the doc, allowing you to create relationships
 * between entities.
 *
 * Every sync table's top-level schema is required to have an identity. However, an identity
 * will be created on your behalf using the {@link SyncTableOptions.identityName} that you provide in the sync
 * table definition, so you needn't explicitly create one unless desired.
 */
export interface IdentityDefinition {
    /**
     * The name of this entity. This is an arbitrary name but should be unique within your pack.
     * For example, if you are defining a schema that represents a user object, "User" would be a good identity name.
     */
    name: string;
    /**
     * The dynamic URL, if this is a schema for a dynamic sync table. When returning a schema from the
     * {@link DynamicSyncTableOptions.getSchema} formula of a dynamic sync table, you must include
     * the dynamic URL of that table, so that rows
     * in this table may be distinguished from rows in another dynamic instance of the same table.
     *
     * When creating a reference to a dynamic sync table, you must include the dynamic URL of the table
     * you wish to reference, again to distinguish which table instance you are trying to reference.
     */
    dynamicUrl?: string;
    /** The ID of another pack, if you are trying to reference a value from different pack. */
    packId?: number;
    /**
     * By default, result sets returned by dynamic sync tables will not be merged together across different dynamicUrl
     * values for the purposes of presenting information. This value, if set, will allow results for identities for the
     * same Pack and name to be merged together if they share the same `mergeKey`.
     *
     * @hidden In development.
     */
    mergeKey?: string;
    /** @deprecated See {@link ObjectSchemaDefinition.attribution} */
    attribution?: AttributionNode[];
}
/**
 * The runtime version of {@link IdentityDefinition} with the current Pack ID injected if a different
 * one isn't set by the maker.
 */
export interface Identity extends IdentityDefinition {
    packId: number;
}
/**
 * An identifier for a schema property for specifying labels along with the reference to the property.
 * This is useful for specifying a label for a property reference that uses a json path, where the
 * label of the underlying property might not be descriptive enough at the top-level object.
 */
export interface PropertyIdentifierDetails {
    /**
     * An optional label for the property. This will be used in locations where the label appears with the property.
     *
     * If set to '', the label will be omitted.
     */
    label?: string;
    /**
     * An optional placeholder value, which will be rendered when the property value is an empty value
     * (null, undefined, "", [], \{\}). This will be used in the Pack card title, subtitle, and snippet.
     * Not accessible within the Coda formula language.
     */
    placeholder?: string;
    /**
     * The value of the property to reference. Can be either an exact property name or a json path.
     */
    property: string;
}
/**
 * An identifier for the value of a property for use in the {@link PropertyIdentifierDetails.label} field.
 * When used, this will be substituted with the value of the property for the final output of the label.
 *
 * If not present, the label will be used as-is in the default label format of '\{label\}: \{VALUE\}'.
 */
export declare const PropertyLabelValueTemplate = "{VALUE}";
/**
 * An identifier for an object schema property that is comprised of either an exact property match with the top-level
 * `properties or a json path (https://github.com/json-path/JsonPath) to a nested property.
 */
export type PropertyIdentifier<K extends string = string> = K | string | PropertyIdentifierDetails;
/**
 * The {@link ObjectSchemaDefinition} properties that reference keys in the `properties` object. These should all be
 * {@link PropertyIdentifier} types.
 */
export type ObjectSchemaPathProperties = Pick<GenericObjectSchema, 'titleProperty' | 'linkProperty' | 'imageProperty' | 'snippetProperty' | 'subtitleProperties' | 'createdAtProperty' | 'createdByProperty' | 'modifiedAtProperty' | 'modifiedByProperty' | 'userEmailProperty' | 'userIdProperty' | 'groupIdProperty' | 'memberGroupIdProperty' | 'versionProperty'>;
/**
 * Specifies how this property should be indexed.
 * @hidden
 */
export declare enum IndexingStrategy {
    Standard = "standard",
    Raw = "raw"
}
/**
 * A list of properties that will be used to provide context when indexing a property for full-text search.
 * @hidden
 */
export type ContextProperties = Array<PropertyIdentifier<string>>;
export type BasicIndexedProperty = PropertyIdentifier<string>;
/**
 * A property that will be used to filter the results of a search.
 *
 * For example, if you want to allow users to query for all emails last modified in the last 30 days,
 * you would add the property that represents the last modified date to filterableProperties.
 *
 * Filterable properties may be one of the following types:
 * {@link ValueType.Boolean}, {@link ValueType.Number}, {@link ValueType.String}, {@link ValueHintType.Person} or
 * an object with userEmailProperty or userIdProperty specified
 *
 * Filterable properties that are arrays may have one of the following item types:
 * {@link ValueType.Number}, {@link ValueType.String}, {@link ValueHintType.Person} or
 * an object with userEmailProperty or userIdProperty specified.
 *
 * For filtering purposes, number values will be rounded down to the nearest integer.
 * @hidden
 */
export type FilterableProperty = PropertyIdentifier<string>;
/**
 * A property to be indexed, supporting a more detailed definition than {@link BasicIndexedProperty}.
 * TODO(alexd): Unhide this
 * @hidden
 */
export interface DetailedIndexedProperty {
    /**
     * A property to be indexed. Must be a {@link ValueType.String} property.
     */
    property: PropertyIdentifier<string>;
    /**
     * The strategy to be used for indexing this property.
     */
    strategy: IndexingStrategy;
}
export type IndexedProperty = BasicIndexedProperty | DetailedIndexedProperty;
/**
 * Base definition for all index definitions.
 * @hidden
 */
interface BaseIndexDefinition {
    /**
     * The name of the property within {@link ObjectSchemaDefinition.properties} that can be interpreted as a number
     * between -1.0 and 1.0 representing the normalized authority score of this entity compared to all other entities.
     *
     * Must be a {@link ValueType.Number} property.
     * TODO(alexd): Unhide this
     * @hidden
     */
    authorityNormProperty?: PropertyIdentifier<string>;
    /**
     * The name of the property within {@link ObjectSchemaDefinition.properties} that can be interpreted as a number
     * between -1.0 and 1.0 representing the normalized popularity score of this entity compared to all other entities.
     *
     * Must be a {@link ValueType.Number} property.
     * TODO(alexd): Unhide this
     * @hidden
     */
    popularityNormProperty?: PropertyIdentifier<string>;
    /**
     * A list of properties from within {@link ObjectSchemaDefinition.properties}
     * that will be made available to filter the results of a search. Limited to 5 properties,
     * so these should be the properties most likely to be useful as filters.
     */
    filterableProperties?: FilterableProperty[];
}
/**
 * Defines how to index custom objects for use with full-text indexing.
 * TODO(alexd): Unhide this
 * @hidden
 */
export interface CustomIndexDefinition extends BaseIndexDefinition {
    /**
     * A list of properties from within {@link ObjectSchemaDefinition.properties} that should be indexed.
     */
    properties: IndexedProperty[];
    contextProperties?: ContextProperties;
}
/**
 * The type of content being indexed, which determines how the property is processed and queried.
 * @hidden
 */
export declare enum ContentCategorizationType {
    /** Messaging: Chat or instant messaging content */
    Messaging = "Messaging",
    /** Document: General document content */
    Document = "Document",
    /** Email: Email message content */
    Email = "Email",
    /** Comment: User comments or feedback */
    Comment = "Comment"
}
export interface BaseContentCategorization {
    type: ContentCategorizationType;
}
export interface MessagingContentCategorization extends BaseContentCategorization {
    type: ContentCategorizationType.Messaging;
}
export interface DocumentContentCategorization extends BaseContentCategorization {
    type: ContentCategorizationType.Document;
}
export interface EmailContentCategorization extends BaseContentCategorization {
    type: ContentCategorizationType.Email;
    toProperty: PropertyIdentifier<string>;
    fromProperty: PropertyIdentifier<string>;
    subjectProperty: PropertyIdentifier<string>;
    htmlBodyProperty: PropertyIdentifier<string>;
    plainTextBodyProperty: PropertyIdentifier<string>;
}
export interface CommentContentCategorization extends BaseContentCategorization {
    type: ContentCategorizationType.Comment;
}
export type ContentCategorization = MessagingContentCategorization | DocumentContentCategorization | EmailContentCategorization | CommentContentCategorization;
export interface ContentCategorizationTypeMap {
    [ContentCategorizationType.Messaging]: MessagingContentCategorization;
    [ContentCategorizationType.Document]: DocumentContentCategorization;
    [ContentCategorizationType.Email]: EmailContentCategorization;
    [ContentCategorizationType.Comment]: CommentContentCategorization;
}
/**
 * Defines how to index categorized objects for use with full-text indexing.
 * These categories are predefined by the system and expect to specific properties
 * to be present in the object.
 * @hidden
 */
export interface CategorizationIndexDefinition extends BaseIndexDefinition {
    /**
     * The category of the content to be indexed. Used to determine how to support the indexing
     * and querying for the text. Must be one of {@link ContentCategorization}.
     */
    contentCategorization: ContentCategorization;
}
/**
 * Defines how to index objects for use with full-text indexing.
 * @hidden
 */
export type IndexDefinition = CustomIndexDefinition | CategorizationIndexDefinition;
/**
 * Determines how permissions are handled for this object.
 */
export declare enum PermissionsBehavior {
    /**
     * The object will inherit permissions from its parent.
     */
    Inherit = "Inherit"
}
/**
 * Determines how the lifecycle of the child objects is handled.
 */
export declare enum LifecycleBehavior {
    /**
     * The child objects should be deleted when the parent object is deleted.
     */
    Inherit = "Inherit"
}
/**
 * A definition of a parent object.
 */
export interface ParentDefinition {
    /**
     * The name of the property within {@link ObjectSchemaDefinition.properties} that
     * identifies the parent of this object.
     *
     * Must be a {@link ValueType.Object} property with {@link ValueHintType.Reference} and contain
     * a valid {@link IdentityDefinition}.
     */
    parentIdProperty: PropertyIdentifier<string>;
    /**
     * Determines how permissions are handled for this object.
     */
    permissions?: PermissionsBehavior;
    /**
     * Determines how the lifecycle of the child objects is handled.
     */
    lifecycle?: LifecycleBehavior;
}
/**
 * A schema definition for an object value (a value with key-value pairs).
 */
export interface ObjectSchemaDefinition<K extends string, L extends string> extends BaseSchema, PropertyWithOptions<{}> {
    /** Identifies this schema as an object schema. */
    type: ValueType.Object;
    /** Definition of the key-value pairs in this object. */
    properties: ObjectSchemaProperties<K | L>;
    /** @deprecated Use {@link ObjectSchemaDefinition.idProperty} */
    id?: K;
    /**
     * The name of a property within {@link ObjectSchemaDefinition.properties} that represents a unique id for this
     * object. Sync table schemas must specify an id property, which uniquely identify each synced row.
     */
    idProperty?: K;
    /** @deprecated Use {@link ObjectSchemaDefinition.displayProperty} */
    primary?: K;
    /**
     * The name of a property within {@link ObjectSchemaDefinition.properties} that be used to label this object in the
     * UI.
     * Object values can contain many properties and the Coda UI will display them as a "chip"
     * with only the value of the "displayProperty" property used as the chip's display label.
     * The other properties can be seen when hovering over the chip.
     */
    displayProperty?: K;
    /**
     * A hint for how Coda should interpret and render this object value.
     *
     * For example, an object can represent a person (user) in a Coda doc, with properties for the
     * email address of the person and their name. Using `ValueHintType.Person` tells Coda to
     * render such a value as an @-reference to that person, rather than a basic object chip.
     */
    codaType?: ObjectHintTypes;
    /** @deprecated Use {@link ObjectSchemaDefinition.featuredProperties} */
    featured?: L[];
    /**
     * A list of property names from within {@link ObjectSchemaDefinition.properties} for the "featured" properties
     * of this object, used in sync tables. When a sync table is first added to a document,
     * columns are created for each of the featured properties. The user can easily add additional
     * columns for any other properties, as desired. All featured properties need to be top-level.
     * If you can't or don't want to change the received data format, consider changing the
     * received object after fetching and before returning and assigning it to the schema.
     *
     * This distinction exists for cases where a sync table may include dozens of properties,
     * which would create a very wide table that is difficult to use. Featuring properties
     * allows a sync table to be created with the most useful columns created by default,
     * and the user can add additional columns as they find them useful.
     *
     * Non-featured properties can always be referenced in formulas regardless of whether column
     * projections have been created for them.
     */
    featuredProperties?: L[];
    /**
     * An identity for this schema, if this schema is important enough to be named and referenced.
     * See {@link IdentityDefinition}.
     */
    identity?: IdentityDefinition;
    /**
     * Attribution text, images, and/or links that should be rendered along with this value.
     *
     * See {@link makeAttributionNode}.
     */
    attribution?: AttributionNode[];
    /**
     * Specifies that object instances with this schema can contain additional properties not defined
     * in the schema, and that the packs infrastructure should retain these unknown properties
     * rather than stripping them.
     *
     * Properties not declared in the schema will not work properly in Coda: they cannot be
     * used natively in the formula language and will not have correct types in Coda. But, in certain
     * scenarios they can be useful.
     */
    includeUnknownProperties?: boolean;
    /**
     * The name of a property within {@link properties} that will be used as a title of a rich card preview
     * for formulas that return this object.
     * Defaults to the value of {@link ObjectSchemaDefinition.displayProperty} if not specified
     *
     * Must be a {@link ValueType.String} property
     */
    titleProperty?: PropertyIdentifier<K>;
    /**
     * The name of a property within {@link ObjectSchemaDefinition.properties} that will
     * navigate users to more details about this object
     *
     * Must be a {@link ValueType.String} property with a {@link ValueHintType.Url}
     * {@link ObjectSchemaDefinition.codaType}.
     */
    linkProperty?: PropertyIdentifier<K>;
    /**
     * A list of property names from within {@link ObjectSchemaDefinition.properties} for the properties of the object
     * to be shown in the subtitle of a rich card preview for formulas that return this object.
     * Defaults to the value of {@link ObjectSchemaDefinition.featuredProperties} if not specified.
     */
    subtitleProperties?: Array<PropertyIdentifier<K>>;
    /**
     * The name of a property within {@link ObjectSchemaDefinition.properties} that be used as a textual summary
     * of the object.
     *
     * Must be a {@link ValueType.String} property or {@link ValueType.Array} of {@link ValueType.String}s.
     */
    snippetProperty?: PropertyIdentifier<K>;
    /**
     * The name of a property within {@link ObjectSchemaDefinition.properties} that can be used as a rich image preview of
     * the object.
     *
     * Must be a {@link ValueType.String} property with the
     * {@link ValueHintType.ImageAttachment} or {@link ValueHintType.ImageReference} hints
     */
    imageProperty?: PropertyIdentifier<K>;
    /**
     * The name of a property within {@link ObjectSchemaDefinition.properties} that can be interpreted as the creation
     * datetime of the object.
     *
     * Must be a {@link ValueType.String} or {@link ValueType.Number} property with the
     * {@link ValueHintType.Date} or {@link ValueHintType.DateTime} hints
     * @hidden
     */
    createdAtProperty?: PropertyIdentifier<K>;
    /**
     * The name of a property within {@link ObjectSchemaDefinition.properties} that can be interpreted as the creator
     * of the object.
     *
     * Must be a {@link ValueType.String} property with the {@link ValueHintType.Email} hint or
     * a {@link ValueType.Object} with the {@link ValueHintType.Person} hint
     * @hidden
     */
    createdByProperty?: PropertyIdentifier<K>;
    /**
     * The name of a property within {@link ObjectSchemaDefinition.properties} that can be interpreted as the last
     * modified datetime of the object.
     *
     * Must be a {@link ValueType.String} or {@link ValueType.Number} property with the
     * {@link ValueHintType.Date} or {@link ValueHintType.DateTime} hints
     * @hidden
     */
    modifiedAtProperty?: PropertyIdentifier<K>;
    /**
     * The name of a property within {@link ObjectSchemaDefinition.properties} that can be interpreted as the last
     * modifier of the object.
     *
     * Must be a {@link ValueType.String} property with the {@link ValueHintType.Email} hint or
     * a {@link ValueType.Object} with the {@link ValueHintType.Person} hint
     * @hidden
     */
    modifiedByProperty?: PropertyIdentifier<K>;
    /**
     * For cases where the object being synced represents a user, the name of the property within
     * {@link ObjectSchemaDefinition.properties} that identifies the email address of the user.
     *
     * This is required for sync tables with role {@link TableRole.User}
     *
     * Must be a {@link ValueType.String} property with the {@link ValueHintType.Email} hint or
     * a {@link ValueType.Object} with the {@link ValueHintType.Person} hint
     * @hidden
     */
    userEmailProperty?: PropertyIdentifier<K>;
    /**
     * For cases where the object being synced represents a user, the name of the property within
     * {@link ObjectSchemaDefinition.properties} that identifies the id of the user in the service
     * being synced from.
     *
     * This is required for sync tables with role {@link TableRole.User}
     *
     * One or both of {@link ObjectSchemaDefinition.memberGroupIdProperty}/{@link ObjectSchemaDefinition.userIdProperty}
     * are required for sync tables with role {@link TableRole.GroupMembers}.
     *
     * Must be a {@link ValueType.String} or {@link ValueType.Number} property
     * @hidden
     */
    userIdProperty?: PropertyIdentifier<K>;
    /**
     * For cases where the object being synced represents a group, the name of the property within
     * {@link ObjectSchemaDefinition.properties} that identifies the id of the group in the service
     * being synced from.
     *
     * This is required for sync tables with role {@link TableRole.GroupMembers}
     *
     * Must be a {@link ValueType.String} or {@link ValueType.Number} property
     * TODO(sam): Unhide this
     * @hidden
     */
    groupIdProperty?: PropertyIdentifier<K>;
    /**
     * For cases where the object being synced represents a nested group, the name of the property within
     * {@link ObjectSchemaDefinition.properties} that identifies the id of the nested group in the service
     * being synced from.
     *
     * One or both of {@link ObjectSchemaDefinition.memberGroupIdProperty}/{@link ObjectSchemaDefinition.userIdProperty}
     * are required for sync tables with role {@link TableRole.GroupMembers}.
     *
     * Must be a {@link ValueType.String} or {@link ValueType.Number} property
     *
     * Nested groups are additive. All children members of a nested group will be considered members of the parent group.
     * TODO(sam): Unhide this
     * @hidden
     */
    memberGroupIdProperty?: PropertyIdentifier<K>;
    /**
     * Defines how to index objects for use with full-text indexing.
     * @hidden
     */
    index?: IndexDefinition;
    /**
     * The name of the property within {@link ObjectSchemaDefinition.properties} that can be be interpreted as
     * text representing the version of an item.
     *
     * Must be a {@link ValueType.String} property.
     * TODO(ebo): Unhide this
     * @hidden
     */
    versionProperty?: PropertyIdentifier<K>;
    /**
     * Defines the parent of an object, if applicable.
     * TODO(alexd): Unhide this
     * @hidden
     */
    parent?: ParentDefinition;
}
/**
 * The type of principal that can be applied to a permission.
 *
 * TODO(sam): Unhide this
 * @hidden
 */
export declare enum PrincipalType {
    User = "user",
    Group = "group",
    Anyone = "anyone",
    AllUsers = "allUsers",
    Domain = "domain"
}
/**
 * This represents a principal that is a single user.
 *
 * TODO(sam): Unhide this
 * @hidden
 */
export interface UserPrincipal {
    type: PrincipalType.User;
    userId: string | number;
}
/**
 * This represents a principal that is a group of users.
 *
 * TODO(sam): Unhide this
 * @hidden
 */
export interface GroupPrincipal {
    type: PrincipalType.Group;
    groupId: string | number;
}
/**
 * This represents a principal that is anyone in that domain
 *
 * TODO(sam): Unhide this
 * @hidden
 */
export interface DomainPrincipal {
    type: PrincipalType.Domain;
    domain: string;
}
/**
 * This represents a principal corresponding to anyone
 *
 * Generally this would apply to an entity where anyone with access to the url can view the item.
 * Deprecated in favor of {@link AllUsersPrincipal}. Will be removed in a future SDK version.
 *
 * TODO(sam): Unhide this
 * @deprecated
 * @hidden
 */
export interface AnyonePrincipal {
    type: PrincipalType.Anyone;
}
/**
 * This represents a principal corresponding to anyone who has access to the external system.
 *
 * This corresponds to any user who appears in the sync table with role {@link TableRole.Users}
 *
 * TODO(sam): Unhide this
 * @hidden
 */
export interface AllUsersPrincipal {
    type: PrincipalType.AllUsers;
}
/**
 * This represents a principal that can be granted access.
 *
 * TODO(sam): Unhide this
 * @hidden
 */
type Principal = UserPrincipal | GroupPrincipal | AnyonePrincipal | DomainPrincipal | AllUsersPrincipal;
/**
 * The type of permission.
 * Delegated permissions are permissions that are inherited from another object that aren't
 * within the same sync table.
 * Direct permissions are permissions that are directly applied to the object. E.g. a user or group, etc
 * TODO(drew): Unhide this
 * @hidden
 */
export declare enum PermissionType {
    Delegated = "delegated",
    Direct = "direct"
}
/**
 * This represents the definition of a direct permission in the external system.
 *
 * TODO(sam): Unhide this
 * @hidden
 */
export interface DirectPermission {
    permissionType?: PermissionType.Direct;
    principal: Principal;
}
/**
 * This represents the definition of a delegated permission in the external system.
 *
 * TODO(drew): Unhide this
 * @hidden
 */
export interface DelegatedPermission {
    permissionType: PermissionType.Delegated;
    item: ItemReference;
}
/**
 * A reference to an item elsewhere in the Pack, typically another row in the same sync
 * table but also potentially a row in another sync table.
 *
 * This is specifically used only outside the context of an object schema, particularly
 * when returning permissions for a sync table row. If just returning sync table result
 * rows where one of the row properties is a reference to a row in another table,
 * you would just return an object with an item id and item name, since the object schema
 * for that property already describes the table to be referenced in the Identity on that schema.
 * Without an object schema, the identity name of the class of item being referenced must be
 * explicitly provided.
 *
 * TODO(drew): Unhide this
 * @hidden
 */
export interface ItemReference {
    id: string | number;
    syncTableName: string;
    identityName: string;
    dynamicUrl?: string;
}
/**
 * This represents the different permissions in the external system.
 *
 * TODO(drew): Unhide this
 * @hidden
 */
export type Permission = DirectPermission | DelegatedPermission;
/**
 * This represents the list of permissions on a sync table row.
 *
 * TODO(sam): Unhide this
 * @hidden
 */
export interface RowAccessDefinition {
    permissions: Permission[];
    rowId: string | number;
}
export type ObjectSchemaDefinitionType<K extends string, L extends string, T extends ObjectSchemaDefinition<K, L>> = ObjectSchemaType<T>;
/** @hidden */
export interface ObjectSchema<K extends string, L extends string> extends ObjectSchemaDefinition<K, L> {
    /**
     * This overrides the `identity` field of ObjectSchemaDefinition with a type that also includes packId.
     */
    identity?: Identity;
    /**
     * Pack makers should never need to interact with this, it's just present for Coda's internal plumbing.
     */
    __packId?: number;
}
/**
 * The type of content in this attribution node.
 *
 * Multiple attribution nodes can be rendered all together, for example to have
 * attribution that contains both text and a logo image.
 *
 * @see [Structuring data with schemas - Data attribution](https://coda.io/packs/build/latest/guides/advanced/schemas/#attribution)
 */
export declare enum AttributionNodeType {
    /**
     * Text attribution content.
     */
    Text = 1,
    /**
     * A hyperlink pointing to the data source.
     */
    Link = 2,
    /**
     * An image, often a logo of the data source.
     */
    Image = 3
}
/**
 * An attribution node that simply renders some text.
 *
 * This might be used to attribute the data source.
 *
 * @example
 * ```
 * coda.makeAttributionNode({
 *   type: coda.AttributionNodeType.Text,
 *   text: "Data provided by ExampleCorp.",
 * });
 * ```
 */
export interface TextAttributionNode {
    /** Identifies this as a text attribution node. */
    type: AttributionNodeType.Text;
    /** The text to render with the pack value. */
    text: string;
}
/**
 * An attribution node that renders a hyperlink.
 *
 * This might be used to attribute the data source and link back to the home page
 * of the data source or directly to the source data.
 *
 * @example
 * ```
 * coda.makeAttributionNode({
 *   type: coda.AttributionNodeType.Link,
 *   anchorUrl: "https://example.com",
 *   anchorText: "Data provided by ExampleCorp.",
 * });
 * ```
 */
export interface LinkAttributionNode {
    /** Identifies this as a link attribution node. */
    type: AttributionNodeType.Link;
    /** The URL to link to. */
    anchorUrl: string;
    /** The text of the hyperlink. */
    anchorText: string;
}
/**
 * An attribution node that renders as a hyperlinked image.
 *
 * This is often the logo of the data source along with a link back to the home page
 * of the data source or directly to the source data.
 *
 * @example
 * ```
 * coda.makeAttributionNode({
 *   type: coda.AttributionNodeType.Image,
 *   anchorUrl: "https://example.com",
 *   imageUrl: "https://example.com/assets/logo.png",
 * });
 * ```
 */
export interface ImageAttributionNode {
    /** Identifies this as an image attribution node. */
    type: AttributionNodeType.Image;
    /** The URL to link to. */
    anchorUrl: string;
    /** The URL of the image to render. */
    imageUrl: string;
}
/**
 * Union of attribution node types for rendering attribution for a pack value. See {@link makeAttributionNode}.
 */
export type AttributionNode = TextAttributionNode | LinkAttributionNode | ImageAttributionNode;
/**
 * A helper for constructing attribution text, links, or images that render along with a Pack value.
 *
 * Many APIs have licensing requirements that ask for specific attribution to be included
 * when using their data. For example, a stock photo API may require attribution text
 * and a logo.
 *
 * Any {@link IdentityDefinition} can include one or more attribution nodes that will be
 * rendered any time a value with that identity is rendered in a doc.
 */
export declare function makeAttributionNode<T extends AttributionNode>(node: T): T;
/**
 * The union of all of the schema types supported for return values and object properties.
 */
export type Schema = BooleanSchema | NumberSchema | StringSchema | ArraySchema | GenericObjectSchema;
export declare function isObject(val?: Schema): val is GenericObjectSchema;
export declare function isArray(val?: Schema): val is ArraySchema;
type SchemaSupportingAutocomplete = ReturnType<typeof maybeUnwrapArraySchema> & {
    codaType: typeof AutocompleteHintValueTypes;
} & PropertyWithOptions<PackFormulaResult>;
export declare function unwrappedSchemaSupportsOptions(schema: ReturnType<typeof maybeUnwrapArraySchema>): schema is SchemaSupportingAutocomplete;
export declare function maybeSchemaOptionsValue(schema: Schema | undefined): PropertySchemaOptions<PackFormulaResult> | undefined;
/**
 * Pulls out the item type of an Array schema, returning undefined if the Array contains another Array.
 */
export declare function maybeUnwrapArraySchema(val?: Schema): BooleanSchema | NumberSchema | StringSchema | GenericObjectSchema | undefined;
interface StringHintTypeToSchemaTypeMap {
    [ValueHintType.Date]: Date | string | number;
}
type StringHintTypeToSchemaType<T extends StringHintTypes | undefined> = T extends keyof StringHintTypeToSchemaTypeMap ? StringHintTypeToSchemaTypeMap[T] : string;
type ObjectSchemaFromKey<T extends ObjectSchemaProperties<any>, K extends keyof T> = T[K]['fromKey'] extends string ? T[K]['fromKey'] : K;
type ObjectSchemaPropertiesSchemaType<T extends ObjectSchemaProperties<any>> = {
    -readonly [K in keyof T as ObjectSchemaFromKey<T, K>]: SchemaType<T[K]>;
};
type ObjectSchemaRequiredProperties<T extends ObjectSchemaProperties<any>> = {
    [K in keyof T]: T[K] extends {
        required: true;
    } ? K : never;
}[keyof T];
type ObjectSchemaType<T extends ObjectSchemaDefinition<any, any>> = ObjectSchemaPropertiesSchemaType<Pick<T['properties'], ObjectSchemaRequiredProperties<T['properties']>>> & Partial<ObjectSchemaPropertiesSchemaType<Omit<T['properties'], ObjectSchemaRequiredProperties<T['properties']>>>>;
/**
 * A TypeScript helper that parses the expected `execute` function return type from a given schema.
 * That is, given a schema, this utility will produce the type that an `execute` function should return
 * in order to fulfill the schema.
 *
 * For example, `SchemaType<NumberSchema>` produces the type `number`.
 *
 * For an object schema, this will for the most part return an object matching the schema
 * but if the schema uses {@link ObjectSchemaProperty.fromKey} then this utility will be unable to infer
 * that the return value type should use the property names given in the `fromKey`
 * attribute, and will simply relax any property name type-checking in such a case.
 *
 * This utility is very optional and only useful for advanced cases of strong typing.
 * It can be helpful for adding type-checking for the return value of an `execute` function
 * to ensure that it matches the schema you have declared for that formula.
 */
export type SchemaType<T extends Schema> = T extends BooleanSchema ? boolean : T extends NumberSchema ? number : T extends StringSchema ? StringHintTypeToSchemaType<T['codaType']> : T extends ArraySchema ? Array<SchemaType<T['items']>> : T extends GenericObjectSchema ? ObjectSchemaType<T> : never;
/** Primitive types for which {@link generateSchema} can infer a schema. */
export type InferrableTypes = boolean | number | string | object | boolean[] | number[] | string[] | object[];
/**
 * Utility that examines a JavaScript value and attempts to infer a schema definition
 * that describes it.
 *
 * It is vastly preferable to define a schema manually. A clear and accurate schema is one of the
 * fundamentals of a good pack. However, for data that is truly dynamic for which a schema can't
 * be known in advance nor can a function be written to generate a dynamic schema from other
 * inputs, it may be useful to us this helper to sniff the return value and generate a basic
 * inferred schema from it.
 *
 * This utility does NOT attempt to determine {@link ObjectSchemaDefinition.idProperty} or
 * {@link ObjectSchemaDefinition.displayProperty} attributes for
 * an object schema, those are left undefined.
 */
export declare function generateSchema(obj: InferrableTypes): Schema;
/**
 * A wrapper for creating any schema definition.
 *
 * If you are creating a schema for an object (as opposed to a scalar or array),
 * use the more specific {@link makeObjectSchema}.
 *
 * It is always recommended to use wrapper functions for creating top-level schema
 * objects rather than specifying object literals. Wrappers validate your schemas
 * at creation time, provide better TypeScript type inference, and can reduce
 * boilerplate.
 *
 * At this time, this wrapper provides only better TypeScript type inference,
 * but it may do validation in a future SDK version.
 *
 * @example
 * ```
 * coda.makeSchema({
 *   type: coda.ValueType.Array,
 *   items: {type: coda.ValueType.String},
 * });
 * ```
 */
export declare function makeSchema<T extends Schema>(schema: T): T;
/**
 * A wrapper for creating a schema definition for an object value.
 *
 * It is always recommended to use wrapper functions for creating top-level schema
 * objects rather than specifying object literals. Wrappers validate your schemas
 * at creation time, provide better TypeScript type inference, and can reduce
 * boilerplate.
 *
 * @example
 * ```
 * coda.makeObjectSchema({
 *   id: "email",
 *   primary: "name",
 *   properties: {
 *     email: {type: coda.ValueType.String, required: true},
 *     name: {type: coda.ValueType.String, required: true},
 *   },
 * });
 * ```
 */
export declare function makeObjectSchema<K extends string, L extends string, const T extends Omit<ObjectSchemaDefinition<K, L>, 'type'>>(schemaDef: T & {
    type?: ValueType.Object;
}): T & {
    identity?: Identity;
    type: ValueType.Object;
};
/**
 * Normalizes a schema key into PascalCase.
 */
export declare function normalizeSchemaKey(key: string): string;
/**
 * Normalizes a schema property key path. This interprets "."s as accessing object properties
 * and "[]" as accessing array items. Uses normalizeSchemaKey to normalize each part in-between.
 *
 * This is used for object schema properties that support path projection.
 */
export declare function normalizeSchemaKeyPath(key: string, normalizedProperties: ObjectSchemaProperties): string;
export declare function isCategorizationIndexDefinition(index: IndexDefinition): index is CategorizationIndexDefinition;
export declare function isCustomIndexDefinition(index: IndexDefinition): index is CustomIndexDefinition;
/**
 * Attempts to transform a property value (which may be a json-path string or a normal object schema property) into
 * a path to access the relevant schema. Specifically this handles the case of
 *   1) object schemas which have an intermediate `properties` object and
 *   2) array schemas which have an intermediate `items` object to traverse.
 */
export declare function normalizePropertyValuePathIntoSchemaPath(propertyValue: string): string;
export declare function normalizeSchema<T extends Schema>(schema: T): T;
export declare function normalizeObjectSchema(schema: GenericObjectSchema): GenericObjectSchema;
/**
 * Convenience for creating a reference object schema from an existing schema for the
 * object. Copies over the identity, idProperty, and displayProperty from the schema,
 * and the subset of properties indicated by the idProperty and displayProperty.
 * A reference schema can always be defined directly, but if you already have an object
 * schema it provides better code reuse to derive a reference schema instead.
 */
export declare function makeReferenceSchemaFromObjectSchema(schema: ObjectSchemaDefinition<string, string> & ObjectSchemaProperty, identityName?: string): GenericObjectSchema & ObjectSchemaProperty;
/**
 * Convenience for defining the result schema for an action. The identity enables Coda to
 * update the corresponding sync table row, if it exists.
 * You could add the identity directly, but that would make the schema less re-usable.
 */
export declare function withIdentity(schema: GenericObjectSchema, identityName: string): GenericObjectSchema;
/**
 * If someone tries to put a js function into a getSchema result in a dynamic schema, it's not going to work.
 * This method is to detect this proactively and give a clear, user-visible error message. Otherwise the error
 * they'd get would be an internal error, and the pack maker tools logs would just mention that structured clone
 * failed to copy a function.
 */
export declare function throwOnDynamicSchemaWithJsOptionsFunction(dynamicSchema: any, parentKey?: string): void;
export {};
