import { memo, useState, useRef, useEffect } from "react";
import { Controller, useWatch } from "react-hook-form";
import { Sparkles } from "lucide-react";
import Input from "../../../components/ui/Input";
import ProductContentSections from "./ProductContentSections";
import { SUPPORTED_LANGS } from "../data/constants";
import { autoSlug, buildHref } from "../utils";

const LanguageFields = ({ lang, control, setValue, errors }) => {
  const isRtl = lang.dir === "rtl";
  const inputClass = isRtl ? "text-right" : "";
  const langCode = lang.code;

  const title = useWatch({ control, name: `${langCode}.title` }) || "";
  const slug = useWatch({ control, name: `${langCode}.slug` }) || "";

  const manuallyEditedRef = useRef(Boolean(slug));

  useEffect(() => {
    if (manuallyEditedRef.current) return;
    const next = autoSlug(title, langCode);
    if (next !== slug) {
      setValue(`${langCode}.slug`, next, { shouldDirty: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  const handleSlugChange = (value) => {
    manuallyEditedRef.current = true;
    setValue(`${langCode}.slug`, value, { shouldDirty: true });
  };

  const handleRegenerate = () => {
    manuallyEditedRef.current = false;
    setValue(`${langCode}.slug`, autoSlug(title, langCode), {
      shouldDirty: true,
    });
  };

  const href = buildHref(slug, langCode, "products");

  return (
    <div className="space-y-5">
      {/* Title */}
      <Controller
        name={`${langCode}.title`}
        control={control}
        render={({ field }) => (
          <Input
            label={`Title (${lang.label})`}
            required
            placeholder={isRtl ? "اسم المنتج" : "Product title"}
            {...field}
            inputClassName={inputClass}
            error={errors?.[langCode]?.title?.message}
          />
        )}
      />

      {/* Slug */}
      <div className="space-y-2">
        <Controller
          name={`${langCode}.slug`}
          control={control}
          render={({ field }) => (
            <Input
              label={`Slug (${lang.label})`}
              placeholder={
                isRtl ? "سيتم توليده تلقائيًا" : "Auto-generated from title"
              }
              hint="Used in the product URL. Edit it if you want a custom one."
              value={field.value}
              onChange={(e) => handleSlugChange(e.target.value)}
              inputClassName={`font-mono ${inputClass}`}
            />
          )}
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={!title}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-main transition hover:brightness-90 disabled:cursor-not-allowed disabled:text-secondary/60"
          >
            <Sparkles size={11} />
            Regenerate from title
          </button>

          {slug && (
            <span className="break-all font-mono text-[10px] text-secondary">
              <span className="text-secondary/60">URL: </span>
              {href}
            </span>
          )}
        </div>
      </div>

      {/* Short Description */}
      <Controller
        name={`${langCode}.shortDescription`}
        control={control}
        render={({ field }) => (
          <Input
            type="textarea"
            label={`Short Description (${lang.label})`}
            placeholder={
              isRtl
                ? "وصف قصير للمنتج"
                : "A short description shown in product cards"
            }
            rows={3}
            {...field}
            inputClassName={inputClass}
          />
        )}
      />

      {/* Content Sections (rich + bullets + table) */}
      <div>
        <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
          Content Sections ({lang.label})
        </label>
        <ProductContentSections
          langCode={langCode}
          isRtl={isRtl}
          control={control}
          setValue={setValue}
        />
      </div>
    </div>
  );
};

const ProductTranslationsTabs = ({ control, setValue, errors }) => {
  const [activeLang, setActiveLang] = useState(SUPPORTED_LANGS[0].code);

  return (
    <div className="space-y-4">
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

      {SUPPORTED_LANGS.map((lang) => (
        <div
          key={lang.code}
          className={activeLang === lang.code ? "block" : "hidden"}
        >
          <LanguageFields
            lang={lang}
            control={control}
            setValue={setValue}
            errors={errors}
          />
        </div>
      ))}
    </div>
  );
};

export default memo(ProductTranslationsTabs);
