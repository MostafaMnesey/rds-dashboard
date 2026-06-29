import { zodResolver } from "@hookform/resolvers/zod";
import { Drawer } from "antd";
import { Loader2, RotateCcw, Send } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import CustomerDetailsSection from "./CustomerDetailsSection";
import OrderDetailsSection from "./OrderDetailsSection";
import OrderSummaryCard from "./OrderSummaryCard";
import ProductsSelectorSection from "./ProductsSelectorSection";

import useSiteShipping from "../useSiteShipping";
import { useCreateManualOrder } from "../useWhatsAppOrderMutations";
import { buildManualOrderPayload, getInitialFormValues } from "../utils";

/* ───────── Zod schema ───────── */
const schema = z.object({
  source: z.string(),
  customer: z.object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Please enter a valid email"),
    phone: z.string().trim().min(5, "Phone number is required"),
    country: z.string().trim().min(1, "Country is required"),
    state: z.string().optional().or(z.literal("")),
    city: z.string().trim().min(1, "City is required"),
    zipCode: z.string().optional().or(z.literal("")),
    streetAddress: z.string().trim().min(1, "Street address is required"),
    apartment: z.string().optional().or(z.literal("")),
    deliveryNotes: z.string().optional().or(z.literal("")),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().min(1),
      }),
    )
    .min(1, "Please add at least one product"),
  notes: z.string().optional().or(z.literal("")),
  paymentStatus: z.enum(["pending", "paid", "unpaid"]),
  shippingType: z.enum(["inside", "outside"]),
  discount: z
    .string()
    .optional()
    .refine((value) => {
      if (value == null || value.trim() === "") return true;
      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed >= 0;
    }, "Please enter a valid discount amount"),
});

const WhatsAppOrderFormDrawer = ({ open, onClose }) => {
  const createMutation = useCreateManualOrder();
  const isSubmitting = createMutation.isPending;

  // Fetch shipping prices from site-info
  const { shippingPrices, isLoading: isLoadingShipping } = useSiteShipping();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: getInitialFormValues(),
  });

  /* Watch items count for the header badge */
  const items = useWatch({ control, name: "items" }) || [];

  /* ─── Handlers ─── */
  const handleReset = () => {
    reset(getInitialFormValues());
  };

  const onSubmit = async (values) => {
    const payload = buildManualOrderPayload(values);
    try {
      await createMutation.mutateAsync(payload);
      reset(getInitialFormValues());
      onClose();
    } catch {
      // handled in hook — form values stay intact
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width="80%"
      destroyOnClose={false}
      closable={false}
      title={null}
      styles={{
        body: { padding: 0, background: "#fafaf9" },
        header: { display: "none" },
      }}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-black/5 bg-white px-6 py-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-oswald text-2xl font-bold uppercase tracking-wide text-soft-black">
                New WhatsApp Order
              </h2>
              {isDirty && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Draft
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-secondary">
              Create a manual order for a customer who reached out via WhatsApp.
              {!isDirty && " Your progress is saved when you close."}
            </p>
          </div>

          {isDirty && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-black/10 bg-black px-4 text-xs font-semibold text-white transition hover:border-black/20 hover:bg-black/90 hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              title="Clear all fields and start over"
            >
              <RotateCcw size={13} />
              Reset Form
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form
            id="whatsapp-order-form"
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-5 lg:grid-cols-3"
          >
            {/* Main column */}
            <div className="space-y-5 lg:col-span-2">
              <CustomerDetailsSection control={control} errors={errors} />
              <ProductsSelectorSection
                control={control}
                setValue={setValue}
                getValues={getValues}
                errors={errors}
              />
              <OrderDetailsSection
                control={control}
                errors={errors}
                shippingPrices={shippingPrices}
                isLoadingShipping={isLoadingShipping}
              />
            </div>

            {/* Sidebar — summary */}
            <div className="lg:col-span-1">
              <OrderSummaryCard
                control={control}
                shippingPrices={shippingPrices}
                isLoadingShipping={isLoadingShipping}
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-black/5 bg-white px-6 py-4">
          <div className="text-xs text-secondary">
            {items.length > 0 ? (
              <>
                <span className="font-semibold text-soft-black">
                  {items.length}
                </span>{" "}
                {items.length === 1 ? "item" : "items"} in the order
              </>
            ) : (
              "Add products and customer details to create the order"
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-6 text-sm font-medium text-soft-black transition hover:border-black/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Close
            </button>
            <button
              type="submit"
              form="whatsapp-order-form"
              disabled={isSubmitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-main px-6 text-sm font-semibold text-white shadow-rds-cta transition hover:brightness-95 hover:shadow-rds-cta-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={15} />
              )}
              Create Order
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default WhatsAppOrderFormDrawer;
