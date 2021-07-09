import './test_helper';
import {ConnectionRequirement} from '../api_types';
import type {PackDefinitionBuilder} from '../builder';
import type {ParamDefs} from '../api_types';
import {ParameterType} from '../api_types';
import {ValueType} from '../schema';
import {makeObjectSchema} from '../schema';
import {makeParameter} from '../api';
import {newPack} from '../builder';

describe('Builder', () => {
  let pack: PackDefinitionBuilder;

  beforeEach(() => {
    pack = newPack();
  });

  function addDummyFormula(
    pack_: PackDefinitionBuilder,
    {connectionRequirement, parameters}: {connectionRequirement?: ConnectionRequirement; parameters?: ParamDefs} = {},
  ) {
    pack_.addFormula({
      resultType: ValueType.String,
      name: 'Foo',
      description: '',
      connectionRequirement,
      parameters: parameters || [],
      execute: () => '',
    });
  }

  function addDummySyncTable(
    pack_: PackDefinitionBuilder,
    {connectionRequirement, parameters}: {connectionRequirement?: ConnectionRequirement; parameters?: ParamDefs} = {},
  ) {
    pack_.addSyncTable({
      name: 'Foos',
      identityName: 'Foo',
      connectionRequirement,
      schema: makeObjectSchema({
        type: ValueType.Object,
        id: 'foo',
        primary: 'foo',
        properties: {foo: {type: ValueType.String}},
      }),
      formula: {
        name: 'Ignored',
        description: '',
        parameters: parameters || [],
        execute: async () => {
          return {result: []};
        },
      },
    });
  }

  describe('setDefaultConnectionRequirement', () => {
    it('works for formula', () => {
      pack.setDefaultConnectionRequirement(ConnectionRequirement.Required);
      addDummyFormula(pack);
      assert.equal(pack.formulas[0].connectionRequirement, ConnectionRequirement.Required);
    });

    it('works for formula after the fact', () => {
      pack.addFormula({
        resultType: ValueType.String,
        name: 'Foo',
        description: '',
        parameters: [],
        execute: () => '',
      });
      pack.setDefaultConnectionRequirement(ConnectionRequirement.Required);
      assert.equal(pack.formulas[0].connectionRequirement, ConnectionRequirement.Required);
    });

    it('does not override manually set value for formula', () => {
      pack.setDefaultConnectionRequirement(ConnectionRequirement.Required);
      addDummyFormula(pack, {connectionRequirement: ConnectionRequirement.None});
      assert.equal(pack.formulas[0].connectionRequirement, ConnectionRequirement.None);
    });

    it('works for formula autocomplete', () => {
      pack.setDefaultConnectionRequirement(ConnectionRequirement.Required);
      addDummyFormula(pack, {
        parameters: [
          makeParameter({type: ParameterType.String, name: 'p', description: '', autocomplete: ['foo', 'bar']}),
        ],
      });
      assert.equal(pack.formulas[0].parameters[0]?.autocomplete?.connectionRequirement, ConnectionRequirement.Required);
    });

    it('works for formula autocomplete after the fact', () => {
      addDummyFormula(pack, {
        parameters: [
          makeParameter({type: ParameterType.String, name: 'p', description: '', autocomplete: ['foo', 'bar']}),
        ],
      });
      pack.setDefaultConnectionRequirement(ConnectionRequirement.Required);
      assert.equal(pack.formulas[0].parameters[0]?.autocomplete?.connectionRequirement, ConnectionRequirement.Required);
    });

    it('works for sync table', () => {
      pack.setDefaultConnectionRequirement(ConnectionRequirement.Required);
      addDummySyncTable(pack);
      assert.equal(pack.syncTables[0].getter.connectionRequirement, ConnectionRequirement.Required);
    });

    it('works for sync table after the fact', () => {
      addDummySyncTable(pack);
      pack.setDefaultConnectionRequirement(ConnectionRequirement.Required);
      assert.equal(pack.syncTables[0].getter.connectionRequirement, ConnectionRequirement.Required);
    });

    it('does not override manually set value for sync table', () => {
      pack.setDefaultConnectionRequirement(ConnectionRequirement.Required);
      addDummySyncTable(pack, {connectionRequirement: ConnectionRequirement.None});
      assert.equal(pack.syncTables[0].getter.connectionRequirement, ConnectionRequirement.None);
    });

    it('works for sync table parameter autocomplete', () => {
      pack.setDefaultConnectionRequirement(ConnectionRequirement.Required);
      addDummySyncTable(pack, {
        parameters: [
          makeParameter({type: ParameterType.String, name: 'p', description: '', autocomplete: ['foo', 'bar']}),
        ],
      });
      assert.equal(
        pack.syncTables[0].getter.parameters[0]?.autocomplete?.connectionRequirement,
        ConnectionRequirement.Required,
      );
    });

    it('works for sync table parameter autocomplete after the fact', () => {
      addDummySyncTable(pack, {
        parameters: [
          makeParameter({type: ParameterType.String, name: 'p', description: '', autocomplete: ['foo', 'bar']}),
        ],
      });
      pack.setDefaultConnectionRequirement(ConnectionRequirement.Required);
      assert.equal(
        pack.syncTables[0].getter.parameters[0]?.autocomplete?.connectionRequirement,
        ConnectionRequirement.Required,
      );
    });
  });
});
