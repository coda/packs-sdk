import './test_helper';
import {schema} from '../index';

const CODA_DEBUG_PACK_ID = 1009;

describe('Schema', () => {
  describe('generateSchema', () => {
    it('number', () => {
      assert.deepEqual(schema.generateSchema(42), {type: schema.ValueType.Number});
    });

    it('string', () => {
      assert.deepEqual(schema.generateSchema('foobaz'), {type: schema.ValueType.String});
    });

    it('boolean', () => {
      assert.deepEqual(schema.generateSchema(false), {type: schema.ValueType.Boolean});
    });

    it('array of scalars', () => {
      assert.deepEqual(schema.generateSchema(['foobaz']), {
        type: schema.ValueType.Array,
        items: {type: schema.ValueType.String},
      });
    });

    it('nested objects', () => {
      assert.deepEqual(schema.generateSchema({a: 42, b: 'blah', c: [42], d: [{a: true}]}), {
        type: schema.ValueType.Object,
        properties: {
          a: {type: schema.ValueType.Number},
          b: {type: schema.ValueType.String},
          c: {type: schema.ValueType.Array, items: {type: schema.ValueType.Number}},
          d: {
            type: schema.ValueType.Array,
            items: {
              type: schema.ValueType.Object,
              properties: {a: {type: schema.ValueType.Boolean}},
            },
          },
        },
      });
    });
  });

  describe('normalizeSchema', () => {
    it('passes through object identity', () => {
      const anotherSchema = schema.makeObjectSchema({
        type: schema.ValueType.Object,
        primary: 'boo',
        properties: {
          boo: {type: schema.ValueType.String},
        },
      });
      const objectSchema = schema.makeObjectSchema({
        type: schema.ValueType.Object,
        id: 'name',
        primary: 'name',
        properties: {
          name: {type: schema.ValueType.String},
          another: anotherSchema,
          yetAnother: schema.makeObjectSchema({
            type: schema.ValueType.Object,
            primary: 'boo',
            properties: {
              baz: {type: schema.ValueType.String},
            },
          }),
        },
        identity: {
          packId: CODA_DEBUG_PACK_ID,
          name: 'hello',
        },
      });
      const normalized = schema.normalizeSchema(objectSchema);
      assert.deepEqual((normalized as any).identity, {
        packId: CODA_DEBUG_PACK_ID,
        name: 'hello',
      });
    });
  });
});
