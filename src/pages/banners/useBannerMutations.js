import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createBanner, deleteBanner } from "../../api/banners";
import { getErrorMessage, getSuccessMessage } from "../../lib/errors";

const invalidate = (qc) => qc.invalidateQueries({ queryKey: ["banners"] });

export const useCreateBanner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBanner,
    onSuccess: (data) => {
      invalidate(qc);
      toast.success(getSuccessMessage(data, "Banner created"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create banner"));
    },
  });
};

export const useDeleteBanner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteBanner,
    onSuccess: (data) => {
      invalidate(qc);
      toast.success(getSuccessMessage(data, "Banner deleted"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete banner"));
    },
  });
};