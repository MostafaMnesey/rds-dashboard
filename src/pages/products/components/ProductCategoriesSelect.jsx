import { memo, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Input from "../../../components/ui/Input";
import { getAllCategories } from "../../../api/categories";

const ProductCategoriesSelect = ({ value, onChange, error }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: getAllCategories,
    staleTime: 60_000,
  });

  // The API returns { data: { items: [...] } } after the interceptor unwraps `.data`
  const categories = data?.data?.items || data?.items || [];

  const options = useMemo(
    () =>
      categories.map((c) => {
        const en = c.translations?.find((t) => t.lang === "en");
        const ar = c.translations?.find((t) => t.lang === "ar");
        const label =
          en?.title || ar?.title || c.name || c.id?.slice(0, 8) || "—";
        return { value: c.id, label };
      }),
    [categories],
  );

  return (
    <Input
      type="multi-select"
      label="Categories"
      placeholder={isLoading ? "Loading categories..." : "Select categories"}
      value={value || []}
      onChange={(v) => onChange(v || [])}
      options={options}
      disabled={isLoading}
      showSearch
      allowClear
      maxTagCount="responsive"
      hint="Select one or more categories for this product."
      error={error}
    />
  );
};

export default memo(ProductCategoriesSelect);
