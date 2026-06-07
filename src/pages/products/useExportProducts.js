import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";
import { getErrorMessage } from "../../lib/errors";

export const useExportProducts = () => {
  return useMutation({
    mutationFn: async (params = {}) => {
      const baseURL =
        import.meta.env.VITE_API_URL || "https://rdspharma.cloud";
      const token = localStorage.getItem("admin_token");

      // Use a raw axios call (no interceptor unwrapping)
      const response = await axios.get(
        `${baseURL}/dashboard/products/export`,
        {
          params,
          responseType: "blob",
          paramsSerializer: { indexes: null },
          headers: {
            ...(token && {
              Authorization: `Bearer ${token}`,
              auth: token,
            }),
            "x-lang": "en",
          },
        }
      );

      const blob = response.data;
      const disposition =
        response.headers?.["content-disposition"] ||
        response.headers?.["Content-Disposition"];

      // Extract filename or build a fallback
      let filename = "products.csv";
      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/i);
        if (match?.[1]) filename = match[1];
      } else {
        const stamp = new Date().toISOString().slice(0, 10);
        filename = `products-${stamp}.csv`;
      }

      // Force CSV mime + UTF-8 BOM so Excel opens Arabic correctly
      const bom = "\uFEFF";
      const csvBlob = new Blob([bom, blob], {
        type: "text/csv;charset=utf-8;",
      });

      // Trigger browser download
      const url = window.URL.createObjectURL(csvBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { filename };
    },
    onSuccess: ({ filename }) => {
      toast.success(`Exported as ${filename}`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to export products"));
    },
  });
};