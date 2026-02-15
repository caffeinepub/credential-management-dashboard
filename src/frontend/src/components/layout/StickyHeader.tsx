import ThemeToggle from './ThemeToggle';
import { Building2 } from 'lucide-react';

export default function StickyHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 shadow-md print:relative print:shadow-none transition-colors duration-200">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-700 rounded-lg flex items-center justify-center shadow-lg print:shadow-none">
              <Building2 className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
          </div>
          
          <div className="flex-1 text-center px-2">
            <h1 className="text-xs md:text-sm lg:text-base font-semibold text-slate-800 dark:text-slate-100 leading-tight">
              Office of the Director General – State Vigilance & Anti-Corruption Bureau, Haryana – Panchkula
            </h1>
          </div>
          
          <div className="flex-shrink-0 print:hidden">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
