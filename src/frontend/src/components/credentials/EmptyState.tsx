import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddClick: () => void;
}

export default function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-12 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
          <FileText className="w-10 h-10 text-slate-400" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
        No Credentials Found
      </h3>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Get started by adding your first credential record.
      </p>
      <Button onClick={onAddClick} className="gap-2">
        <Plus className="h-4 w-4" />
        Add First Credential
      </Button>
    </div>
  );
}
