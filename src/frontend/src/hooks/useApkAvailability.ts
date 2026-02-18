import { useState, useEffect } from 'react';

type ApkStatus = 'checking' | 'available' | 'invalid' | 'missing' | 'unreachable';

interface ApkAvailabilityResult {
  status: ApkStatus;
  message: string;
  size: number | null;
  contentType: string | null;
}

// Minimum size threshold for a valid APK (100 KB)
// Real APKs are typically 5-20 MB; anything under 100 KB is likely a placeholder/error page
const MIN_VALID_APK_SIZE = 100 * 1024; // 100 KB in bytes

export function useApkAvailability(shouldCheck: boolean): ApkAvailabilityResult {
  const [status, setStatus] = useState<ApkStatus>('checking');
  const [message, setMessage] = useState<string>('Checking APK availability...');
  const [size, setSize] = useState<number | null>(null);
  const [contentType, setContentType] = useState<string | null>(null);

  useEffect(() => {
    if (!shouldCheck) {
      setStatus('checking');
      setMessage('Checking APK availability...');
      setSize(null);
      setContentType(null);
      return;
    }

    let isCancelled = false;

    const checkAvailability = async () => {
      try {
        setStatus('checking');
        setMessage('Checking APK availability...');
        setSize(null);
        setContentType(null);

        // Add cache-busting query parameter to ensure fresh check after redeploy
        const cacheBuster = `?t=${Date.now()}`;
        const apkUrl = `/downloads/app.apk${cacheBuster}`;

        // Try HEAD request first (lightweight)
        let response: Response;
        let headFailed = false;
        try {
          response = await fetch(apkUrl, {
            method: 'HEAD',
            cache: 'no-store', // Bypass all caches including service worker
          });
        } catch (headError) {
          headFailed = true;
          // Fallback to GET if HEAD is not supported
          response = await fetch(apkUrl, {
            method: 'GET',
            cache: 'no-store', // Bypass all caches including service worker
          });
        }

        if (isCancelled) return;

        if (response.ok) {
          // Extract Content-Length and Content-Type
          const contentLength = response.headers.get('Content-Length');
          const contentTypeHeader = response.headers.get('Content-Type');
          
          let fileSizeBytes = contentLength ? parseInt(contentLength, 10) : null;
          
          // If Content-Length is missing or unreliable, perform fallback validation
          if (fileSizeBytes === null || fileSizeBytes < MIN_VALID_APK_SIZE) {
            const fallbackResult = await performFallbackValidation(apkUrl, fileSizeBytes, contentTypeHeader);
            if (isCancelled) return;
            
            setStatus(fallbackResult.status);
            setMessage(fallbackResult.message);
            setSize(fallbackResult.size);
            setContentType(fallbackResult.contentType);
            return;
          }

          setSize(fileSizeBytes);
          setContentType(contentTypeHeader);

          // Validate that this is a real APK, not a placeholder or HTML error page
          const isValidSize = fileSizeBytes >= MIN_VALID_APK_SIZE;
          const isValidContentType = contentTypeHeader && (
            contentTypeHeader.includes('application/vnd.android.package-archive') ||
            contentTypeHeader.includes('application/octet-stream')
          );
          const isHtmlOrText = contentTypeHeader && (
            contentTypeHeader.includes('text/html') ||
            contentTypeHeader.includes('text/plain')
          );

          if (isHtmlOrText) {
            // Definitely not an APK - server returned HTML/text
            setStatus('invalid');
            setMessage('Hosted file is not a valid APK (HTML/text response detected)');
          } else if (!isValidSize) {
            // File is too small to be a real APK
            setStatus('invalid');
            const sizeStr = fileSizeBytes !== null 
              ? `${(fileSizeBytes / 1024).toFixed(2)} KB` 
              : 'unknown';
            setMessage(`Hosted file is too small to be a valid APK (${sizeStr}) - likely a placeholder`);
          } else if (isValidSize && isValidContentType) {
            // Valid APK
            setStatus('available');
            setMessage('APK is available for download');
          } else if (isValidSize) {
            // Size is OK but content-type is unexpected - warn but allow
            setStatus('available');
            setMessage('APK appears available (verify content-type if issues occur)');
          } else {
            // Fallback
            setStatus('invalid');
            setMessage('Unable to validate APK file - may be invalid or placeholder');
          }
        } else if (response.status === 404) {
          setStatus('missing');
          setMessage('No APK currently hosted');
        } else {
          setStatus('unreachable');
          setMessage(`APK check returned status ${response.status} - availability uncertain`);
        }
      } catch (error) {
        if (isCancelled) return;
        
        // Network error or other failure
        setStatus('unreachable');
        setMessage('Unable to verify APK availability - network error');
      }
    };

    checkAvailability();

    return () => {
      isCancelled = true;
    };
  }, [shouldCheck]);

  return { status, message, size, contentType };
}

/**
 * Fallback validation using byte-range request or small GET to verify APK signature
 * This handles cases where Content-Length is missing or incorrect
 */
async function performFallbackValidation(
  apkUrl: string,
  reportedSize: number | null,
  contentTypeHeader: string | null
): Promise<ApkAvailabilityResult> {
  try {
    // Try to fetch first 4 bytes to check for ZIP/APK signature (PK\x03\x04)
    let response: Response;
    let actualBytes: Uint8Array;
    
    try {
      // Attempt Range request for first 4 bytes
      response = await fetch(apkUrl, {
        method: 'GET',
        headers: {
          'Range': 'bytes=0-3'
        },
        cache: 'no-store',
      });
      
      if (response.ok && (response.status === 206 || response.status === 200)) {
        const arrayBuffer = await response.arrayBuffer();
        actualBytes = new Uint8Array(arrayBuffer);
      } else {
        throw new Error('Range request not supported');
      }
    } catch (rangeError) {
      // Fallback: fetch first 1KB to check signature and detect HTML/text
      response = await fetch(apkUrl, {
        method: 'GET',
        cache: 'no-store',
      });
      
      if (!response.ok) {
        return {
          status: 'unreachable',
          message: 'Unable to fetch APK for validation',
          size: reportedSize,
          contentType: contentTypeHeader,
        };
      }
      
      // Read first 1KB
      const reader = response.body?.getReader();
      if (!reader) {
        return {
          status: 'unreachable',
          message: 'Unable to read APK content',
          size: reportedSize,
          contentType: contentTypeHeader,
        };
      }
      
      const { value } = await reader.read();
      actualBytes = value || new Uint8Array(0);
      reader.cancel(); // Cancel the rest of the stream
    }
    
    // Check for ZIP/APK signature: PK\x03\x04 (0x50 0x4B 0x03 0x04)
    const hasZipSignature = actualBytes.length >= 4 &&
      actualBytes[0] === 0x50 && // 'P'
      actualBytes[1] === 0x4B && // 'K'
      actualBytes[2] === 0x03 &&
      actualBytes[3] === 0x04;
    
    // Check for HTML/text content
    const textDecoder = new TextDecoder('utf-8');
    const firstBytes = textDecoder.decode(actualBytes.slice(0, Math.min(100, actualBytes.length)));
    const isHtmlOrText = firstBytes.includes('<!DOCTYPE') || 
                         firstBytes.includes('<html') ||
                         firstBytes.includes('⚠️') ||
                         firstBytes.includes('PLACEHOLDER');
    
    if (isHtmlOrText) {
      return {
        status: 'invalid',
        message: 'Hosted file is not a valid APK (HTML/text placeholder detected)',
        size: reportedSize,
        contentType: contentTypeHeader,
      };
    }
    
    if (!hasZipSignature) {
      return {
        status: 'invalid',
        message: 'Hosted file is not a valid APK (missing ZIP signature)',
        size: reportedSize,
        contentType: contentTypeHeader,
      };
    }
    
    // If we got here, it has a valid ZIP signature but size is small
    // This could be a very small APK (unlikely) or corrupted
    if (reportedSize !== null && reportedSize < MIN_VALID_APK_SIZE) {
      return {
        status: 'invalid',
        message: `Hosted file is too small to be a valid APK (${(reportedSize / 1024).toFixed(2)} KB) - likely a placeholder`,
        size: reportedSize,
        contentType: contentTypeHeader,
      };
    }
    
    // Valid signature but no size info - assume valid
    return {
      status: 'available',
      message: 'APK appears available (size unknown, signature valid)',
      size: reportedSize,
      contentType: contentTypeHeader,
    };
    
  } catch (error) {
    return {
      status: 'unreachable',
      message: 'Unable to validate APK - network error',
      size: reportedSize,
      contentType: contentTypeHeader,
    };
  }
}
