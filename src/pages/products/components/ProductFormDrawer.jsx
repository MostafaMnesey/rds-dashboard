import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Drawer, Switch } from "antd";
import { Loader2 } from "lucide-react";
import Input from "../../../components/ui/Input";
import ProductTranslationsTabs from "./ProductTranslationsTabs";
import ProductMediaManager from "./ProductMediaUpload";
import ProductCategoriesSelect from "./ProductCategoriesSelect";
import { useCreateProduct, useUpdateProduct } from "../useProductMutations";
import { buildProductDefaults, buildProductFormData } from "../utils";
import { STOCK_STATUS_OPTIONS } from "../data/constants";

/* ─── Schemas ─── */
const sectionsSchema = z.object({
  rich: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
  }),
  bullets: z.object({
    title: z.string().optional(),
    items: z.array(z.string()).optional(),
  }),
  table: z.object({
    title: z.string().optional(),
    columns: z.array(z.string()).optional(),
    rows: z.array(z.array(z.string())).optional(),
  }),
});

const translationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  shortDescription: z.string().optional(),
  sections: sectionsSchema,
});

const schema = z.object({
  brand: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  badge: z.string().optional(),
  stockStatus: z.string().min(1, "Stock status is required"),
  oldPrice: z.number().min(0, "Cannot be negative"),
  newPrice: z.number().min(0, "Cannot be negative"),
  isOnSale: z.boolean(),
  categoryIds: z.array(z.string()).optional(),
  en: translationSchema,
  ar: translationSchema,
});

const ProductFormDrawer = ({ open, onClose, product }) => {
  const isEdit = Boolean(product);

  /* ─── Media state ─── */
  const [existingMedia, setExistingMedia] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [frontIndex, setFrontIndex] = useState(null);
  const [backIndex, setBackIndex] = useState(null);

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: buildProductDefaults(product),
  });

  /* Reset on open/product change */
  useEffect(() => {
    if (!open) return;
    reset(buildProductDefaults(product));

    const media = product?.media || [];
    setExistingMedia(media);
    setNewFiles([]);

    const frontIdx = media.findIndex(
      (m) => m.role === "front_image" || m.isPrimary,
    );
    const backIdx = media.findIndex((m) => m.role === "back_image");
    setFrontIndex(frontIdx >= 0 ? `existing-${frontIdx}` : null);
    setBackIndex(backIdx >= 0 ? `existing-${backIdx}` : null);
  }, [open, product, reset]);

  /* ─── Media handlers ─── */
  const handleAddFiles = (files) => {
    setNewFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveNew = (idx) => {
    const key = `new-${idx}`;
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    if (frontIndex === key) setFrontIndex(null);
    if (backIndex === key) setBackIndex(null);
    setFrontIndex((prev) => shiftKey(prev, "new", idx));
    setBackIndex((prev) => shiftKey(prev, "new", idx));
  };

  const handleRemoveExisting = (idx) => {
    const key = `existing-${idx}`;
    setExistingMedia((prev) => prev.filter((_, i) => i !== idx));
    if (frontIndex === key) setFrontIndex(null);
    if (backIndex === key) setBackIndex(null);
    setFrontIndex((prev) => shiftKey(prev, "existing", idx));
    setBackIndex((prev) => shiftKey(prev, "existing", idx));
  };

  const handleSetFront = (key) => {
    setFrontIndex(key);
    if (backIndex === key) setBackIndex(null);
  };

  const handleSetBack = (key) => {
    setBackIndex(key);
    if (frontIndex === key) setFrontIndex(null);
  };

  const getFileByKey = (key) => {
    if (!key) return null;
    if (key.startsWith("new-")) {
      const idx = Number(key.replace("new-", ""));
      return newFiles[idx] || null;
    }
    return null;
  };

  /* ─── Submit ─── */
  const onSubmit = async (values) => {
    const frontFile = getFileByKey(frontIndex);
    const backFile = getFileByKey(backIndex);

    // Gallery = newFiles that are NOT marked as front or back
    const galleryFiles = newFiles.filter((_, idx) => {
      const key = `new-${idx}`;
      return key !== frontIndex && key !== backIndex;
    });

    const formData = buildProductFormData(values, {
      galleryFiles,
      frontFile,
      backFile,
    });

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: product.id, formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onClose();
    } catch {
      // toast handled in hook
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={720}
      destroyOnClose
      closable={false}
      title={null}
      styles={{
        body: { padding: 0, background: "#ffffff" },
        header: { display: "none" },
      }}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b border-black/5 px-6 py-5">
          <h2 className="font-oswald text-2xl font-bold uppercase tracking-wide text-soft-black">
            {isEdit ? "Edit Product" : "New Product"}
          </h2>
          <p className="mt-1 text-sm text-secondary">
            {isEdit
              ? "Update product details, media and translations."
              : "Create a new product with multi-language support."}
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form
            id="product-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Unified media manager */}
            <ProductMediaManager
              existing={existingMedia}
              newFiles={newFiles}
              frontIndex={frontIndex}
              backIndex={backIndex}
              onAdd={handleAddFiles}
              onRemoveNew={handleRemoveNew}
              onRemoveExisting={handleRemoveExisting}
              onSetFront={handleSetFront}
              onSetBack={handleSetBack}
            />

            {/* Basic info */}
            <div className="rounded-2xl border border-black/5 bg-[#fafaf9] p-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary">
                Basic Info
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  name="brand"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Brand"
                      placeholder="e.g. Skinage"
                      {...field}
                      error={errors?.brand?.message}
                    />
                  )}
                />
                <Controller
                  name="sku"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="SKU"
                      required
                      placeholder="RDS-PRODUCT-001"
                      {...field}
                      inputClassName="font-mono"
                      error={errors?.sku?.message}
                    />
                  )}
                />
                <Controller
                  name="badge"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Badge"
                      placeholder="e.g. Sale, New, Hot"
                      {...field}
                      error={errors?.badge?.message}
                    />
                  )}
                />
                <Controller
                  name="stockStatus"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="select"
                      label="Stock Status"
                      required
                      value={field.value}
                      onChange={(v) => field.onChange(v || "in_stock")}
                      options={STOCK_STATUS_OPTIONS}
                      error={errors?.stockStatus?.message}
                    />
                  )}
                />
              </div>
            </div>

            {/* Pricing — AED only */}
            <div className="rounded-2xl border border-black/5 bg-[#fafaf9] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary">
                  Pricing
                </p>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold text-secondary shadow-rds-sm">
                  AED
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  name="oldPrice"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      label="Old Price"
                      min={0}
                      placeholder="0"
                      {...field}
                      onChange={(val) => field.onChange(val ?? 0)}
                      error={errors?.oldPrice?.message}
                      suffix={<span className="text-secondary">AED</span>}
                    />
                  )}
                />
                <Controller
                  name="newPrice"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      label="New Price"
                      required
                      min={0}
                      placeholder="0"
                      {...field}
                      onChange={(val) => field.onChange(val ?? 0)}
                      error={errors?.newPrice?.message}
                      suffix={<span className="text-secondary">AED</span>}
                    />
                  )}
                />
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl border border-black/5 bg-white px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-soft-black">
                    On Sale
                  </p>
                  <p className="text-xs text-secondary">
                    Marks the product as discounted and shows the old price.
                  </p>
                </div>
                <Controller
                  name="isOnSale"
                  control={control}
                  render={({ field }) => (
                    <Switch checked={field.value} onChange={field.onChange} />
                  )}
                />
              </div>
            </div>

            {/* Categories */}
            <Controller
              name="categoryIds"
              control={control}
              render={({ field }) => (
                <ProductCategoriesSelect
                  value={field.value}
                  onChange={field.onChange}
                  error={errors?.categoryIds?.message}
                />
              )}
            />

            {/* Translations */}
            <div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                Translations
              </label>
              <ProductTranslationsTabs
                control={control}
                setValue={setValue}
                errors={errors}
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-black/5 bg-[#fafaf9] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-6 text-sm font-medium text-soft-black transition hover:border-black/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-main px-6 text-sm font-semibold text-white shadow-rds-cta transition hover:brightness-95 hover:shadow-rds-cta-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </div>
    </Drawer>
  );
};

/* Helper: when an item is removed, shift any front/back key that pointed to a higher index */
function shiftKey(currentKey, type, removedIdx) {
  if (!currentKey) return currentKey;
  const prefix = `${type}-`;
  if (!currentKey.startsWith(prefix)) return currentKey;
  const idx = Number(currentKey.replace(prefix, ""));
  if (idx > removedIdx) return `${prefix}${idx - 1}`;
  return currentKey;
}

export default ProductFormDrawer;
