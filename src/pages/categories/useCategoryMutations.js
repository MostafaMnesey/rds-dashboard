import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/categories";
import toast from "react-hot-toast";

const invalidateCategories = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: ["categories"] });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: (data) => {
      invalidateCategories(queryClient);
      toast.success((data?.message) || "Category created");
    },
    onError: (error) => {
      toast.error(
        (error?.response?.data?.message) ||
          "Failed to create category"
      );
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
      toast.success((data?.message) || "Category updated");
    },
    onError: (error) => {
      toast.error(
        (error?.response?.data?.message) ||
          "Failed to update category"
      );
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (data) => {
      invalidateCategories(queryClient);
      toast.success((data?.message) || "Category deleted");
    },
    onError: (error) => {
      toast.error(
        (error?.response?.data?.message) ||
          "Failed to delete category"
      );
    },
  });
};