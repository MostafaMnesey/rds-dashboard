import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/categories";
import { getErrorMessage, getSuccessMessage } from "../../lib/errors";

const invalidateCategories = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: ["categories"] });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: (data) => {
      invalidateCategories(queryClient);
      toast.success(getSuccessMessage(data, "Category created"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create category"));
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }) => updateCategory(id, formData),
    onSuccess: (data, variables) => {
      invalidateCategories(queryClient);
      queryClient.invalidateQueries({ queryKey: ["category", variables.id] });
      toast.success(getSuccessMessage(data, "Category updated"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update category"));
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (data) => {
      invalidateCategories(queryClient);
      toast.success(getSuccessMessage(data, "Category deleted"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete category"));
    },
  });
};