import { memo } from "react";
import { Truck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const SiteInfoShippingNote = () => {
    return (
        <div className="flex items-start gap-3 rounded-2xl border border-dashed border-black/10 bg-white p-5 shadow-rds-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main">
                <Truck size={18} />
            </div>
            <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-soft-black">
                    Shipping & Business Hours
                </h4>
                <p className="mt-1 text-xs text-secondary">
                    Shipping prices are managed separately in the{" "}
                    <Link to="/shipping" className="inline-flex items-center gap-1 font-semibold text-main">
                        Shipping <ArrowRight size={11} />
                    </Link>{" "}
                    section. Business hours are coming soon.
                </p>
            </div>
        </div>
    );
};

export default memo(SiteInfoShippingNote);