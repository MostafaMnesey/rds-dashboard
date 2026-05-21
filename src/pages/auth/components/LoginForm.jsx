import { memo } from "react";
import { Controller } from "react-hook-form";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Input, Button } from "../../../components/ui";

const LoginForm = ({ form, onSubmit, isLoading }) => {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="email"
            label="Email Address"
            placeholder="admin@rdspharma.com"
            prefix={<Mail size={16} className="text-secondary" />}
            error={errors.email?.message}
            required
            autoComplete="email"
            autoFocus
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="password"
            label="Password"
            placeholder="••••••••"
            prefix={<Lock size={16} className="text-secondary" />}
            error={errors.password?.message}
            required
            autoComplete="current-password"
          />
        )}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isLoading}
        icon={ArrowRight}
        iconPosition="right"
        className="mt-2"
      >
        Sign In
      </Button>
    </form>
  );
};

export default memo(LoginForm);
