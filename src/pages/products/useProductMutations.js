import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/products";
import { getErrorMessage, getSuccessMessage } from "../../lib/errors";

const invalidate = (qc) => qc.invalidateQueries({ queryKey: ["products"] });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      invalidate(qc);
      toast.success(getSuccessMessage(data, "Product created"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create product"));
    },
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }) => updateProduct(id, formData),
    onSuccess: (data, variables) => {
      invalidate(qc);
      qc.invalidateQueries({ queryKey: ["product", variables.id] });
      toast.success(getSuccessMessage(data, "Product updated"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update product"));
    },
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (data) => {
      invalidate(qc);
      toast.success(getSuccessMessage(data, "Product deleted"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete product"));
    },
  });
};