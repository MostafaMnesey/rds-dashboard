import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Drawer } from "antd";
import { Loader2, Shield } from "lucide-react";
import Input from "../../../../components/ui/Input";
import { useCreateRole } from "../useRoleMutations";
import { buildRolePayload } from "../../utils";

const schema = z.object({
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(40, "Code is too long")
    .regex(/^[a-z0-9_-]+$/i, "Only letters, numbers, dashes and underscores"),
  name_en: z.string().min(1, "English name is required"),
  name_ar: z.string().min(1, "Arabic name is required"),
});

const defaults = { code: "", name_en: "", name_ar: "" };

const RoleFormDrawer = ({ open, onClose }) => {
  const createMutation = useCreateRole();
  const isSubmitting = createMutation.isPending;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  useEffect(() => {
    if (open) reset(defaults);
  }, [open, reset]);

  const onSubmit = async (values) => {
    const payload = buildRolePayload(values);
    try {
      await createMutation.mutateAsync(payload);
      onClose();
    } catch {
      // toast handled in hook
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={520}
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
            New Role
          </h2>
          <p className="mt-1 text-sm text-secondary">
            Define a new role with English and Arabic names.
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form
            id="role-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Code */}
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <Input
                  label="Role Code"
                  required
                  placeholder="sales"
                  hint="Unique identifier. Lowercase letters, numbers, - and _ only."
                  {...field}
                  value={(field.value || "").toLowerCase()}
                  onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                  inputClassName="font-mono lowercase"
                  error={errors?.code?.message}
                />
              )}
            />

            {/* Names: EN + AR */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="name_en"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Name (English)"
                    required
                    placeholder="Sales"
                    {...field}
                    error={errors?.name_en?.message}
                  />
                )}
              />
              <Controller
                name="name_ar"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Name (العربية)"
                    required
                    placeholder="مسوق"
                    {...field}
                    inputClassName="text-right font-garamond"
                    error={errors?.name_ar?.message}
                  />
                )}
              />
            </div>

            {/* Preview */}
            <div className="rounded-2xl border border-dashed border-main/40 bg-main/[0.04] p-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-main">
                Preview
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-main/10 text-main">
                  <Shield size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-sm font-semibold uppercase tracking-wide text-soft-black">
                    {watch("code") || "role-code"}
                  </p>
                  <p className="truncate text-xs text-secondary">
                    {watch("name_en") || "English name"}
                    {" • "}
                    <span className="font-garamond">
                      {watch("name_ar") || "الاسم العربي"}
                    </span>
                  </p>
                </div>
              </div>
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
            form="role-form"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-main px-6 text-sm font-semibold text-white shadow-rds-cta transition hover:brightness-95 hover:shadow-rds-cta-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            Create Role
          </button>
        </div>
      </div>
    </Drawer>
  );
};

export default RoleFormDrawer;
