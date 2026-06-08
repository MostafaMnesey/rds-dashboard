import { memo } from "react";
import * as PhoneInputModule from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// Handle Vite's interop between ESM/CJS for react-phone-input-2
const PhoneInput =
    PhoneInputModule.default?.default ||
    PhoneInputModule.default ||
    PhoneInputModule;

/**
 * Reusable phone input wrapped to match the RDS design system.
 * Built on top of react-phone-input-2.
 *
 * Props:
 * - value: string (e.g. "+971501234567")
 * - onChange: (value: string) => void  → returns "+971501234567"
 * - label, required, hint, error
 * - country: default country code (e.g. "ae")
 * - disabled
 */
const RDSPhoneInput = ({
    value = "",
    onChange,
    label,
    required = false,
    hint,
    error,
    country = "ae",
    disabled = false,
    placeholder,
}) => {
    const handleChange = (val) => {
        // Always emit "+xxxxxxxxx" format for backend consistency
        const normalized = val ? (val.startsWith("+") ? val : `+${val}`) : "";
        onChange?.(normalized);
    };

    return (
        <div className="w-full">
            {label && (
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                    {label}
                    {required && <span className="ml-0.5 text-red-500">*</span>}
                </label>
            )}

            <div className={`rds-phone-input ${error ? "has-error" : ""}`}>
                <PhoneInput
                    country={country}
                    value={value || ""}
                    onChange={handleChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    enableSearch
                    countryCodeEditable={false}
                    preferredCountries={["ae", "sa", "eg", "kw", "qa", "om", "bh"]}
                    inputProps={{
                        autoComplete: "tel",
                    }}
                    containerClass="!w-full"
                    inputClass="rds-phone-input__input"
                    buttonClass="rds-phone-input__button"
                    dropdownClass="rds-phone-input__dropdown"
                    searchClass="rds-phone-input__search"
                />
            </div>

            {error ? (
                <p className="mt-1.5 text-xs text-red-600">{error}</p>
            ) : hint ? (
                <p className="mt-1.5 text-xs text-secondary">{hint}</p>
            ) : null}
        </div>
    );
};

export default memo(RDSPhoneInput);