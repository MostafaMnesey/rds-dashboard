import { memo } from "react";
import { Badge } from "../../../components/ui";
import { STATUS_VARIANTS } from "../data/constants";

const OrderStatusTag = ({ status }) => {
  const variant = STATUS_VARIANTS[status] || "neutral";
  return (
    <Badge variant={variant} size="md">
      {status}
    </Badge>
  );
};

export default memo(OrderStatusTag);
