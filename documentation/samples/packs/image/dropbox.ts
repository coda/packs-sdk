import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Schema defining the fields to sync for each file.
const FileSchema = coda.makeObjectSchema({
  properties: {
    name: { type: coda.ValueType.String },
    path: { type: coda.ValueType.String, fromKey: "path_display" },
    url: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
    },
    thumbnail: {
      type: coda.ValueType.String,
      // ImageAttachments instructs Coda to ingest the image and store it in the
      // doc. This is required, since the thumbnail image URLs returned by
      // TemporaryBlobStorage expire.
      codaType: coda.ValueHintType.ImageAttachment,
    },
    fileId: { type: coda.ValueType.String, fromKey: "id" },
  },
  displayProperty: "name",
  idProperty: "fileId",
  featuredProperties: ["thumbnail", "url"],
});

// Sync table for files.
pack.addSyncTable({
  name: "Files",
  identityName: "File",
  schema: FileSchema,
  formula: {
    name: "SyncFiles",
    description: "Sync the files.",
    parameters: [],
    execute: async function ([], context) {
      // Get a batch of files.
      let filesResponse = await getFiles(context);
      let files = filesResponse.entries
        .filter(entry => entry[".tag"] === "file");
      let hasMore = filesResponse.has_more;

      // Get the URL for each file.
      let fileIds = files.map(file => file.id);
      let fileUrls = await getFileUrls(fileIds, context);
      for (let i = 0; i < files.length; i++) {
        files[i].url = fileUrls[i];
      }

      // Get the thumbnail for each file.
      let paths = files.map(file => file.path_lower);
      let thumbnails = await getThumbnails(paths, context);

      // The thumbnail images are returned as base64-encoded strings in the
      // response body, but the doc can only ingest an image URL. We'll parse
      // the image data and store it in temporary blob storage, and return those
      // URLs.

      // Collect the all of the temporary blob storage jobs that are started.
      let jobs = [];
      for (let thumbnail of thumbnails) {
        let job;
        if (thumbnail) {
          // Parse the base64 thumbnail content.
          let buffer = Buffer.from(thumbnail, "base64");
          // Store it in temporary blob storage.
          job = context.temporaryBlobStorage.storeBlob(buffer, "image/png");
        } else {
          // The file has no thumbnail, have the job return undefined.
          job = Promise.resolve(undefined);
        }
        jobs.push(job);
      }

      // Wait for all the jobs to complete, then copy the temporary URLs back
      // into the file objects.
      let temporaryUrls = await Promise.all(jobs);
      for (let i = 0; i < files.length; i++) {
        files[i].thumbnail = temporaryUrls[i];
      }

      // If there are more files to retrieve, create a continuation.
      let continuation;
      if (hasMore) {
        continuation = {
          cursor: filesResponse.cursor,
        };
      }

      // Return the results.
      return {
        result: files,
        continuation: continuation,
      };
    },
  },
});

// Gets a batch of files from the API.
async function getFiles(context: coda.ExecutionContext): Promise<any> {
  let url = "https://api.dropboxapi.com/2/files/list_folder";
  let body;

  // Retrieve the cursor to continue from, if any.
  let cursor = context.sync.continuation?.cursor;
  if (cursor) {
    // Continue from the cursor.
    url = coda.joinUrl(url, "/continue");
    body = {
      cursor: cursor,
    };
  } else {
    // Starting a new sync, list all of the files.
    body = {
      path: "",
      recursive: true,
      limit: 25,
    };
  }

  // Make the API request and return the response.
  let response = await context.fetcher.fetch({
    method: "POST",
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return response.body;
}

// Get the thumbnail metadata for a list of file paths.
async function getThumbnails(paths, context: coda.ExecutionContext):
    Promise<string[]> {
  // Use a batch URL to get all of the thumbnail metadata in one request.
  let url = "https://content.dropboxapi.com/2/files/get_thumbnail_batch";

  // Create a request entry for each file path.
  let entries = [];
  for (let path of paths) {
    let entry = {
      path: path,
      format: "png",
      size: "w256h256",
    };
    entries.push(entry);
  }

  // Make the API request and return the response.
  let response = await context.fetcher.fetch({
    method: "POST",
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      entries: entries,
    }),
  });
  return response.body.entries.map(entry => entry.thumbnail);
}

// Get the Dropbox URLs for a list of file IDs.
async function getFileUrls(fileIds, context: coda.ExecutionContext):
    Promise<string[]> {
  // Use a batch URL to get all of the thumbnail metadata in one request.
  let url = "https://api.dropboxapi.com/2/sharing/get_file_metadata/batch";

  // Make the API request and return the response.
  let response = await context.fetcher.fetch({
    method: "POST",
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      files: fileIds,
    }),
  });
  return response.body.map(metadata => metadata.result.preview_url);
}

// Set per-user authentication using Dropbox's OAuth2.
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://www.dropbox.com/oauth2/authorize",
  tokenUrl: "https://api.dropbox.com/oauth2/token",
  scopes: ["files.content.read", "sharing.read"],
  additionalParams: {
    token_access_type: "offline",
  },
});

// Allow access to the Dropbox domain.
pack.addNetworkDomain("dropboxapi.com");
