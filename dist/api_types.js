"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionsType = exports.PrecannedDateRange = exports.ValidFetchMethods = exports.NetworkConnection = exports.ConnectionRequirement = exports.ParameterTypeInputMap = exports.ParameterType = exports.fileArray = exports.imageArray = exports.htmlArray = exports.dateArray = exports.booleanArray = exports.numberArray = exports.stringArray = exports.isArrayType = exports.Type = void 0;
/**
 * Markers used internally to represent data types for parameters and return values.
 * It should not be necessary to ever use these values directly.
 *
 * When defining a parameter, use {@link ParameterType}. When defining
 * a formula return value, or properties within an object return value,
 * use {@link ValueType}.
 */
var Type;
(function (Type) {
    Type[Type["string"] = 0] = "string";
    Type[Type["number"] = 1] = "number";
    Type[Type["object"] = 2] = "object";
    Type[Type["boolean"] = 3] = "boolean";
    Type[Type["date"] = 4] = "date";
    Type[Type["html"] = 5] = "html";
    Type[Type["image"] = 6] = "image";
    Type[Type["file"] = 7] = "file";
    Type[Type["markdown"] = 8] = "markdown";
})(Type || (exports.Type = Type = {}));
function isArrayType(obj) {
    return obj && obj.type === 'array' && typeof obj.items === 'number';
}
exports.isArrayType = isArrayType;
/** @deprecated */
exports.stringArray = {
    type: 'array',
    items: Type.string,
};
/** @deprecated */
exports.numberArray = {
    type: 'array',
    items: Type.number,
};
/** @deprecated */
exports.booleanArray = {
    type: 'array',
    items: Type.boolean,
};
/** @deprecated */
exports.dateArray = {
    type: 'array',
    items: Type.date,
};
/** @deprecated */
exports.htmlArray = {
    type: 'array',
    items: Type.html,
};
/** @deprecated */
exports.imageArray = {
    type: 'array',
    items: Type.image,
};
/** @deprecated */
exports.fileArray = {
    type: 'array',
    items: Type.file,
};
/**
 * Enumeration of types of formula parameters. These describe Coda value types (as opposed to JavaScript value types).
 */
var ParameterType;
(function (ParameterType) {
    /**
     * Indicates a parameter that is a Coda text value.
     */
    ParameterType["String"] = "string";
    /**
     * Indicates a parameter that is a Coda number value.
     */
    ParameterType["Number"] = "number";
    /**
     * Indicates a parameter that is a Coda boolean value.
     */
    ParameterType["Boolean"] = "boolean";
    /**
     * Indicates a parameter that is a Coda date value (which includes time and datetime values).
     */
    ParameterType["Date"] = "date";
    /**
     * Indicates a parameter that is a Coda rich text value that should be passed to the pack as HTML.
     */
    ParameterType["Html"] = "html";
    /**
     * Indicates a parameter that is a Coda image. The pack is passed an image URL.
     */
    ParameterType["Image"] = "image";
    /**
     * Indicates a parameter that is a Coda file. The pack is passed a file URL.
     */
    ParameterType["File"] = "file";
    /**
     * Indicates a parameter that is a Coda rich text value that should be passed to the pack as Markdown.
     */
    ParameterType["Markdown"] = "markdown";
    /**
     * Indicates a parameter that is a list of Coda text values.
     */
    ParameterType["StringArray"] = "stringArray";
    /**
     * {@link StringArray} that accepts unparsable values as `undefined`.
     */
    ParameterType["SparseStringArray"] = "sparseStringArray";
    /**
     * Indicates a parameter that is a list of Coda number values.
     */
    ParameterType["NumberArray"] = "numberArray";
    /**
     * {@link NumberArray} that accepts unparsable values as `undefined`.
     */
    ParameterType["SparseNumberArray"] = "sparseNumberArray";
    /**
     * Indicates a parameter that is a list of Coda boolean values.
     */
    ParameterType["BooleanArray"] = "booleanArray";
    /**
     * {@link BooleanArray} that accepts unparsable values as `undefined`.
     */
    ParameterType["SparseBooleanArray"] = "sparseBooleanArray";
    /**
     * Indicates a parameter that is a list of Coda date values (which includes time and datetime values).
     *
     * Currently, when such a parameter is used with a sync table formula or an action formula
     * ({@link BaseFormulaDef.isAction}), which will generate a builder UI for selecting parameters, a date array
     * parameter will always render as a date range selector. A date range will always be passed to a pack formula
     * as a list of two elements, the beginning of the range and the end of the range.
     */
    ParameterType["DateArray"] = "dateArray";
    /**
     * {@link DateArray} that accepts unparsable values as `undefined`.
     */
    ParameterType["SparseDateArray"] = "sparseDateArray";
    /**
     * Indicates a parameter that is a list of Coda rich text values that should be passed to the pack as HTML.
     */
    ParameterType["HtmlArray"] = "htmlArray`";
    /**
     * {@link HtmlArray} that accepts unparsable values as `undefined`.
     */
    ParameterType["SparseHtmlArray"] = "sparseHtmlArray";
    /**
     * Indicates a parameter that is a list of Coda image values. The pack is passed a list of image URLs.
     */
    ParameterType["ImageArray"] = "imageArray";
    /**
     * {@link ImageArray} that accepts unparsable values as `undefined`.
     */
    ParameterType["SparseImageArray"] = "sparseImageArray";
    /**
     * Indicates a parameter that is a list of Coda file values. The pack is passed a list of file URLs.
     */
    ParameterType["FileArray"] = "fileArray";
    /**
     * {@link FileArray} that accepts unparsable values as `undefined`.
     */
    ParameterType["SparseFileArray"] = "sparseFileArray";
    /**
     * Indicates a parameter that is a list of Coda rich text values that should be passed to the pack as Markdown.
     */
    ParameterType["MarkdownArray"] = "markdownArray`";
    /**
     * {@link MarkdownArray} that accepts unparsable values as `undefined`.
     */
    ParameterType["SparseMarkdownArray"] = "sparseMarkdownArray";
})(ParameterType || (exports.ParameterType = ParameterType = {}));
exports.ParameterTypeInputMap = {
    [ParameterType.String]: Type.string,
    [ParameterType.Number]: Type.number,
    [ParameterType.Boolean]: Type.boolean,
    [ParameterType.Date]: Type.date,
    [ParameterType.Html]: Type.html,
    [ParameterType.Image]: Type.image,
    [ParameterType.File]: Type.file,
    [ParameterType.Markdown]: Type.markdown,
    [ParameterType.StringArray]: { type: 'array', items: Type.string },
    [ParameterType.NumberArray]: { type: 'array', items: Type.number },
    [ParameterType.BooleanArray]: { type: 'array', items: Type.boolean },
    [ParameterType.DateArray]: { type: 'array', items: Type.date },
    [ParameterType.HtmlArray]: { type: 'array', items: Type.html },
    [ParameterType.ImageArray]: { type: 'array', items: Type.image },
    [ParameterType.FileArray]: { type: 'array', items: Type.file },
    [ParameterType.MarkdownArray]: { type: 'array', items: Type.markdown },
    [ParameterType.SparseStringArray]: { type: 'array', items: Type.string, allowEmpty: true },
    [ParameterType.SparseNumberArray]: { type: 'array', items: Type.number, allowEmpty: true },
    [ParameterType.SparseBooleanArray]: { type: 'array', items: Type.boolean, allowEmpty: true },
    [ParameterType.SparseDateArray]: { type: 'array', items: Type.date, allowEmpty: true },
    [ParameterType.SparseHtmlArray]: { type: 'array', items: Type.html, allowEmpty: true },
    [ParameterType.SparseImageArray]: { type: 'array', items: Type.image, allowEmpty: true },
    [ParameterType.SparseFileArray]: { type: 'array', items: Type.file, allowEmpty: true },
    [ParameterType.SparseMarkdownArray]: { type: 'array', items: Type.markdown, allowEmpty: true },
};
/**
 * Enumeration of requirement states for whether a given formula or sync table requires
 * a connection (account) to use.
 */
var ConnectionRequirement;
(function (ConnectionRequirement) {
    /**
     * Indicates this building block does not make use of an account.
     */
    ConnectionRequirement["None"] = "none";
    /**
     * Indicates that this building block can be used with or without an account.
     *
     * An optional parameter will be added to the formula (or sync formula) for the calling user
     * to specify an account to use.
     */
    ConnectionRequirement["Optional"] = "optional";
    /**
     * Indicates that this building block must be used with an account.
     *
     * A required parameter will be added to the formula (or sync formula) for the calling user
     * to specify an account to use.
     */
    ConnectionRequirement["Required"] = "required";
})(ConnectionRequirement || (exports.ConnectionRequirement = ConnectionRequirement = {}));
/** @deprecated use `ConnectionRequirement` instead */
var NetworkConnection;
(function (NetworkConnection) {
    NetworkConnection["None"] = "none";
    NetworkConnection["Optional"] = "optional";
    NetworkConnection["Required"] = "required";
})(NetworkConnection || (exports.NetworkConnection = NetworkConnection = {}));
/** The HTTP methods (verbs) supported by the fetcher. */
exports.ValidFetchMethods = ['GET', 'PATCH', 'POST', 'PUT', 'DELETE', 'HEAD'];
// A mapping exists in coda that allows these to show up in the UI.
// If adding new values here, add them to that mapping and vice versa.
/**
 * Special "live" date range values that can be used as the {@link ParamDef.suggestedValue}
 * for a date array parameter.
 *
 * Date array parameters are meant to represent date ranges. A date range can
 * be a fixed range, e.g. April 1, 2020 - May 15, 2020, or it can be a "live"
 * range, like "last 30 days".
 *
 * At execution time, a date range will always be passed to a pack as an
 * array of two specific dates, but for many use cases, it is necessary
 * to provide a default value that is a "live" range rather than hardcoded
 * one. For example, if your pack has a table that syncs recent emails,
 * you might want to have a date range parameter that default to
 * "last 7 days". Defaulting to a hardcoded date range would not be useful
 * and requiring the user to always specify a date range may be inconvenient.
 */
var PrecannedDateRange;
(function (PrecannedDateRange) {
    // Past
    PrecannedDateRange["Yesterday"] = "yesterday";
    PrecannedDateRange["Last7Days"] = "last_7_days";
    PrecannedDateRange["Last30Days"] = "last_30_days";
    PrecannedDateRange["Last90Days"] = "last_90_days";
    PrecannedDateRange["Last180Days"] = "last_180_days";
    PrecannedDateRange["Last365Days"] = "last_365_days";
    PrecannedDateRange["LastWeek"] = "last_week";
    PrecannedDateRange["LastMonth"] = "last_month";
    /** @deprecated */
    PrecannedDateRange["Last3Months"] = "last_3_months";
    /** @deprecated */
    PrecannedDateRange["Last6Months"] = "last_6_months";
    PrecannedDateRange["LastYear"] = "last_year";
    // Present
    PrecannedDateRange["Today"] = "today";
    PrecannedDateRange["ThisWeek"] = "this_week";
    PrecannedDateRange["ThisMonth"] = "this_month";
    PrecannedDateRange["YearToDate"] = "year_to_date";
    PrecannedDateRange["ThisYear"] = "this_year";
    PrecannedDateRange["Last7AndNext7Days"] = "last_7_and_next_7_days";
    PrecannedDateRange["Last30AndNext30Days"] = "last_30_and_next_30_days";
    // Future
    PrecannedDateRange["Tomorrow"] = "tomorrow";
    PrecannedDateRange["Next7Days"] = "next_7_days";
    PrecannedDateRange["Next30Days"] = "next_30_days";
    PrecannedDateRange["Next90Days"] = "next_90_days";
    PrecannedDateRange["Next180Days"] = "next_180_days";
    PrecannedDateRange["Next365Days"] = "next_365_days";
    PrecannedDateRange["NextWeek"] = "next_week";
    PrecannedDateRange["NextMonth"] = "next_month";
    /** @deprecated */
    PrecannedDateRange["Next3Months"] = "next_3_months";
    /** @deprecated */
    PrecannedDateRange["Next6Months"] = "next_6_months";
    PrecannedDateRange["NextYear"] = "next_year";
    /**
     * Indicates a date range beginning in the very distant past (e.g. 1/1/1, aka 1 A.D.)
     * and ending in the distant future (e.g. 12/31/3999). Exact dates are subject to change.
     */
    PrecannedDateRange["Everything"] = "everything";
})(PrecannedDateRange || (exports.PrecannedDateRange = PrecannedDateRange = {}));
/**
 * An enum defining special types options handling for properties.
 */
var OptionsType;
(function (OptionsType) {
    // These are special sentinel values for property options functions that aren't named
    // after user-defined schema properties. Make sure the values aren't likely to collide with
    // user-defined properties.
    /**
     * The property's options should be generated by the sync table's
     * {@link DynamicSyncTableOptions.propertyOptions} function.
     */
    OptionsType["Dynamic"] = "__coda_dynamic__";
})(OptionsType || (exports.OptionsType = OptionsType = {}));
