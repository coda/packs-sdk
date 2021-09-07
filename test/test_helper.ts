export const testHelper = {
  /**
   * Asserts that the provided promise is rejected by wrapping it with another and rejecting if it's fulfilled. A
   * subsequent {@code then} block can be used to perform assertions on the original promise's rejection error.
   *
   * @param promise The original promise.
   * @returns The inverted promise, which fulfills if rejected and rejects if fulfilled.
   */
  async willBeRejected<ErrorT = any>(promise: Promise<any>): Promise<ErrorT> {
    try {
      await promise;
    } catch (err: any) {
      return err;
    }

    throw new Error('Promise unexpectedly resolved');
  },

  /**
   * Similar to {@link assert.willBeRejected}, but also takes in a matcher than can be used to quickly match the
   * expected error with which the specified promise is rejected. Unlike the other assertion method, however, this one
   * intentionally does not return the error; use the other one if you need to perform more complex assertions on the
   * returned error.
   *
   * @param {Promise<T>} promise The original promise.
   * @param {RegEx} matcher
   * @returns {Promise<T>} The inverted promise, which fulfills if rejected and rejects if fulfilled (or if rejected
   *   with an unmatched error).
   */
  async willBeRejectedWith<T, ErrorT = any>(promise: Promise<T>, matcher?: RegExp): Promise<ErrorT> {
    const error = await this.willBeRejected(promise);
    if (matcher) {
      assert.match(error, matcher, 'Promise was rejected with unexpected error.');
    }
    return error as ErrorT;
  },
};
