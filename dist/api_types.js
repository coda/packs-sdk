"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrecannedDateRange = exports.NetworkConnection = exports.AccountRequirement = exports.imageArray = exports.htmlArray = exports.dateArray = exports.booleanArray = exports.numberArray = exports.stringArray = exports.isArrayType = exports.Type = void 0;
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
var AccountRequirement;
(function (AccountRequirement) {
    AccountRequirement["None"] = "none";
    AccountRequirement["Optional"] = "optional";
    AccountRequirement["Required"] = "required";
})(AccountRequirement = exports.AccountRequirement || (exports.AccountRequirement = {}));
/** @deprecated use `AccountRequirement` instead */
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
