import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createShippingMethod,
  updateShippingMethod,
  deleteShippingMethod,
} from "../../api/shipping";
import { getErrorMessage, getSuccessMessage } from "../../lib/errors";

const invalidate = (qc) => qc.invalidateQueries({ queryKey: ["shipping"] });

export const useCreateShipping = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createShippingMethod,
    onSuccess: (data) => {
      invalidate(qc);
      toast.success(getSuccessMessage(data, "Shipping method created"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create shipping method"));
    },
  });
};

export const useUpdateShipping = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateShippingMethod,
    onSuccess: (data) => {
      invalidate(qc);
      toast.success(getSuccessMessage(data, "Shipping method updated"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update shipping method"));
    },
  });
};

export const useDeleteShipping = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteShippingMethod,
    onSuccess: (data) => {
      invalidate(qc);
      toast.success(getSuccessMessage(data, "Shipping method deleted"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete shipping method"));
    },
  });
};