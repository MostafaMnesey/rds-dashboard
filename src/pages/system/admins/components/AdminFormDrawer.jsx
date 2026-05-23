import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Drawer } from "antd";
import { Loader2 } from "lucide-react";
import Input from "../../../../components/ui/Input";
import PasswordStrengthHints from "./PasswordStrengthHints";
import { useCreateAdmin, useUpdateAdmin } from "../useAdminMutations";
import { useRoles } from "../../roles/useRoles";
import {
  buildAdminPayload,
  getRoleDisplayName,
  normalizeAdminStatus,
} from "../../utils";
import {
  ADMIN_STATUSES,
  PASSWORD_REGEX,
  PASSWORD_MIN_LENGTH,
} from "../../data/constants";

const PASSWORD_ERROR_MESSAGE =
  "Password must be at least 8 characters and include uppercase, lowercase, number and a special character.";

/* ───────── Schema (dynamic based on edit/create) ───────── */
const buildSchema = (isEdit) =>
  z
    .object({
      name: z.string().min(2, "Name is required"),
      email: z.string().email("Enter a valid email"),
      password: isEdit
        ? z
            .string()
            .optional()
            .refine(
              (v) => !v || v.length >= PASSWORD_MIN_LENGTH,
              `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
            )
            .refine((v) => !v || PASSWORD_REGEX.test(v), PASSWORD_ERROR_MESSAGE)
        : z
            .string()
            .min(
              PASSWORD_MIN_LENGTH,
              `Minimum ${PASSWORD_MIN_LENGTH} characters`,
            )
            .regex(PASSWORD_REGEX, PASSWORD_ERROR_MESSAGE),
      confirmPassword: z.string().optional(),
      roleId: z.string().min(1, "Role is required"),
      status: z.enum(["ACTIVE", "INACTIVE"]),
    })
    .refine(
      (data) => !data.password || data.password === data.confirmPassword,
      {
        message: "Passwords don't match",
        path: ["confirmPassword"],
      },
    );

const buildDefaults = (admin) => ({
  name: admin?.name || "",
  email: admin?.email || "",
  password: "",
  confirmPassword: "",
  roleId: admin?.role?.id || "",
  status: normalizeAdminStatus(admin?.status),
});

const AdminFormDrawer = ({ open, onClose, admin }) => {
  const isEdit = Boolean(admin);

  const createMutation = useCreateAdmin();
  const updateMutation = useUpdateAdmin();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const { items: roles, isLoading: rolesLoading } = useRoles();

  const roleOptions = useMemo(
    () =>
      (roles || []).map((r) => ({
        value: r.id,
        label: getRoleDisplayName(r, "en"),
      })),
    [roles],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(buildSchema(isEdit)),
    defaultValues: buildDefaults(admin),
    mode: "onChange",
  });

  useEffect(() => {
    if (open) reset(buildDefaults(admin));
  }, [open, admin, reset]);

  const onSubmit = async (values) => {
    const payload = buildAdminPayload(values, isEdit);
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: admin.id, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch {
      // toast handled in hook
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={520}
      destroyOnClose
      closable={false}
      title={null}
      styles={{
        body: { padding: 0, background: "#ffffff" },
        header: { display: "none" },
      }}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b border-black/5 px-6 py-5">
          <h2 className="font-oswald text-2xl font-bold uppercase tracking-wide text-soft-black">
            {isEdit ? "Edit Admin" : "New Admin"}
          </h2>
          <p className="mt-1 text-sm text-secondary">
            {isEdit
              ? "Update admin details and permissions."
              : "Create a new dashboard administrator and assign a role."}
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form
            id="admin-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  label="Full Name"
                  required
                  placeholder="John Doe"
                  {...field}
                  error={errors?.name?.message}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  type="email"
                  label="Email Address"
                  required
                  placeholder="admin@example.com"
                  {...field}
                  error={errors?.email?.message}
                />
              )}
            />

            {/* Password fields */}
            <div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="password"
                      label="Password"
                      required={!isEdit}
                      placeholder="Password@123"
                      {...field}
                      error={errors?.password?.message}
                    />
                  )}
                />

                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="password"
                      label="Confirm Password"
                      required={!isEdit}
                      placeholder="Password@123"
                      {...field}
                      error={errors?.confirmPassword?.message}
                    />
                  )}
                />
              </div>

              {/* Live password strength hints */}
              <PasswordStrengthHints control={control} name="password" />

              {isEdit && (
                <p className="mt-2 text-xs text-secondary">
                  Leave password empty to keep the current one.
                </p>
              )}
            </div>

            <Controller
              name="roleId"
              control={control}
              render={({ field }) => (
                <Input
                  type="select"
                  label="Role"
                  required
                  placeholder={
                    rolesLoading ? "Loading roles..." : "Select a role"
                  }
                  value={field.value || undefined}
                  onChange={(v) => field.onChange(v || "")}
                  options={roleOptions}
                  disabled={rolesLoading}
                  showSearch
                  allowClear
                  error={errors?.roleId?.message}
                />
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Input
                  type="select"
                  label="Status"
                  required
                  value={field.value}
                  onChange={(v) => field.onChange(v || "ACTIVE")}
                  options={ADMIN_STATUSES}
                  error={errors?.status?.message}
                />
              )}
            />
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-black/5 bg-[#fafaf9] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-6 text-sm font-medium text-soft-black transition hover:border-black/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="admin-form"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-main px-6 text-sm font-semibold text-white shadow-rds-cta transition hover:brightness-95 hover:shadow-rds-cta-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? "Save Changes" : "Create Admin"}
          </button>
        </div>
      </div>
    </Drawer>
  );
};

export default AdminFormDrawer;
