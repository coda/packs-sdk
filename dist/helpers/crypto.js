import createHash from 'sha.js';
export function computeSha256(dataToChecksum, encodeAsUtf8 = true) {
    return _computeSha256Impl(dataToChecksum, encodeAsUtf8, true);
}
function _computeSha256Impl(dataToChecksum, encodeAsUtf8 = true, outputHex) {
    const hash = createHash('sha256');
    if (typeof dataToChecksum === 'string' && encodeAsUtf8) {
        hash.update(dataToChecksum, 'utf8');
    }
    else {
        hash.update(dataToChecksum);
    }
    return outputHex ? hash.digest('hex') : hash.digest();
}
