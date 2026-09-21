"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseServerSentEvents = exports.makeMultipartBody = exports.downloadFile = void 0;
/**
 * Downloads a URL supplied by a File parameter without applying the Pack's authentication.
 */
async function downloadFile(fileUrl, fetcher) {
    var _a;
    const response = await fetcher.fetch({
        method: 'GET',
        url: fileUrl,
        isBinaryResponse: true,
        disableAuthentication: true,
    });
    if (!Buffer.isBuffer(response.body)) {
        throw new Error(`Expected a binary response while downloading ${fileUrl}.`);
    }
    const contentDisposition = String(response.headers['content-disposition'] || '');
    const filename = ((_a = contentDisposition.match(/filename="?([^";]+)"?/)) === null || _a === void 0 ? void 0 : _a[1]) || fileUrl.split('/').pop() || 'file';
    return {
        filename,
        contentType: String(response.headers['content-type'] || 'application/octet-stream'),
        data: response.body,
    };
}
exports.downloadFile = downloadFile;
/**
 * Encodes text fields and files as a multipart/form-data request body.
 */
function makeMultipartBody(fields, files = [], boundary = makeBoundary()) {
    const parts = [];
    for (const [name, value] of Object.entries(fields)) {
        parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${escapeHeaderValue(name)}"\r\n\r\n${value}\r\n`));
    }
    for (const file of files) {
        parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${escapeHeaderValue(file.fieldName)}"; filename="${escapeHeaderValue(file.filename)}"\r\nContent-Type: ${escapeHeaderValue(file.contentType)}\r\n\r\n`));
        parts.push(file.data);
        parts.push(Buffer.from('\r\n'));
    }
    parts.push(Buffer.from(`--${boundary}--\r\n`));
    return {
        body: Buffer.concat(parts),
        contentType: `multipart/form-data; boundary=${boundary}`,
    };
}
exports.makeMultipartBody = makeMultipartBody;
/**
 * Parses a complete server-sent events response into events.
 */
function parseServerSentEvents(body) {
    const events = [];
    for (const block of body.toString().replace(/\r\n/g, '\n').split(/\n\n+/)) {
        const event = parseServerSentEvent(block);
        if (event) {
            events.push(event);
        }
    }
    return events;
}
exports.parseServerSentEvents = parseServerSentEvents;
function parseServerSentEvent(block) {
    const data = [];
    let event;
    let id;
    let retry;
    for (const line of block.split('\n')) {
        if (!line || line.startsWith(':')) {
            continue;
        }
        const separator = line.indexOf(':');
        const field = separator === -1 ? line : line.slice(0, separator);
        const value = separator === -1 ? '' : line.slice(separator + 1).replace(/^ /, '');
        if (field === 'data') {
            data.push(value);
        }
        else if (field === 'event') {
            event = value;
        }
        else if (field === 'id') {
            id = value;
        }
        else if (field === 'retry' && /^\d+$/.test(value)) {
            retry = Number(value);
        }
    }
    if (data.length === 0) {
        return undefined;
    }
    return {
        data: data.join('\n'),
        ...(event !== undefined ? { event } : {}),
        ...(id !== undefined ? { id } : {}),
        ...(retry !== undefined ? { retry } : {}),
    };
}
function makeBoundary() {
    return `coda-packs-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function escapeHeaderValue(value) {
    return value.replace(/[\r\n]/g, '').replace(/"/g, '%22');
}
