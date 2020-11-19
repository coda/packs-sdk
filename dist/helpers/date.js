"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.shiftToTimezone = exports.parseDate = exports.DEFAULT_TIMEZONE = void 0;
const sugar_date_1 = __importDefault(require("sugar-date"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
exports.DEFAULT_TIMEZONE = 'America/Los_Angeles';
// Dates can contain time zone names which get quite long. For example, Australian Eastern Daylight Savings Time
const MAX_PARSABLE_DATE_AND_TIME_STRING = 100;
const MAX_PARSABLE_DATE_STRING = 30;
// Match a number, optionally some non numeric content, followed by a delimiter and then two numbers more
// optionally followed by more alphaNumeric tokens with separators with an optional tail UTC offset and/or (timezone)
const numericRegex = /[0-9][a-zA-Z ,]{0,20}[ \/:-][0-9]{1,2}(?:[,\/:\-. ]*[a-zA-Z0-9]+){0,5}(?:[ ]?[-+][0-9]{2,4})?(?:[ ]?\([A-Z]{3}\))?\s*$/;
// Sniff to see if a date string is of a short month date format (without year specified).   This match ensures the
// month name is paired with a day prefix or suffix matching the forms: NN(th|st)? MONTH | MONTH NN(th|st)?
const monthNamesOnlyRegexpEN = '(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)';
const monthNameRegexEN = new RegExp(`\\d{1,2}(?:(th|st))?\\s${monthNamesOnlyRegexpEN}|${monthNamesOnlyRegexpEN}\\s\\d{1,2}(?:(th|st))?`, 'i');
/**
 * Sniff to see if a date time string looks like a pure time string
 */
const timeRegexStr = '(\\d{1,2}):(\\d{2})(:\\d{2})?\\s?(am|pm)?';
const timeRegex = new RegExp(timeRegexStr, 'i');
const anchoredTimeRegex = new RegExp(`^\\s*${timeRegexStr}\\s*$`, 'i');
/**
 * Timezone annotations can take a number of forms
 * Z -> UTC
 * GMT / PST / EST, etc
 * +|- HH:?(mm)?
 * (Pacific Daylight Time)
 *
 * Detecting timezone based on hour minute offset in a ISO 8061 and RFC 822 friendly way that does not mistakenly
 * identify other parts of a date string. For this reason we put the restriction that the the hour and minute offset
 * has to be found after a ':' which is assumed to be in the time portion of the string because it is only followed by
 * digits and whitespace. This does mean timezone hour & minute offsets applied to a date with no time will be handled
 * incorrectly.
 */
const timeZoneRegex = /(?:[\s|\d][a-zA-Z]{3}[()\s]*$)|(?::[\s\d\.]*(?:\+|-)\d{2}:?(?:\d{2})?$)|(?:Z$)/;
/**
 * Parse date attempts to convert a dateString to a JavaScript data object.
 *
 * Since all browsers do not parse dates in the same manner we have to use 3rd party libaries to do this. (Some browsers
 * interpret ambiguous timezone dates as in the local timezone while others interpret them as in UTC time).
 *
 * We start by sniffing the date string to make sure it looks something roughly like a date because we do a large amount
 * date detection by trying coerce inputs and formula data to a date in various places.
 *
 * We use Sugar Date library to parse the dateString because it is 100x+ faster than moment, but it has some drawbacks.
 * Sugar does not have timezone support in such that you can not pick a default timezone to interpret timezone ambiguous
 * dates as. By default all timezone ambiguous date strings are interpreted as machine local time. It also does not have
 * good support for limiting the set of date formats we support.
 *
 * To work around these limitations we sniff the dateString to see if it looks like a time (w/o a date) (see: timeRegex)
 * and if that is the case we extract hour, minutes, and seconds relative to local time and use moment to create a date
 * with that time relative to 1/1/1900 (in excel fashion).
 *
 * If the dateString is not a time we then sniff the dateString to see if it specified a timezone (see: timeZoneRegex)
 * and if it did not we extract the date components using local representation and create a new date with moment
 * who has set a default timezone to our desired timezone. This in essence translates the string to being interpretted
 * relative to the desired timezone.
 *
 * Risks:
 *
 * The timezone and time sniffing is not fool proof as there are many different dateTime specifications, and it is
 * possible that our regular expressions do not catch a format that is parsed as a valid date by Sugar. This could lead
 * to not handling those dates correctly.
 *
 * Similarly most 3rd party libraries including (moment & Sugar) will fall back to native browser Date parsing if they
 * don't detect a match. When this happens we have the potential to get different results across different browsers.
 * Most of our officially supported formats do not fall back to native parsing. Some notable examples that fall back
 * to native parsing are:
 *
 * - Wed, 02 Oct 2002 15:00:00 +0200
 * - Fri, 27 March 2015 18:45:12 -0700
 * - Fri, 27 March 2015 18:45:12-0700
 * - Fri, 27 March 2015 18:45:12 -07:00
 * - Fri, 27 March 2015 18:45:12-07
 *
 * Testing:
 *
 * Any changes to parseDate should carefully investigate if the results are correct when the local timezone is not our
 * Americas/Los_Angeles default. Since our tests hardcoded the timezone in our test bootstrap and you can't change it
 * after it is set you have to manually change the value tests are run as and then run the tests. Some interesting
 * timezones worth trying are:
 *
 * - 'Asia/Kolkata' (Off by non whole hours)
 * - 'Asia/Seoul'
 * - 'America/Los_Angeles' (Default)
 * - 'Europe/London'
 * - 'Pacific/Honolulu'
 *
 * The other thing to pay attention to is to figure out when 3rd party libraries are falling back to native Date parsing
 *
 * Future Thoughts:
 *
 * If we were going to invest further in date parsing we would likely need to look at investing in either Moment or
 * Sugar itself. Moment is painfully slow but has better date support. Sugar would be safer for us to use if we
 * extracted their date parts parsing code so that we would not need to sniff which components of a dateString were
 * ambiguous. This in itself is not trivial because for several time variants where the timezone is specified the
 * library falls back to native date parsing.
 */
function parseDate(dateString, timezone, preferredLocale) {
    // Sniff at the input and only return if it could possibly be a date.
    // Needed since date parsing can be a bit slow.
    if (dateString.length > MAX_PARSABLE_DATE_AND_TIME_STRING) {
        return null;
    }
    const matchesNumbers = numericRegex.test(dateString);
    const matchesMonth = monthNameRegexEN.test(dateString);
    if (!matchesNumbers && !matchesMonth) {
        return null;
    }
    // If we don't see what looks like a time, clamp the length even further
    if (!timeRegex.test(dateString) && dateString.length > MAX_PARSABLE_DATE_STRING) {
        return null;
    }
    // Use Sugar to parse Dates and DateTimes because it is much faster than moment
    // Sugar returns a JavaScript Date object, which is in the local machine time.
    const locale = preferredLocale ? preferredLocale : 'en';
    const date = sugar_date_1.default.Date.create(dateString, { locale });
    if (!sugar_date_1.default.Date.isValid(date)) {
        return null;
    }
    if (anchoredTimeRegex.test(dateString)) {
        // moment defaults these times to the current day, whereas we want to have
        // our defaults to be 1/1/1900, which is actually 12/30/1899 for some
        // inexplicable reason.
        return create(timezone, 1899, 11, 30, date.getHours(), date.getMinutes(), date.getSeconds());
    }
    // If the dateString specified a timezone we are done
    if (timeZoneRegex.test(dateString)) {
        return date;
    }
    // Extract the parts of the date so we can adjust it to the default timezone because Sugar will have created the
    // date relative to the timezone of the local machine.
    return shiftToTimezone(date, timezone);
}
exports.parseDate = parseDate;
/**
 * TODO: This method is very likely busted since it is using browser timezone values. Browser timezone can diverge from
 * document timezone and when that happens a number of issues show up. We should eliminate all usages of this method.
 */
function shiftToTimezone(date, timezone) {
    return moment_timezone_1.default
        .tz([
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds(),
    ], timezone)
        .toDate();
}
exports.shiftToTimezone = shiftToTimezone;
/**
 * Similar to javascript's `new Date` constructor but year values 00-99 are treated as the first century.
 * @returns {Date}
 */
function create(timezone, year = 1900, month = 0, date = 1, hour = 0, minute = 0, second = 0, msec = 0) {
    year = Math.floor(year);
    month = Math.floor(month);
    date = Math.floor(date);
    hour = Math.floor(hour);
    minute = Math.floor(minute);
    second = Math.floor(second);
    // Passing these values directly into the constructor leads to an invalid date when there is overflow, so use these
    // methods instead, which automatically bubble up. We also re-use a moment object for better performance.
    let m;
    if (hour || minute || second || msec) {
        m = moment_timezone_1.default
            .tz([1900, 0, 1], timezone)
            .year(year)
            .month(month)
            .date(date)
            .hour(hour)
            .minute(minute)
            .second(second)
            .millisecond(msec);
    }
    else {
        m = moment_timezone_1.default.tz([1900, 0, 1], timezone).year(year).month(month).date(date);
    }
    return new Date(m.toDate().valueOf());
}
exports.create = create;
