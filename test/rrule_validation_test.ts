import './test_helper';
import {validateRRuleString} from '../testing/rrule_validation';

describe('validateRRuleString', () => {
  const TooFrequent = 'A schedule trigger must not run more frequently than once per hour.';

  function assertValid(rruleString: string) {
    assert.isUndefined(validateRRuleString(rruleString), rruleString);
  }

  describe('shape', () => {
    it('takes a bare rule', () => {
      assertValid('FREQ=DAILY');
    });

    it('takes an RRULE line', () => {
      assertValid('RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,WE;BYHOUR=9;BYMINUTE=0');
    });

    it('takes a DTSTART line with a timezone', () => {
      assertValid('DTSTART;TZID=America/New_York:20260101T090000\nRRULE:FREQ=WEEKLY;BYDAY=MO');
    });

    it('takes a date-only DTSTART', () => {
      assertValid('DTSTART:20260101\nRRULE:FREQ=MONTHLY;BYMONTHDAY=1');
    });

    it('takes the parts the builder form omits', () => {
      assertValid('RRULE:FREQ=MONTHLY;BYDAY=-1FR;BYSETPOS=-1;BYMONTH=3;WKST=SU;COUNT=10');
      assertValid('RRULE:FREQ=DAILY;BYMINUTE=17;UNTIL=20270101T000000Z');
      assertValid('RRULE:FREQ=YEARLY;BYMONTH=3;BYMONTHDAY=1');
    });

    it('rejects a rule with no FREQ', () => {
      assert.equal(validateRRuleString('RRULE:INTERVAL=2'), 'A schedule trigger must set FREQ.');
    });

    it('rejects an empty string', () => {
      assert.equal(validateRRuleString(''), 'A schedule trigger must have an RRULE.');
    });

    it('rejects a second RRULE line', () => {
      assert.equal(
        validateRRuleString('RRULE:FREQ=DAILY\nRRULE:FREQ=WEEKLY'),
        'A schedule trigger takes one DTSTART line and one RRULE line.',
      );
    });

    it('rejects the dates an RRuleSet is made of', () => {
      assert.equal(
        validateRRuleString('RRULE:FREQ=DAILY\nEXDATE:20260101T090000Z'),
        'A schedule trigger takes one DTSTART line and one RRULE line.',
      );
    });

    it('rejects a part it does not know', () => {
      assert.equal(
        validateRRuleString('RRULE:FREQ=DAILY;BYSECOND=0,30'),
        'A schedule trigger does not support "BYSECOND=0,30".',
      );
    });

    it('rejects a repeated part', () => {
      assert.equal(
        validateRRuleString('RRULE:FREQ=DAILY;INTERVAL=1;INTERVAL=2'),
        'A schedule trigger can only set INTERVAL once.',
      );
    });

    it('rejects 0 where RFC 5545 leaves it out of the range', () => {
      assert.equal(
        validateRRuleString('RRULE:FREQ=MONTHLY;BYMONTHDAY=0'),
        'A schedule trigger has an invalid BYMONTHDAY.',
      );
      assert.equal(
        validateRRuleString('RRULE:FREQ=MONTHLY;BYDAY=MO;BYSETPOS=0'),
        'A schedule trigger has an invalid BYSETPOS.',
      );
      assert.equal(validateRRuleString('RRULE:FREQ=MONTHLY;BYDAY=0MO'), 'A schedule trigger has an invalid BYDAY.');
    });

    it('ranges the occurrence a BYDAY picks at 1 through 53', () => {
      assertValid('RRULE:FREQ=MONTHLY;BYDAY=+53MO');
      assertValid('RRULE:FREQ=MONTHLY;BYDAY=-53SU,13WE');
      for (const day of ['00MO', '54MO', '99MO', '-54MO']) {
        assert.equal(
          validateRRuleString(`RRULE:FREQ=MONTHLY;BYDAY=${day}`),
          'A schedule trigger has an invalid BYDAY.',
          day,
        );
      }
    });

    it('rejects a value out of range', () => {
      assert.equal(validateRRuleString('RRULE:FREQ=DAILY;BYHOUR=24'), 'A schedule trigger has an invalid BYHOUR.');
      assert.equal(validateRRuleString('RRULE:FREQ=DAILY;INTERVAL=0'), 'A schedule trigger has an invalid INTERVAL.');
      assert.equal(validateRRuleString('RRULE:FREQ=WEEKLY;BYDAY=XX'), 'A schedule trigger has an invalid BYDAY.');
      assert.equal(
        validateRRuleString('DTSTART:tomorrow\nRRULE:FREQ=DAILY'),
        'A schedule trigger has an invalid DTSTART.',
      );
    });
  });

  describe('dates', () => {
    it('rejects a day the month does not have', () => {
      // Passes a digit count check, and the runtime silently rolls it into March.
      assert.equal(
        validateRRuleString('DTSTART:20260231\nRRULE:FREQ=DAILY'),
        'A schedule trigger has an invalid DTSTART.',
      );
      assert.equal(
        validateRRuleString('RRULE:FREQ=DAILY;UNTIL=20270431T000000Z'),
        'A schedule trigger has an invalid UNTIL.',
      );
    });

    it('rejects a month, hour, minute, or second out of range', () => {
      for (const dtstart of ['20261301', '20260100', '20260101T240000', '20260101T006000', '20260101T000061']) {
        assert.equal(
          validateRRuleString(`DTSTART:${dtstart}\nRRULE:FREQ=DAILY`),
          'A schedule trigger has an invalid DTSTART.',
          dtstart,
        );
      }
    });

    it('takes February 29 in a leap year and rejects it otherwise', () => {
      assertValid('DTSTART:20280229\nRRULE:FREQ=YEARLY');
      assert.equal(
        validateRRuleString('DTSTART:20260229\nRRULE:FREQ=YEARLY'),
        'A schedule trigger has an invalid DTSTART.',
      );
    });

    it('rejects a leap second, which neither Date nor rrule has', () => {
      assert.equal(
        validateRRuleString('DTSTART:20261231T235960Z\nRRULE:FREQ=DAILY'),
        'A schedule trigger has an invalid DTSTART.',
      );
    });

    it('rejects a year Date.UTC would read as 1900 through 1999', () => {
      assert.equal(
        validateRRuleString('DTSTART:00040101\nRRULE:FREQ=DAILY'),
        'A schedule trigger has an invalid DTSTART.',
      );
    });

    it('rejects an UNTIL before the DTSTART', () => {
      // rrule yields no occurrence at all, which computeNextRunAt writes as next_run_at = NULL.
      assert.equal(
        validateRRuleString('DTSTART:20260101\nRRULE:FREQ=DAILY;UNTIL=20250101T000000Z'),
        'A schedule trigger must not end before it starts.',
      );
    });

    it('takes an UNTIL on or after the DTSTART', () => {
      assertValid('DTSTART:20260101\nRRULE:FREQ=DAILY;UNTIL=20270101T000000Z');
    });

    it('leaves the order to the runtime when the DTSTART names a zone', () => {
      // A zoned DTSTART is a wall clock and UNTIL is UTC, so comparing the dates decides nothing.
      // West of UTC the dates agree while the instants may not, east of UTC the reverse. Both go
      // through rather than reject one of them wrongly.
      assertValid('DTSTART;TZID=America/New_York:20260101T090000\nRRULE:FREQ=DAILY;UNTIL=20260101T000000Z');
      assertValid('DTSTART;TZID=Pacific/Auckland:20260102T010000\nRRULE:FREQ=DAILY;UNTIL=20260101T120000Z');
    });
  });

  describe('timezone', () => {
    it('takes the zones the runtime resolves', () => {
      for (const timezone of ['America/New_York', 'UTC', 'utc', 'Asia/Calcutta', 'Etc/GMT+5', 'Europe/London']) {
        assertValid(`DTSTART;TZID=${timezone}:20260101T090000\nRRULE:FREQ=DAILY`);
      }
    });

    it('rejects a zone that does not exist', () => {
      // rrulestr throws on these, which computeNextRunAt swallows into a trigger that never fires.
      assert.equal(
        validateRRuleString('DTSTART;TZID=Mars/Olympus:20260101T090000\nRRULE:FREQ=DAILY'),
        'A schedule trigger has an invalid DTSTART timezone.',
      );
      assert.equal(
        validateRRuleString('DTSTART;TZID=:20260101T090000\nRRULE:FREQ=DAILY'),
        'A schedule trigger has an invalid DTSTART timezone.',
      );
    });

    it('takes a quoted zone', () => {
      assertValid('DTSTART;TZID="America/New_York":20260101T090000\nRRULE:FREQ=DAILY');
    });

    it('rejects a zone alongside a UTC time', () => {
      assert.equal(
        validateRRuleString('DTSTART;TZID=America/New_York:20260101T090000Z\nRRULE:FREQ=DAILY'),
        'A schedule trigger cannot set both a DTSTART timezone and a UTC time.',
      );
    });

    it('takes the other params a DTSTART carries', () => {
      assertValid('DTSTART;VALUE=DATE:20260101\nRRULE:FREQ=DAILY');
      assertValid('DTSTART;VALUE=DATE-TIME;TZID=America/New_York:20260101T090000\nRRULE:FREQ=DAILY');
    });

    it('takes a lowercase UTC suffix, the way UNTIL does', () => {
      assertValid('DTSTART:20260101T090000z\nRRULE:FREQ=DAILY');
      assertValid('RRULE:FREQ=DAILY;UNTIL=20270101T000000z');
    });
  });

  describe('frequency', () => {
    it('takes hourly', () => {
      assertValid('RRULE:FREQ=HOURLY;BYMINUTE=30');
    });

    it('takes a day full of hourly runs', () => {
      assertValid('RRULE:FREQ=DAILY;BYHOUR=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23');
    });

    it('rejects frequencies below an hour', () => {
      assert.equal(validateRRuleString('RRULE:FREQ=MINUTELY'), TooFrequent);
      assert.equal(validateRRuleString('RRULE:FREQ=SECONDLY'), TooFrequent);
    });

    it('rejects an hourly rule that fires twice an hour', () => {
      assert.equal(validateRRuleString('RRULE:FREQ=HOURLY;BYMINUTE=0,30'), TooFrequent);
    });

    it('rejects minutes that pack two runs into one hour', () => {
      assert.equal(validateRRuleString('RRULE:FREQ=DAILY;BYHOUR=9;BYMINUTE=0,30'), TooFrequent);
      assert.equal(validateRRuleString('RRULE:FREQ=WEEKLY;BYDAY=MO;BYHOUR=9,10;BYMINUTE=0,30'), TooFrequent);
    });

    it('takes hours exactly an hour apart', () => {
      assertValid('RRULE:FREQ=DAILY;BYHOUR=9,10;BYMINUTE=30');
    });

    it('takes a rule with one occurrence a day', () => {
      assertValid('DTSTART:20260101T093000\nRRULE:FREQ=DAILY');
    });
  });
});
