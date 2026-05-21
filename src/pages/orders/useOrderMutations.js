import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateOrderStatus, deleteOrder } from "../../api/orders";

export const useOrderMutations = ({ onDeleted } = {}) => {
  const qc = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (res) => {
      toast.success(res?.message || "Order status updated");
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to update order status";
      toast.error(msg);
    },
  });

  const remove = useMutation({
    mutationFn: deleteOrder,
    onSuccess: (res) => {
      toast.success(res?.message || "Order deleted");
      qc.invalidateQueries({ queryKey: ["orders"] });
      onDeleted?.();
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to delete order";
      toast.error(msg);
    },
  });

  return { updateStatus, remove };
};