import { useState, useMemo, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getProducts, getProductById } from "../../api/products";
import { DEFAULT_PAGE_SIZE } from "./data/constants";

export const useProducts = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [isOnSale, setIsOnSale] = useState("");
  const [brand, setBrand] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, stockStatus, isOnSale, brand]);

  const queryKey = useMemo(
    () => [
      "products",
      { page, search: debouncedSearch, stockStatus, isOnSale, brand },
    ],
    [page, debouncedSearch, stockStatus, isOnSale, brand]
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey,
    queryFn: () =>
      getProducts({
        page,
        limit: DEFAULT_PAGE_SIZE,
        search: debouncedSearch || undefined,
        stockStatus: stockStatus || undefined,
        isOnSale: isOnSale || undefined,
        brand: brand || undefined,
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

  const hasActiveFilters =
    !!debouncedSearch || !!stockStatus || !!isOnSale || !!brand;

  const onResetFilters = () => {
    setSearch("");
    setStockStatus("");
    setIsOnSale("");
    setBrand("");
  };

  return {
    items,
    pagination,
    isLoading,
    isFetching,
    page,
    onPageChange: setPage,
    filters: {
      search,
      stockStatus,
      isOnSale,
      brand,
      onSearchChange: setSearch,
      onStockStatusChange: (v) => setStockStatus(v || ""),
      onIsOnSaleChange: (v) => setIsOnSale(v || ""),
      onBrandChange: (v) => setBrand(v || ""),
      onReset: onResetFilters,
      hasActive: hasActiveFilters,
    },
  };
};

export const useProduct = (id, options = {}) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
    staleTime: 30_000,
    ...options,
  });
};