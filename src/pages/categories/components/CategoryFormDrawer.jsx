import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Drawer } from "antd";
import { Loader2 } from "lucide-react";
import CategoryTranslationsTabs from "./CategoryTranslationsTabs";
import CategoryImageUpload from "./CategoryImageUpload";
import CategoryStatusSelector from "./CategoryStatusSelector";
import { useCreateCategory, useUpdateCategory } from "../useCategoryMutations";
import { buildCategoryFormData, keywordsStringToArray } from "../utils";

const translationSchema = z.object({
  lang: z.string(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.array(z.string()).optional(),
});

const schema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]),
  translations: z.array(translationSchema).min(1),
});

const findTranslation = (category, lang) =>
  category?.translations?.find((t) => t.lang === lang);

const buildDefaults = (category) => {
  const en = findTranslation(category, "en");
  const ar = findTranslation(category, "ar");

  return {
    status: category?.status || "ACTIVE",
    translations: [
      {
        lang: "en",
        title: en?.title || "",
        slug: en?.slug || "",
        meta_title: en?.meta_title || "",
        meta_description: en?.meta_description || "",
        meta_keywords: keywordsStringToArray(en?.meta_keywords),
      },
      {
        lang: "ar",
        title: ar?.title || "",
        slug: ar?.slug || "",
        meta_title: ar?.meta_title || "",
        meta_description: ar?.meta_description || "",
        meta_keywords: keywordsStringToArray(ar?.meta_keywords),
      },
    ],
  };
};

const CategoryFormDrawer = ({ open, onClose, category }) => {
  const isEdit = Boolean(category);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: buildDefaults(category),
  });

  useEffect(() => {
    if (open) {
      reset(buildDefaults(category));
      setImageFile(null);
      setImagePreview(category?.image || null);
    }
  }, [open, category, reset]);

  const handleImageChange = (file) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleImageClear = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (values) => {
    const formData = buildCategoryFormData(values, imageFile);
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: category.id, formData });
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
      width={580}
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
            {isEdit ? "Edit Category" : "New Category"}
          </h2>
          <p className="mt-1 text-sm text-secondary">
            {isEdit
              ? "Update the category details, translations and SEO."
              : "Create a new category with multi-language support."}
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form
            id="category-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <CategoryImageUpload
              preview={imagePreview}
              onChange={handleImageChange}
              onClear={handleImageClear}
            />

            <CategoryStatusSelector
              value={watch("status")}
              onChange={(val) => setValue("status", val)}
            />

            <div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                Translations
              </label>
              <CategoryTranslationsTabs
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
            form="category-form"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-main px-6 text-sm font-semibold text-white shadow-rds-cta transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 hover:shadow-rds-cta-hover"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? "Save Changes" : "Create Category"}
          </button>
        </div>
      </div>
    </Drawer>
  );
};

export default CategoryFormDrawer;
