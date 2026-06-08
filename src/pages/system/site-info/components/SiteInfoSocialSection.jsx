import { memo } from "react";
import { Controller } from "react-hook-form";
import { Share2 } from "lucide-react";
import SiteInfoSection from "./SiteInfoSection";
import { SOCIAL_PLATFORMS } from "../data/constants";

const SiteInfoSocialSection = ({ control, errors }) => {
    return (
        <SiteInfoSection
            icon={Share2}
            title="Social Links"
            description="Your social media profile URLs."
        >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {SOCIAL_PLATFORMS.map((p) => {
                    const Icon = p.icon;
                    return (
                        <Controller
                            key={p.key}
                            name={`socialLinks.${p.key}`}
                            control={control}
                            render={({ field }) => (
                                <div>
                                    <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                                        <Icon size={14} className={p.accent} />
                                        {p.label}
                                    </label>
                                    <input
                                        {...field}
                                        type="url"
                                        placeholder={p.placeholder}
                                        className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-soft-black outline-none transition placeholder:text-secondary/60 focus:border-main focus:ring-2 focus:ring-main/15"
                                    />
                                    {errors?.socialLinks?.[p.key]?.message && (
                                        <p className="mt-1.5 text-xs text-red-600">
                                            {errors.socialLinks[p.key].message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                    );
                })}
            </div>
        </SiteInfoSection>
    );
};

export default memo(SiteInfoSocialSection);