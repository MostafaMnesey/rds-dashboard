import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Drawer, Switch } from "antd";
import { Loader2, Sparkles } from "lucide-react";
import Input from "../../../components/ui/Input";
import { useCreateCoupon, useUpdateCoupon } from "../useCouponMutations";
import { buildCouponPayload } from "../utils";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(40, "Code is too long")
    .regex(
      /^[A-Z0-9_-]+$/i,
      "Only letters, numbers, dashes and underscores are allowed",
    ),
  discountValue: z
    .number({ invalid_type_error: "Discount is required" })
    .min(1, "Must be at least 1%")
    .max(100, "Cannot exceed 100%"),
  usageLimit: z
    .number({ invalid_type_error: "Usage limit is required" })
    .min(0, "Cannot be negative")
    .max(1_000_000, "Too large"),
  isActive: z.boolean().default(true),
});

const buildDefaults = (coupon) => ({
  name: coupon?.name || "",
  code: coupon?.code || "",
  discountValue:
    typeof coupon?.discountValue === "number" ? coupon.discountValue : 10,
  usageLimit: typeof coupon?.usageLimit === "number" ? coupon.usageLimit : 100,
  isActive: coupon ? Boolean(coupon.isActive) : true,
});

const randomCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
};

const CouponFormDrawer = ({ open, onClose, coupon }) => {
  const isEdit = Boolean(coupon);

  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();
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
    defaultValues: buildDefaults(coupon),
  });

  useEffect(() => {
    if (open) reset(buildDefaults(coupon));
  }, [open, coupon, reset]);

  const onSubmit = async (values) => {
    const payload = buildCouponPayload(values);
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: coupon.id, payload });
      } else {
        await createMutation.mutateAsync(payload);
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
            {isEdit ? "Edit Coupon" : "New Coupon"}
          </h2>
          <p className="mt-1 text-sm text-secondary">
            {isEdit
              ? "Update the coupon details and limits."
              : "Create a promotional discount code for your customers."}
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form
            id="coupon-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Name */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  label="Coupon Name"
                  required
                  placeholder="e.g. Summer Sale"
                  hint="Internal name for your reference."
                  {...field}
                  error={errors?.name?.message}
                />
              )}
            />

            {/* Code with generate button */}
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Input
                    label="Coupon Code"
                    required
                    placeholder="SUMMER50"
                    hint="Customers will enter this at checkout. Letters, numbers, - and _ only."
                    {...field}
                    value={(field.value || "").toUpperCase()}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                    inputClassName="font-mono uppercase tracking-wider"
                    error={errors?.code?.message}
                  />
                  <button
                    type="button"
                    onClick={() => setValue("code", randomCode())}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-main transition hover:brightness-90"
                  >
                    <Sparkles size={12} />
                    Generate random code
                  </button>
                </div>
              )}
            />

            {/* Discount + Usage Limit */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="discountValue"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    label="Discount (%)"
                    required
                    min={1}
                    max={100}
                    placeholder="50"
                    {...field}
                    onChange={(val) => field.onChange(val ?? 0)}
                    error={errors?.discountValue?.message}
                    suffix={<span className="text-secondary">%</span>}
                  />
                )}
              />

              <Controller
                name="usageLimit"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    label="Usage Limit"
                    required
                    min={0}
                    placeholder="100"
                    hint="Set 0 for unlimited."
                    {...field}
                    onChange={(val) => field.onChange(val ?? 0)}
                    error={errors?.usageLimit?.message}
                  />
                )}
              />
            </div>

            {/* Active toggle */}
            <div className="flex items-center justify-between rounded-xl border border-black/5 bg-[#fafaf9] px-4 py-3.5">
              <div>
                <p className="text-sm font-semibold text-soft-black">Active</p>
                <p className="text-xs text-secondary">
                  Inactive coupons cannot be used at checkout.
                </p>
              </div>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Switch checked={field.value} onChange={field.onChange} />
                )}
              />
            </div>

            {/* Preview card */}
            <div className="rounded-2xl border border-dashed border-main/40 bg-main/[0.04] p-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-main">
                Preview
              </p>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-mono text-base font-bold uppercase tracking-wider text-soft-black">
                    {watch("code") || "YOUR-CODE"}
                  </p>
                  <p className="truncate text-xs text-secondary">
                    {watch("name") || "Coupon name"}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-oswald text-2xl font-bold text-main">
                    {watch("discountValue") || 0}%
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-secondary">
                    Off
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
            form="coupon-form"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-main px-6 text-sm font-semibold text-white shadow-rds-cta transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 hover:shadow-rds-cta-hover"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? "Save Changes" : "Create Coupon"}
          </button>
        </div>
      </div>
    </Drawer>
  );
};

export default CouponFormDrawer;
