import * as promise from './promise';
import streamModule from 'stream';

type ReadableStream = streamModule.Readable | streamModule.Duplex;

export function isReadableStream(stream: any): stream is ReadableStream {
  return stream instanceof streamModule.Readable || stream instanceof streamModule.Duplex;
}

export async function toBuffer(stream: streamModule.Readable, maxBytes: number = 0): Promise<Buffer> {
  const bufs: Buffer[] = [];
  const defer = promise.defer<Buffer>();

  function onEnd() {
    stream.destroy();

    let buf = Buffer.concat(bufs);
    if (maxBytes) {
      buf = buf.slice(0, maxBytes);
    }
    defer.fulfill(buf);
  }

  let count = 0;
  stream.on('data', buffer => {
    if (typeof buffer === 'string') {
      bufs.push(Buffer.from(buffer));
    } else {
      bufs.push(buffer);
    }

    count += buffer.length;
    if (maxBytes && count >= maxBytes) {
      onEnd();
    }
  });

  stream.on('end', () => onEnd());
  stream.on('error', err => defer.reject(err));

  return defer.promise;
}
