import proxyquire from 'proxyquire';

function makeInputGenerator(input: string | string[]): () => string {
  input = typeof input === 'string' ? [input] : input;
  const values = input.values();
  return () => {
    const value = values.next();
    if (value.done) {
      throw new Error('No input left.');
    }
    return value.value;
  };
}

describe('Helpers', () => {
  describe('promptForInput', () => {
    let inputGenerator: () => string;

    function setInput(input: string | string[]) {
      inputGenerator = makeInputGenerator(input);
    }

    const readlineStub = {
      question() {
        return inputGenerator();
      },
    };

    const helpers = proxyquire('../testing/helpers', {
      'readline-sync': readlineStub,
    });

    it('Returns input', () => {
      setInput('cat');
      const result = helpers.promptForInput('Enter an animal');
      assert.equal(result, 'cat');
    });

    it('Returns first valid options', () => {
      setInput(['cat', 'dog']);
      const result = helpers.promptForInput('Enter an animal', {
        options: ['cat', 'dog'],
      });
      assert.equal(result, 'cat');
    });

    it('Retries invalid option', () => {
      setInput(['mouse', 'cat']);
      const result = helpers.promptForInput('Enter an animal', {
        options: ['cat', 'dog'],
      });
      assert.equal(result, 'cat');
    });

    it('Returns first valid yes or no', () => {
      setInput(['yes', 'no']);
      const result = helpers.promptForInput('Feed animal?', {
        yesOrNo: true,
      });
      assert.equal(result, 'yes');
    });

    it('Retries invalid yes or no', () => {
      setInput(['cat', 'yes']);
      const result = helpers.promptForInput('Feed animal?', {
        yesOrNo: true,
      });
      assert.equal(result, 'yes');
    });

    it('Returns yes for y', () => {
      setInput('y');
      const result = helpers.promptForInput('Feed animal?', {
        yesOrNo: true,
      });
      assert.equal(result, 'yes');
    });

    it('Returns no as is', () => {
      setInput('no');
      const result = helpers.promptForInput('Feed animal?', {
        yesOrNo: true,
      });
      assert.equal(result, 'no');
    });

    it('Returns no for n', () => {
      setInput('n');
      const result = helpers.promptForInput('Feed animal?', {
        yesOrNo: true,
      });
      assert.equal(result, 'no');
    });

    it('Returns no for empty string', () => {
      setInput('');
      const result = helpers.promptForInput('Feed animal?', {
        yesOrNo: true,
      });
      assert.equal(result, 'no');
    });
  });
});
