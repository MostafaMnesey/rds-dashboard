import { memo } from "react";
import { Controller } from "react-hook-form";
import { ShieldCheck, Check } from "lucide-react";
import Input from "../../../../components/ui/Input";
import SiteInfoSection from "./SiteInfoSection";
import { PAYMENT_METHODS } from "../data/constants";

const PaymentMethodChip = ({ method, selected, onToggle }) => {
    const Icon = method.icon;
    return (
        <button
            type="button"
            onClick={onToggle}
            className={`relative flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition active:scale-[0.98] ${selected
                    ? "border-main bg-main/[0.06] text-soft-black"
                    : "border-black/10 bg-white text-secondary hover:border-black/20 hover:text-soft-black"
                }`}
        >
            <Icon size={16} className={selected ? method.accent : "text-secondary"} />
            <span>{method.label}</span>
            {selected && (
                <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-main text-white">
                    <Check size={10} strokeWidth={3} />
                </span>
            )}
        </button>
    );
};

const SiteInfoPoliciesSection = ({ control, errors }) => {
    return (
        <SiteInfoSection
            icon={ShieldCheck}
            title="Policies & Payment"
            description="Return policy, warranty terms and accepted payment methods."
        >
            <Controller
                name="extraInfo.returnPolicy"
                control={control}
                render={({ field }) => (
                    <Input
                        label="Return Policy"
                        placeholder="e.g. 7-day return policy"
                        {...field}
                        error={errors?.extraInfo?.returnPolicy?.message}
                    />
                )}
            />

            <Controller
                name="extraInfo.warranty"
                control={control}
                render={({ field }) => (
                    <Input
                        type="textarea"
                        label="Warranty"
                        rows={2}
                        placeholder="e.g. All products are 100% authentic and in original packaging"
                        {...field}
                        error={errors?.extraInfo?.warranty?.message}
                    />
                )}
            />

            {/* Payment methods */}
            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                    Accepted Payment Methods
                </label>
                <Controller
                    name="extraInfo.paymentMethods"
                    control={control}
                    render={({ field }) => {
                        const selected = field.value || [];
                        const toggle = (value) => {
                            if (selected.includes(value)) {
                                field.onChange(selected.filter((v) => v !== value));
                            } else {
                                field.onChange([...selected, value]);
                            }
                        };
                        return (
                            <div className="flex flex-wrap gap-2">
                                {PAYMENT_METHODS.map((m) => (
                                    <PaymentMethodChip
                                        key={m.value}
                                        method={m}
                                        selected={selected.includes(m.value)}
                                        onToggle={() => toggle(m.value)}
                                    />
                                ))}
                            </div>
                        );
                    }}
                />
                <p className="mt-2 text-xs text-secondary">
                    Select all methods accepted at checkout.
                </p>
            </div>
        </SiteInfoSection>
    );
};

export default memo(SiteInfoPoliciesSection);