import './test_helper';
import {ValueType} from '../schema';
import {generateObjectResponseHandler} from '../handler_templates';
import {generateRequestHandler} from '../handler_templates';
import {makeStringParameter} from '../api';

describe('handler templates', () => {
  describe('generateRequestHandler', () => {
    it('includes URL params', () => {
      const generator = generateRequestHandler({url: 'http://foo/{bar}/{baz}', method: 'GET'}, [
        makeStringParameter('baz', 'param description'),
        makeStringParameter('bar', 'param description'),
      ]);
      assert.deepInclude(generator(['1foo', '2foo']), {url: 'http://foo/2foo/1foo', method: 'GET'});
    });

    it('includes URL and query params', () => {
      const generator = generateRequestHandler(
        {url: 'http://foo/{bar}/{baz}?bleh=42', method: 'GET', queryParams: ['boo']},
        [
          makeStringParameter('boo', 'param description'),
          makeStringParameter('baz', 'param description'),
          makeStringParameter('bar', 'param description'),
        ],
      );
      assert.deepInclude(generator(['0foo', '1foo', '2foo']), {
        url: 'http://foo/2foo/1foo?bleh=42&boo=0foo',
        method: 'GET',
      });
    });

    it('with naughty args', () => {
      const generator = generateRequestHandler({url: 'http://foo/{bar}', method: 'GET', queryParams: ['boo']}, [
        makeStringParameter('bar', 'param description'),
        makeStringParameter('boo', 'param description'),
      ]);
      assert.deepInclude(generator(['http:://foo', '?blah']), {
        url: 'http://foo/http%3A%3A%2F%2Ffoo?boo=%253Fblah',
        method: 'GET',
      });
    });

    it('with transforms', () => {
      const generator = generateRequestHandler(
        {
          url: 'http://foo/{boo}',
          method: 'GET',
          transforms: {boo: val => `wrapped${val}`},
        },
        [makeStringParameter('boo', 'param description')],
      );
      assert.deepInclude(generator(['blah']), {url: 'http://foo/wrappedblah', method: 'GET'});
    });

    it('includes body params', () => {
      const generator = generateRequestHandler(
        {url: 'http://foo/bar?bleh=42', method: 'GET', bodyParams: ['boo', 'bar']},
        [
          makeStringParameter('boo', 'param description'),
          makeStringParameter('baz', 'param description'),
          makeStringParameter('bar', 'param description'),
        ],
      );
      assert.deepInclude(generator(['0foo', '1foo', '2foo']), {
        url: 'http://foo/bar?bleh=42',
        method: 'GET',
        body: JSON.stringify({boo: '0foo', bar: '2foo'}),
      });
    });

    it('include body template and params', () => {
      const generator = generateRequestHandler(
        {url: 'http://foo/bar?bleh=42', method: 'GET', bodyTemplate: {blah: 42}, bodyParams: ['boo', 'bar']},
        [
          makeStringParameter('boo', 'param description'),
          makeStringParameter('baz', 'param description'),
          makeStringParameter('bar', 'param description'),
        ],
      );
      assert.deepInclude(generator(['0foo', '1foo', '2foo']), {
        url: 'http://foo/bar?bleh=42',
        method: 'GET',
        body: JSON.stringify({blah: 42, boo: '0foo', bar: '2foo'}),
      });
    });
  });

  describe('generateObjectResponseHandler', () => {
    it('returns an undefined projection', () => {
      const handler = generateObjectResponseHandler({projectKey: 'FOOBAZ', schema: undefined as any});
      assert.equal(undefined, handler({headers: {}, body: {foobaz: []}, status: 200}));
    });

    it('projects out a key from the response', () => {
      const handler = generateObjectResponseHandler({projectKey: 'foobaz', schema: undefined as any});
      assert.deepEqual([{bleh: 42}], handler({headers: {}, body: {foobaz: [{bleh: 42}]}, status: 200}));
    });

    it('remaps keys', () => {
      const handler = generateObjectResponseHandler({
        schema: {
          type: ValueType.Array,
          items: {
            type: ValueType.Object,
            properties: {
              someThing: {type: ValueType.Number, fromKey: 'some_thing'},
              cool_thing: {type: ValueType.Number},
            },
          },
        },
      });
      assert.deepEqual(
        handler({
          headers: {},
          body: [
            {some_thing: 42, cool_thing: 123},
            {cool: 456, some_thing: 321},
          ],
          status: 200,
        }),
        [
          {someThing: 42, cool_thing: 123},
          {someThing: 321},
        ] as any,
      );
    });

    it('remaps keys for object', () => {
      const handler = generateObjectResponseHandler({
        schema: {
          type: ValueType.Object,
          properties: {
            someThing: {type: ValueType.Number, fromKey: 'some_thing'},
            cool_thing: {type: ValueType.Number},
          },
        },
      });
      assert.deepEqual(
        {someThing: 42, cool_thing: 123},
        handler({headers: {}, body: {some_thing: 42, cool_thing: 123}, status: 200}),
      );
    });

    it('removes extraneous keys', () => {
      const handler = generateObjectResponseHandler({
        schema: {
          type: ValueType.Object,
          properties: {
            someThing: {type: ValueType.Number, fromKey: 'some_thing'},
            cool_thing: {type: ValueType.Number},
          },
        },
      });
      assert.deepEqual(
        {someThing: 42, cool_thing: 123},
        handler({headers: {}, body: {some_thing: 42, cool_thing: 123, another_thing: 42}, status: 200}),
      );
    });

    it('remaps nested keys', () => {
      const handler = generateObjectResponseHandler({
        schema: {
          type: ValueType.Array,
          items: {
            type: ValueType.Object,
            properties: {
              some_thing: {
                type: ValueType.Object,
                properties: {
                  somethingElse: {type: ValueType.Number, fromKey: 'this_thing'},
                },
              },
            },
          },
        },
      });
      assert.deepEqual(handler({headers: {}, body: [{some_thing: {this_thing: 12}, cool_thing: 123}], status: 200}), [
        {some_thing: {somethingElse: 12}},
      ] as any);
    });

    it('remaps nested keys and key', () => {
      const handler = generateObjectResponseHandler({
        schema: {
          type: ValueType.Array,
          items: {
            type: ValueType.Object,
            properties: {
              aThing: {
                type: ValueType.Object,
                properties: {
                  somethingElse: {type: ValueType.Number, fromKey: 'this_thing'},
                },
                fromKey: 'some_thing',
              },
            },
          },
        },
      });
      assert.deepEqual(handler({headers: {}, body: [{some_thing: {this_thing: 12}, cool_thing: 123}], status: 200}), [
        {aThing: {somethingElse: 12}},
      ] as any);
    });
  });
});
