import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Schema defining the fields to sync for each file.
const FileSchema = coda.makeObjectSchema({
  properties: {
    name: { type: coda.ValueType.String },
    url: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
      fromKey: "webViewLink",
    },
    thumbnail: {
      type: coda.ValueType.String,
      // ImageAttachments instructs Coda to ingest the image and store it in the
      // doc.
      codaType: coda.ValueHintType.ImageAttachment,
    },
    fileId: {
      type: coda.ValueType.String,
      fromKey: "id",
    },
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
      // Retrieve the page token to use from the previous sync, if any.
      let pageToken = context.sync.continuation?.pageToken;

      // Get a batch of files.
      let url = "https://www.googleapis.com/drive/v3/files";
      url = coda.withQueryParams(url, {
        fields: "files(id,name,webViewLink,thumbnailLink)",
        pageToken: pageToken,
      });
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });
      let files = response.body.files;
      let nextPageToken = response.body.nextPageToken;

      // The thumbnail URLs that the Drive API returns require authentication
      // credentials to access, so the doc won't be able to ingest them as-is.
      // Instead, we'll download the thumbnails and store them in temporary
      // blob storage, and return those URLs.

      // Collect the all of the temporary blob storage jobs that are started.
      let jobs = [];
      for (let file of files) {
        let job;
        if (file.thumbnailLink) {
          // Download the thumbnail (with credentials) and store it in temporary
          // blob storage.
          job = context.temporaryBlobStorage.storeUrl(file.thumbnailLink);
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
      if (nextPageToken) {
        continuation = { pageToken: nextPageToken };
      }

      // Return the results.
      return {
        result: files,
        continuation: continuation,
      };
    },
  },
});

// Set per-user authentication using Google's OAuth2.
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://oauth2.googleapis.com/token",
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  additionalParams: {
    access_type: "offline",
    prompt: "consent",
  },
  // Send the authentication information to all domains.
  // Note: Using auth with multiple domains requires approval from Coda.
  networkDomain: ["googleapis.com", "docs.google.com", "googleusercontent.com"],
});

// Allow access to the Google domains.
// Note: Using multiple domains in a Pack requires approval from Coda.
pack.addNetworkDomain("googleapis.com");
pack.addNetworkDomain("docs.google.com");
pack.addNetworkDomain("googleusercontent.com");
