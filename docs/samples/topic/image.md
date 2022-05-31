---
title: Images
---

# Image samples

Packs have native support for accepting images as parameters and returning them as results, always passed as URLs. Packs can either return a "live" URL to a hosted image (`ImageReference`) or a temporary URL that Coda should upload the doc (`ImageAttachment`). The utility provided at `content.temporaryBlobStorage` can be used to save private images to a temporary location for later upload. Packs also provide support for embedded SVGs, including support for dark mode.


[Learn More](../../../guides/advanced/images){ .md-button }

## Image parameter
A formula that takes an image as a parameter. This sample returns the file size of an image.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Regular expression that matches Coda-hosted images.
const HostedImageUrlRegex = new RegExp("^https://(?:[^/]*\.)?codahosted.io/.*");

// Formula that calculates the file size of an image.
pack.addFormula({
  name: "FileSize",
  description: "Gets the file size of an image, in bytes.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Image,
      name: "image",
      description:
        "The image to operate on. Not compatible with Image URL columns.",
    }),
  ],
  resultType: coda.ValueType.Number,
  execute: async function ([imageUrl], context) {
    // Throw an error if the image isn't Coda-hosted. Image URL columns can
    // contain images on any domain, but we can only fetch the contents from
    // domains added with addNetworkDomain().
    if (!imageUrl.match(HostedImageUrlRegex)) {
      throw new coda.UserVisibleError("Not compatible with Image URL columns.");
    }
    // Fetch the image content.
    let response = await context.fetcher.fetch({
      method: "GET",
      url: imageUrl,
      isBinaryResponse: true, // Required when fetching binary content.
    });
    // The binary content of the response is returned as a Node.js Buffer.
    // See: https://nodejs.org/api/buffer.html
    let buffer = response.body as Buffer;
    // Return the length, in bytes.
    return buffer.length;
  },
});

// Coda images are hosted on this domain, and it must be added as an allowed
// network domain.
pack.addNetworkDomain("codahosted.io");
```
## Image result
A formula that return an external image. This sample returns a random photo of a cat.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Formula that fetches a random cat image, with various options.
pack.addFormula({
  name: "CatImage",
  description: "Gets a random cat image.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "text",
      description: "Text to display over the image.",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "filter",
      description: "A filter to apply to the image.",
      autocomplete: ["blur", "mono", "sepia", "negative", "paint", "pixel"],
      optional: true,
    }),
  ],
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.ImageReference,
  execute: async function ([text, filter], context) {
    let url = "https://cataas.com/cat";
    if (text) {
      url += "/says/" + encodeURIComponent(text);
    }
    url = coda.withQueryParams(url, {
      filter: filter,
      json: true,
    });
    let response = await context.fetcher.fetch({
      method: "GET",
      url: url,
      cacheTtlSecs: 0, // Don't cache the result, so we can get a fresh cat.
    });
    return "https://cataas.com" + response.body.url;
  },
});

// Allow the pack to make requests to Cat-as-a-service API.
pack.addNetworkDomain("cataas.com");
```
## Upload images
An action that downloads images from Coda and uploads them to another service. This sample uploads a list of files to Google Photos.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Regular expression that matches Coda-hosted images.
const HostedImageUrlRegex = new RegExp("^https://(?:[^/]*\.)?codahosted.io/.*");

// A custom type that bundles together the image buffer and content type.
interface ImageData {
  buffer: Buffer,
  contentType: string,
}

// Action that uploads a list of images to Google Photos.
pack.addFormula({
  name: "Upload",
  description: "Uploads images to Google Photos.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.ImageArray,
      name: "images",
      description: "The images to upload.",
    }),
  ],
  resultType: coda.ValueType.Array,
  items: {
    type: coda.ValueType.String,
    codaType: coda.ValueHintType.Url,
  },
  isAction: true,
  execute: async function ([imageUrls], context) {
    // Download the images from Coda.
    let images = await downloadImages(imageUrls, context);
    // Upload the images to Google Photos, getting temporary tokens.
    let uploadTokens = await uploadImages(images, context);
    // Add the images to the user's library, using the tokens.
    let urls = await addImages(uploadTokens, context);
    // Return the URLs of the uploaded images.
    return urls;
  },
});

// Download the images from Coda, in parallel. For each image it returns a
// buffer of image data and the MIME type of the image.
async function downloadImages(imageUrls, context: coda.ExecutionContext):
    Promise<ImageData[]> {
  let requests = [];
  for (let imageUrl of imageUrls) {
    // Reject images not hosted in Coda, since we can't download them.
    if (!imageUrl.match(HostedImageUrlRegex)) {
      throw new coda.UserVisibleError("Not compatible with Image URL columns.");
    }

    // Start the download.
    let request = context.fetcher.fetch({
      method: "GET",
      url: imageUrl,
      isBinaryResponse: true,
    });
    requests.push(request);
  }
  // Wait for all the downloads to finish.
  let responses = await Promise.all(requests);

  // Extract the data from the responses.
  let images: ImageData[] = [];
  for (let response of responses) {
    let data = {
      buffer: response.body,
      contentType: response.headers["content-type"] as string,
    };
    images.push(data);
  }
  return images;
}

// Uploads the images to Google Photos, in parallel. For each image it returns a
// temporary upload token.
async function uploadImages(images: ImageData[],
    context: coda.ExecutionContext): Promise<string[]> {
  let requests = [];
  for (let image of images) {
    // Start the upload.
    let request = context.fetcher.fetch({
      method: "POST",
      url: "https://photoslibrary.googleapis.com/v1/uploads",
      headers: {
        "Content-Type": "application/octet-stream",
        "X-Goog-Upload-Content-Type": image.contentType,
        "X-Goog-Upload-Protocol": "raw",
      },
      body: image.buffer,
    });
    requests.push(request);
  }
  // Wait for all the uploads to finish.
  let responses = await Promise.all(requests);

  // Extract the upload tokens from the responses.
  let uploadTokens = [];
  for (let response of responses) {
    let uploadToken = response.body;
    uploadTokens.push(uploadToken);
  }
  return uploadTokens;
}

// Adds uploaded images to the user's library. For each image it returns the URL
// of the image in Google Photos.
async function addImages(uploadTokens: string[],
    context: coda.ExecutionContext): Promise<string[]> {
  // Construct the request payload.
  let items = [];
  for (let uploadToken of uploadTokens) {
    let item  = {
      simpleMediaItem: {
        uploadToken: uploadToken,
      },
    };
    items.push(item);
  }
  let payload = {
    newMediaItems: items,
  };

  // Make the request to add all the images.
  let response = await context.fetcher.fetch({
    method: "POST",
    url: "https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  let results = response.body.newMediaItemResults;

  // Extract the URLs from the results.
  let urls = [];
  for (let [i, result] of results.entries()) {
    // Throw an error if any of the uploads failed.
    if (result.status.message !== "Success") {
      throw new coda.UserVisibleError(
        `Upload failed for image ${i + 1}: ${result.status.message}`);
    }
    let url = result.mediaItem.productUrl;
    urls.push(url);
  }
  return urls;
}

pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://oauth2.googleapis.com/token",
  scopes: [
    "https://www.googleapis.com/auth/photoslibrary.appendonly",
  ],
  additionalParams: {
    access_type: "offline",
    prompt: "consent",
  },
});

pack.addNetworkDomain("googleapis.com");
```
## Attach image data
A sync table that includes images sourced from raw data. This sample syncs files from Dropbox, including their thumbnail images.

```ts
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
      fromKey: "webViewLink",
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
      let files = filesResponse.entries;
      let hasMore = filesResponse.has_more;

      // Get the thumbnail metadata for each file.
      let paths = filesResponse.entries.map(file => file.path_lower);
      let thumbnailsResponse = await getThumbnails(paths, context);
      let thumbnails = thumbnailsResponse.entries;

      // The thumbnail images are returned as base64-encoded strings in the
      // response body, but the doc can only ingest an image URL. We'll parse
      // the image data and store it in temporary blob storage, and return those
      // URLs.

      // Collect the all of the temporary blob storage jobs that are started.
      let jobs = [];
      for (let metadata of thumbnails) {
        let job;
        if (metadata.thumbnail) {
          // Parse the base64 thumbnail content.
          let buffer = Buffer.from(metadata.thumbnail, "base64");
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
async function getFiles(context: coda.ExecutionContext) {
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
async function getThumbnails(paths, context: coda.ExecutionContext) {
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
  return response.body;
}

// Set per-user authentication using Dropbox's OAuth2.
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://www.dropbox.com/oauth2/authorize",
  tokenUrl: "https://api.dropbox.com/oauth2/token",
  scopes: ["files.content.read"],
  additionalParams: {
    token_access_type: "offline",
  },
});

// Allow access to the Dropbox domains.
// Note: Using multiple domains in a Pack requires approval from Coda.
pack.addNetworkDomain("api.dropboxapi.com");
pack.addNetworkDomain("content.dropboxapi.com");
```
## Attach private images
A sync table that includes images sourced from private URLs. This sample syncs files from Google Drive, including their thumbnail images.

```ts
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
});

// Allow access to the Google domains.
// Note: Using multiple domains in a Pack requires approval from Coda.
pack.addNetworkDomain("googleapis.com");
pack.addNetworkDomain("docs.google.com");
pack.addNetworkDomain("lh3.googleusercontent.com");
```
## Generated SVG
A formula that generated an SVG, and returns it as a data URI. This sample generates an image from the text provided.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// A formula that generates an image using some input text.
pack.addFormula({
  name: "TextToImage",
  description: "Generates an image using the text provided.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "text",
      description: "The text to include in the image.",
      suggestedValue: "Hello World!",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "color",
      description: "The desired color of the text. Defaults to black.",
      optional: true,
    }),
  ],
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.ImageReference,
  execute: async function ([text, color = "black"], context) {
    // Calculate the width of the generated image required to fit the text.
    // Using a fixed-width font to make this easy.
    let width = text.length * 6;
    // Generate the SVG markup. Prefer using a library for this when possible.
    let svg = `
      <svg viewBox="0 0 ${width} 10" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="8" font-family="Courier" font-size="10" fill="${color}">
          ${text}
        </text>
      </svg>
    `.trim();
    // Encode the markup as base64.
    let encoded = Buffer.from(svg).toString("base64");
    // Return the SVG as a data URL.
    return coda.SvgConstants.DataUrlPrefix + encoded;
  },
});
```
## Dark mode SVG
A formula that generates an SVG that adapts if dark mode is enabled. This sample generates an image with static text, which changes color when dark mode is enabled.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// A formula that demonstrates how to generate an SVG that adapts to the user's
// dark mode setting in Coda.
pack.addFormula({
  name: "HelloDarkMode",
  description: "Generates an image that adapts to the dark mode setting.",
  parameters: [],
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.ImageReference,
  execute: async function ([], context) {
    // When loading your image in dark mode, Coda will append the URL fragment
    // "#DarkMode". Instead of hard-coding that value, it's safer to retrieve
    // it from the SDK.
    let darkModeId = coda.SvgConstants.DarkModeFragmentId;
    // Generate the SVG markup. Prefer using a library for this when possible.
    let svg = `
      <svg viewBox="0 0 36 10" xmlns="http://www.w3.org/2000/svg">
        <!-- Add the dark mode ID to the root of the SVG. -->
        <g id="${darkModeId}">
          <text x="0" y="8" font-family="Courier" font-size="10" fill="black">
            Hello World!
          </text>
        </g>
        <style>
          /* Create a style rule that will be applied when the dark mode
             fragment is applied. */
          #${darkModeId}:target text { fill: white; }
        </style>
      </svg>
    `.trim();
    // Encode the markup as base64.
    let encoded = Buffer.from(svg).toString("base64");
    // Return the SVG as a data URL (using the dark mode prefix).
    return coda.SvgConstants.DataUrlPrefixWithDarkModeSupport + encoded;
  },
});
```

