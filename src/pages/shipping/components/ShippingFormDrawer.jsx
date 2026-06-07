import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Drawer } from "antd";
import { Loader2 } from "lucide-react";
import Input from "../../../components/ui/Input";
import { useCreateShipping, useUpdateShipping } from "../useShippingMutations";
import {
  buildShippingPayload,
  formatShippingPrice,
  getShippingTypeMeta,
} from "../utils";

const schema = z.object({
  type: z.enum(["inside", "outside"]),
  price: z
    .number({ invalid_type_error: "Price is required" })
    .min(0, "Price cannot be negative")
    .max(1_000_000, "Price is too large"),
});

const buildDefaults = (method, presetType) => ({
  type: method?.type || presetType || "inside",
  price:
    typeof method?.price === "number"
      ? method.price
      : Number(method?.price) || 0,
});

const ShippingFormDrawer = ({ open, onClose, method, presetType }) => {
  const isEdit = Boolean(method);

  const createMutation = useCreateShipping();
  const updateMutation = useUpdateShipping();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: buildDefaults(method, presetType),
  });

  useEffect(() => {
    if (open) reset(buildDefaults(method, presetType));
  }, [open, method, presetType, reset]);

  const watchedType = watch("type");
  const watchedPrice = watch("price");
  const meta = getShippingTypeMeta(watchedType);
  const Icon = meta.icon;

  const onSubmit = async (values) => {
    const payload = buildShippingPayload(values);
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: method.id, payload });
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
            {isEdit ? "Edit Shipping" : "New Shipping"}
          </h2>
          <p className="mt-1 text-sm text-secondary">
            {isEdit
              ? "Update the shipping price for this method."
              : `Set the shipping price for ${meta.label.toLowerCase()}.`}
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form
            id="shipping-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Type display (locked) */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                Shipping Type
              </label>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-[#fafaf9] px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.accent}`}
                  >
                    {Icon && <Icon size={18} strokeWidth={1.8} />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-soft-black">
                      {meta.label}
                    </p>
                    <p className="truncate text-xs text-secondary">
                      {meta.description}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-black/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary">
                  Locked
                </span>
              </div>
              <p className="mt-1.5 text-xs text-secondary">
                The shipping type cannot be changed after selection.
              </p>
            </div>

            {/* Price */}
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  label="Shipping Price"
                  required
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                  hint="The price customers will pay for this shipping method."
                  {...field}
                  onChange={(val) => field.onChange(val ?? 0)}
                  error={errors?.price?.message}
                  suffix={
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                      AED
                    </span>
                  }
                />
              )}
            />

            {/* Preview card */}
            <div className="rounded-2xl border border-dashed border-main/40 bg-main/[0.04] p-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-main">
                Preview
              </p>
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${meta.accent}`}
                  >
                    {Icon && <Icon size={20} strokeWidth={1.8} />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-soft-black">
                      {meta.label}
                    </p>
                    <p className="truncate text-xs text-secondary">
                      Shipping option
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-oswald text-2xl font-bold text-main">
                    {formatShippingPrice(watchedPrice || 0)}
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
            form="shipping-form"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-main px-6 text-sm font-semibold text-white shadow-rds-cta transition hover:brightness-95 hover:shadow-rds-cta-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? "Save Changes" : "Create Shipping"}
          </button>
        </div>
      </div>
    </Drawer>
  );
};

export default ShippingFormDrawer;
