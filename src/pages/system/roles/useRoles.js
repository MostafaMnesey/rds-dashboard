import { useState, useMemo, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getRoles, getRoleById } from "../../../api/system";
import { DEFAULT_PAGE_SIZE } from "../data/constants";

export const useRoles = () => {
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
    () => ["roles", { search: debouncedSearch }],
    [debouncedSearch]
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey,
    queryFn: () => getRoles(), // ⬅️ no params
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const allItems = data?.data?.items || [];

  // Client-side search (since backend doesn't support it here)
  const filteredItems = useMemo(() => {
    if (!debouncedSearch) return allItems;
    const q = debouncedSearch.toLowerCase();
    return allItems.filter((role) => {
      if (role.name?.toLowerCase().includes(q)) return true;
      return role.roleTranslations?.some((t) =>
        t.name?.toLowerCase().includes(q)
      );
    });
  }, [allItems, debouncedSearch]);

  // Client-side pagination
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / DEFAULT_PAGE_SIZE));
  const start = (page - 1) * DEFAULT_PAGE_SIZE;
  const items = filteredItems.slice(start, start + DEFAULT_PAGE_SIZE);

  const pagination = {
    page,
    limit: DEFAULT_PAGE_SIZE,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
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

export const useRole = (id, options = {}) => {
  return useQuery({
    queryKey: ["role", id],
    queryFn: () => getRoleById(id),
    enabled: Boolean(id),
    staleTime: 30_000,
    ...options,
  });
};