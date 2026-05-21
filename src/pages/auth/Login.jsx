import LoginHeader from "./components/LoginHeader";
import LoginForm from "./components/LoginForm";
import DemoCredentials from "./components/DemoCredentials";
import { useLogin } from "./useLogin";

const Login = () => {
  const { form, onSubmit, isLoading } = useLogin();

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-off-white px-5 py-12">
      {/* Subtle decorative background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-main/[0.06] blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-main/[0.04] blur-3xl" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-[440px] rounded-3xl border border-black/5 bg-white p-8 shadow-[0_24px_60px_rgba(0,0,0,0.06)] sm:p-10 animate-fade-in">
        <LoginHeader />
        <LoginForm form={form} onSubmit={onSubmit} isLoading={isLoading} />
        <DemoCredentials />

        <p className="mt-7 text-center text-[11px] text-secondary">
          © {new Date().getFullYear()} RDS Pharma — All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Login;
