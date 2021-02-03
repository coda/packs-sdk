export declare const DEFAULT_TIMEZONE = "America/Los_Angeles";
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
export declare function parseDate(dateString: string, timezone: string, preferredLocale?: string): Date | null;
/**
 * TODO: This method is very likely busted since it is using browser timezone values. Browser timezone can diverge from
 * document timezone and when that happens a number of issues show up. We should eliminate all usages of this method.
 */
export declare function shiftToTimezone(date: Date, timezone: string): Date;
/**
 * Similar to javascript's `new Date` constructor but year values 00-99 are treated as the first century.
 * @returns {Date}
 */
export declare function create(timezone: string, year?: number, month?: number, date?: number, hour?: number, minute?: number, second?: number, msec?: number): Date;
