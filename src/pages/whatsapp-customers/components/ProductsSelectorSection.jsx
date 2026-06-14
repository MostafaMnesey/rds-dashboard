import { memo, useCallback } from "react";
import { useWatch } from "react-hook-form";
import { Package } from "lucide-react";
import WhatsAppFormSection from "./WhatsAppFormSection";
import ProductSearchDropdown from "./ProductSearchDropdown";
import SelectedProductsList from "./SelectedProductsList";

const ProductsSelectorSection = ({ control, setValue, getValues, errors }) => {
    const items = useWatch({ control, name: "items" }) || [];
    const selectedIds = items.map((it) => it.productId);

    const handleAdd = useCallback(
        (product) => {
            const current = getValues("items") || [];
            // If product already exists, just increase qty
            const existingIdx = current.findIndex((it) => it.productId === product.id);
            if (existingIdx > -1) {
                const updated = [...current];
                updated[existingIdx] = {
                    ...updated[existingIdx],
                    quantity: (Number(updated[existingIdx].quantity) || 1) + 1,
                };
                setValue("items", updated, { shouldDirty: true, shouldValidate: true });
                return;
            }
            setValue(
                "items",
                [
                    ...current,
                    {
                        productId: product.id,
                        quantity: 1,
                        _product: product,
                    },
                ],
                { shouldDirty: true, shouldValidate: true },
            );
        },
        [getValues, setValue],
    );

    const handleQtyChange = useCallback(
        (index, qty) => {
            const current = getValues("items") || [];
            const updated = [...current];
            if (!updated[index]) return;
            updated[index] = { ...updated[index], quantity: qty };
            setValue("items", updated, { shouldDirty: true });
        },
        [getValues, setValue],
    );

    const handleRemove = useCallback(
        (index) => {
            const current = getValues("items") || [];
            const updated = current.filter((_, i) => i !== index);
            setValue("items", updated, { shouldDirty: true, shouldValidate: true });
        },
        [getValues, setValue],
    );

    const itemsError = errors?.items?.message;

    return (
        <WhatsAppFormSection
            icon={Package}
            title="Products"
            description="Search and add the products the customer wants to order."
            badge={
                items.length > 0 && (
                    <span className="rounded-full bg-main/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-main">
                        {items.length} {items.length === 1 ? "item" : "items"}
                    </span>
                )
            }
        >
            <ProductSearchDropdown onAdd={handleAdd} selectedIds={selectedIds} />

            <SelectedProductsList
                items={items}
                onQtyChange={handleQtyChange}
                onRemove={handleRemove}
            />

            {itemsError && (
                <p className="text-xs text-red-600">{itemsError}</p>
            )}
        </WhatsAppFormSection>
    );
};

export default memo(ProductsSelectorSection);