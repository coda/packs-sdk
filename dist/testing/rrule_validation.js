"use strict";
// Validation for the RFC 5545 recurrence a pack declares in a `schedule` default trigger.
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRRuleString = void 0;
const Frequencies = ['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
const SubHourlyFrequencies = ['MINUTELY', 'SECONDLY'];
const Weekdays = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
// The rule parts a pack may declare.
const RulePartNames = [
    'FREQ',
    'INTERVAL',
    'COUNT',
    'UNTIL',
    'WKST',
    'BYDAY',
    'BYHOUR',
    'BYMINUTE',
    'BYMONTH',
    'BYMONTHDAY',
    'BYSETPOS',
];
// The values each numeric rule part takes, as the RFC 5545 ranges it allows.
const NumericRulePartRanges = [
    ['BYHOUR', [0, 23]],
    ['BYMINUTE', [0, 59]],
    ['BYMONTH', [1, 12]],
    ['BYMONTHDAY', [-31, -1], [1, 31]],
    ['BYSETPOS', [-366, -1], [1, 366]],
];
const DatePattern = /^(\d{4})(\d{2})(\d{2})$/;
const TimePattern = /^(\d{2})(\d{2})(\d{2})Z?$/;
const TimezoneParam = 'TZID=';
// A weekday, optionally picking one occurrence of it, as RFC 5545 ranges that at 1 through 53.
const WeekdayPattern = new RegExp(`^([+-]?([1-9]|[1-4]\\d|5[0-3]))?(${Weekdays.join('|')})$`);
const MinutesPerHour = 60;
const TooFrequent = 'A schedule trigger must not run more frequently than once per hour.';
/**
 * Checks a schedule against what the runtime can store and fire, returning a message when it can't.
 */
function validateRRuleString(rruleString) {
    var _a, _b;
    const lines = rruleString
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean);
    let dtstart;
    let dtstartParams = [];
    let rule;
    for (const line of lines) {
        const separator = line.indexOf(':');
        const properties = separator < 0 ? [''] : line.slice(0, separator).split(';');
        const name = properties[0].toUpperCase();
        if (name === 'DTSTART' && dtstart === undefined) {
            dtstart = line.slice(separator + 1);
            dtstartParams = properties.slice(1);
        }
        else if ((name === 'RRULE' || name === '') && rule === undefined) {
            rule = separator < 0 ? line : line.slice(separator + 1);
        }
        else {
            return 'A schedule trigger takes one DTSTART line and one RRULE line.';
        }
    }
    if (rule === undefined) {
        return 'A schedule trigger must have an RRULE.';
    }
    if (dtstart !== undefined && !isDateTime(dtstart)) {
        return 'A schedule trigger has an invalid DTSTART.';
    }
    const timezone = dtstartParams.find(param => param.toUpperCase().startsWith(TimezoneParam));
    if (timezone !== undefined && !isTimezone(timezone.slice(TimezoneParam.length))) {
        return 'A schedule trigger has an invalid DTSTART timezone.';
    }
    const parts = new Map();
    for (const part of rule.split(';')) {
        const [name, value] = part.split('=');
        const key = name.toUpperCase();
        if (!RulePartNames.includes(key) || !value) {
            return `A schedule trigger does not support "${part}".`;
        }
        if (parts.has(key)) {
            return `A schedule trigger can only set ${key} once.`;
        }
        parts.set(key, value.toUpperCase());
    }
    const frequency = parts.get('FREQ');
    if (frequency === undefined) {
        return 'A schedule trigger must set FREQ.';
    }
    if (SubHourlyFrequencies.includes(frequency)) {
        return TooFrequent;
    }
    if (!Frequencies.includes(frequency)) {
        return `A schedule trigger does not support FREQ=${frequency}.`;
    }
    for (const key of ['INTERVAL', 'COUNT']) {
        const value = parts.get(key);
        if (value !== undefined && !/^[1-9]\d*$/.test(value)) {
            return `A schedule trigger has an invalid ${key}.`;
        }
    }
    const until = parts.get('UNTIL');
    if (until !== undefined && !isDateTime(until)) {
        return 'A schedule trigger has an invalid UNTIL.';
    }
    // Compared by date alone: a DTSTART carrying a TZID is a wall clock, while UNTIL is UTC.
    if (until !== undefined && dtstart !== undefined && until.slice(0, 8) < dtstart.slice(0, 8)) {
        return 'A schedule trigger must not end before it starts.';
    }
    const weekStart = parts.get('WKST');
    if (weekStart !== undefined && !Weekdays.includes(weekStart)) {
        return 'A schedule trigger has an invalid WKST.';
    }
    const byDay = parts.get('BYDAY');
    if (byDay !== undefined && !byDay.split(',').every(day => WeekdayPattern.test(day))) {
        return 'A schedule trigger has an invalid BYDAY.';
    }
    const numbers = new Map();
    for (const [key, ...ranges] of NumericRulePartRanges) {
        const value = parts.get(key);
        if (value === undefined) {
            continue;
        }
        const parsed = parseNumberList(value, ranges);
        if (!parsed) {
            return `A schedule trigger has an invalid ${key}.`;
        }
        numbers.set(key, parsed);
    }
    const hours = (_a = numbers.get('BYHOUR')) !== null && _a !== void 0 ? _a : [0];
    const minutes = (_b = numbers.get('BYMINUTE')) !== null && _b !== void 0 ? _b : [0];
    if (frequency === 'HOURLY') {
        return minutes.length > 1 ? TooFrequent : undefined;
    }
    // A day's occurrences are BYHOUR crossed with BYMINUTE, as minutes past midnight.
    const runTimes = [...new Set(hours.flatMap(hour => minutes.map(minute => hour * MinutesPerHour + minute)))].sort((a, b) => a - b);
    const gaps = runTimes.slice(1).map((runTime, index) => runTime - runTimes[index]);
    return gaps.some(gap => gap < MinutesPerHour) ? TooFrequent : undefined;
}
exports.validateRRuleString = validateRRuleString;
// An RFC 5545 DATE or DATE-TIME naming a day that exists, not just the right count of digits.
function isDateTime(value) {
    const parts = value.split('T');
    const date = parts.length <= 2 ? DatePattern.exec(parts[0]) : null;
    if (!date) {
        return false;
    }
    const [year, month, day] = [Number(date[1]), Number(date[2]), Number(date[3])];
    const parsed = new Date(Date.UTC(year, month - 1, day));
    if (parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) {
        return false;
    }
    if (parts.length === 1) {
        return true;
    }
    const time = TimePattern.exec(parts[1]);
    // RFC 5545 leaves room for a leap second.
    return time !== null && Number(time[1]) <= 23 && Number(time[2]) <= 59 && Number(time[3]) <= 60;
}
// A zone the runtime can resolve. Node's ICU backs the same lookup the runtime's does.
function isTimezone(value) {
    try {
        new Intl.DateTimeFormat('en-US', { timeZone: value });
        return true;
    }
    catch {
        return false;
    }
}
function parseNumberList(value, ranges) {
    const numbers = value.split(',').map(entry => (/^-?\d+$/.test(entry) ? Number(entry) : NaN));
    const inRange = (entry) => ranges.some(([min, max]) => entry >= min && entry <= max);
    return numbers.every(inRange) ? numbers : undefined;
}
