import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { getSchema } from "../schemas/Auth.schema";
import { FORM_DEFAULTS, ROUTE_PATHS, USER_ROLES } from "../constants/Auth.constants";
import { login, signup } from "../services/auth";
import { useAuth } from "./useAuth";
import { useError } from "../contexts/ErrorContext";

export const useAuthForm = () => {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();
  const { addError } = useError();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = getSchema(isLogin);
  const defaultValues = isLogin ? FORM_DEFAULTS.LOGIN : FORM_DEFAULTS.SIGNUP;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur", 
  });

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = form;

  const toggleMode = useCallback(() => {
    setIsLogin((prev) => !prev);
    setShowPassword(false);
    setShowConfirmPassword(false);
    reset();
  }, [reset]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword(prev => !prev);
  }, []);

  const handleRoleSelect = useCallback((role) => {
    setValue("role", role, { shouldValidate: true });
  }, [setValue]);

  const handleFormSubmit = useCallback(async (data) => {
    if (isSubmitting) return;
    
    console.log(data)
    setIsSubmitting(true);
    
    try {
      let response;

      if (isLogin) {
        response = await login({
          email: data.email,
          password: data.password,
          role: data.role,
        });
      } else {
        response = await signup({
          name: data.userName,
          email: data.email,
          password: data.password,
          passwordConfirm: data.confirmPassword,
          role: USER_ROLES.PATIENT, 
          dateOfBirth: data.dateOfBirth,
        });
      }
      console.log(response)
      // Validate response structure
      if (!response?.user) {
        throw new Error("Invalid response from server");
      }

      // Update authentication state
      setAuthUser(response.user);

      // Navigate based on user role
      const redirectPath = response.user.role === USER_ROLES.DOCTOR 
        ? ROUTE_PATHS.DOCTOR_DASHBOARD 
        : ROUTE_PATHS.PATIENT_DASHBOARD;

      navigate(redirectPath, { replace: true });
      
    } catch (error) {
      console.error("Authentication error:", error);
      
      const errorMessage = 
        error.response?.data?.error?.message ||
        error.message ||
        `${isLogin ? "Login" : "Registration"} failed. Please try again.`;
      
      addError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [isLogin, isSubmitting, setAuthUser, navigate, addError]);

  return {
    isLogin,
    showPassword,
    showConfirmPassword,
    isSubmitting,
    errors,
    register,
    handleSubmit: handleSubmit(handleFormSubmit),
    watch,
    toggleMode,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleRoleSelect,
  };
};