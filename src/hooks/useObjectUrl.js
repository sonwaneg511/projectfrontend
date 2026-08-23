import { useEffect, useState } from 'react';

/**
 * Creates a blob object URL for the given File and revokes it on change/unmount,
 * preventing the blob-URL memory leak caused by calling URL.createObjectURL()
 * during render. Returns '' when no file is provided.
 */
export function useObjectUrl(file) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!file) {
      setUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
}
