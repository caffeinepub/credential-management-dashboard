import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText, ArrowLeft, Copy, Check, AlertCircle, CheckCircle, Loader2, Shield, Info, XCircle } from 'lucide-react';
import AndroidApkInstructions from './AndroidApkInstructions';
import { useApkAvailability } from '@/hooks/useApkAvailability';
import { useApkIntegrity } from '@/hooks/useApkIntegrity';
import { toast } from 'sonner';

interface AndroidApkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AndroidApkDialog({ open, onOpenChange }: AndroidApkDialogProps) {
  const [showInstructions, setShowInstructions] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [checksumCopied, setChecksumCopied] = useState(false);

  // Check APK availability when dialog opens
  const { status, message, size: availabilitySize, contentType: availabilityContentType } = useApkAvailability(open && !showInstructions);
  
  // Fetch APK metadata for integrity checking (only if status is available)
  const { size, lastModified, contentType, error: integrityError, sha256, isCalculating, calculateChecksum } = useApkIntegrity(
    open && !showInstructions && status === 'available'
  );

  // Compute full APK URL from current origin
  const fullApkUrl = useMemo(() => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/downloads/app.apk`;
    }
    return '/downloads/app.apk';
  }, []);

  const handleClose = () => {
    setShowInstructions(false);
    onOpenChange(false);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullApkUrl);
      setUrlCopied(true);
      toast.success('APK URL copied to clipboard');
      setTimeout(() => setUrlCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy URL to clipboard');
    }
  };

  const handleCopyChecksum = async () => {
    if (!sha256) return;
    try {
      await navigator.clipboard.writeText(sha256);
      setChecksumCopied(true);
      toast.success('SHA-256 checksum copied to clipboard');
      setTimeout(() => setChecksumCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy checksum to clipboard');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />;
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'invalid':
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case 'missing':
      case 'unreachable':
        return <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800';
      case 'available':
        return 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800';
      case 'invalid':
        return 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800';
      case 'missing':
      case 'unreachable':
        return 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700';
    }
  };

  // Determine if download should be disabled
  const isDownloadDisabled = status === 'invalid' || status === 'missing' || status === 'unreachable';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        {!showInstructions ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Android APK Download
              </DialogTitle>
              <DialogDescription>
                Download and install the Android application package for offline use.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* APK Availability Status */}
              <div className={`rounded-lg p-4 border ${getStatusColor()} transition-colors`}>
                <div className="flex items-start gap-3">
                  {getStatusIcon()}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {message}
                    </p>
                    {availabilitySize !== null && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Detected size: {formatFileSize(availabilitySize)}
                      </p>
                    )}
                    {availabilityContentType && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        Content-Type: {availabilityContentType}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Missing APK State */}
              {status === 'missing' && (
                <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-2 text-slate-900 dark:text-slate-100">
                        No APK Currently Hosted
                      </h3>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mb-2">
                        The APK file has not been deployed yet. This is the default state until you build and deploy a signed universal APK.
                      </p>
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        To deploy an APK:
                      </p>
                      <ol className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-decimal list-inside">
                        <li>Build a <strong>universal APK</strong> using Bubblewrap with <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">--universalApk</code> flag</li>
                        <li>Sign the APK properly with your keystore</li>
                        <li>Place the APK at <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">frontend/public/downloads/app.apk</code></li>
                        <li>Verify the file size is several MB (not KB)</li>
                        <li>Redeploy the frontend canister: <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">dfx deploy frontend</code></li>
                      </ol>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowInstructions(true)}
                        className="mt-3"
                      >
                        <FileText className="h-3 w-3 mr-2" />
                        View Build Instructions
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Invalid APK Warning */}
              {status === 'invalid' && (
                <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4 border border-red-200 dark:border-red-800">
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-2 text-slate-900 dark:text-slate-100">
                        Invalid APK File Detected
                      </h3>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mb-2">
                        The hosted file is not a valid Android APK. This is likely a placeholder or error page.
                      </p>
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        To fix this:
                      </p>
                      <ol className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-decimal list-inside">
                        <li>Build a <strong>universal APK</strong> using Bubblewrap with <code className="bg-red-100 dark:bg-red-900/50 px-1 rounded">--universalApk</code> flag</li>
                        <li>Sign the APK properly with your keystore</li>
                        <li>Replace <code className="bg-red-100 dark:bg-red-900/50 px-1 rounded">frontend/public/downloads/app.apk</code> with your real APK (several MB)</li>
                        <li>Verify the file size is several MB (not KB)</li>
                        <li>Redeploy the frontend canister: <code className="bg-red-100 dark:bg-red-900/50 px-1 rounded">dfx deploy frontend</code></li>
                      </ol>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowInstructions(true)}
                        className="mt-3"
                      >
                        <FileText className="h-3 w-3 mr-2" />
                        View Build Instructions
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Unreachable APK State */}
              {status === 'unreachable' && (
                <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-2 text-slate-900 dark:text-slate-100">
                        Unable to Verify APK Availability
                      </h3>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mb-2">
                        The APK availability check failed due to a network error or server issue. This could be temporary.
                      </p>
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        Troubleshooting steps:
                      </p>
                      <ol className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-decimal list-inside">
                        <li>Check your internet connection</li>
                        <li>Refresh the page and try again</li>
                        <li>Verify the frontend canister is deployed and accessible</li>
                        <li>If the issue persists, check the browser console for errors</li>
                        <li>Ensure the APK file is properly deployed at <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">frontend/public/downloads/app.apk</code></li>
                      </ol>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowInstructions(true)}
                        className="mt-3"
                      >
                        <FileText className="h-3 w-3 mr-2" />
                        View Build Instructions
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Troubleshooting Section - Only show when APK is available */}
              {status === 'available' && (
                <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-2 text-slate-900 dark:text-slate-100">
                        Installation Error: "There was a problem while parsing the package"?
                      </h3>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mb-2">
                        This is a common Android installation error. Try these fixes in order:
                      </p>
                      <ol className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-decimal list-inside">
                        <li><strong>Verify file size</strong> - Real APKs are several MB, not 1-2 KB</li>
                        <li><strong>Re-download the APK</strong> - Corrupted downloads are the #1 cause</li>
                        <li><strong>Enable "Install unknown apps"</strong> in Settings → Apps → Your Browser</li>
                        <li><strong>Uninstall any previous version</strong> of this app first</li>
                        <li><strong>Check device compatibility</strong> - Requires Android 5.0 or higher</li>
                        <li><strong>Verify file integrity</strong> using the checksum below</li>
                        <li><strong>Free up storage space</strong> - Need at least 50-100 MB available</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* APK Integrity Section */}
              {status === 'available' && (
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    <h3 className="font-semibold text-sm">File Integrity</h3>
                  </div>
                  
                  {integrityError && (
                    <div className="mb-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded text-xs text-amber-900 dark:text-amber-100">
                      <AlertCircle className="h-3 w-3 inline mr-1" />
                      {integrityError}
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {/* File Size */}
                    {size !== null && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 dark:text-slate-400">Expected File Size:</span>
                        <span className="font-mono font-medium text-slate-900 dark:text-slate-100">
                          {formatFileSize(size)}
                        </span>
                      </div>
                    )}

                    {/* Content-Type */}
                    {contentType && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 dark:text-slate-400">Content-Type:</span>
                        <span className="font-mono text-slate-900 dark:text-slate-100 text-[10px]">
                          {contentType}
                        </span>
                      </div>
                    )}

                    {/* Last Modified */}
                    {lastModified && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 dark:text-slate-400">Last Updated:</span>
                        <span className="font-mono text-slate-900 dark:text-slate-100">
                          {new Date(lastModified).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {/* SHA-256 Checksum */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                      {!sha256 ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={calculateChecksum}
                          disabled={isCalculating || !!integrityError}
                          className="w-full"
                        >
                          {isCalculating ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                              Calculating SHA-256...
                            </>
                          ) : (
                            <>
                              <Shield className="h-3 w-3 mr-2" />
                              Calculate SHA-256 Checksum
                            </>
                          )}
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-600 dark:text-slate-400">SHA-256:</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCopyChecksum}
                              className="h-6 px-2"
                            >
                              {checksumCopied ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                          <code className="block text-[10px] font-mono bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700 break-all text-slate-700 dark:text-slate-300">
                            {sha256}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Download Section */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => window.open(fullApkUrl, '_blank')}
                  disabled={isDownloadDisabled}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download APK
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopyUrl}
                  disabled={status === 'missing'}
                  className="flex-1"
                >
                  {urlCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-2 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy URL
                    </>
                  )}
                </Button>
              </div>

              {/* Build Instructions Link */}
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInstructions(true)}
                  className="text-xs"
                >
                  <FileText className="h-3 w-3 mr-2" />
                  View Build Instructions
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Building Android APK
              </DialogTitle>
              <DialogDescription>
                Complete guide to building and deploying a universal Android APK using Bubblewrap.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <AndroidApkInstructions />
            </div>

            <div className="flex justify-start pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowInstructions(false)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Download
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
