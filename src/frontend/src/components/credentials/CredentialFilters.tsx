import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORY_OPTIONS, RANGES_OPTIONS, BRANCH_OPTIONS } from '../../constants/credentialOptions';
import { X, FilterX } from 'lucide-react';

interface CredentialFiltersProps {
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  rangeFilter: string;
  setRangeFilter: (value: string) => void;
  branchFilter: string;
  setBranchFilter: (value: string) => void;
  onClearAll: () => void;
}

export default function CredentialFilters({
  categoryFilter,
  setCategoryFilter,
  rangeFilter,
  setRangeFilter,
  branchFilter,
  setBranchFilter,
  onClearAll,
}: CredentialFiltersProps) {
  const hasActiveFilters = categoryFilter || rangeFilter || branchFilter;

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex items-center gap-2">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {categoryFilter && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCategoryFilter('')}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Select value={rangeFilter} onValueChange={setRangeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ranges" />
          </SelectTrigger>
          <SelectContent>
            {RANGES_OPTIONS.map(range => (
              <SelectItem key={range} value={range}>{range}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {rangeFilter && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setRangeFilter('')}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Select value={branchFilter} onValueChange={setBranchFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Branch" />
          </SelectTrigger>
          <SelectContent>
            {BRANCH_OPTIONS.map(branch => (
              <SelectItem key={branch} value={branch}>{branch}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {branchFilter && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setBranchFilter('')}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={onClearAll}
          className="gap-2"
        >
          <FilterX className="h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
