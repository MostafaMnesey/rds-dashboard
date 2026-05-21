import { useState } from "react";
import { Pencil, Trash2, Copy, Check } from "lucide-react";

const CouponRowActions = ({ code, onEdit, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={handleCopy}
        title={copied ? "Copied!" : "Copy code"}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition ${
          copied
            ? "bg-main/10 text-main"
            : "text-secondary hover:bg-black/[0.04] hover:text-soft-black"
        }`}
        aria-label="Copy code"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-secondary transition hover:bg-black/[0.04] hover:text-soft-black"
        aria-label="Edit coupon"
      >
        <Pencil size={16} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-secondary transition hover:bg-red-50 hover:text-red-600"
        aria-label="Delete coupon"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default CouponRowActions;
