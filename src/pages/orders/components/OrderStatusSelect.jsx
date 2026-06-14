import { memo, useCallback } from "react";
import { Select } from "antd";
import { ORDER_STATUSES } from "../data/constants";

const OrderStatusSelect = ({
  value,
  onChange,
  loading = false,
  size = "small",
}) => {
  // Stop the click on the option from bubbling up to the row
  const stop = useCallback((e) => e.stopPropagation(), []);

  const handleChange = useCallback(
    (next) => {
      onChange?.(next);
    },
    [onChange],
  );

  return (
    <div onClick={stop} onMouseDown={stop}>
      <Select
        size={size}
        value={value}
        onChange={handleChange}
        loading={loading}
        disabled={loading}
        options={ORDER_STATUSES}
        getPopupContainer={() => document.body}
        popupMatchSelectWidth={false}
        style={{ width: 130 }}
        // getPopupContainer={(trigger) => trigger.parentNode}
        dropdownRender={(menu) => (
          <div onClick={stop} onMouseDown={stop}>
            {menu}
          </div>
        )}
      />
    </div>
  );
};

export default memo(OrderStatusSelect);
