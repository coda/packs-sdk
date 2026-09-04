import * as sdk from '@codahq/packs-sdk';

const ApiDomain = 'api.harvey.ai';
const CompletionUrl = `https://${ApiDomain}/api/v2/completion?include_citations=true`;

export const pack = sdk.newPack();

pack.addNetworkDomain(ApiDomain);

pack.setUserAuthentication({
  type: sdk.AuthenticationType.HeaderBearerToken,
  networkDomain: ApiDomain,
  instructionsUrl: 'https://developers.harvey.ai/guides/authentication',
});

pack.addFormula({
  name: 'AskHarvey',
  description:
    'Ask Harvey a legal question. Attach a file or a Vault folder, not both. Streaming responses are assembled into the final text.',
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: 'prompt',
      description: 'A specific legal question or drafting request.',
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.File,
      name: 'file',
      description: 'Optional document to analyze in this request. Cannot be used with vaultFolderId.',
      optional: true,
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: 'vaultFolderId',
      description: 'Optional Vault project UUID to ground the request. Cannot be used with file.',
      optional: true,
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.Boolean,
      name: 'stream',
      description: 'If true, consume Harvey SSE chunks and return the assembled completion. Defaults to true.',
      optional: true,
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: 'mode',
      description: 'Optional completion mode: draft or assist.',
      optional: true,
    }),
  ],
  resultType: sdk.ValueType.String,
  async execute([prompt, fileUrl, vaultFolderId, stream, mode], context) {
    if (fileUrl && vaultFolderId) {
      throw new sdk.UserVisibleError('Harvey rejects file uploads together with Vault knowledge sources. Choose one.');
    }

    const useStream = stream !== false;
    const fields: Record<string, string> = {
      prompt,
      stream: useStream ? 'true' : 'false',
    };
    if (mode) {
      fields.mode = mode;
    }
    if (vaultFolderId) {
      fields.knowledge_sources = JSON.stringify([{type: 'vault', folder_id: vaultFolderId}]);
    }

    const files = fileUrl ? [await readUpload(fileUrl, 'file', context)] : undefined;
    const boundary = makeBoundary();
    const response = await context.fetcher.fetch({
      method: 'POST',
      url: CompletionUrl,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        Accept: useStream ? 'text/event-stream' : 'application/json',
      },
      body: encodeMultipart(boundary, fields, files),
      isBinaryResponse: useStream,
      cacheTtlSecs: 0,
    });

    if (useStream) {
      return assembleSseResponse(bufferToString(response.body));
    }

    const body = response.body as CompletionBody;
    return body.response_with_citations || body.response;
  },
});

pack.addFormula({
  name: 'ListVaultProjects',
  description: 'List Vault projects the authenticated Harvey user can view.',
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.Number,
      name: 'page',
      description: 'Page number. Defaults to 1.',
      optional: true,
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.Number,
      name: 'perPage',
      description: 'Page size, max 100. Defaults to 20.',
      optional: true,
    }),
  ],
  resultType: sdk.ValueType.String,
  async execute([page, perPage], context) {
    const url = sdk.withQueryParams(`https://${ApiDomain}/api/v1/vault/workspace/projects`, {
      page: page || 1,
      per_page: perPage || 20,
    });
    const response = await context.fetcher.fetch<{
      response: {content: {projects: Array<{id: string; name: string; files_count: number}>}};
    }>({
      method: 'GET',
      url,
      cacheTtlSecs: 0,
    });
    return JSON.stringify(response.body.response.content.projects);
  },
});

pack.addFormula({
  name: 'UploadToVault',
  description: 'Upload a file into a Vault project.',
  isAction: true,
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: 'projectId',
      description: 'Vault project UUID.',
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.File,
      name: 'file',
      description: 'The document to store in the project.',
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: 'filePath',
      description: 'Optional Vault path, including the file name.',
      optional: true,
    }),
  ],
  resultType: sdk.ValueType.String,
  async execute([projectId, fileUrl, filePath], context) {
    const upload = await readUpload(fileUrl, 'files', context);
    const fields: Record<string, string> = {};
    if (filePath) {
      fields.file_paths = filePath;
    }
    const boundary = makeBoundary();
    const response = await context.fetcher.fetch<{file_ids: string[]; project_id: string}>({
      method: 'POST',
      url: `https://${ApiDomain}/api/v1/vault/upload_files/${encodeURIComponent(projectId)}`,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: encodeMultipart(boundary, fields, [upload]),
      cacheTtlSecs: 0,
    });
    return JSON.stringify(response.body);
  },
});

interface CompletionBody {
  response: string;
  response_with_citations?: string | null;
}

interface MultipartFile {
  name: string;
  filename: string;
  contentType: string;
  data: Buffer;
}

async function readUpload(fileUrl: string, fieldName: string, context: sdk.ExecutionContext): Promise<MultipartFile> {
  const response = await context.fetcher.fetch({
    method: 'GET',
    url: fileUrl,
    isBinaryResponse: true,
    disableAuthentication: true,
  });
  const contentDisposition = String(response.headers['content-disposition'] || '');
  const filename = contentDisposition.match(/filename="?([^";]+)"?/)?.[1] || fileUrl.split('/').pop() || 'document';
  return {
    name: fieldName,
    filename,
    contentType: String(response.headers['content-type'] || 'application/octet-stream'),
    data: response.body as Buffer,
  };
}

function encodeMultipart(boundary: string, fields: Record<string, string>, files: MultipartFile[] = []): Buffer {
  const parts: Buffer[] = [];
  for (const [name, value] of Object.entries(fields)) {
    parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`));
  }
  for (const file of files) {
    parts.push(
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="${file.name}"; filename="${file.filename}"\r\nContent-Type: ${file.contentType}\r\n\r\n`,
      ),
    );
    parts.push(file.data);
    parts.push(Buffer.from('\r\n'));
  }
  parts.push(Buffer.from(`--${boundary}--\r\n`));
  return Buffer.concat(parts);
}

function assembleSseResponse(body: string): string {
  const chunks: string[] = [];
  let cited: string | undefined;
  for (const line of body.split(/\r?\n/)) {
    const payload = line.startsWith('data:') ? line.slice(5).trim() : '';
    if (!payload || payload === '[DONE]') {
      continue;
    }
    const parsed = JSON.parse(payload) as CompletionBody;
    if (parsed.response) {
      chunks.push(parsed.response);
    }
    if (parsed.response_with_citations) {
      cited = parsed.response_with_citations;
    }
  }
  return cited || chunks.join('');
}

function bufferToString(body: unknown): string {
  if (Buffer.isBuffer(body)) {
    return body.toString('utf8');
  }
  return String(body ?? '');
}

function makeBoundary(): string {
  return `coda-packs-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
