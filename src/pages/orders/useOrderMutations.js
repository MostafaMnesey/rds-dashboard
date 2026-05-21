import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateOrderStatus, deleteOrder } from "../../api/orders";
import { getErrorMessage, getSuccessMessage } from "../../lib/errors";

export const useOrderMutations = ({ onDeleted } = {}) => {
  const qc = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (res) => {
      toast.success(getSuccessMessage(res, "Order status updated"));
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update order status"));
    },
  });

  const remove = useMutation({
    mutationFn: deleteOrder,
    onSuccess: (res) => {
      toast.success(getSuccessMessage(res, "Order deleted"));
      qc.invalidateQueries({ queryKey: ["orders"] });
      onDeleted?.();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete order"));
    },
  });

  return { updateStatus, remove };
};