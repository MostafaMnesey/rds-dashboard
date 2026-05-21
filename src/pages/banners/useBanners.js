import { useQuery } from "@tanstack/react-query";
import { getBanners } from "../../api/banners";

export const useBanners = () => {
  return useQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
    staleTime: 30_000,
  });
};