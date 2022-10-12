import {ValueHintType} from '../index';
import {ValueType} from '../index';
import {deepCopy} from '../helpers/object_utils';
import {makeObjectSchema} from '../index';
import {makeSchema} from '../index';
import * as schema from '../schema';

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

    it('null', () => {
      assert.deepEqual(schema.generateSchema(null as any), {type: schema.ValueType.String});
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
        codaType: ValueHintType.Reference,
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
          displayProperty: 'reference',
          identity: {name: 'Test'},
        };
        makeObjectSchema(missingIdSchema);
      }).to.throw('Objects with codaType "reference" require a "idProperty" property in the schema definition.');

      expect(() => {
        const missingPrimarySchema: any = {
          ...baseReferenceSchema,
          idProperty: 'reference',
          identity: {name: 'Test'},
        };
        makeObjectSchema(missingPrimarySchema);
      }).to.throw('Objects with codaType "reference" require a "displayProperty" property in the schema definition.');

      expect(() => {
        const missingIdentitySchema: any = {
          ...baseReferenceSchema,
          idProperty: 'reference',
          displayProperty: 'reference',
        };
        makeObjectSchema(missingIdentitySchema);
      }).to.throw('Objects with codaType "reference" require a "identity" property in the schema definition.');

      expect(() => {
        const referenceNotRequiredSchema: any = {
          ...baseReferenceSchema,
          idProperty: 'reference',
          displayProperty: 'reference',
          identity: {name: 'Test'},
          properties: {...baseReferenceSchema.properties, required: false},
        };
        makeObjectSchema(referenceNotRequiredSchema);
      }).to.throw('Field "reference" must be marked as required in schema with codaType "reference".');

      makeObjectSchema({
        type: ValueType.Object,
        codaType: ValueHintType.Reference,
        idProperty: 'reference',
        displayProperty: 'reference',
        identity: {name: 'Test'},
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
          codaType: ValueHintType.Person,
          displayProperty: 'name',
          properties: {
            email: {type: ValueType.String, required: true},
            name: {type: ValueType.String, required: true},
          },
        });
      }).to.throw('Objects with codaType "person" require a "idProperty" property in the schema definition.');

      expect(() => {
        makeObjectSchema({
          type: ValueType.Object,
          codaType: ValueHintType.Person,
          idProperty: 'email',
          displayProperty: 'name',
          properties: {
            email: {type: ValueType.String},
            name: {type: ValueType.String, required: true},
          },
        });
      }).to.throw('Field "email" must be marked as required in schema with codaType "person".');

      makeObjectSchema({
        type: ValueType.Object,
        codaType: ValueHintType.Person,
        idProperty: 'email',
        displayProperty: 'name',
        properties: {
          email: {type: ValueType.String, required: true},
          name: {type: ValueType.String, required: true},
        },
      });
    });

    it('allows sub-schema re-use', () => {
      const stringSchema = makeSchema({type: ValueType.String});
      const mySchema = makeObjectSchema({
        properties: {
          apple: stringSchema,
          banana: stringSchema,
        },
        displayProperty: 'apple',
      });
      assert.notEqual(mySchema.properties.apple, mySchema.properties.banana);
    });
  });

  describe('normalizeSchema', () => {
    it('passes through object identity', () => {
      const anotherSchema = schema.makeObjectSchema({
        type: schema.ValueType.Object,
        displayProperty: 'boo',
        properties: {
          boo: {type: schema.ValueType.String},
        },
      });
      const objectSchema = schema.makeObjectSchema({
        type: schema.ValueType.Object,
        idProperty: 'name',
        displayProperty: 'name',
        properties: {
          name: {type: schema.ValueType.String},
          another: anotherSchema,
          yetAnother: schema.makeObjectSchema({
            type: schema.ValueType.Object,
            displayProperty: 'boo',
            properties: {
              baz: {type: schema.ValueType.String},
            },
          }),
        },
        identity: {
          name: 'hello',
        },
      });
      const normalized = schema.normalizeSchema(objectSchema);
      assert.deepEqual((normalized as any).identity, {
        name: 'hello',
      });
    });

    it('works', () => {
      const anotherSchema = schema.makeObjectSchema({
        type: schema.ValueType.Object,
        primary: 'boo',
        properties: {
          boo: {type: schema.ValueType.String},
          baz: {type: schema.ValueType.Number, mutable: true},
        },
      });
      const objectSchema = schema.makeObjectSchema({
        type: schema.ValueType.Object,
        id: 'name',
        primary: 'name',
        properties: {
          name: {type: schema.ValueType.String},
          another: anotherSchema,
          "What's your name?": {type: schema.ValueType.String},
          'Enter the date in MM.DD.YYYY format': {type: schema.ValueType.String},
          'fruit [choose multiple]': {type: schema.ValueType.String},
        },
        titleProperty: 'Enter the date in MM.DD.YYYY format',
        snippetProperty: 'another.boo',
      });
      const normalized = schema.normalizeSchema(objectSchema);
      // Deep copy to remove undefined values
      assert.deepEqual(deepCopy((normalized as schema.GenericObjectSchema).properties), {
        Name: {type: schema.ValueType.String, fromKey: 'name'},
        WhatSYourName: {type: schema.ValueType.String, fromKey: "What's your name?"},
        EnterTheDateInMMDDYYYYFormat: {
          type: schema.ValueType.String,
          fromKey: 'Enter the date in MM.DD.YYYY format',
        },
        FruitChooseMultiple: {type: schema.ValueType.String, fromKey: 'fruit [choose multiple]'},
        Another: {
          primary: 'Boo',
          type: schema.ValueType.Object,
          fromKey: 'another',
          properties: {
            Boo: {type: schema.ValueType.String, fromKey: 'boo'},
            Baz: {type: schema.ValueType.Number, fromKey: 'baz', mutable: true},
          },
        },
      });
      assert.deepEqual((normalized as schema.GenericObjectSchema).titleProperty, 'EnterTheDateInMMDDYYYYFormat');
      assert.deepEqual((normalized as schema.GenericObjectSchema).snippetProperty, 'Another.Boo');
    });
  });
});
