import { useState } from "react";
import { Controller } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import Input from "../../../components/ui/Input";
import KeywordsInput from "../../../components/ui/KeywordsInput";
import { SUPPORTED_LANGS } from "../data/constants";
import { slugify } from "../utils";

const CategoryTranslationsTabs = ({ control, setValue, watch, errors }) => {
  const [activeLang, setActiveLang] = useState(SUPPORTED_LANGS[0].code);
  const [seoOpen, setSeoOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Language Tabs */}
      <div className="flex gap-1 rounded-xl bg-[#fafaf9] p-1">
        {SUPPORTED_LANGS.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setActiveLang(lang.code)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeLang === lang.code
                ? "bg-white text-soft-black shadow-rds-sm"
                : "text-secondary hover:text-soft-black"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Translation fields */}
      {SUPPORTED_LANGS.map((lang, index) => (
        <div
          key={lang.code}
          className={`space-y-4 ${activeLang === lang.code ? "block" : "hidden"}`}
        >
          {/* Title */}
          <Controller
            name={`translations.${index}.title`}
            control={control}
            render={({ field }) => (
              <Input
                label={`Title (${lang.label})`}
                required
                placeholder={lang.code === "ar" ? "العنوان" : "Category title"}
                value={field.value}
                onChange={(e) => {
                  field.onChange(e);
                  const slugField = `translations.${index}.slug`;
                  const currentSlug = watch(slugField);
                  if (!currentSlug) {
                    setValue(slugField, slugify(e.target.value));
                  }
                }}
                error={errors?.translations?.[index]?.title?.message}
                inputClassName={lang.dir === "rtl" ? "text-right" : ""}
              />
            )}
          />

          {/* Slug */}
          <Controller
            name={`translations.${index}.slug`}
            control={control}
            render={({ field }) => (
              <Input
                label={`Slug (${lang.label})`}
                placeholder="auto-generated-slug"
                hint="Used in URLs. Auto-generated from title if left empty."
                {...field}
              />
            )}
          />

          {/* SEO Section */}
          <div className="overflow-hidden rounded-xl border border-black/5 bg-[#fafaf9]">
            <button
              type="button"
              onClick={() => setSeoOpen((v) => !v)}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-black/[0.02]"
            >
              <span className="text-sm font-semibold text-soft-black">
                SEO Settings
              </span>
              <ChevronDown
                size={16}
                className={`text-secondary transition ${seoOpen ? "rotate-180" : ""}`}
              />
            </button>

            {seoOpen && (
              <div className="space-y-4 border-t border-black/5 bg-white px-4 py-4">
                <Controller
                  name={`translations.${index}.meta_title`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Meta Title"
                      placeholder="SEO title"
                      {...field}
                      inputClassName={lang.dir === "rtl" ? "text-right" : ""}
                    />
                  )}
                />

                <Controller
                  name={`translations.${index}.meta_description`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="textarea"
                      label="Meta Description"
                      placeholder="A short description for search engines"
                      rows={3}
                      {...field}
                      inputClassName={lang.dir === "rtl" ? "text-right" : ""}
                    />
                  )}
                />

                <Controller
                  name={`translations.${index}.meta_keywords`}
                  control={control}
                  render={({ field }) => (
                    <KeywordsInput
                      label="Meta Keywords"
                      placeholder="Type a keyword and press Enter"
                      hint="Press Enter or comma to add. Click × to remove."
                      value={field.value}
                      onChange={field.onChange}
                      dir={lang.dir}
                    />
                  )}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryTranslationsTabs;
