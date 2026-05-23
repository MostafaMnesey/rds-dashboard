import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Drawer, Switch } from "antd";
import { Loader2 } from "lucide-react";
import Input from "../../../components/ui/Input";
import BlogImageUpload from "./BlogImageUpload";
import BlogTranslationsTabs from "./BlogTranslationsTabs";
import BlogProductSelect from "./BlogProductSelect";
import { useCreateBlog, useUpdateBlog } from "../useBlogMutations";
import {
  buildBlogFormData,
  formatDateForInput,
  keywordsStringToArray,
  slugify,
} from "../utils";

const translationSchema = z.object({
  lang: z.string(),
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().optional(),
  category: z.string().optional(),
  href: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.array(z.string()).optional(),
});

const schema = z.object({
  slug: z.string().min(1, "Slug is required"),
  date: z.string().optional(),
  isFeatured: z.boolean().default(false),
  productId: z.string().optional().nullable(),
  translations: z.array(translationSchema).min(1),
});

const findT = (blog, lang) =>
  blog?.blogTranslations?.find((t) => t.lang === lang);

const buildDefaults = (blog) => {
  const en = findT(blog, "en");
  const ar = findT(blog, "ar");
  return {
    slug: blog?.slug || "",
    date: formatDateForInput(blog?.date) || "",
    isFeatured: Boolean(blog?.isFeatured),
    productId: blog?.productId || "",
    translations: [
      {
        lang: "en",
        title: en?.title || "",
        excerpt: en?.excerpt || "",
        category: en?.category || "",
        href: en?.href || "",
        meta_title: en?.meta_title || "",
        meta_description: en?.meta_description || "",
        meta_keywords: keywordsStringToArray(en?.meta_keywords),
      },
      {
        lang: "ar",
        title: ar?.title || "",
        excerpt: ar?.excerpt || "",
        category: ar?.category || "",
        href: ar?.href || "",
        meta_title: ar?.meta_title || "",
        meta_description: ar?.meta_description || "",
        meta_keywords: keywordsStringToArray(ar?.meta_keywords),
      },
    ],
  };
};

const BlogFormDrawer = ({ open, onClose, blog }) => {
  const isEdit = Boolean(blog);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [srcSetFiles, setSrcSetFiles] = useState([]);

  const createMutation = useCreateBlog();
  const updateMutation = useUpdateBlog();
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
    defaultValues: buildDefaults(blog),
  });

  useEffect(() => {
    if (open) {
      reset(buildDefaults(blog));
      setImageFile(null);
      setImagePreview(blog?.image || null);
      setSrcSetFiles([]);
    }
  }, [open, blog, reset]);

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

  const handleSrcSetChange = (e) => {
    const files = Array.from(e.target.files || []);
    setSrcSetFiles(files);
  };

  const onSubmit = async (values) => {
    const formData = buildBlogFormData(values, imageFile, srcSetFiles);
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: blog.id, formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onClose();
    } catch {
      // handled in hook
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={640}
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
            {isEdit ? "Edit Blog" : "New Blog"}
          </h2>
          <p className="mt-1 text-sm text-secondary">
            {isEdit
              ? "Update the blog content, translations and SEO."
              : "Write a new editorial post with multi-language support."}
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form
            id="blog-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <BlogImageUpload
              preview={imagePreview}
              onChange={handleImageChange}
              onClear={handleImageClear}
            />

            {/* Slug + Date + Featured */}
            <div className="grid grid-cols-1 gap-4">
              <Controller
                name="slug"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Slug"
                    required
                    placeholder="my-blog-post"
                    hint="Used in the URL. Auto-generated from English title."
                    {...field}
                    onBlur={(e) => {
                      field.onBlur(e);
                      if (!e.target.value) {
                        const enTitle = watch("translations.0.title");
                        if (enTitle) {
                          setValue("slug", slugify(enTitle));
                        }
                      }
                    }}
                    error={errors?.slug?.message}
                  />
                )}
              />

              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Input type="date" label="Publish Date" {...field} />
                )}
              />
            </div>

            {/* Featured switch */}
            <div className="flex items-center justify-between rounded-xl border border-black/5 bg-[#fafaf9] px-4 py-3.5">
              <div>
                <p className="text-sm font-semibold text-soft-black">
                  Featured Blog
                </p>
                <p className="text-xs text-secondary">
                  Show this post at the top of the blog page.
                </p>
              </div>
              <Controller
                name="isFeatured"
                control={control}
                render={({ field }) => (
                  <Switch checked={field.value} onChange={field.onChange} />
                )}
              />
            </div>

            {/* Linked product */}
            <Controller
              name="productId"
              control={control}
              render={({ field }) => (
                <BlogProductSelect
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            {/* Translations */}
            <div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                Translations
              </label>
              <BlogTranslationsTabs control={control} errors={errors} />
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
            form="blog-form"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-main px-6 text-sm font-semibold text-white shadow-rds-cta transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 hover:shadow-rds-cta-hover"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? "Save Changes" : "Create Blog"}
          </button>
        </div>
      </div>
    </Drawer>
  );
};

export default BlogFormDrawer;
