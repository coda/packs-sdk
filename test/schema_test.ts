import {ValueType} from '../index';
import {makeObjectSchema} from '../index';
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

  describe('makeObjectSchema', () => {
    it('requires for codaType.Reference', async () => {
      const baseReferenceSchema = {
        type: ValueType.Object,
        codaType: ValueType.Reference,
        properties: {
          reference: {
            type: ValueType.Object,
            properties: {
              objectId: {type: ValueType.String},
              identifier: {type: ValueType.String},
              name: {type: ValueType.String},
            },
          },
          required: true,
        },
      };
      expect(() => {
        const missingIdSchema: any = {
          ...baseReferenceSchema,
          primary: 'reference',
          identity: {packId: CODA_DEBUG_PACK_ID, name: 'Test'},
        };
        makeObjectSchema(missingIdSchema);
      }).to.throw('Objects with codaType "reference" require a "id" property in the schema definition.');

      expect(() => {
        const missingPrimarySchema: any = {
          ...baseReferenceSchema,
          id: 'reference',
          identity: {packId: CODA_DEBUG_PACK_ID, name: 'Test'},
        };
        makeObjectSchema(missingPrimarySchema);
      }).to.throw('Objects with codaType "reference" require a "primary" property in the schema definition.');

      expect(() => {
        const missingIdentitySchema: any = {
          ...baseReferenceSchema,
          id: 'reference',
          primary: 'reference',
        };
        makeObjectSchema(missingIdentitySchema);
      }).to.throw('Objects with codaType "reference" require a "identity" property in the schema definition.');

      expect(() => {
        const referenceNotRequiredSchema: any = {
          ...baseReferenceSchema,
          id: 'reference',
          primary: 'reference',
          identity: {packId: CODA_DEBUG_PACK_ID, name: 'Test'},
          properties: {...baseReferenceSchema.properties, required: false},
        };
        makeObjectSchema(referenceNotRequiredSchema);
      }).to.throw('Field "reference" must be marked as required in schema with codaType "reference".');

      makeObjectSchema({
        type: ValueType.Object,
        codaType: ValueType.Reference,
        id: 'reference',
        primary: 'reference',
        identity: {packId: CODA_DEBUG_PACK_ID, name: 'Test'},
        properties: {
          reference: {
            type: ValueType.Object,
            properties: {
              objectId: {type: ValueType.String},
              identifier: {type: ValueType.String},
              name: {type: ValueType.String},
            },
            required: true,
          },
        },
      });
    });

    it('requires for codaType.Person', async () => {
      expect(() => {
        makeObjectSchema({
          type: ValueType.Object,
          codaType: ValueType.Person,
          primary: 'name',
          properties: {
            email: {type: ValueType.String, required: true},
            name: {type: ValueType.String, required: true},
          },
        });
      }).to.throw('Objects with codaType "person" require a "id" property in the schema definition.');

      expect(() => {
        makeObjectSchema({
          type: ValueType.Object,
          codaType: ValueType.Person,
          id: 'email',
          primary: 'name',
          properties: {
            email: {type: ValueType.String},
            name: {type: ValueType.String, required: true},
          },
        });
      }).to.throw('Field "email" must be marked as required in schema with codaType "person".');

      makeObjectSchema({
        type: ValueType.Object,
        codaType: ValueType.Person,
        id: 'email',
        primary: 'name',
        properties: {
          email: {type: ValueType.String, required: true},
          name: {type: ValueType.String, required: true},
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
