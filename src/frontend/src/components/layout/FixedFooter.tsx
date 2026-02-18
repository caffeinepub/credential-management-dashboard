import { Smartphone } from 'lucide-react';

interface FixedFooterProps {
  onApkClick?: () => void;
}

export default function FixedFooter({ onApkClick }: FixedFooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-slate-800 dark:bg-slate-950 text-white py-3 shadow-lg print:relative print:mt-8 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm font-medium">
            Confidential – For Official Use Only
          </p>
          {onApkClick && (
            <button
              onClick={onApkClick}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-1.5 underline-offset-4 hover:underline"
              aria-label="Download Android APK"
            >
              <Smartphone className="h-3.5 w-3.5" />
              Android APK
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
