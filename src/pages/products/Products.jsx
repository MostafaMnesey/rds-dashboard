import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { PageHeader, Button } from "../../components/ui";
import ProductsFilters from "./components/ProductsFilters";
import ProductsTable from "./components/ProductsTable";
import ProductFormDrawer from "./components/ProductFormDrawer";
import { useProducts } from "./useProducts";
import { useDeleteProduct } from "./useProductMutations";

const Products = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {
    items,
    pagination,
    isLoading,
    isFetching,
    page,
    onPageChange,
    filters,
  } = useProducts();

  const deleteMutation = useDeleteProduct();

  const handleCreate = useCallback(() => {
    setSelectedProduct(null);
    setDrawerOpen(true);
  }, []);

  const handleEdit = useCallback((product) => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedProduct(null), 200);
  }, []);

  const handleDelete = useCallback(
    (id) => deleteMutation.mutate(id),
    [deleteMutation],
  );

  return (
    <>
      <PageHeader
        title="Products"
        subtitle={
          pagination.totalItems
            ? `${pagination.totalItems} total products`
            : "Manage your product catalog"
        }
        actions={
          <Button icon={Plus} onClick={handleCreate}>
            Add Product
          </Button>
        }
      />

      <ProductsFilters {...filters} />

      <ProductsTable
        items={items}
        loading={isLoading || isFetching}
        pagination={pagination}
        page={page}
        onPageChange={onPageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingId={deleteMutation.isPending ? deleteMutation.variables : null}
      />

      <ProductFormDrawer
        open={drawerOpen}
        onClose={handleClose}
        product={selectedProduct}
      />
    </>
  );
};

export default Products;
