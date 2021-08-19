"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrecannedDateRange = exports.NetworkConnection = exports.ConnectionRequirement = exports.ParameterTypeInputMap = exports.ParameterType = exports.imageArray = exports.htmlArray = exports.dateArray = exports.booleanArray = exports.numberArray = exports.stringArray = exports.isArrayType = exports.Type = void 0;
var Type;
(function (Type) {
    Type[Type["string"] = 0] = "string";
    Type[Type["number"] = 1] = "number";
    Type[Type["object"] = 2] = "object";
    Type[Type["boolean"] = 3] = "boolean";
    Type[Type["date"] = 4] = "date";
    Type[Type["html"] = 5] = "html";
    Type[Type["image"] = 6] = "image";
})(Type = exports.Type || (exports.Type = {}));
function isArrayType(obj) {
    return obj && obj.type === 'array' && typeof obj.items === 'number';
}
exports.isArrayType = isArrayType;
exports.stringArray = {
    type: 'array',
    items: Type.string,
};
exports.numberArray = {
    type: 'array',
    items: Type.number,
};
exports.booleanArray = {
    type: 'array',
    items: Type.boolean,
};
exports.dateArray = {
    type: 'array',
    items: Type.date,
};
exports.htmlArray = {
    type: 'array',
    items: Type.html,
};
exports.imageArray = {
    type: 'array',
    items: Type.image,
};
var ParameterType;
(function (ParameterType) {
    ParameterType["String"] = "string";
    ParameterType["Number"] = "number";
    ParameterType["Boolean"] = "boolean";
    ParameterType["Date"] = "date";
    ParameterType["Html"] = "html";
    ParameterType["Image"] = "image";
    ParameterType["StringArray"] = "stringArray";
    ParameterType["NumberArray"] = "numberArray";
    ParameterType["BooleanArray"] = "booleanArray";
    ParameterType["DateArray"] = "dateArray";
    ParameterType["HtmlArray"] = "htmlArray`";
    ParameterType["ImageArray"] = "imageArray";
})(ParameterType = exports.ParameterType || (exports.ParameterType = {}));
exports.ParameterTypeInputMap = {
    [ParameterType.String]: Type.string,
    [ParameterType.Number]: Type.number,
    [ParameterType.Boolean]: Type.boolean,
    [ParameterType.Date]: Type.date,
    [ParameterType.Html]: Type.html,
    [ParameterType.Image]: Type.image,
    [ParameterType.StringArray]: { type: 'array', items: Type.string },
    [ParameterType.NumberArray]: { type: 'array', items: Type.number },
    [ParameterType.BooleanArray]: { type: 'array', items: Type.boolean },
    [ParameterType.DateArray]: { type: 'array', items: Type.date },
    [ParameterType.HtmlArray]: { type: 'array', items: Type.html },
    [ParameterType.ImageArray]: { type: 'array', items: Type.image },
};
var ConnectionRequirement;
(function (ConnectionRequirement) {
    ConnectionRequirement["None"] = "none";
    ConnectionRequirement["Optional"] = "optional";
    ConnectionRequirement["Required"] = "required";
})(ConnectionRequirement = exports.ConnectionRequirement || (exports.ConnectionRequirement = {}));
/** @deprecated use `ConnectionRequirement` instead */
var NetworkConnection;
(function (NetworkConnection) {
    NetworkConnection["None"] = "none";
    NetworkConnection["Optional"] = "optional";
    NetworkConnection["Required"] = "required";
})(NetworkConnection = exports.NetworkConnection || (exports.NetworkConnection = {}));
// Fetcher APIs
const ValidFetchMethods = ['GET', 'PATCH', 'POST', 'PUT', 'DELETE'];
// A mapping exists in coda that allows these to show up in the UI.
// If adding new values here, add them to that mapping and vice versa.
var PrecannedDateRange;
(function (PrecannedDateRange) {
    // Past
    PrecannedDateRange["Yesterday"] = "yesterday";
    PrecannedDateRange["Last7Days"] = "last_7_days";
    PrecannedDateRange["Last30Days"] = "last_30_days";
    PrecannedDateRange["LastWeek"] = "last_week";
    PrecannedDateRange["LastMonth"] = "last_month";
    PrecannedDateRange["Last3Months"] = "last_3_months";
    PrecannedDateRange["Last6Months"] = "last_6_months";
    PrecannedDateRange["LastYear"] = "last_year";
    // Present
    PrecannedDateRange["Today"] = "today";
    PrecannedDateRange["ThisWeek"] = "this_week";
    PrecannedDateRange["ThisWeekStart"] = "this_week_start";
    PrecannedDateRange["ThisMonth"] = "this_month";
    PrecannedDateRange["ThisMonthStart"] = "this_month_start";
    PrecannedDateRange["ThisYearStart"] = "this_year_start";
    PrecannedDateRange["YearToDate"] = "year_to_date";
    PrecannedDateRange["ThisYear"] = "this_year";
    // Future
    PrecannedDateRange["Tomorrow"] = "tomorrow";
    PrecannedDateRange["Next7Days"] = "next_7_days";
    PrecannedDateRange["Next30Days"] = "next_30_days";
    PrecannedDateRange["NextWeek"] = "next_week";
    PrecannedDateRange["NextMonth"] = "next_month";
    PrecannedDateRange["Next3Months"] = "next_3_months";
    PrecannedDateRange["Next6Months"] = "next_6_months";
    PrecannedDateRange["NextYear"] = "next_year";
    PrecannedDateRange["Everything"] = "everything";
})(PrecannedDateRange = exports.PrecannedDateRange || (exports.PrecannedDateRange = {}));
