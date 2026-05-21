import { memo } from "react";

const LoginHeader = () => {
  return (
    <div className="mb-8 flex flex-col items-center text-center">
      <img
        src="https://res.cloudinary.com/dbvh5i83q/image/upload/v1776082859/rds_logo_xpmbfn.webp"
        alt="Logo"
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-white shadow-rds-cta"
      />
      <h1 className="font-oswald text-2xl font-bold uppercase tracking-wide text-soft-black sm:text-3xl">
        Welcome back
      </h1>
      <p className="mt-2 text-sm text-secondary">
        Sign in to access your RDS Pharma dashboard
      </p>
    </div>
  );
};

export default memo(LoginHeader);
