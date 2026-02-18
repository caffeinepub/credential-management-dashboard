import { useState, useMemo, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import StickyHeader from './components/layout/StickyHeader';
import FixedFooter from './components/layout/FixedFooter';
import PageTitleBlock from './components/dashboard/PageTitleBlock';
import CredentialSearchBar from './components/credentials/CredentialSearchBar';
import CredentialFilters from './components/credentials/CredentialFilters';
import CredentialTable from './components/credentials/CredentialTable';
import PaginationControls from './components/credentials/PaginationControls';
import CredentialFormModal from './components/credentials/CredentialFormModal';
import EmptyState from './components/credentials/EmptyState';
import PrintButton from './components/print/PrintButton';
import AndroidApkDialog from './components/apk/AndroidApkDialog';
import { useCredentials } from './hooks/useCredentials';
import { useCredentialFiltering } from './hooks/useCredentialFiltering';
import { usePagination } from './hooks/usePagination';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const queryClient = new QueryClient();

function DashboardContent() {
  const { credentials, addCredential, updateCredential, deleteCredential } = useCredentials();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState<any>(null);
  const [isApkDialogOpen, setIsApkDialogOpen] = useState(false);

  // Register service worker for PWA functionality
  useEffect(() => {
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration.scope);
        })
        .catch((error) => {
          console.warn('Service Worker registration failed:', error);
        });
    }
  }, []);

  const {
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
  } = useCredentialFiltering(credentials);

  const {
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    paginatedData,
    totalPages,
  } = usePagination(filteredCredentials, 25);

  const handleAddCredential = (data: any) => {
    addCredential(data);
    setIsFormOpen(false);
  };

  const handleEditCredential = (data: any) => {
    if (editingCredential) {
      updateCredential(editingCredential.id, data);
      setEditingCredential(null);
      setIsFormOpen(false);
    }
  };

  const handleOpenEdit = (credential: any) => {
    setEditingCredential(credential);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCredential(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <StickyHeader />
      
      <main className="flex-1 container mx-auto px-4 py-6 pb-24 pt-32 md:pt-36">
        <PageTitleBlock />
        
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 md:p-6 mb-6 transition-all duration-200">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <CredentialSearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <div className="flex gap-2">
              <PrintButton data={filteredCredentials} />
              <Button onClick={() => setIsFormOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Credential
              </Button>
            </div>
          </div>
          
          <CredentialFilters
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            rangeFilter={rangeFilter}
            setRangeFilter={setRangeFilter}
            branchFilter={branchFilter}
            setBranchFilter={setBranchFilter}
            onClearAll={clearAllFilters}
          />
        </div>

        {credentials.length === 0 ? (
          <EmptyState onAddClick={() => setIsFormOpen(true)} />
        ) : (
          <>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transition-all duration-200">
              <CredentialTable
                data={paginatedData}
                onEdit={handleOpenEdit}
                onDelete={deleteCredential}
                startIndex={(currentPage - 1) * pageSize}
              />
            </div>
            
            {totalPages > 1 && (
              <div className="mt-6">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                  totalItems={filteredCredentials.length}
                />
              </div>
            )}
          </>
        )}
      </main>

      <FixedFooter onApkClick={() => setIsApkDialogOpen(true)} />
      
      <CredentialFormModal
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingCredential ? handleEditCredential : handleAddCredential}
        initialData={editingCredential}
        mode={editingCredential ? 'edit' : 'add'}
      />

      <AndroidApkDialog 
        open={isApkDialogOpen} 
        onOpenChange={setIsApkDialogOpen} 
      />
      
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <DashboardContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
