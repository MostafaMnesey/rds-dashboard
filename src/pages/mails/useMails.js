import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getMails } from "../../api/mails";

const useDebounceValue = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timerRef.current);
  }, [value, delay]);

  return debounced;
};

const useMails = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [type, setType] = useState(null);

  const debouncedSearch = useDebounceValue(search, 400);

  const params = useMemo(() => {
    const p = { page, limit };
    if (debouncedSearch) p.search = debouncedSearch;
    if (type) p.type = type;
    return p;
  }, [page, limit, debouncedSearch, type]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["mails", params],
    queryFn: () => getMails(params),
  });

  const mails = data?.items || data?.data?.items || [];
  const pagination = data?.pagination || data?.data?.pagination || {};

  console.log(mails, pagination);

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleTypeChange = useCallback((value) => {
    setType(value);
    setPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearch("");
    setType(null);
    setPage(1);
  }, []);

  const hasActiveFilters = Boolean(search || type);

  return {
    mails,
    pagination,
    isLoading,
    isError,
    error,
    page,
    setPage,
    search,
    type,
    handleSearchChange,
    handleTypeChange,
    handleResetFilters,
    hasActiveFilters,
  };
};

export default useMails;
