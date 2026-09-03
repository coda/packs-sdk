// Validation for the RFC 5545 recurrence a pack declares in a `schedule` default trigger.

const Frequencies = ['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY'];
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

// The ranges each numeric rule part takes, as [min, max].
const NumericRulePartRanges: Array<[string, number, number]> = [
  ['BYHOUR', 0, 23],
  ['BYMINUTE', 0, 59],
  ['BYMONTH', 1, 12],
  ['BYMONTHDAY', -31, 31],
  ['BYSETPOS', -366, 366],
];

// RFC 5545 excludes 0 from these parts' ranges.
const RulePartsWithoutZero = ['BYMONTHDAY', 'BYSETPOS'];

const DateTimePattern = /^\d{8}(T\d{6}Z?)?$/;
const WeekdayPattern = new RegExp(`^[+-]?\\d{0,2}(${Weekdays.join('|')})$`);
const MinutesPerHour = 60;

const TooFrequent = 'A schedule trigger must not run more frequently than once per hour.';

/**
 * Checks a schedule against what the runtime can store and fire, returning a message when it can't.
 */
export function validateRRuleString(rruleString: string): string | undefined {
  const lines = rruleString
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  let dtstart: string | undefined;
  let rule: string | undefined;
  for (const line of lines) {
    const separator = line.indexOf(':');
    const name = separator < 0 ? '' : line.slice(0, separator).split(';')[0].toUpperCase();
    if (name === 'DTSTART' && dtstart === undefined) {
      dtstart = line.slice(separator + 1);
    } else if ((name === 'RRULE' || name === '') && rule === undefined) {
      rule = separator < 0 ? line : line.slice(separator + 1);
    } else {
      return 'A schedule trigger takes one DTSTART line and one RRULE line.';
    }
  }

  if (rule === undefined) {
    return 'A schedule trigger must have an RRULE.';
  }
  if (dtstart !== undefined && !DateTimePattern.test(dtstart)) {
    return 'A schedule trigger has an invalid DTSTART.';
  }

  const parts = new Map<string, string>();
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
  if (until !== undefined && !DateTimePattern.test(until)) {
    return 'A schedule trigger has an invalid UNTIL.';
  }
  const weekStart = parts.get('WKST');
  if (weekStart !== undefined && !Weekdays.includes(weekStart)) {
    return 'A schedule trigger has an invalid WKST.';
  }
  const byDay = parts.get('BYDAY');
  if (byDay !== undefined && !byDay.split(',').every(day => WeekdayPattern.test(day))) {
    return 'A schedule trigger has an invalid BYDAY.';
  }

  const numbers = new Map<string, number[]>();
  for (const [key, min, max] of NumericRulePartRanges) {
    const value = parts.get(key);
    if (value === undefined) {
      continue;
    }
    const parsed = parseNumberList(value, min, max);
    if (!parsed || (RulePartsWithoutZero.includes(key) && parsed.includes(0))) {
      return `A schedule trigger has an invalid ${key}.`;
    }
    numbers.set(key, parsed);
  }

  const hours = numbers.get('BYHOUR') ?? [0];
  const minutes = numbers.get('BYMINUTE') ?? [0];
  if (frequency === 'HOURLY') {
    return minutes.length > 1 ? TooFrequent : undefined;
  }

  // A day's occurrences are BYHOUR crossed with BYMINUTE, as minutes past midnight.
  const runTimes = [...new Set(hours.flatMap(hour => minutes.map(minute => hour * MinutesPerHour + minute)))].sort(
    (a, b) => a - b,
  );
  const gaps = runTimes.slice(1).map((runTime, index) => runTime - runTimes[index]);

  return gaps.some(gap => gap < MinutesPerHour) ? TooFrequent : undefined;
}

function parseNumberList(value: string, min: number, max: number): number[] | undefined {
  const numbers = value.split(',').map(entry => (/^-?\d+$/.test(entry) ? Number(entry) : NaN));
  return numbers.every(entry => entry >= min && entry <= max) ? numbers : undefined;
}
