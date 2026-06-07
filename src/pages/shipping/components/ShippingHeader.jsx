import { memo } from "react";
import PageHeader from "../../../components/ui/PageHeader";

const ShippingHeader = ({ configuredCount }) => {
  const subtitle =
    configuredCount === 0
      ? "No shipping methods configured yet"
      : `${configuredCount} of 2 shipping methods configured`;

  return <PageHeader title="Shipping" subtitle={subtitle} />;
};

export default memo(ShippingHeader);
