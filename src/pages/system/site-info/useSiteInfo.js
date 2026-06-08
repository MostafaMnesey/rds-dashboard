import { useQuery } from "@tanstack/react-query";
import { getSiteInfo } from "../../../api/system";

export const useSiteInfo = () => {
  return useQuery({
    queryKey: ["site-info"],
    queryFn: getSiteInfo,
    staleTime: 60_000,
    select: (res) => res?.data ?? null,
  });
};