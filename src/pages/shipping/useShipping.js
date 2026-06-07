import { useQuery } from "@tanstack/react-query";
import { getShippingMethods } from "../../api/shipping";

export const useShipping = () => {
  return useQuery({
    queryKey: ["shipping"],
    queryFn: getShippingMethods,
    staleTime: 30_000,
  });
};