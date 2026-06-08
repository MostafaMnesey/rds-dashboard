import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateSiteInfo } from "../../../api/system";
import { getErrorMessage, getSuccessMessage } from "../../../lib/errors";
import { translateSiteInfoErrorCode } from "./utils";

export const useUpdateSiteInfo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateSiteInfo,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["site-info"] });
      toast.success(getSuccessMessage(data, "Site info updated"));
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(
          error,
          "Failed to update site info",
          translateSiteInfoErrorCode,
        ),
      );
    },
  });
};