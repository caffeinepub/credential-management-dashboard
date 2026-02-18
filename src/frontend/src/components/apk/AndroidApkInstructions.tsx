import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, AlertTriangle } from 'lucide-react';

export default function AndroidApkInstructions() {
  return (
    <ScrollArea className="h-[60vh] pr-4">
      <div className="space-y-6 text-sm">
        <section>
          <h3 className="font-semibold text-base mb-2">Overview</h3>
          <p className="text-slate-600 dark:text-slate-400">
            This guide explains how to package your deployed PWA into an Android APK using{' '}
            <strong>Trusted Web Activity (TWA)</strong> technology. The APK generation happens
            locally on your development machine using Android build tools.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-base mb-2">Prerequisites</h3>
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
            <li>Node.js and npm (v14.15.0 or higher)</li>
            <li>Java Development Kit (JDK) 8 or higher</li>
            <li>Android SDK (via Android Studio or command-line tools)</li>
            <li>Your deployed app URL (HTTPS required)</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-base mb-2">Method: Using Bubblewrap (Recommended)</h3>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium mb-1">Step 1: Install Bubblewrap CLI</h4>
              <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-xs overflow-x-auto">
                npm install -g @bubblewrap/cli
              </pre>
            </div>

            <div>
              <h4 className="font-medium mb-1">Step 2: Initialize Your Project</h4>
              <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-xs overflow-x-auto">
                bubblewrap init --manifest https://your-app-url.icp0.io/manifest.webmanifest
              </pre>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Follow the prompts to configure your app details (package name, app name, etc.).
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-1">Step 3: Build Universal APK (Recommended)</h4>
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded p-3 mb-2">
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mb-1">
                  ✓ Use the --universalApk flag for maximum compatibility
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  This creates an APK that works on all common Android devices (ARM, x86, x86_64) and prevents "problem while parsing the package" errors.
                </p>
              </div>
              <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-xs overflow-x-auto">
                bubblewrap build --universalApk
              </pre>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                The universal APK will be generated at:{' '}
                <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-xs">
                  app/build/outputs/apk/release/app-universal-release-signed.apk
                </code>
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-1">Step 4: Signing Your APK</h4>
              <p className="text-slate-600 dark:text-slate-400 mb-2">
                During initialization, Bubblewrap will guide you through creating a keystore for signing your APK:
              </p>
              <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-xs overflow-x-auto">
{`? Key store location: /path/to/android.keystore
? Key name: android
? Password for the Key Store: ********
? Password for the Key: ********`}
              </pre>
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded p-3 mt-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      Important: Back up your keystore!
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      You must use the same keystore for all future updates. If you lose it, users will need to uninstall the old app before installing updates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-semibold text-base mb-2">Hosting Your APK for Download</h3>
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
            <p className="text-slate-700 dark:text-slate-300 font-medium text-xs">
              To make your APK available for download through this app:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400 text-xs">
              <li>
                Build your universal APK using <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">bubblewrap build --universalApk</code>
              </li>
              <li>
                Locate the file at{' '}
                <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">
                  app/build/outputs/apk/release/app-universal-release-signed.apk
                </code>
              </li>
              <li>
                Rename it to <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">app.apk</code>
              </li>
              <li>
                Copy it to{' '}
                <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">
                  frontend/public/downloads/app.apk
                </code>
              </li>
              <li>
                Redeploy your frontend canister using <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">dfx deploy frontend</code>
              </li>
              <li>
                The APK will be accessible at <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">/downloads/app.apk</code>
              </li>
            </ol>
          </div>
        </section>

        <section>
          <h3 className="font-semibold text-base mb-2">Troubleshooting Installation Errors</h3>
          <div className="space-y-3">
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded p-3">
              <h4 className="font-medium text-xs mb-2 text-slate-900 dark:text-slate-100">
                "There was a problem while parsing the package"
              </h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-400">
                <li><strong>Corrupted download:</strong> Re-download the APK file</li>
                <li><strong>Wrong architecture:</strong> Use the universal APK (not architecture-specific)</li>
                <li><strong>Unsigned APK:</strong> Ensure the filename contains "signed"</li>
                <li><strong>Old version conflict:</strong> Uninstall previous version first</li>
                <li><strong>Incompatible device:</strong> Requires Android 5.0 (API 21) or higher</li>
                <li><strong>Insufficient storage:</strong> Free up at least 50-100 MB</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-semibold text-base mb-2">Digital Asset Links</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-2 text-xs">
            To remove the browser address bar and make your TWA feel truly native, you need to
            verify domain ownership by hosting an <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">assetlinks.json</code> file.
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-xs">
            Place this file at{' '}
            <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">
              frontend/public/.well-known/assetlinks.json
            </code>{' '}
            with your app's SHA-256 fingerprint.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-base mb-2">Minimum Requirements</h3>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <li><strong>Minimum Android Version:</strong> Android 5.0 (API level 21)</li>
            <li><strong>Recommended:</strong> Android 8.0 (API level 26) or higher</li>
            <li><strong>Architecture Support:</strong> Universal APK supports all common ABIs</li>
            <li><strong>Typical File Size:</strong> 5-15 MB for universal APK</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-base mb-2">Additional Resources</h3>
          <div className="space-y-2">
            <a
              href="https://github.com/GoogleChromeLabs/bubblewrap"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-xs"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Bubblewrap Documentation
            </a>
            <a
              href="https://developer.chrome.com/docs/android/trusted-web-activity/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-xs"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Trusted Web Activity Guide
            </a>
            <a
              href="https://developer.android.com/training/app-links/verify-android-applinks"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-xs"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Android App Links Documentation
            </a>
          </div>
        </section>

        <section className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            For complete documentation, refer to the{' '}
            <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">
              frontend/ANDROID_APK.md
            </code>{' '}
            file in your project repository.
          </p>
        </section>
      </div>
    </ScrollArea>
  );
}
