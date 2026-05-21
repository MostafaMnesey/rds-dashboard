import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createAdmin, updateAdmin, deleteAdmin } from "../../../api/system";
import { getErrorMessage, getSuccessMessage } from "../../../lib/errors";

const invalidate = (qc) => qc.invalidateQueries({ queryKey: ["admins"] });

export const useCreateAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAdmin,
    onSuccess: (data) => {
      invalidate(qc);
      toast.success(getSuccessMessage(data, "Admin created"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create admin"));
    },
  });
};

export const useUpdateAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateAdmin(id, payload),
    onSuccess: (data, variables) => {
      invalidate(qc);
      qc.invalidateQueries({ queryKey: ["admin", variables.id] });
      toast.success(getSuccessMessage(data, "Admin updated"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update admin"));
    },
  });
};

export const useDeleteAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdmin,
    onSuccess: (data) => {
      invalidate(qc);
      toast.success(getSuccessMessage(data, "Admin deleted"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete admin"));
    },
  });
};