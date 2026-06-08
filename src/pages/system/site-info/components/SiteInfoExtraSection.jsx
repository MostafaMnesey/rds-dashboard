import { memo } from "react";
import { Controller } from "react-hook-form";
import { FileText } from "lucide-react";
import Input from "../../../../components/ui/Input";
import SiteInfoSection from "./SiteInfoSection";

const SiteInfoExtraSection = ({ control, errors }) => {
    return (
        <SiteInfoSection
            icon={FileText}
            title="Extra Information"
            description="Business details and legal information."
        >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                    name="extraInfo.companyName"
                    control={control}
                    render={({ field }) => (
                        <Input
                            label="Company Name"
                            placeholder="e.g. RDS Pharma LLC"
                            {...field}
                            error={errors?.extraInfo?.companyName?.message}
                        />
                    )}
                />

                <Controller
                    name="extraInfo.taxNumber"
                    control={control}
                    render={({ field }) => (
                        <Input
                            label="Tax Number (TRN)"
                            placeholder="e.g. TRN123456789"
                            {...field}
                            error={errors?.extraInfo?.taxNumber?.message}
                        />
                    )}
                />
            </div>

            <Controller
                name="extraInfo.note"
                control={control}
                render={({ field }) => (
                    <Input
                        type="textarea"
                        label="Additional Note"
                        rows={3}
                        placeholder="Any extra information shown to customers..."
                        {...field}
                        error={errors?.extraInfo?.note?.message}
                    />
                )}
            />
        </SiteInfoSection>
    );
};

export default memo(SiteInfoExtraSection);