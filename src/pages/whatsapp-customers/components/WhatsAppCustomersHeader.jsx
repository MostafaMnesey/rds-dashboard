import { memo } from "react";
import { MessageCircle, Plus } from "lucide-react";

const WhatsAppCustomersHeader = ({ totalCount = 0, onCreate }) => {
    return (
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">

                <div className="min-w-0">
                    <h1 className="font-oswald text-3xl font-bold uppercase tracking-wide text-soft-black">
                        Customers
                    </h1>
                    <p className="mt-1 text-sm text-secondary">
                        {totalCount > 0
                            ? `${totalCount} ${totalCount === 1 ? "order" : "orders"} from WhatsApp`
                            : "Manage orders received via WhatsApp"}
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={onCreate}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-main px-5 text-sm font-semibold text-white shadow-rds-cta transition hover:brightness-95 hover:shadow-rds-cta-hover active:scale-95 sm:w-auto"
            >
                <Plus size={16} />
                New Order
            </button>
        </div>
    );
};

export default memo(WhatsAppCustomersHeader);