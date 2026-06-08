import { memo, useCallback } from "react";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { Plus, Trash2, Phone, Star } from "lucide-react";
import { Switch } from "antd";
import Input from "../../../../components/ui/Input";
import PhoneInput from "../../../../components/ui/PhoneInput";
import SiteInfoSection from "./SiteInfoSection";
import { CONTACT_METHOD_TYPES } from "../data/constants";

/* ───────── Row ───────── */
const ContactRow = memo(({ control, errors, index, onRemove }) => {
    const rowErrors = errors?.contactMethods?.[index] || {};

    const currentType = useWatch({
        control,
        name: `contactMethods.${index}.type`,
    });

    const isPhoneType = currentType === "phone" || currentType === "whatsapp";

    return (
        <div className="rounded-xl border border-black/5 bg-[#fafaf9] p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                {/* Type */}
                <div className="sm:col-span-3">
                    <Controller
                        name={`contactMethods.${index}.type`}
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="select"
                                label="Type"
                                options={CONTACT_METHOD_TYPES.map((t) => ({
                                    value: t.value,
                                    label: t.label,
                                }))}
                                {...field}
                                error={rowErrors?.type?.message}
                            />
                        )}
                    />
                </div>

                {/* Label */}
                <div className="sm:col-span-4">
                    <Controller
                        name={`contactMethods.${index}.label`}
                        control={control}
                        render={({ field }) => (
                            <Input
                                label="Label"
                                placeholder="e.g. Main Email"
                                {...field}
                                error={rowErrors?.label?.message}
                            />
                        )}
                    />
                </div>

                {/* Value */}
                <div className="sm:col-span-5">
                    <Controller
                        name={`contactMethods.${index}.value`}
                        control={control}
                        render={({ field }) =>
                            isPhoneType ? (
                                <PhoneInput
                                    label="Value"
                                    value={field.value}
                                    onChange={field.onChange}
                                    country="ae"
                                    error={rowErrors?.value?.message}
                                />
                            ) : (
                                <Input
                                    label="Value"
                                    placeholder="email / address / link"
                                    {...field}
                                    error={rowErrors?.value?.message}
                                />
                            )
                        }
                    />
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-3">
                <Controller
                    name={`contactMethods.${index}.isPrimary`}
                    control={control}
                    render={({ field }) => (
                        <label className="inline-flex cursor-pointer items-center gap-2.5">
                            <Switch
                                size="small"
                                checked={field.value}
                                onChange={field.onChange}
                            />
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-soft-black">
                                <Star size={12} className="text-amber-500" />
                                Primary contact
                            </span>
                        </label>
                    )}
                />

                <button
                    type="button"
                    onClick={onRemove}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 text-xs font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50 active:scale-95"
                >
                    <Trash2 size={13} />
                    Remove
                </button>
            </div>
        </div>
    );
});

ContactRow.displayName = "ContactRow";

/* ───────── Main Section ───────── */
const SiteInfoContactsSection = ({ control, errors }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "contactMethods",
    });

    const handleAdd = useCallback(() => {
        append({
            type: "email",
            label: "",
            value: "",
            url: "",
            isPrimary: false,
        });
    }, [append]);

    const handleRemove = useCallback(
        (index) => () => remove(index),
        [remove],
    );

    return (
        <SiteInfoSection
            icon={Phone}
            title="Contact Methods"
            description="Multiple ways for customers to reach you. The URL is auto-generated when saving."
        >
            {fields.length === 0 && (
                <div className="rounded-xl border border-dashed border-black/10 bg-[#fafaf9] px-4 py-8 text-center">
                    <p className="text-sm text-secondary">
                        No contact methods yet. Add one to get started.
                    </p>
                </div>
            )}

            <div className="space-y-3">
                {fields.map((field, index) => (
                    <ContactRow
                        key={field.id}
                        control={control}
                        errors={errors}
                        index={index}
                        onRemove={handleRemove(index)}
                    />
                ))}
            </div>

            <button
                type="button"
                onClick={handleAdd}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-dashed border-main/40 bg-main/[0.04] px-4 text-sm font-semibold text-main transition hover:bg-main/[0.08] active:scale-[0.99]"
            >
                <Plus size={16} />
                Add Contact Method
            </button>
        </SiteInfoSection>
    );
};

export default memo(SiteInfoContactsSection);