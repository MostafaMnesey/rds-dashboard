import { memo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { Settings, Check, Ticket } from "lucide-react";
import Input from "../../../components/ui/Input";
import WhatsAppFormSection from "./WhatsAppFormSection";
import { SHIPPING_TYPES, PAYMENT_STATUSES } from "../data/constants";
import { formatCurrency } from "../../orders/utils/formatters";

const OptionCard = ({ option, isActive, onClick, badge }) => {
    const Icon = option.icon;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`group relative flex flex-col items-start gap-1 rounded-xl border p-3.5 text-left transition ${isActive
                    ? "border-main bg-main/5"
                    : "border-black/10 bg-white hover:border-black/20"
                }`}
        >
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                    {Icon && (
                        <Icon
                            size={16}
                            className={isActive ? "text-main" : "text-secondary"}
                        />
                    )}
                    <span
                        className={`text-sm font-semibold ${isActive ? "text-main" : "text-soft-black"
                            }`}
                    >
                        {option.label}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {badge && (
                        <span className="rounded-lg bg-black/[0.04] px-2 py-0.5 text-[11px] font-bold text-soft-black">
                            {badge}
                        </span>
                    )}
                    {isActive && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-main text-white">
                            <Check size={12} strokeWidth={3} />
                        </span>
                    )}
                </div>
            </div>

            {option.description && (
                <span className="text-xs text-secondary">{option.description}</span>
            )}
        </button>
    );
};

const OrderDetailsSection = ({
    control,
    errors,
    shippingPrices,
    isLoadingShipping,
}) => {
    const selectedShippingType = useWatch({ control, name: "shippingType" });
    const selectedShipping = shippingPrices?.[selectedShippingType];

    return (
        <WhatsAppFormSection
            icon={Settings}
            title="Order Details"
            description="Shipping method, payment status, and additional notes."
        >
            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                    Shipping Type
                </label>

                <Controller
                    name="shippingType"
                    control={control}
                    render={({ field }) => (
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {SHIPPING_TYPES.map((opt) => {
                                const config = shippingPrices?.[opt.value];
                                let badge = null;

                                if (isLoadingShipping) {
                                    badge = "...";
                                } else if (config?.configured) {
                                    badge = formatCurrency(config.price, "AED");
                                } else {
                                    badge = "Not set";
                                }

                                return (
                                    <OptionCard
                                        key={opt.value}
                                        option={opt}
                                        isActive={field.value === opt.value}
                                        onClick={() => field.onChange(opt.value)}
                                        badge={badge}
                                    />
                                );
                            })}
                        </div>
                    )}
                />

                {selectedShipping?.configured && selectedShipping.freeAboveOrder > 0 && (
                    <p className="mt-2 text-xs text-secondary">
                        Free shipping for this method on orders above{" "}
                        <span className="font-semibold text-main">
                            {formatCurrency(selectedShipping.freeAboveOrder, "AED")}
                        </span>
                        .
                    </p>
                )}
            </div>

            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                    Payment Status
                </label>
                <Controller
                    name="paymentStatus"
                    control={control}
                    render={({ field }) => (
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            {PAYMENT_STATUSES.map((opt) => (
                                <OptionCard
                                    key={opt.value}
                                    option={opt}
                                    isActive={field.value === opt.value}
                                    onClick={() => field.onChange(opt.value)}
                                />
                            ))}
                        </div>
                    )}
                />
            </div>

            <Controller
                name="couponCode"
                control={control}
                render={({ field }) => (
                    <Input
                        label="Coupon Code"
                        placeholder="e.g. WELCOME10 (optional)"
                        hint="Leave blank if no coupon applies."
                        {...field}
                        value={(field.value || "").toUpperCase()}
                        onChange={(e) => {
                            const v = e?.target?.value !== undefined ? e.target.value : e;
                            field.onChange((v || "").toUpperCase());
                        }}
                        inputClassName="font-mono uppercase tracking-wider"
                        error={errors?.couponCode?.message}
                        suffix={<Ticket size={14} className="text-secondary" />}
                    />
                )}
            />

            <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                    <Input
                        type="textarea"
                        label="Internal Notes"
                        rows={3}
                        placeholder="Any additional notes about this order..."
                        hint="These notes are for internal use only."
                        {...field}
                        error={errors?.notes?.message}
                    />
                )}
            />
        </WhatsAppFormSection>
    );
};

export default memo(OrderDetailsSection);