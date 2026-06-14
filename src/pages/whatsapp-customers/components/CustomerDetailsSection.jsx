import { memo } from "react";
import { Controller } from "react-hook-form";
import { User } from "lucide-react";
import Input from "../../../components/ui/Input";
import PhoneInput from "../../../components/ui/PhoneInput";
import WhatsAppFormSection from "./WhatsAppFormSection";

const CustomerDetailsSection = ({ control, errors }) => {
    return (
        <WhatsAppFormSection
            icon={User}
            title="Customer Details"
            description="Contact and shipping information for this customer."
        >
            {/* Name */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                    name="customer.firstName"
                    control={control}
                    render={({ field }) => (
                        <Input
                            label="First Name"
                            required
                            placeholder="e.g. John"
                            {...field}
                            error={errors?.customer?.firstName?.message}
                        />
                    )}
                />
                <Controller
                    name="customer.lastName"
                    control={control}
                    render={({ field }) => (
                        <Input
                            label="Last Name"
                            required
                            placeholder="e.g. Doe"
                            {...field}
                            error={errors?.customer?.lastName?.message}
                        />
                    )}
                />
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                    name="customer.email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="email"
                            label="Email"
                            required
                            placeholder="customer@example.com"
                            {...field}
                            error={errors?.customer?.email?.message}
                        />
                    )}
                />
                <Controller
                    name="customer.phone"
                    control={control}
                    render={({ field }) => (
                        <PhoneInput
                            label="Phone Number"
                            required
                            value={field.value}
                            onChange={field.onChange}
                            country="ae"
                            error={errors?.customer?.phone?.message}
                        />
                    )}
                />
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Controller
                    name="customer.country"
                    control={control}
                    render={({ field }) => (
                        <Input
                            label="Country"
                            required
                            placeholder="e.g. UAE"
                            {...field}
                            error={errors?.customer?.country?.message}
                        />
                    )}
                />
                <Controller
                    name="customer.state"
                    control={control}
                    render={({ field }) => (
                        <Input
                            label="State / Province"
                            placeholder="e.g. Sharjah"
                            {...field}
                            error={errors?.customer?.state?.message}
                        />
                    )}
                />
                <Controller
                    name="customer.city"
                    control={control}
                    render={({ field }) => (
                        <Input
                            label="City"
                            required
                            placeholder="e.g. Dubai"
                            {...field}
                            error={errors?.customer?.city?.message}
                        />
                    )}
                />
            </div>

            <Controller
                name="customer.streetAddress"
                control={control}
                render={({ field }) => (
                    <Input
                        label="Street Address"
                        required
                        placeholder="e.g. 123 Sheikh Zayed Rd"
                        {...field}
                        error={errors?.customer?.streetAddress?.message}
                    />
                )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                    name="customer.apartment"
                    control={control}
                    render={({ field }) => (
                        <Input
                            label="Apartment / Suite"
                            placeholder="e.g. Apt 5"
                            {...field}
                            error={errors?.customer?.apartment?.message}
                        />
                    )}
                />
                <Controller
                    name="customer.zipCode"
                    control={control}
                    render={({ field }) => (
                        <Input
                            label="Zip / Postal Code"
                            placeholder="e.g. 12345"
                            {...field}
                            error={errors?.customer?.zipCode?.message}
                        />
                    )}
                />
            </div>

            <Controller
                name="customer.deliveryNotes"
                control={control}
                render={({ field }) => (
                    <Input
                        type="textarea"
                        label="Delivery Notes"
                        rows={2}
                        placeholder="e.g. Call before delivery"
                        {...field}
                        error={errors?.customer?.deliveryNotes?.message}
                    />
                )}
            />
        </WhatsAppFormSection>
    );
};

export default memo(CustomerDetailsSection);