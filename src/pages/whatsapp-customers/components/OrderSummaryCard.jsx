import { memo } from "react";
import { useWatch } from "react-hook-form";
import { Receipt, Truck, Gift } from "lucide-react";
import { formatCurrency } from "../../orders/utils/formatters";
import { calculateSubtotal, calculateShippingCost } from "../utils";

const SummaryRow = ({ label, value, bold }) => (
    <div className="flex items-center justify-between">
        <span
            className={`text-sm ${bold ? "font-semibold text-soft-black" : "text-secondary"
                }`}
        >
            {label}
        </span>
        <span
            className={`${bold
                    ? "font-oswald text-xl font-bold text-soft-black"
                    : "text-sm font-semibold text-soft-black"
                }`}
        >
            {value}
        </span>
    </div>
);

const OrderSummaryCard = ({ control, shippingPrices, isLoadingShipping }) => {
    const items = useWatch({ control, name: "items" }) || [];
    const shippingType = useWatch({ control, name: "shippingType" });
    const coupon = useWatch({ control, name: "couponCode" });

    const subtotal = calculateSubtotal(items);
    const itemsCount = items.reduce(
        (sum, it) => sum + (Number(it.quantity) || 0),
        0,
    );

    const shipping = calculateShippingCost(
        shippingType,
        subtotal,
        shippingPrices,
    );

    const estimatedTotal = subtotal + shipping.cost;
    const remainingForFree =
        shipping.isConfigured &&
            !shipping.isFree &&
            shipping.threshold > 0 &&
            subtotal < shipping.threshold
            ? shipping.threshold - subtotal
            : 0;

    return (
        <div className="sticky top-4 space-y-4">
            <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-rds-sm">
                <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-main/10 text-main">
                        <Receipt size={16} />
                    </div>
                    <h3 className="font-oswald text-base font-bold uppercase tracking-wide text-soft-black">
                        Order Summary
                    </h3>
                </div>

                <div className="space-y-2.5 border-b border-black/5 pb-4">
                    <SummaryRow
                        label={`Items (${itemsCount})`}
                        value={formatCurrency(subtotal, "AED")}
                    />

                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-sm text-secondary">
                            <Truck size={13} />
                            Shipping
                        </span>

                        <span className="text-sm font-semibold">
                            {isLoadingShipping ? (
                                <span className="text-xs text-secondary">Loading...</span>
                            ) : !shipping.isConfigured ? (
                                <span className="text-xs text-secondary">Not configured</span>
                            ) : shipping.isFree ? (
                                <span className="inline-flex items-center gap-1 text-main">
                                    <Gift size={13} />
                                    FREE
                                </span>
                            ) : (
                                formatCurrency(shipping.cost, "AED")
                            )}
                        </span>
                    </div>

                    {coupon && (
                        <SummaryRow
                            label="Coupon"
                            value={
                                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-main">
                                    {coupon}
                                </span>
                            }
                        />
                    )}
                </div>

                <div className="pt-4">
                    <SummaryRow
                        label="Estimated Total"
                        value={formatCurrency(estimatedTotal, "AED")}
                        bold
                    />
                    <p className="mt-2 text-xs text-secondary">
                        Coupon discount will be applied after we wire the coupon validation.
                    </p>
                </div>
            </div>

            {remainingForFree > 0 && (
                <div className="rounded-2xl border border-main/20 bg-main/5 p-4">
                    <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-main/15 text-main">
                            <Gift size={14} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-soft-black">
                                Almost there!
                            </p>
                            <p className="mt-0.5 text-xs text-secondary">
                                Add{" "}
                                <span className="font-bold text-main">
                                    {formatCurrency(remainingForFree, "AED")}
                                </span>{" "}
                                more to get free shipping.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {shipping.isFree && subtotal > 0 && (
                <div className="rounded-2xl border border-main/20 bg-main/5 p-4">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-main/15 text-main">
                            <Gift size={14} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-main">
                                🎉 Free shipping applied!
                            </p>
                            <p className="mt-0.5 text-xs text-secondary">
                                This order reached the free shipping threshold.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(OrderSummaryCard);