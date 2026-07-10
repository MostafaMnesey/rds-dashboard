import { Mail } from "lucide-react";
import { useCallback, useState } from "react";

import LoadingState from "../../components/ui/LoadingState";
import PageHeader from "../../components/ui/PageHeader";
import MailDetailsDrawer from "./components/MailDetailsDrawer";
import MailsFilters from "./components/MailsFilters";
import MailsTable from "./components/MailsTable";

import { useDeleteMail } from "./useMailMutations";
import useMails from "./useMails";

const Mails = () => {
  const {
    mails,
    pagination,
    isLoading,
    page,
    setPage,
    search,
    type,
    handleSearchChange,
    handleTypeChange,
    handleResetFilters,
    hasActiveFilters,
  } = useMails();

  const deleteMutation = useDeleteMail();
  const [selectedMail, setSelectedMail] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleView = useCallback((mail) => {
    setSelectedMail(mail);
    setDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedMail(null), 300);
  }, []);

  const handleDelete = useCallback(
    async (id) => {
      setDeletingId(id);
      try {
        await deleteMutation.mutateAsync(id);
        if (selectedMail?.id === id) {
          handleCloseDrawer();
        }
      } finally {
        setDeletingId(null);
      }
    },
    [deleteMutation, selectedMail, handleCloseDrawer],
  );

  const totalItems = pagination.totalItems || 0;

  return (
    <div>
      <PageHeader
        title="Messages"
        subtitle={`${totalItems} contact ${totalItems === 1 ? "message" : "messages"}`}
        icon={Mail}
      />

      <MailsFilters
        search={search}
        type={type}
        onSearchChange={handleSearchChange}
        onTypeChange={handleTypeChange}
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {isLoading ? (
        <LoadingState />
      ) : (
        <MailsTable
          items={mails}
          loading={isLoading}
          pagination={pagination}
          page={page}
          onPageChange={setPage}
          onView={handleView}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      )}

      <MailDetailsDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        mail={selectedMail}
        onDelete={handleDelete}
        isDeleting={deletingId === selectedMail?.id}
      />
    </div>
  );
};

export default Mails;
