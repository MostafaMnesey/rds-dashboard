import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getCategories, getCategoryById } from "../../api/categories";

export const useCategories = (params) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => getCategories(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};

export const useCategory = (id, options = {}) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
    enabled: Boolean(id),
    staleTime: 30_000,
    ...options,
  });
};