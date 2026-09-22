import './test_helper';
import type {Fetcher} from '../api_types';
import {downloadFile} from '../helpers/http';
import {makeMultipartBody} from '../helpers/http';
import {parseServerSentEvents} from '../helpers/http';

describe('HTTP helpers', () => {
  it('downloads an uploaded file without connector authentication', async () => {
    const fetcher = {
      async fetch(request) {
        assert.deepEqual(request, {
          method: 'GET',
          url: 'https://uploads.example.com/document',
          isBinaryResponse: true,
          disableAuthentication: true,
        });
        return {
          status: 200,
          headers: {
            'content-disposition': 'attachment; filename="contract.pdf"',
            'content-type': 'application/pdf',
          },
          body: Buffer.from('contract'),
        };
      },
    } as Fetcher;

    assert.deepEqual(await downloadFile('https://uploads.example.com/document', fetcher), {
      filename: 'contract.pdf',
      contentType: 'application/pdf',
      data: Buffer.from('contract'),
    });
  });

  it('builds a multipart body with fields and files', () => {
    const multipart = makeMultipartBody(
      {prompt: 'Review this'},
      [
        {
          fieldName: 'file',
          filename: 'contract.txt',
          contentType: 'text/plain',
          data: Buffer.from('terms'),
        },
      ],
      'test-boundary',
    );

    assert.equal(multipart.contentType, 'multipart/form-data; boundary=test-boundary');
    assert.equal(
      multipart.body.toString(),
      '--test-boundary\r\n' +
        'Content-Disposition: form-data; name="prompt"\r\n\r\n' +
        'Review this\r\n' +
        '--test-boundary\r\n' +
        'Content-Disposition: form-data; name="file"; filename="contract.txt"\r\n' +
        'Content-Type: text/plain\r\n\r\n' +
        'terms\r\n' +
        '--test-boundary--\r\n',
    );
  });

  it('parses event metadata and multiline data from an SSE response', () => {
    const events = parseServerSentEvents(
      Buffer.from(
        ': keepalive\r\n' +
          'id: 42\r\n' +
          'event: completion\r\n' +
          'retry: 1000\r\n' +
          'data: first line\r\n' +
          'data: second line\r\n\r\n' +
          'data: [DONE]\r\n\r\n',
      ),
    );

    assert.deepEqual(events, [
      {
        data: 'first line\nsecond line',
        event: 'completion',
        id: '42',
        retry: 1000,
      },
      {data: '[DONE]'},
    ]);
  });
});
