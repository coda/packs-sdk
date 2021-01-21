import {join} from '../helpers/url';

describe('url helpers test', () => {
  it('handles null entry', () => {
    assert.equal(join(), '');
  });

  it('handles single entry', () => {
    assert.equal(join('https://coolurl.com'), 'https://coolurl.com');
  });

  it('handles multi entry', () => {
    assert.equal(join('https://coolurl.com', 'fizzbuzz'), 'https://coolurl.com/fizzbuzz');
  });

  it('leaves trailing slash on the leaf token', () => {
    assert.equal(join('https://coolurl.com', 'fizzbuzz/4422/'), 'https://coolurl.com/fizzbuzz/4422/');
  });

  it('strips leading slashes from tokens', () => {
    assert.equal(join('https://coolurl.com', '/fizzbuzz/4312'), 'https://coolurl.com/fizzbuzz/4312');
  });
});
