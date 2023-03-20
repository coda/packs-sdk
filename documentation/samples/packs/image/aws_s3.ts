import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Action that uploads a file to Amazon S3.
pack.addFormula({
  name: "Upload",
  description: "Upload a file to AWS S3.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.File,
      name: "file",
      description: "The file to upload.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "name",
      description: "The target file name. Default: the original file name.",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "path",
      description: "The target directory path. Default: the root directory.",
      optional: true,
    }),
  ],
  resultType: coda.ValueType.String,
  isAction: true,
  execute: async function ([fileUrl, name, path="/"], context) {
    // Fetch the file contents.
    let response = await context.fetcher.fetch({
      method: "GET",
      url: fileUrl,
      isBinaryResponse: true,
      disableAuthentication: true,
    });
    let buffer = response.body;
    let contentType = response.headers["content-type"] as string;
    let contentDisposition = response.headers["content-disposition"] as string;

    // Determine file name.
    if (!name && contentDisposition) {
      name = getFilename(contentDisposition);
    }
    if (!name) {
      // Fallback to last segment of the URL.
      name = fileUrl.split("/").pop();
    }

    // Upload to S3.
    let s3Url = coda.joinUrl(context.endpoint, path, name);
    await context.fetcher.fetch({
      method: "PUT",
      url: s3Url,
      headers: {
        "Content-Type": contentType,
        "Content-Length": buffer.length.toString(),
      },
      body: buffer,
    });
    return s3Url;
  },
});

// Gets the filename from a Content-Disposition header value.
function getFilename(contentDisposition) {
  let match = contentDisposition.match(/filename=(.*?)(;|$)/);
  if (!match) {
    return;
  }
  let filename = match[1].trim();
  // Remove quotes around the filename, if present.
  filename = filename.replace(/^["'](.*)["']$/, "$1");
  return filename;
}

// Set per-user authentication using AWS Signature Version 4 with an access key.
pack.setUserAuthentication({
  type: coda.AuthenticationType.AWSAccessKey,
  service: "s3",
  requiresEndpointUrl: true,
  endpointDomain: "amazonaws.com",
});

// Allow the pack to make requests to AWS.
pack.addNetworkDomain("amazonaws.com");
