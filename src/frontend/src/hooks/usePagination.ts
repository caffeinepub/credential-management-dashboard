import { useState, useMemo, useEffect } from 'react';

export function usePagination<T>(data: T[], initialPageSize: number = 25) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [data.length, totalPages, currentPage]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  return {
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    paginatedData,
    totalPages,
    totalItems: data.length,
  };
}
