import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createManualOrder,
  updateOrderStatus,
  deleteOrder,
} from "../../api/orders";
import { getErrorMessage, getSuccessMessage } from "../../lib/errors";
import { translateWhatsAppOrderErrorCode } from "./utils";

const invalidateOrders = (qc) => {
  qc.invalidateQueries({ queryKey: ["orders"] });
  qc.invalidateQueries({ queryKey: ["order"] });
};

export const useCreateManualOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createManualOrder,
    onSuccess: (data) => {
      invalidateOrders(qc);
      toast.success(getSuccessMessage(data, "Order created successfully"));
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(
          error,
          "Failed to create order",
          translateWhatsAppOrderErrorCode,
        ),
      );
    },
  });
};

/* Bundle status + delete so the page can use the same shape as Orders feature */
export const useWhatsAppOrderMutations = ({ onDeleted } = {}) => {
  const qc = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (data) => {
      invalidateOrders(qc);
      toast.success(getSuccessMessage(data, "Status updated"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update status"));
    },
  });

  const remove = useMutation({
    mutationFn: deleteOrder,
    onSuccess: (data) => {
      invalidateOrders(qc);
      toast.success(getSuccessMessage(data, "Order deleted"));
      onDeleted?.();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete order"));
    },
  });

  return { updateStatus, remove };
};