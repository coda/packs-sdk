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
