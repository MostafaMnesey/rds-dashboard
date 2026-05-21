import { memo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { Plus, X, Trash2, GripVertical } from "lucide-react";
import Input from "../../../components/ui/Input";
import RichTextEditor from "../../../components/ui/RichTextEditor";

const SectionCard = ({ title, badge, children }) => (
  <div className="rounded-2xl border border-black/5 bg-white shadow-rds-sm">
    <div className="flex items-center justify-between gap-3 border-b border-black/5 px-4 py-3">
      <h4 className="text-sm font-semibold text-soft-black">{title}</h4>
      {badge && (
        <span className="rounded-full bg-main/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-main">
          {badge}
        </span>
      )}
    </div>
    <div className="p-4">{children}</div>
  </div>
);

/* ============================================
 * BULLETS Editor
 * ============================================ */
const BulletsEditor = ({ control, setValue, langCode, isRtl }) => {
  const inputClass = isRtl ? "text-right" : "";
  const items =
    useWatch({ control, name: `${langCode}.sections.bullets.items` }) || [];

  const addItem = () => {
    setValue(`${langCode}.sections.bullets.items`, [...items, ""], {
      shouldDirty: true,
    });
  };

  const updateItem = (idx, value) => {
    const next = [...items];
    next[idx] = value;
    setValue(`${langCode}.sections.bullets.items`, next, { shouldDirty: true });
  };

  const removeItem = (idx) => {
    setValue(
      `${langCode}.sections.bullets.items`,
      items.filter((_, i) => i !== idx),
      { shouldDirty: true },
    );
  };

  return (
    <SectionCard title="Bullet List" badge="bullets">
      <Controller
        name={`${langCode}.sections.bullets.title`}
        control={control}
        render={({ field }) => (
          <Input
            label="Section Title"
            placeholder={isRtl ? "الفوائد الرئيسية" : "Key Benefits"}
            {...field}
            inputClassName={inputClass}
          />
        )}
      />

      <div className="mt-4 space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
          Items
        </label>

        {items.length === 0 && (
          <p className="rounded-xl border border-dashed border-black/10 bg-[#fafaf9] px-4 py-6 text-center text-xs text-secondary">
            No items yet. Click "Add Item" below.
          </p>
        )}

        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="flex h-8 w-6 shrink-0 items-center justify-center text-secondary">
                <GripVertical size={14} />
              </span>
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(idx, e.target.value)}
                placeholder={isRtl ? `العنصر ${idx + 1}` : `Item ${idx + 1}`}
                dir={isRtl ? "rtl" : "ltr"}
                className={`h-10 flex-1 rounded-lg border border-black/10 bg-white px-3 text-sm text-soft-black outline-none transition placeholder:text-secondary/70 focus:border-main focus:shadow-[0_0_0_2px_rgba(104,188,82,0.1)] ${inputClass}`}
                style={{ fontSize: "16px" }}
              />
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-secondary transition hover:bg-red-50 hover:text-red-600"
                aria-label="Remove item"
              >
                <X size={15} />
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={addItem}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-main/10 px-3 py-1.5 text-xs font-semibold text-main transition hover:bg-main/20"
        >
          <Plus size={13} />
          Add Item
        </button>
      </div>
    </SectionCard>
  );
};

/* ============================================
 * TABLE Editor
 * ============================================ */
const TableEditor = ({ control, setValue, langCode, isRtl }) => {
  const inputClass = isRtl ? "text-right" : "";
  const columns =
    useWatch({ control, name: `${langCode}.sections.table.columns` }) || [];
  const rows =
    useWatch({ control, name: `${langCode}.sections.table.rows` }) || [];

  const updateColumn = (idx, value) => {
    const next = [...columns];
    next[idx] = value;
    setValue(`${langCode}.sections.table.columns`, next, { shouldDirty: true });
  };

  const addColumn = () => {
    const next = [...columns, ""];
    const updatedRows = rows.map((r) => [...r, ""]);
    setValue(`${langCode}.sections.table.columns`, next, { shouldDirty: true });
    setValue(`${langCode}.sections.table.rows`, updatedRows, {
      shouldDirty: true,
    });
  };

  const removeColumn = (idx) => {
    if (columns.length <= 1) return;
    const next = columns.filter((_, i) => i !== idx);
    const updatedRows = rows.map((r) => r.filter((_, i) => i !== idx));
    setValue(`${langCode}.sections.table.columns`, next, { shouldDirty: true });
    setValue(`${langCode}.sections.table.rows`, updatedRows, {
      shouldDirty: true,
    });
  };

  const addRow = () => {
    const newRow = columns.map(() => "");
    setValue(`${langCode}.sections.table.rows`, [...rows, newRow], {
      shouldDirty: true,
    });
  };

  const updateCell = (rowIdx, colIdx, value) => {
    const next = rows.map((r) => [...r]);
    if (!next[rowIdx]) next[rowIdx] = columns.map(() => "");
    next[rowIdx][colIdx] = value;
    setValue(`${langCode}.sections.table.rows`, next, { shouldDirty: true });
  };

  const removeRow = (idx) => {
    setValue(
      `${langCode}.sections.table.rows`,
      rows.filter((_, i) => i !== idx),
      { shouldDirty: true },
    );
  };

  return (
    <SectionCard title="Table" badge="table">
      <Controller
        name={`${langCode}.sections.table.title`}
        control={control}
        render={({ field }) => (
          <Input
            label="Section Title"
            placeholder={isRtl ? "تفاصيل المنتج" : "Product Details"}
            {...field}
            inputClassName={inputClass}
          />
        )}
      />

      {/* Columns editor */}
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
            Columns ({columns.length})
          </label>
          <button
            type="button"
            onClick={addColumn}
            className="inline-flex items-center gap-1 rounded-md bg-main/10 px-2 py-1 text-[11px] font-semibold text-main transition hover:bg-main/20"
          >
            <Plus size={11} />
            Add Column
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {columns.map((col, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 rounded-lg border border-black/10 bg-white px-2"
            >
              <input
                type="text"
                value={col}
                onChange={(e) => updateColumn(idx, e.target.value)}
                placeholder={`Col ${idx + 1}`}
                dir={isRtl ? "rtl" : "ltr"}
                className={`h-9 w-32 bg-transparent text-sm font-semibold text-soft-black outline-none placeholder:text-secondary/70 ${inputClass}`}
                style={{ fontSize: "16px" }}
              />
              <button
                type="button"
                onClick={() => removeColumn(idx)}
                disabled={columns.length <= 1}
                className="inline-flex h-6 w-6 items-center justify-center rounded text-secondary transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Remove column"
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Rows editor */}
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
            Rows ({rows.length})
          </label>
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-1 rounded-md bg-main/10 px-2 py-1 text-[11px] font-semibold text-main transition hover:bg-main/20"
          >
            <Plus size={11} />
            Add Row
          </button>
        </div>

        {rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-black/10 bg-[#fafaf9] px-4 py-6 text-center text-xs text-secondary">
            No rows yet. Click "Add Row" to start.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-black/5">
            <table className="w-full">
              <thead className="bg-[#fafaf9]">
                <tr>
                  {columns.map((col, idx) => (
                    <th
                      key={idx}
                      className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-secondary"
                    >
                      {col || `Col ${idx + 1}`}
                    </th>
                  ))}
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className="border-t border-black/5">
                    {columns.map((_, cIdx) => (
                      <td key={cIdx} className="p-1">
                        <input
                          type="text"
                          value={row?.[cIdx] || ""}
                          onChange={(e) =>
                            updateCell(rIdx, cIdx, e.target.value)
                          }
                          placeholder="—"
                          dir={isRtl ? "rtl" : "ltr"}
                          className={`h-9 w-full rounded-md border border-transparent bg-transparent px-2 text-sm text-soft-black outline-none transition hover:bg-[#fafaf9] focus:border-main focus:bg-white ${inputClass}`}
                          style={{ fontSize: "16px" }}
                        />
                      </td>
                    ))}
                    <td className="p-1">
                      <button
                        type="button"
                        onClick={() => removeRow(rIdx)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-secondary transition hover:bg-red-50 hover:text-red-600"
                        aria-label="Remove row"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SectionCard>
  );
};

/* ============================================
 * Main wrapper
 * ============================================ */
const ProductContentSections = ({ langCode, isRtl, control, setValue }) => {
  return (
    <div className="space-y-4">
      {/* RICH TEXT */}
      <SectionCard title="Rich Description" badge="rich text">
        <Controller
          name={`${langCode}.sections.rich.title`}
          control={control}
          render={({ field }) => (
            <Input
              label="Section Title"
              placeholder={isRtl ? "نظرة عامة على المنتج" : "Product Overview"}
              {...field}
              inputClassName={isRtl ? "text-right" : ""}
            />
          )}
        />

        <div className="mt-4">
          <Controller
            name={`${langCode}.sections.rich.content`}
            control={control}
            render={({ field }) => (
              <RichTextEditor
                label="Content"
                placeholder={
                  isRtl ? "اكتب وصفًا تفصيليًا..." : "Write detailed content..."
                }
                value={field.value}
                onChange={field.onChange}
                dir={isRtl ? "rtl" : "ltr"}
                minHeight={220}
              />
            )}
          />
        </div>
      </SectionCard>

      {/* BULLETS */}
      <BulletsEditor
        control={control}
        setValue={setValue}
        langCode={langCode}
        isRtl={isRtl}
      />

      {/* TABLE */}
      <TableEditor
        control={control}
        setValue={setValue}
        langCode={langCode}
        isRtl={isRtl}
      />
    </div>
  );
};

export default memo(ProductContentSections);
