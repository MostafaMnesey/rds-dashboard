import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../../api/auth";
import { useAppStore } from "../../store";
import { loginSchema } from "./schema/loginSchema";
import { getErrorMessage } from "../../lib/errors";

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAppStore((s) => s.setAuth);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      const token = response?.data?.token;

      if (!token) {
        toast.error("Login failed. Please try again.");
        return;
      }

      const email = form.getValues("email");
      const user = {
        email,
        name: email.split("@")[0],
        role: { name: "Admin" },
        status: "ACTIVE",
      };

      setAuth(token, user);
      toast.success("Welcome back!");
      navigate("/", { replace: true });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Invalid email or password"));
    },
  });

  const onSubmit = useCallback(
    (values) => loginMutation.mutate(values),
    [loginMutation]
  );

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: loginMutation.isPending,
  };
};