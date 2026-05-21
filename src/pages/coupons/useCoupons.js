import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getCoupons, getCouponById } from "../../api/coupons";

export const useCoupons = (params) => {
  return useQuery({
    queryKey: ["coupons", params],
    queryFn: () => getCoupons(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};

export const useCoupon = (id, options = {}) => {
  return useQuery({
    queryKey: ["coupon", id],
    queryFn: () => getCouponById(id),
    enabled: Boolean(id),
    staleTime: 30_000,
    ...options,
  });
};