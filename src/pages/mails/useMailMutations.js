import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteMail } from "../../api/mails";
import { getErrorMessage, getSuccessMessage } from "../../lib/errors";

export const useDeleteMail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteMail(id),
    onSuccess: (data) => {
      toast.success(getSuccessMessage(data, "Message deleted successfully"));
      queryClient.invalidateQueries({ queryKey: ["mails"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete message"));
    },
  });
};
