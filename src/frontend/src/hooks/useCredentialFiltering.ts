import { useState, useMemo, useCallback } from 'react';
import { Credential } from '../types/credentials';

export function useCredentialFiltering(credentials: Credential[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [rangeFilter, setRangeFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');

  const filteredCredentials = useMemo(() => {
    return credentials.filter(cred => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        cred.category.toLowerCase().includes(searchLower) ||
        cred.name.toLowerCase().includes(searchLower) ||
        cred.designation.toLowerCase().includes(searchLower) ||
        cred.ranges.some(r => r.toLowerCase().includes(searchLower)) ||
        cred.branch.some(b => b.toLowerCase().includes(searchLower)) ||
        cred.loginId.toLowerCase().includes(searchLower) ||
        cred.mobile.toLowerCase().includes(searchLower) ||
        cred.emailUrl.toLowerCase().includes(searchLower) ||
        cred.remarks.toLowerCase().includes(searchLower);

      const matchesCategory = !categoryFilter || cred.category === categoryFilter;
      const matchesRange = !rangeFilter || cred.ranges.includes(rangeFilter);
      const matchesBranch = !branchFilter || cred.branch.includes(branchFilter);

      return matchesSearch && matchesCategory && matchesRange && matchesBranch;
    });
  }, [credentials, searchQuery, categoryFilter, rangeFilter, branchFilter]);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setCategoryFilter('');
    setRangeFilter('');
    setBranchFilter('');
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    rangeFilter,
    setRangeFilter,
    branchFilter,
    setBranchFilter,
    clearAllFilters,
    filteredCredentials,
  };
}
