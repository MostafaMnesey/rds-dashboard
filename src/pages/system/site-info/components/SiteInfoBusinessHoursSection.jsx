import { memo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { Switch, TimePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Clock, Copy } from "lucide-react";
import SiteInfoSection from "./SiteInfoSection";
import { BUSINESS_DAYS } from "../data/constants";

// Required so dayjs can parse "HH:mm" strings reliably
dayjs.extend(customParseFormat);

const TIME_FORMAT = "HH:mm";

/* ──────────────── Time Picker wrapper ──────────────── */
const TimeField = ({ value, onChange, disabled }) => {
    const parsed = value ? dayjs(value, TIME_FORMAT) : null;
    const dayjsValue = parsed?.isValid() ? parsed : null;

    return (
        <TimePicker
            value={dayjsValue}
            onChange={(val) => onChange?.(val ? val.format(TIME_FORMAT) : "")}
            format={TIME_FORMAT}
            minuteStep={5}
            allowClear={false}
            disabled={disabled}
            needConfirm={false}
            placeholder="--:--"
            suffixIcon={null}
            className="rds-time-picker"
            popupClassName="rds-time-picker-popup"
        />
    );
};

/* ──────────────── Day Row ──────────────── */
const DayRow = memo(({ control, dayKey, label, onCopyToAll }) => {
    const isOpen = useWatch({
        control,
        name: `extraInfo.businessHours.${dayKey}.isOpen`,
    });

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-black/5 bg-[#fafaf9] p-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Day label + switch */}
            <div className="flex w-full items-center justify-between gap-3 sm:w-40 sm:justify-start">
                <span className="text-sm font-semibold text-soft-black">{label}</span>
                <Controller
                    name={`extraInfo.businessHours.${dayKey}.isOpen`}
                    control={control}
                    render={({ field }) => (
                        <Switch
                            size="small"
                            checked={Boolean(field.value)}
                            onChange={field.onChange}
                        />
                    )}
                />
            </div>

            {/* Times */}
            <div className="flex flex-1 flex-wrap items-center gap-2 sm:justify-end">
                {isOpen ? (
                    <>
                        <Controller
                            name={`extraInfo.businessHours.${dayKey}.open`}
                            control={control}
                            render={({ field }) => (
                                <TimeField value={field.value} onChange={field.onChange} />
                            )}
                        />
                        <span className="text-xs text-secondary">to</span>
                        <Controller
                            name={`extraInfo.businessHours.${dayKey}.close`}
                            control={control}
                            render={({ field }) => (
                                <TimeField value={field.value} onChange={field.onChange} />
                            )}
                        />

                        <button
                            type="button"
                            onClick={() => onCopyToAll?.(dayKey)}
                            title="Copy these hours to all days"
                            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 text-xs font-semibold text-secondary transition hover:border-main/30 hover:text-main active:scale-95"
                        >
                            <Copy size={12} />
                            <span className="hidden sm:inline">Apply to all</span>
                        </button>
                    </>
                ) : (
                    <span className="rounded-lg bg-black/[0.04] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                        Closed
                    </span>
                )}
            </div>
        </div>
    );
});

DayRow.displayName = "DayRow";

/* ──────────────── Main Section ──────────────── */
const SiteInfoBusinessHoursSection = ({ control, setValue, getValues }) => {
    const handleCopyToAll = (sourceDay) => {
        const source = getValues(`extraInfo.businessHours.${sourceDay}`);
        if (!source) return;
        BUSINESS_DAYS.forEach((day) => {
            if (day.key === sourceDay) return;
            setValue(
                `extraInfo.businessHours.${day.key}`,
                {
                    open: source.open,
                    close: source.close,
                    isOpen: source.isOpen,
                },
                { shouldDirty: true },
            );
        });
    };

    return (
        <SiteInfoSection
            icon={Clock}
            title="Business Hours"
            description="Set opening and closing times for each day of the week."
        >
            <div className="space-y-2.5">
                {BUSINESS_DAYS.map((day) => (
                    <DayRow
                        key={day.key}
                        control={control}
                        dayKey={day.key}
                        label={day.label}
                        onCopyToAll={handleCopyToAll}
                    />
                ))}
            </div>
        </SiteInfoSection>
    );
};

export default memo(SiteInfoBusinessHoursSection);