import type {ResponseError} from '../helpers/external-api/coda';
import {formatResponseError} from '../cli/errors';

function fakeResponseError(response: {status: number; statusText: string; body: string}): ResponseError {
  const {status, statusText, body} = response;
  return {
    response: {
      status,
      statusText,
      text: async () => body,
    },
  } as ResponseError;
}

describe('CLI errors', () => {
  describe('formatResponseError', () => {
    it('surfaces the server-side message and status from a JSON body', async () => {
      const err = fakeResponseError({
        status: 401,
        statusText: 'Unauthorized',
        body: JSON.stringify({statusCode: 401, message: 'Token is missing the pack scope'}),
      });

      const formatted = await formatResponseError(err);

      assert.include(formatted, '401');
      assert.include(formatted, 'Unauthorized');
      assert.include(formatted, 'Token is missing the pack scope');
    });

    it('falls back to the raw response text when the body is not JSON', async () => {
      const err = fakeResponseError({
        status: 502,
        statusText: 'Bad Gateway',
        body: 'upstream connect error or disconnect/reset before headers',
      });

      const formatted = await formatResponseError(err);

      assert.include(formatted, '502');
      assert.include(formatted, 'upstream connect error or disconnect/reset before headers');
    });

    it('returns the status when the response body is empty', async () => {
      const err = fakeResponseError({
        status: 500,
        statusText: 'Internal Server Error',
        body: '',
      });

      const formatted = await formatResponseError(err);

      assert.include(formatted, '500');
      assert.include(formatted, 'Internal Server Error');
    });
  });
});
