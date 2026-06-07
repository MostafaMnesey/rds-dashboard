import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Drawer } from "antd";
import { Check, Loader2 } from "lucide-react";
import BannerImageUpload from "./BannerImageUpload";
import BannerTargetSelect from "./BannerTargetSelect";
import { useCreateBanner, useUpdateBanner } from "../useBannerMutations";
import { buildBannerFormData } from "../utils";
import { TARGET_TYPES } from "../data/constants";
import { resolveMediaSrc } from "../../../lib/media";

const schema = z.object({
  targetType: z.enum(["product", "category"]),
  targetId: z.string().min(1, "Please select a target"),
});

const defaults = {
  targetType: "product",
  targetId: "",
};

const BannerFormDrawer = ({ open, onClose, banner }) => {
  const isEdit = Boolean(banner);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const createMutation = useCreateBanner();
  const updateMutation = useUpdateBanner();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  const targetType = watch("targetType");

  // Initialize form on open (create or edit)
  useEffect(() => {
    if (!open) return;

    if (isEdit) {
      reset({
        targetType: banner.targetType || "product",
        targetId: banner.targetId || banner.target?.id || "",
      });
      setImageFile(null);
      setImagePreview(resolveMediaSrc(banner.image) || null);
    } else {
      reset(defaults);
      setImageFile(null);
      setImagePreview(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isEdit, banner?.id]);

  // Reset target id when switching target type (only in create mode,
  // or in edit mode if user manually changes the type)
  const handleTargetTypeChange = (newType, fieldOnChange) => {
    fieldOnChange(newType);
    setValue("targetId", "");
  };

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
    // Image is required for create, optional for update
    if (!isEdit && !imageFile) return;

    try {
      const formData = buildBannerFormData({
        ...values,
        imageFile, // null for unchanged image in edit → not appended
      });

      if (isEdit) {
        await updateMutation.mutateAsync({ id: banner.id, formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onClose();
    } catch {
      // handled in hook
    }
  };

  const canSubmit = isEdit ? Boolean(imagePreview) : Boolean(imageFile);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={560}
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
            {isEdit ? "Edit Banner" : "New Banner"}
          </h2>
          <p className="mt-1 text-sm text-secondary">
            {isEdit
              ? "Update the banner image or change its target."
              : "Upload a banner image and link it to a product or category."}
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form
            id="banner-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Image */}
            <BannerImageUpload
              preview={imagePreview}
              onChange={handleImageChange}
              onClear={handleImageClear}
            />
            {!imagePreview && (
              <p className="-mt-3 text-xs text-secondary">
                A banner image is required.
              </p>
            )}
            {isEdit && imagePreview && !imageFile && (
              <p className="-mt-3 text-xs text-secondary">
                Upload a new image to replace the current one, or keep it as is.
              </p>
            )}

            {/* Target type */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                Target Type
              </label>

              <Controller
                name="targetType"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-2">
                    {TARGET_TYPES.map((opt) => {
                      const isActive = field.value === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            handleTargetTypeChange(opt.value, field.onChange)
                          }
                          className={`group relative flex flex-col items-start gap-1 rounded-xl border p-3.5 text-left transition ${
                            isActive
                              ? "border-main bg-main/5"
                              : "border-black/10 bg-white hover:border-black/20"
                          }`}
                        >
                          <div className="flex w-full items-center justify-between">
                            <span
                              className={`text-sm font-semibold ${
                                isActive ? "text-main" : "text-soft-black"
                              }`}
                            >
                              {opt.label}
                            </span>
                            {isActive && (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-main text-white">
                                <Check size={12} strokeWidth={3} />
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-secondary">
                            {opt.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              />
            </div>

            {/* Target */}
            <Controller
              name="targetId"
              control={control}
              render={({ field }) => (
                <BannerTargetSelect
                  targetType={targetType}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors?.targetId?.message}
                />
              )}
            />
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
            form="banner-form"
            disabled={isSubmitting || !canSubmit}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-main px-6 text-sm font-semibold text-white shadow-rds-cta transition hover:brightness-95 hover:shadow-rds-cta-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? "Save Changes" : "Create Banner"}
          </button>
        </div>
      </div>
    </Drawer>
  );
};

export default BannerFormDrawer;
