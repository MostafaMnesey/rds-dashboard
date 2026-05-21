import { useState } from "react";
import { Controller } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import Input from "../../../components/ui/Input";
import KeywordsInput from "../../../components/ui/KeywordsInput";
import RichTextEditor from "../../../components/ui/RichTextEditor";
import { SUPPORTED_LANGS, BLOG_CATEGORIES } from "../data/constants";

const categoryOptions = BLOG_CATEGORIES.map((c) => ({
  value: c,
  label: c,
}));

const BlogTranslationsTabs = ({ control, errors }) => {
  const [activeLang, setActiveLang] = useState(SUPPORTED_LANGS[0].code);
  const [seoOpen, setSeoOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Tabs */}
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
                placeholder={lang.code === "ar" ? "العنوان" : "Blog title"}
                value={field.value}
                onChange={field.onChange}
                error={errors?.translations?.[index]?.title?.message}
                inputClassName={lang.dir === "rtl" ? "text-right" : ""}
              />
            )}
          />

          {/* Category */}
          <Controller
            name={`translations.${index}.category`}
            control={control}
            render={({ field }) => (
              <Input
                type="select"
                label={`Category (${lang.label})`}
                placeholder="Select category"
                value={field.value || undefined}
                onChange={field.onChange}
                options={categoryOptions}
                allowClear
                showSearch
              />
            )}
          />

          {/* Excerpt / Content — Rich Text */}
          <Controller
            name={`translations.${index}.excerpt`}
            control={control}
            render={({ field }) => (
              <RichTextEditor
                label={`Content (${lang.label})`}
                placeholder={
                  lang.code === "ar"
                    ? "ابدأ بكتابة المقال..."
                    : "Start writing your blog..."
                }
                hint="Use the toolbar to format text, add headings, lists, links and images."
                value={field.value}
                onChange={field.onChange}
                dir={lang.dir}
                minHeight={280}
              />
            )}
          />

          {/* SEO */}
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
                      hint="Press Enter or comma to add."
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

export default BlogTranslationsTabs;
