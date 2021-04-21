import createHash from 'sha.js';

export function computeSha256(dataToChecksum: string | Buffer, encodeAsUtf8: boolean = true): string {
  return _computeSha256Impl(dataToChecksum, encodeAsUtf8, true);
}

function _computeSha256Impl(dataToChecksum: string | Buffer, encodeAsUtf8: boolean, outputHex: true): string;
function _computeSha256Impl(dataToChecksum: string | Buffer, encodeAsUtf8: boolean, outputHex: false): Buffer;
function _computeSha256Impl(dataToChecksum: string | Buffer, encodeAsUtf8 = true, outputHex: boolean): string | Buffer {
  const hash = createHash('sha256');
  if (typeof dataToChecksum === 'string' && encodeAsUtf8) {
    hash.update(dataToChecksum, 'utf8');
  } else {
    hash.update(dataToChecksum);
  }

  return outputHex ? hash.digest('hex') : hash.digest();
}
