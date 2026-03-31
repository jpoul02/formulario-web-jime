const UPLOAD_MARKER = '/image/upload/';

export function getCloudinaryUrl(
  src: string,
  width: number,
  quality: number | 'auto' = 'auto'
): string {
  if (!src || !src.includes('res.cloudinary.com')) return src;

  const idx = src.indexOf(UPLOAD_MARKER);
  if (idx === -1) return src;

  const before = src.slice(0, idx + UPLOAD_MARKER.length);
  const after = src.slice(idx + UPLOAD_MARKER.length);

  if (/^[a-z]_/.test(after)) return src;

  return `${before}f_auto,q_${quality},w_${width}/${after}`;
}

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (src.includes('res.cloudinary.com')) {
    return getCloudinaryUrl(src, width, quality ?? 'auto');
  }
  return src;
}
