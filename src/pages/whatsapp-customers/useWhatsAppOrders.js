import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getOrders } from "../../api/orders";
import { DEFAULT_PAGE_SIZE, ORDER_SOURCES } from "./data/constants";

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

export const useWhatsAppOrders = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [day, setDay] = useState([]);
  const [date, setDate] = useState(null);

  /* Debounce search */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  /* Reset to first page when filters change */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, day, date]);

  const queryKey = useMemo(
    () => [
      "orders",
      {
        source: ORDER_SOURCES.WHATSAPP,
        page,
        search: debouncedSearch,
        status,
        day,
        date: formatDateParam(date),
      },
    ],
    [page, debouncedSearch, status, day, date],
  );

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey,
    queryFn: () =>
      getOrders({
        source: ORDER_SOURCES.WHATSAPP, // 👈 hard-locked filter
        page,
        limit: DEFAULT_PAGE_SIZE,
        search: debouncedSearch || undefined,
        status: status || undefined,
        day: day?.length ? day : undefined,
        date: formatDateParam(date),
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
    setStatus("");
    setDay([]);
    setDate(null);
  }, []);

  const hasActiveFilters =
    !!debouncedSearch || !!status || (day && day.length > 0) || !!date;

  return {
    items,
    pagination,
    isLoading,
    isFetching,
    refetch,

    filters: {
      search,
      status,
      day,
      date,
      onSearchChange: setSearch,
      onStatusChange: (v) => setStatus(v || ""),
      onDayChange: (v) => setDay(v || []),
      onDateChange: (v) => setDate(v || null),
      onReset: onResetFilters,
      hasActive: hasActiveFilters,
    },

    page,
    onPageChange: setPage,
  };
};