import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createBlog, updateBlog, deleteBlog } from "../../api/blogs";
import { getErrorMessage, getSuccessMessage } from "../../lib/errors";

const invalidate = (qc) => qc.invalidateQueries({ queryKey: ["blogs"] });

export const useCreateBlog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBlog,
    onSuccess: (data) => {
      invalidate(qc);
      toast.success(getSuccessMessage(data, "Blog created"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create blog"));
    },
  });
};

export const useUpdateBlog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }) => updateBlog(id, formData),
    onSuccess: (data, variables) => {
      invalidate(qc);
      qc.invalidateQueries({ queryKey: ["blog", variables.id] });
      toast.success(getSuccessMessage(data, "Blog updated"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update blog"));
    },
  });
};

export const useDeleteBlog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: (data) => {
      invalidate(qc);
      toast.success(getSuccessMessage(data, "Blog deleted"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete blog"));
    },
  });
};