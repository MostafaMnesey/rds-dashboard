import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../api/orders";
import { DEFAULT_PAGE_SIZE } from "./data/constants";

const formatDateParam = (dateObj) => {
  if (!dateObj) return undefined;
  // dateObj may be a Day.js / Date — both support toISOString
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

export const useOrders = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [day, setDay] = useState([]); // array — multi-select
  const [date, setDate] = useState(null); // dayjs object
  const [type, setType] = useState(""); // "" | "manual" | "stripe"

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, day, date, type]);

  const queryKey = useMemo(
    () => [
      "orders",
      {
        page,
        search: debouncedSearch,
        status,
        day,
        date: formatDateParam(date),
        type,
      },
    ],
    [page, debouncedSearch, status, day, date, type]
  );

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey,
    queryFn: () =>
      getOrders({
        page,
        limit: DEFAULT_PAGE_SIZE,
        search: debouncedSearch || undefined,
        status: status || undefined,
        day: day?.length ? day : undefined,
        date: formatDateParam(date),
        type: type || undefined,
      }),
    keepPreviousData: true,
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
    setType("");
  }, []);

  const hasActiveFilters =
    !!debouncedSearch ||
    !!status ||
    (day && day.length > 0) ||
    !!date ||
    !!type;

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
      type,
      onSearchChange: setSearch,
      onStatusChange: (v) => setStatus(v || ""),
      onDayChange: (v) => setDay(v || []),
      onDateChange: (v) => setDate(v || null),
      onTypeChange: (v) => setType(v || ""),
      onReset: onResetFilters,
      hasActive: hasActiveFilters,
    },

    page,
    onPageChange: setPage,
  };
};