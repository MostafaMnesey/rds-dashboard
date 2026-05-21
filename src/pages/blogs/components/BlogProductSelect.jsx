import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Input from "../../../components/ui/Input";
import API from "../../../api";

// Light-weight product lookup for linking blogs to products
const fetchProductsLookup = async (search) => {
  const response = await API.get("/dashboard/products", {
    params: { limit: 50, ...(search && { search }) },
  });
  return response.data;
};

const BlogProductSelect = ({ value, onChange }) => {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["products-lookup", search],
    queryFn: () => fetchProductsLookup(search),
    staleTime: 60_000,
  });

  const options = (data?.items || []).map((p) => {
    const title =
      p?.translations?.find((t) => t.lang === "en")?.title ||
      p?.sku ||
      "Untitled";
    return { value: p.id, label: `${title} · ${p.sku}` };
  });

  return (
    <Input
      type="select"
      label="Linked Product"
      placeholder="Search and select a product (optional)"
      hint="Connect this blog to a product so it shows up on the product page."
      value={value || undefined}
      onChange={onChange}
      options={options}
      allowClear
      showSearch
      onSearch={setSearch}
      filterOption={false}
      loading={isLoading}
    />
  );
};

export default BlogProductSelect;
