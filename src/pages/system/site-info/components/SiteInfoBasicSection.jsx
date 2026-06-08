import { memo, useState } from "react";
import { Controller } from "react-hook-form";
import { Building2 } from "lucide-react";
import Input from "../../../../components/ui/Input";
import PhoneInput from "../../../../components/ui/PhoneInput";
import SiteInfoSection from "./SiteInfoSection";
import { SITE_INFO_LANGS } from "../data/constants";

const SiteInfoBasicSection = ({ control, errors }) => {
    const [activeLang, setActiveLang] = useState("en");
    const isAr = activeLang === "ar";

    return (
        <SiteInfoSection
            icon={Building2}
            title="Basic Information"
            description="Core details that appear on your storefront."
        >
            {/* Contacts */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="email"
                            label="Main Email"
                            placeholder="info@example.com"
                            {...field}
                            error={errors?.email?.message}
                        />
                    )}
                />

                <Controller
                    name="extraInfo.supportEmail"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="email"
                            label="Support Email"
                            placeholder="support@example.com"
                            {...field}
                            error={errors?.extraInfo?.supportEmail?.message}
                        />
                    )}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                        <PhoneInput
                            label="Phone Number"
                            value={field.value}
                            onChange={field.onChange}
                            country="ae"
                            error={errors?.phone?.message}
                        />
                    )}
                />

                <Controller
                    name="whatsapp"
                    control={control}
                    render={({ field }) => (
                        <PhoneInput
                            label="WhatsApp Number"
                            value={field.value}
                            onChange={field.onChange}
                            country="ae"
                            error={errors?.whatsapp?.message}
                        />
                    )}
                />
            </div>

            {/* Translations divider */}
            <div className="border-t border-black/5 pt-5">
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                            Translations
                        </p>
                        <p className="mt-0.5 text-xs text-secondary/80">
                            Site name and address shown in each language.
                        </p>
                    </div>

                    <div className="inline-flex gap-1 rounded-xl bg-[#fafaf9] p-1">
                        {SITE_INFO_LANGS.map((lang) => {
                            const isActive = activeLang === lang.code;
                            return (
                                <button
                                    key={lang.code}
                                    type="button"
                                    onClick={() => setActiveLang(lang.code)}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${isActive
                                            ? "bg-white text-soft-black shadow-rds-sm"
                                            : "text-secondary hover:text-soft-black"
                                        }`}
                                >
                                    {lang.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* EN fields */}
                <div className={activeLang === "en" ? "space-y-4" : "hidden"}>
                    <Controller
                        name="en.siteName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                label="Site Name"
                                required
                                placeholder="e.g. Al Reaya Al Owla Medicine"
                                {...field}
                                error={errors?.en?.siteName?.message}
                            />
                        )}
                    />
                    <Controller
                        name="en.address"
                        control={control}
                        render={({ field }) => (
                            <Input
                                label="Address"
                                placeholder="Shop 2, Salim Al Owis Building, Sharjah, UAE"
                                {...field}
                                error={errors?.en?.address?.message}
                            />
                        )}
                    />
                </div>

                {/* AR fields */}
                <div
                    className={activeLang === "ar" ? "space-y-4" : "hidden"}
                    dir="rtl"
                >
                    <Controller
                        name="ar.siteName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                label="اسم الموقع"
                                required
                                placeholder="مثال: الصيدلية الأولى للمنتجات الطبية"
                                {...field}
                                error={errors?.ar?.siteName?.message}
                            />
                        )}
                    />
                    <Controller
                        name="ar.address"
                        control={control}
                        render={({ field }) => (
                            <Input
                                label="العنوان"
                                placeholder="المحل 2، بناية سالم العويس، الشارقة، الإمارات"
                                {...field}
                                error={errors?.ar?.address?.message}
                            />
                        )}
                    />
                </div>

                {/* Validation hint for hidden tab */}
                {isAr
                    ? errors?.en?.siteName?.message && (
                        <p className="mt-2 text-xs text-red-600">
                            Missing English site name — switch to the English tab.
                        </p>
                    )
                    : errors?.ar?.siteName?.message && (
                        <p className="mt-2 text-xs text-red-600">
                            Missing Arabic site name — switch to the Arabic tab.
                        </p>
                    )}
            </div>
        </SiteInfoSection>
    );
};

export default memo(SiteInfoBasicSection);