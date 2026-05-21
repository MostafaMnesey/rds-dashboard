import { useState, useMemo, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAdmins, getAdminById } from "../../../api/system";
import { DEFAULT_PAGE_SIZE } from "../data/constants";

export const useAdmins = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const queryKey = useMemo(
    () => ["admins", { page, search: debouncedSearch }],
    [page, debouncedSearch]
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey,
    queryFn: () =>
      getAdmins({
        page,
        limit: DEFAULT_PAGE_SIZE,
        search: debouncedSearch || undefined,
      }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const items = data?.data?.items || [];
  const pagination = data?.data?.pagination || {
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
  };

  return {
    items,
    pagination,
    isLoading,
    isFetching,
    page,
    onPageChange: setPage,
    search,
    onSearchChange: setSearch,
    hasActiveFilters: !!debouncedSearch,
    onResetFilters: () => setSearch(""),
  };
};

export const useAdmin = (id, options = {}) => {
  return useQuery({
    queryKey: ["admin", id],
    queryFn: () => getAdminById(id),
    enabled: Boolean(id),
    staleTime: 30_000,
    ...options,
  });
};