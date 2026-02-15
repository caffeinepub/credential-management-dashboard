import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CredentialSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CredentialSearchBar({ value, onChange }: CredentialSearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <Input
        type="text"
        placeholder="Search credentials..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 rounded-full border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
      />
    </div>
  );
}
