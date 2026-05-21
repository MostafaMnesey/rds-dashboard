import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Input from "../../../components/ui/Input";
import API from "../../../api";

/* Product lookup */
const fetchProducts = async (search) => {
  const response = await API.get("/dashboard/products", {
    params: { limit: 50, ...(search && { search }) },
  });
  return response.data;
};

/* Category lookup */
const fetchCategories = async (search) => {
  const response = await API.get("/dashboard/categories", {
    params: { limit: 50, ...(search && { search }) },
  });
  return response.data;
};

const BannerTargetSelect = ({ targetType, value, onChange, error }) => {
  const [search, setSearch] = useState("");

  const isProduct = targetType === "product";
  const isCategory = targetType === "category";

  const { data, isLoading } = useQuery({
    queryKey: [isProduct ? "products-lookup" : "categories-lookup", search],
    queryFn: () =>
      isProduct ? fetchProducts(search) : fetchCategories(search),
    enabled: Boolean(targetType),
    staleTime: 60_000,
  });

  const options = (data?.items || []).map((item) => {
    const title =
      item?.translations?.find((t) => t.lang === "en")?.title ||
      item?.translations?.[0]?.title ||
      item?.sku ||
      "Untitled";
    const sub = isProduct ? ` · ${item.sku}` : "";
    return { value: item.id, label: `${title}${sub}` };
  });

  return (
    <Input
      type="select"
      label={isProduct ? "Linked Product" : "Linked Category"}
      placeholder={
        isProduct
          ? "Search and select a product"
          : "Search and select a category"
      }
      required
      value={value || undefined}
      onChange={onChange}
      options={options}
      allowClear
      showSearch
      onSearch={setSearch}
      filterOption={false}
      loading={isLoading}
      error={error}
    />
  );
};

export default BannerTargetSelect;
