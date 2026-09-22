import type {Fetcher} from '../api_types';

export interface DownloadedFile {
  filename: string;
  contentType: string;
  data: Buffer;
}

export interface MultipartFile extends DownloadedFile {
  fieldName: string;
}

export interface MultipartBody {
  body: Buffer;
  contentType: string;
}

export interface ServerSentEvent {
  data: string;
  event?: string;
  id?: string;
  retry?: number;
}

/**
 * Downloads a URL supplied by a File parameter without applying the Pack's authentication.
 */
export async function downloadFile(fileUrl: string, fetcher: Fetcher): Promise<DownloadedFile> {
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
  const filename = contentDisposition.match(/filename="?([^";]+)"?/)?.[1] || fileUrl.split('/').pop() || 'file';
  return {
    filename,
    contentType: String(response.headers['content-type'] || 'application/octet-stream'),
    data: response.body,
  };
}

/**
 * Encodes text fields and files as a multipart/form-data request body.
 */
export function makeMultipartBody(
  fields: Record<string, string>,
  files: MultipartFile[] = [],
  boundary = makeBoundary(),
): MultipartBody {
  const parts: Buffer[] = [];
  for (const [name, value] of Object.entries(fields)) {
    parts.push(
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="${escapeHeaderValue(name)}"\r\n\r\n${value}\r\n`,
      ),
    );
  }
  for (const file of files) {
    parts.push(
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="${escapeHeaderValue(
          file.fieldName,
        )}"; filename="${escapeHeaderValue(file.filename)}"\r\nContent-Type: ${escapeHeaderValue(
          file.contentType,
        )}\r\n\r\n`,
      ),
    );
    parts.push(file.data);
    parts.push(Buffer.from('\r\n'));
  }
  parts.push(Buffer.from(`--${boundary}--\r\n`));
  return {
    body: Buffer.concat(parts),
    contentType: `multipart/form-data; boundary=${boundary}`,
  };
}

/**
 * Parses a complete server-sent events response into events.
 */
export function parseServerSentEvents(body: string | Buffer): ServerSentEvent[] {
  const events: ServerSentEvent[] = [];
  for (const block of body.toString().replace(/\r\n/g, '\n').split(/\n\n+/)) {
    const event = parseServerSentEvent(block);
    if (event) {
      events.push(event);
    }
  }
  return events;
}

function parseServerSentEvent(block: string): ServerSentEvent | undefined {
  const data: string[] = [];
  let event: string | undefined;
  let id: string | undefined;
  let retry: number | undefined;
  for (const line of block.split('\n')) {
    if (!line || line.startsWith(':')) {
      continue;
    }
    const separator = line.indexOf(':');
    const field = separator === -1 ? line : line.slice(0, separator);
    const value = separator === -1 ? '' : line.slice(separator + 1).replace(/^ /, '');
    if (field === 'data') {
      data.push(value);
    } else if (field === 'event') {
      event = value;
    } else if (field === 'id') {
      id = value;
    } else if (field === 'retry' && /^\d+$/.test(value)) {
      retry = Number(value);
    }
  }
  if (data.length === 0) {
    return undefined;
  }
  return {
    data: data.join('\n'),
    ...(event !== undefined ? {event} : {}),
    ...(id !== undefined ? {id} : {}),
    ...(retry !== undefined ? {retry} : {}),
  };
}

function makeBoundary(): string {
  return `coda-packs-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function escapeHeaderValue(value: string): string {
  return value.replace(/[\r\n]/g, '').replace(/"/g, '%22');
}
