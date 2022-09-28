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
      disableAuthentication: true,
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
