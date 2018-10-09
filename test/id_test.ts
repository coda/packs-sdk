import {PackId} from '../types';
import {ProviderId} from '../types';

describe('ID verification', () => {
  it('no repeated pack IDs', () => {
    const ids: Set<number> = new Set();

    for (const id in PackId) {
      if (!isNaN(Number(id))) {
        assert.notOk(ids.has(+id), `Pack ID value ${id} cannot be reused.`);
        ids.add(+id);
      }
    }
  });

  it('no repeated provider IDs', () => {
    const ids: Set<number> = new Set();

    for (const id in ProviderId) {
      if (!isNaN(Number(id))) {
        assert.notOk(ids.has(+id), `Provider ID value ${id} cannot be reused.`);
        ids.add(+id);
      }
    }
  });
});
