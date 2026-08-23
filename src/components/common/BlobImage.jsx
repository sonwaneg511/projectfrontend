'use client';

import Image from 'next/image';
import { useObjectUrl } from '@/hooks/useObjectUrl';

/**
 * Renders a preview <Image> for a File without leaking blob URLs.
 * Creates the object URL via useObjectUrl (revoked on unmount/change) and
 * falls back to `fallbackUrl` for already-uploaded images that have no File.
 * Passes through any extra props (width, height, className, alt, ...) to next/image.
 */
export function BlobImage({ file, fallbackUrl = '', alt = '', ...props }) {
  const objectUrl = useObjectUrl(file);
  const src = objectUrl || fallbackUrl;

  if (!src) return null;

  return <Image src={src} alt={alt} {...props} />;
}
