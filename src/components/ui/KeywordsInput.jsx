import { memo, useState, useId } from "react";
import { Plus, X } from "lucide-react";
import Label from "./Label";

const KeywordsInput = ({
  label,
  required = false,
  value = [],
  onChange,
  error,
  hint,
  placeholder = "Add a keyword and press Enter",
  dir = "ltr",
  id,
  className = "",
}) => {
  const reactId = useId();
  const fieldId = id || reactId;
  const [draft, setDraft] = useState("");

  const keywords = Array.isArray(value) ? value : [];

  const addKeyword = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    // Support pasting comma-separated values
    const parts = trimmed
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    const unique = parts.filter(
      (p) => !keywords.some((k) => k.toLowerCase() === p.toLowerCase()),
    );

    if (unique.length) {
      onChange?.([...keywords, ...unique]);
    }
    setDraft("");
  };

  const removeKeyword = (index) => {
    const next = keywords.filter((_, i) => i !== index);
    onChange?.(next);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword();
    } else if (e.key === "Backspace" && !draft && keywords.length) {
      removeKeyword(keywords.length - 1);
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
      )}

      <div
        className={`flex min-h-[44px] flex-wrap items-center gap-2 rounded-xl border bg-white px-2 py-2 transition focus-within:shadow-[0_0_0_2px_rgba(104,188,82,0.1)] ${
          error
            ? "border-red-400 focus-within:border-red-500"
            : "border-black/10 focus-within:border-main"
        }`}
      >
        {keywords.map((keyword, index) => (
          <span
            key={`${keyword}-${index}`}
            className="inline-flex items-center gap-1 rounded-lg bg-main/10 px-2.5 py-1 text-xs font-medium text-main"
            dir={dir}
          >
            {keyword}
            <button
              type="button"
              onClick={() => removeKeyword(index)}
              className="inline-flex h-4 w-4 items-center justify-center rounded-full text-main/70 transition hover:bg-main/20 hover:text-main"
              aria-label={`Remove ${keyword}`}
            >
              <X size={11} strokeWidth={2.5} />
            </button>
          </span>
        ))}

        <input
          id={fieldId}
          type="text"
          dir={dir}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addKeyword}
          placeholder={keywords.length === 0 ? placeholder : ""}
          className="min-w-[120px] flex-1 bg-transparent px-1 text-sm text-soft-black outline-none placeholder:text-secondary/70"
        />

        <button
          type="button"
          onClick={addKeyword}
          disabled={!draft.trim()}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-main/10 text-main transition hover:bg-main/20 disabled:cursor-not-allowed disabled:bg-black/[0.04] disabled:text-secondary/60"
          aria-label="Add keyword"
        >
          <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>

      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-secondary">{hint}</p>
      ) : null}
    </div>
  );
};

export default memo(KeywordsInput);
