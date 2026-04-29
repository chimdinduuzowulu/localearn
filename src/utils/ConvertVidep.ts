export function extractGoogleDriveFileId(url: string) {
  const pattern = /\/d\/([a-zA-Z0-9_-]+)\//;
  const match = url.match(pattern);

  if (match && match[1]) {
    return match[1];
  } else {
    return null;
  }
}

