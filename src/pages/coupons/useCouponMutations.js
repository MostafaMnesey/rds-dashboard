import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createCoupon, updateCoupon, deleteCoupon } from "../../api/coupons";
import { getErrorMessage, getSuccessMessage } from "../../lib/errors";

const invalidate = (qc) => qc.invalidateQueries({ queryKey: ["coupons"] });

export const useCreateCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCoupon,
    onSuccess: (data) => {
      invalidate(qc);
      toast.success(getSuccessMessage(data, "Coupon created"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create coupon"));
    },
  });
};

export const useUpdateCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateCoupon(id, payload),
    onSuccess: (data, variables) => {
      invalidate(qc);
      qc.invalidateQueries({ queryKey: ["coupon", variables.id] });
      toast.success(getSuccessMessage(data, "Coupon updated"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update coupon"));
    },
  });
};

export const useDeleteCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCoupon,
    onSuccess: (data) => {
      invalidate(qc);
      toast.success(getSuccessMessage(data, "Coupon deleted"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete coupon"));
    },
  });
};