import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getDashboardStats } from "../../api/stats";

export const useStats = (params) => {
  return useQuery({
    queryKey: ["dashboard-stats", params],
    queryFn: () => getDashboardStats(params),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
};