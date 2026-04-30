import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  clearStoredPendingConfirmationEmail,
  writeStoredPendingConfirmationEmail,
} from "../../../infrastructure/auth/auth-storage";
import { useAuth } from "../../../shared/auth/AuthContext";
import { useToast } from "../../../shared/ui";
import { REGISTER_SUCCESS_MESSAGE } from "../api/auth.api";
import { useLogin } from "./useLogin";
import { useRegister } from "./useRegister";
import { isConfirmationRequiredMessage } from "../utils/auth-response-signals";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type AuthBanner = {
  tone: "success" | "error";
  text: string;
} | null;

export function useWelcomeAuthFlow() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup" | "check-email">("login");
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [authBanner, setAuthBanner] = useState<AuthBanner>(null);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [registerErrors, setRegisterErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agree?: string;
    form?: string;
  }>({});

  const resetMutationState = useCallback(() => {
    loginMutation.reset();
    registerMutation.reset();
  }, [loginMutation, registerMutation]);

  const resetAuthErrors = useCallback(() => {
    setAuthBanner(null);
    setLoginErrors({});
    setRegisterErrors({});
  }, []);

  const openLoginModal = useCallback(() => {
    setConfirmationEmail("");
    setAuthMode("login");
    setIsAuthOpen(true);
    resetAuthErrors();
    resetMutationState();
  }, [resetAuthErrors, resetMutationState]);

  const closeAuthModal = useCallback(() => {
    if (location.pathname === "/login") {
      navigate("/welcome", { replace: true });
    }

    setIsAuthOpen(false);
    resetAuthErrors();
    resetMutationState();
  }, [location.pathname, navigate, resetAuthErrors, resetMutationState]);

  const switchToSignup = useCallback(() => {
    setConfirmationEmail("");
    setAuthMode("signup");
    setAuthBanner(null);
    setLoginErrors({});
    loginMutation.reset();
  }, [loginMutation]);

  const switchToLogin = useCallback(() => {
    setConfirmationEmail("");
    setAuthMode("login");
    setRegisterErrors({});
    setAuthBanner(null);
  }, []);

  const openCheckEmailModal = useCallback((email: string) => {
    const normalizedEmail = email.trim();

    if (normalizedEmail) {
      writeStoredPendingConfirmationEmail(normalizedEmail);
    }

    setConfirmationEmail(normalizedEmail);
    setAuthMode("check-email");
    setIsAuthOpen(true);
    setAuthBanner(null);
    setLoginErrors({});
    setRegisterErrors({});
  }, []);

  useEffect(() => {
    if (!isAuthOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAuthModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeAuthModal, isAuthOpen]);

  useEffect(() => {
    if (location.pathname !== "/login") {
      return;
    }

    setAuthMode("login");
    setIsAuthOpen(true);
    resetAuthErrors();
    resetMutationState();
  }, [location.pathname, resetAuthErrors, resetMutationState]);

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthBanner(null);
    setLoginErrors((prev) => ({ ...prev, [name]: undefined }));
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setAuthBanner((current) => (current?.tone === "error" ? null : current));
    setRegisterErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
    setRegisterData((prev) => ({ ...prev, [name]: newValue }));
  };

  const validateLogin = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!loginData.email.trim()) newErrors.email = "Email is required";
    if (!loginData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (loginData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const validateRegister = () => {
    const newErrors: typeof registerErrors = {};
    if (!registerData.username.trim()) newErrors.username = "Username is required";
    if (!registerData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(registerData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }
    if (!registerData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (registerData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!registerData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    }
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!registerData.agree) newErrors.agree = "You must agree to the policy";
    return newErrors;
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthBanner(null);
    const validationErrors = validateLogin();
    if (Object.keys(validationErrors).length > 0) {
      setLoginErrors(validationErrors);
      return;
    }

    try {
      const session = await loginMutation.mutateAsync({
        email: loginData.email.trim(),
        password: loginData.password,
      });

      clearStoredPendingConfirmationEmail();
      login(session);
      setIsAuthOpen(false);
      setLoginErrors({});
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed. Please try again.";
      if (isConfirmationRequiredMessage(message)) {
        const submittedEmail = loginData.email.trim();
        openCheckEmailModal(submittedEmail);
        showToast({
          id: `auth-login-confirm:${submittedEmail.toLowerCase()}`,
          message: "Please confirm your email. We've sent you a new confirmation link.",
          tone: "warning",
        });
        return;
      }

      setLoginErrors((prev) => ({ ...prev, password: message }));
      setAuthBanner({ tone: "error", text: message });
    }
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthBanner(null);
    const validationErrors = validateRegister();
    if (Object.keys(validationErrors).length > 0) {
      setRegisterErrors(validationErrors);
      return;
    }

    try {
      const submittedEmail = registerData.email.trim();
      await registerMutation.mutateAsync({
        email: submittedEmail,
        username: registerData.username.trim(),
        password: registerData.password,
        confirmPassword: registerData.confirmPassword,
      });

      setRegisterErrors({});
      setRegisterData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        agree: false,
      });
      setLoginData({ email: "", password: "" });
      showToast({
        id: "auth-register-success",
        message: REGISTER_SUCCESS_MESSAGE,
        tone: "success",
      });
      openCheckEmailModal(submittedEmail);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed. Please try again.";
      setRegisterErrors((prev) => ({ ...prev, form: message }));
      setAuthBanner({ tone: "error", text: message });
      showToast({
        id: "auth-register-error",
        message,
        tone: "error",
      });
    }
  };

  return {
    authBanner,
    authMode,
    confirmationEmail,
    handleLoginChange,
    handleLoginSubmit,
    handleRegisterChange,
    handleRegisterSubmit,
    isAuthOpen,
    loginData,
    loginErrors,
    loginMutation,
    openLoginModal,
    registerData,
    registerErrors,
    registerMutation,
    setIsAuthOpen,
    switchToLogin,
    switchToSignup,
    closeAuthModal,
  };
}
