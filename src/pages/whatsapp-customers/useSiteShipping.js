import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getShippingMethods } from "../../api/shipping";
import { extractShippingPrices } from "./utils";

const useSiteShipping = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["shipping"],
    queryFn: getShippingMethods,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const shippingPrices = useMemo(() => {
    return extractShippingPrices(data);
  }, [data]);

  return {
    shippingPrices,
    isLoading,
    isError,
  };
};

export default useSiteShipping;