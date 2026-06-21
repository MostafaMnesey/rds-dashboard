import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, RotateCcw } from "lucide-react";

import { useSiteInfo } from "./useSiteInfo";
import { useUpdateSiteInfo, useToggleCod } from "./useSiteInfoMutations";
import {
    SITE_INFO_DEFAULTS,
    mapSiteInfoToForm,
    buildSiteInfoPayload,
} from "./utils";

import SiteInfoBasicSection from "./components/SiteInfoBasicSection";
import SiteInfoContactsSection from "./components/SiteInfoContactsSection";
import SiteInfoSocialSection from "./components/SiteInfoSocialSection";
import SiteInfoBusinessHoursSection from "./components/SiteInfoBusinessHoursSection";
import SiteInfoPoliciesSection from "./components/SiteInfoPoliciesSection";
import SiteInfoShippingNote from "./components/SiteInfoShippingNote";

/* ───────── Zod schema ───────── */
const optionalEmail = z
    .string()
    .trim()
    .max(255)
    .refine(
        (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        "Please enter a valid email",
    )
    .optional()
    .or(z.literal(""));

const optionalUrl = z
    .string()
    .trim()
    .refine(
        (v) => !v || /^https?:\/\//i.test(v),
        "Must start with http:// or https://",
    )
    .optional()
    .or(z.literal(""));

const dayHoursSchema = z.object({
    open: z.string().optional().or(z.literal("")),
    close: z.string().optional().or(z.literal("")),
    isOpen: z.boolean(),
});

const schema = z.object({
    email: optionalEmail,
    phone: z.string().trim().optional().or(z.literal("")),
    whatsapp: z.string().trim().optional().or(z.literal("")),
    en: z.object({
        siteName: z.string().trim().min(1, "English site name is required"),
        address: z.string().optional().or(z.literal("")),
        freeExchage: z.string().optional().or(z.literal("")),
    }),
    ar: z.object({
        siteName: z.string().trim().min(1, "Arabic site name is required"),
        address: z.string().optional().or(z.literal("")),
        freeExchage: z.string().optional().or(z.literal("")),
    }),
    contactMethods: z
        .array(
            z.object({
                type: z.string(),
                label: z.string().optional().or(z.literal("")),
                value: z.string().trim().min(1, "Value is required"),
                url: z.string().optional().or(z.literal("")),
                isPrimary: z.boolean().optional(),
            }),
        )
        .default([]),
    socialLinks: z.object({
        facebook: optionalUrl,
        instagram: optionalUrl,
        twitter: optionalUrl,
        linkedin: optionalUrl,
        youtube: optionalUrl,
        tiktok: optionalUrl,
    }),
    extraInfo: z.object({
        supportEmail: optionalEmail,
        businessHours: z.object({
            monday: dayHoursSchema,
            tuesday: dayHoursSchema,
            wednesday: dayHoursSchema,
            thursday: dayHoursSchema,
            friday: dayHoursSchema,
            saturday: dayHoursSchema,
            sunday: dayHoursSchema,
        }),
        returnPolicy: z.string().optional().or(z.literal("")),
        warranty: z.string().optional().or(z.literal("")),
        paymentMethods: z.array(z.string()).default([]),
    }),
});

const SiteInfoTab = () => {
    const { data: siteInfo, isLoading } = useSiteInfo();
    const updateMutation = useUpdateSiteInfo();
    const toggleCodMutation = useToggleCod();
    const isSubmitting = updateMutation.isPending;
    const isTogglingCod = toggleCodMutation.isPending;

    const defaultValues = useMemo(
        () => (siteInfo ? mapSiteInfoToForm(siteInfo) : SITE_INFO_DEFAULTS),
        [siteInfo],
    );

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors, isDirty },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues,
    });

    useEffect(() => {
        if (siteInfo && !isDirty) {
            reset(mapSiteInfoToForm(siteInfo));
        }
    }, [siteInfo, reset, isDirty]);

    const onSubmit = async (values) => {
        const payload = buildSiteInfoPayload(values);
        try {
            await updateMutation.mutateAsync(payload);
            reset(values);
        } catch {
            // handled in mutation hook
        }
    };

    const handleToggleCod = () => {
        toggleCodMutation.mutate();
    };

    const handleReset = () => {
        if (siteInfo) reset(mapSiteInfoToForm(siteInfo));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center rounded-2xl border border-black/5 bg-white py-24 shadow-rds-sm">
                <Loader2 size={24} className="animate-spin text-main" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pb-24">
            <SiteInfoBasicSection control={control} errors={errors} />
            <SiteInfoContactsSection control={control} errors={errors} />
            <SiteInfoSocialSection control={control} errors={errors} />
            <SiteInfoBusinessHoursSection
                control={control}
                setValue={setValue}
                getValues={getValues}
            />
            <SiteInfoPoliciesSection
                control={control}
                errors={errors}
                codOpen={Boolean(siteInfo?.codOpen)}
                onToggleCod={handleToggleCod}
                isTogglingCod={isTogglingCod}
            />

            <SiteInfoShippingNote />


            {/* Sticky footer */}
            <div className="sticky bottom-4 z-10 flex flex-col items-stretch justify-between gap-3 rounded-2xl border border-black/5 bg-white px-5 py-4 shadow-rds-lg sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 text-xs">
                    {isDirty ? (
                        <>
                            <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
                            <span className="font-medium text-soft-black">
                                You have unsaved changes
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="inline-block h-2 w-2 rounded-full bg-main" />
                            <span className="text-secondary">All changes saved</span>
                        </>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={!isDirty || isSubmitting}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-5 text-sm font-medium text-soft-black transition hover:border-black/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RotateCcw size={15} />
                        Reset
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting || !isDirty}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-main px-6 text-sm font-semibold text-white shadow-rds-cta transition hover:brightness-95 hover:shadow-rds-cta-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Save size={15} />
                        )}
                        Save Changes
                    </button>
                </div>
            </div>
        </form>
    );
};

export default SiteInfoTab;