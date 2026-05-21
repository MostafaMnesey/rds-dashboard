import { memo, forwardRef, useId } from "react";
import { Input as AntInput, Select as AntSelect, InputNumber } from "antd";
import { Search, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Label from "./Label";

const { TextArea, Password } = AntInput;

const SIZE_MAP = {
  sm: "small",
  md: "middle",
  lg: "large",
};

const Input = forwardRef(
  (
    {
      type = "text",
      label,
      required = false,
      error,
      hint,
      size = "md",
      prefix,
      suffix,
      className = "",
      inputClassName = "",
      id,
      // select-specific
      options = [],
      allowClear = false,
      showSearch = false,
      mode,
      // number-specific
      min,
      max,
      step,
      // textarea-specific
      rows = 4,
      autoSize,
      // input
      onChange,
      value,
      placeholder,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const reactId = useId();
    const fieldId = id || reactId;
    const antSize = SIZE_MAP[size] || "middle";

    const statusProp = error ? { status: "error" } : {};

    /* ---------- helpers ---------- */
    const renderControl = () => {
      const sharedProps = {
        id: fieldId,
        ref,
        size: antSize,
        disabled,
        placeholder,
        className: `w-full ${inputClassName}`,
        ...statusProp,
        ...rest,
      };

      switch (type) {
        case "password":
          return (
            <Password
              {...sharedProps}
              value={value}
              onChange={onChange}
              prefix={prefix}
              iconRender={(visible) =>
                visible ? <EyeOff size={16} /> : <Eye size={16} />
              }
            />
          );

        case "number":
          return (
            <InputNumber
              {...sharedProps}
              value={value}
              onChange={onChange}
              min={min}
              max={max}
              step={step}
              controls={false}
              prefix={prefix}
            />
          );

        case "textarea":
          return (
            <TextArea
              {...sharedProps}
              value={value}
              onChange={onChange}
              rows={rows}
              autoSize={autoSize}
              style={{ resize: "vertical" }}
            />
          );

        case "select":
        case "multi-select":
          return (
            <AntSelect
              {...sharedProps}
              value={value}
              onChange={onChange}
              options={options}
              allowClear={allowClear}
              showSearch={showSearch}
              mode={type === "multi-select" ? "multiple" : mode}
              optionFilterProp="label"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          );

        case "search":
          return (
            <AntInput
              {...sharedProps}
              value={value}
              onChange={onChange}
              prefix={prefix ?? <Search size={16} className="text-secondary" />}
              suffix={suffix}
              allowClear
            />
          );

        // text, email, url, tel, etc.
        default:
          return (
            <AntInput
              {...sharedProps}
              type={type}
              value={value}
              onChange={onChange}
              prefix={prefix}
              suffix={suffix}
            />
          );
      }
    };

    return (
      <div className={`flex flex-col ${className}`}>
        {label && (
          <Label htmlFor={fieldId} required={required}>
            {label}
          </Label>
        )}

        {renderControl()}

        {error ? (
          <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-secondary">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";

export default memo(Input);
