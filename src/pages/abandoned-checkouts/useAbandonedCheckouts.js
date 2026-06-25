import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAbandonedCheckouts } from "../../api/orders";
import { DEFAULT_PAGE_SIZE } from "../orders/data/constants";

const formatDateParam = (dateObj) => {
  if (!dateObj) return undefined;
  try {
    const d = dateObj.toDate ? dateObj.toDate() : new Date(dateObj);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  } catch {
    return undefined;
  }
};

export const useAbandonedCheckouts = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [day, setDay] = useState([]);
  const [date, setDate] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, day, date]);

  const formattedDate = formatDateParam(date);

  const queryKey = useMemo(
    () => [
      "abandoned-checkouts",
      {
        page,
        search: debouncedSearch,
        day,
        date: formattedDate,
      },
    ],
    [page, debouncedSearch, day, formattedDate],
  );

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey,
    queryFn: () =>
      getAbandonedCheckouts({
        page,
        limit: DEFAULT_PAGE_SIZE,
        search: debouncedSearch || undefined,
        day: day?.length ? day : undefined,
        date: formattedDate,
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

  const onResetFilters = useCallback(() => {
    setSearch("");
    setDay([]);
    setDate(null);
  }, []);

  const hasActiveFilters =
    !!debouncedSearch || (day && day.length > 0) || !!date;

  return {
    items,
    pagination,
    isLoading,
    isFetching,
    refetch,

    filters: {
      search,
      day,
      date,
      onSearchChange: setSearch,
      onDayChange: (v) => setDay(v || []),
      onDateChange: (v) => setDate(v || null),
      onReset: onResetFilters,
      hasActive: hasActiveFilters,
    },

    page,
    onPageChange: setPage,
  };
};
