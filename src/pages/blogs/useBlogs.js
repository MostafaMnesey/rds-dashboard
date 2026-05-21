import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getBlogs, getBlogById } from "../../api/blogs";

export const useBlogs = (params) => {
  return useQuery({
    queryKey: ["blogs", params],
    queryFn: () => getBlogs(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};

export const useBlog = (id, options = {}) => {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlogById(id),
    enabled: Boolean(id),
    staleTime: 30_000,
    ...options,
  });
};