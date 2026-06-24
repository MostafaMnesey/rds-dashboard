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
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [shippingType, setShippingType] = useState("");
  const [day, setDay] = useState([]);
  const [date, setDate] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, paymentStatus, shippingType, day, date]);

  const formattedDate = formatDateParam(date);

  const queryKey = useMemo(
    () => [
      "abandoned-checkouts",
      {
        page,
        search: debouncedSearch,
        status,
        paymentStatus,
        shippingType,
        day,
        date: formattedDate,
      },
    ],
    [
      page,
      debouncedSearch,
      status,
      paymentStatus,
      shippingType,
      day,
      formattedDate,
    ],
  );

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey,
    queryFn: () =>
      getAbandonedCheckouts({
        page,
        limit: DEFAULT_PAGE_SIZE,
        search: debouncedSearch || undefined,
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
        shippingType: shippingType || undefined,
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
    setStatus("");
    setPaymentStatus("");
    setShippingType("");
    setDay([]);
    setDate(null);
  }, []);

  const hasActiveFilters =
    !!debouncedSearch ||
    !!status ||
    !!paymentStatus ||
    !!shippingType ||
    (day && day.length > 0) ||
    !!date;

  return {
    items,
    pagination,
    isLoading,
    isFetching,
    refetch,

    filters: {
      search,
      status,
      paymentStatus,
      shippingType,
      day,
      date,
      onSearchChange: setSearch,
      onStatusChange: (v) => setStatus(v || ""),
      onPaymentStatusChange: (v) => setPaymentStatus(v || ""),
      onShippingTypeChange: (v) => setShippingType(v || ""),
      onDayChange: (v) => setDay(v || []),
      onDateChange: (v) => setDate(v || null),
      onReset: onResetFilters,
      hasActive: hasActiveFilters,
    },

    page,
    onPageChange: setPage,
  };
};
