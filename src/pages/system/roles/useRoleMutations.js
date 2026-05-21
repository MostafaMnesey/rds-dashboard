import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createRole } from "../../../api/system";
import { getErrorMessage, getSuccessMessage } from "../../../lib/errors";

const invalidate = (qc) => qc.invalidateQueries({ queryKey: ["roles"] });

export const useCreateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createRole,
    onSuccess: (data) => {
      invalidate(qc);
      toast.success(getSuccessMessage(data, "Role created"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create role"));
    },
  });
};