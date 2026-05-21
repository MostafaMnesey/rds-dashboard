import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createBanner, deleteBanner } from "../../api/banners";
import { translateMessage } from "../../lib/translateMessage";

const invalidate = (qc) =>
  qc.invalidateQueries({ queryKey: ["banners"] });

export const useCreateBanner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBanner,
    onSuccess: (data) => {
      invalidate(qc);
      toast.success(data?.message || "Banner created");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create banner"
      );
    },
  });
};

export const useDeleteBanner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteBanner,
    onSuccess: (data) => {
      invalidate(qc);
      toast.success(data?.message || "Banner deleted");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete banner"
      );
    },
  });
};