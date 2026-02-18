import { useState, useEffect } from 'react';

interface ApkMetadata {
  size: number | null;
  lastModified: string | null;
  contentType: string | null;
  isLoading: boolean;
  error: string | null;
}

interface ApkIntegrityResult extends ApkMetadata {
  sha256: string | null;
  isCalculating: boolean;
  calculateChecksum: () => Promise<void>;
}

// Minimum size threshold for a valid APK (100 KB)
const MIN_VALID_APK_SIZE = 100 * 1024;

export function useApkIntegrity(shouldFetch: boolean): ApkIntegrityResult {
  const [size, setSize] = useState<number | null>(null);
  const [lastModified, setLastModified] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sha256, setSha256] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (!shouldFetch) {
      setSize(null);
      setLastModified(null);
      setContentType(null);
      setError(null);
      setSha256(null);
      return;
    }

    let isCancelled = false;

    const fetchMetadata = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Add cache-busting to ensure fresh metadata
        const cacheBuster = `?t=${Date.now()}`;
        const apkUrl = `/downloads/app.apk${cacheBuster}`;

        // Try HEAD request first for lightweight metadata
        let response: Response;
        try {
          response = await fetch(apkUrl, {
            method: 'HEAD',
            cache: 'no-store',
          });
        } catch (headError) {
          // Fallback to GET if HEAD is not supported
          response = await fetch(apkUrl, {
            method: 'GET',
            cache: 'no-store',
          });
        }

        if (isCancelled) return;

        if (response.ok) {
          // Extract Content-Length
          const contentLength = response.headers.get('Content-Length');
          if (contentLength) {
            const sizeBytes = parseInt(contentLength, 10);
            setSize(sizeBytes);
            
            // Validate size
            if (sizeBytes < MIN_VALID_APK_SIZE) {
              setError(`File is too small (${(sizeBytes / 1024).toFixed(2)} KB) - likely a placeholder, not a real APK`);
            }
          }

          // Extract Content-Type
          const contentTypeHeader = response.headers.get('Content-Type');
          if (contentTypeHeader) {
            setContentType(contentTypeHeader);
            
            // Warn if content-type suggests HTML/text instead of APK
            if (contentTypeHeader.includes('text/html') || contentTypeHeader.includes('text/plain')) {
              setError('File appears to be HTML/text, not an APK - server may be returning an error page');
            }
          }

          // Extract Last-Modified
          const lastModifiedHeader = response.headers.get('Last-Modified');
          if (lastModifiedHeader) {
            setLastModified(lastModifiedHeader);
          }
        } else {
          setError(`Unable to fetch APK metadata (status ${response.status})`);
        }
      } catch (err) {
        if (isCancelled) return;
        setError('Network error while fetching APK metadata');
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchMetadata();

    return () => {
      isCancelled = true;
    };
  }, [shouldFetch]);

  const calculateChecksum = async () => {
    try {
      setIsCalculating(true);
      setError(null);

      // Fetch the APK file with cache-busting
      const cacheBuster = `?t=${Date.now()}`;
      const response = await fetch(`/downloads/app.apk${cacheBuster}`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch APK (status ${response.status})`);
      }

      // Get the file as ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();
      
      // Validate size
      if (arrayBuffer.byteLength < MIN_VALID_APK_SIZE) {
        throw new Error(`Downloaded file is too small (${(arrayBuffer.byteLength / 1024).toFixed(2)} KB) - not a valid APK`);
      }

      // Calculate SHA-256 using Web Crypto API
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);

      // Convert to hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      setSha256(hashHex);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate checksum');
      setSha256(null);
    } finally {
      setIsCalculating(false);
    }
  };

  return {
    size,
    lastModified,
    contentType,
    isLoading,
    error,
    sha256,
    isCalculating,
    calculateChecksum,
  };
}
