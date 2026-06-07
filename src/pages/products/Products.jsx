import { useState, useCallback } from "react";
import { Plus, Download } from "lucide-react";
import { PageHeader, Button } from "../../components/ui";
import ProductsFilters from "./components/ProductsFilters";
import ProductsTable from "./components/ProductsTable";
import ProductFormDrawer from "./components/ProductFormDrawer";
import { useProducts } from "./useProducts";
import { useDeleteProduct } from "./useProductMutations";
import { useExportProducts } from "./useExportProducts";

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
  const exportMutation = useExportProducts();

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

  const handleExport = useCallback(() => {
    // Send the same active filters so the export matches what the user sees
    exportMutation.mutate({
      search: filters.search || undefined,
      brand: filters.brand || undefined,
      stockStatus: filters.stockStatus || undefined,
      isOnSale: filters.isOnSale || undefined,
    });
  }, [exportMutation, filters]);

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
          <>
            <Button
              variant="secondary"
              icon={Download}
              onClick={handleExport}
              loading={exportMutation.isPending}
            >
              Export
            </Button>
            <Button icon={Plus} onClick={handleCreate}>
              Add Product
            </Button>
          </>
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
