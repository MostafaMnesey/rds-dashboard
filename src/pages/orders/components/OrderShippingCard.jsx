import { memo } from "react";
import { MapPin, Phone, Mail, FileText } from "lucide-react";
import { fullName, formatAddress } from "../utils/formatters";

const Field = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-2.5">
    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#fafaf9]">
      <Icon size={14} className="text-secondary" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary">
        {label}
      </p>
      <p className="mt-0.5 text-sm text-soft-black break-words">
        {value || "—"}
      </p>
    </div>
  </div>
);

const OrderShippingCard = ({ shippingAddress }) => {
  if (!shippingAddress) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white p-5">
        <h3 className="mb-2 text-sm font-semibold text-soft-black">
          Shipping Address
        </h3>
        <p className="text-sm text-secondary">No shipping address provided</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <h3 className="mb-2 text-sm font-semibold text-soft-black">
        Shipping Address
      </h3>
      <Field
        icon={MapPin}
        label="Recipient"
        value={fullName(shippingAddress)}
      />
      <Field icon={Phone} label="Phone" value={shippingAddress.phone} />
      <Field icon={Mail} label="Email" value={shippingAddress.email} />
      <Field
        icon={MapPin}
        label="Address"
        value={formatAddress(shippingAddress)}
      />
      {shippingAddress.deliveryNotes && (
        <Field
          icon={FileText}
          label="Delivery Notes"
          value={shippingAddress.deliveryNotes}
        />
      )}
    </div>
  );
};

export default memo(OrderShippingCard);
