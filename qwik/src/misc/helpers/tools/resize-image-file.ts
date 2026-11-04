// downscales+recompresses an image client-side before upload: keeps memory pressure
// (and the request itself) small on phones, and normalizes odd formats (e.g. iPhone HEIC)
// to plain jpeg before it ever reaches the server. Falls back to the original file on
// any failure (decode error, no canvas support) rather than blocking the upload.
export function resizeImageFile(file: File, maxDimension = 1600, quality = 0.82): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
      const width = Math.round(img.width * scale);
      const height = Math.round(img.height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) return resolve(file);

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => resolve(blob || file), 'image/jpeg', quality);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}
