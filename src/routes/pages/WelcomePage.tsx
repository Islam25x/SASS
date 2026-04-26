import { Camera, Lightbulb, Mic, Target, TrendingUp, Wallet, X } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CTASection from "../../components/landing/CTASection";
import FeatureSection from "../../components/landing/FeatureSection";
import GoalsSection from "../../components/landing/GoalsSection";
import HeroSection from "../../components/landing/HeroSection";
import type { BenefitItem, LandingCardItem } from "../../components/landing/types";
import navLogoSrc from "../../assets/logo.png";
import mobileLogoSrc from "../../assets/mobile view logo.png";
import robotImageSrc from "../../assets/Finixa robot.png";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { pageMotion } from "../../shared/animations/pageMotion";
import { REGISTER_SUCCESS_MESSAGE } from "../../features/auth/api/auth.api";
import { useLogin } from "../../features/auth/hooks/useLogin";
import { useRegister } from "../../features/auth/hooks/useRegister";
import {
  clearStoredPendingConfirmationEmail,
  writeStoredPendingConfirmationEmail,
} from "../../infrastructure/auth/auth-storage";
import { useAuth } from "../../shared/auth/AuthContext";
import { useToast } from "../../shared/ui";
import { CheckEmailPanel } from "./CheckEmailPage";

const CONTAINER_CLASS = "mx-auto max-w-7xl px-6";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const heroBenefits: BenefitItem[] = [
  { id: "voice-photo", label: "Track expenses by voice or photo" },
  { id: "alerts", label: "Get alerts before you're broke" },
];

const preventionCards: LandingCardItem[] = [
  {
    id: "voice",
    title: "Record expenses by voice",
    description: "Just say it, we'll track it automatically.",
    icon: Mic,
  },
  {
    id: "receipt",
    title: "Snap a photo of your receipt",
    description: "Just snap a photo, done.",
    icon: Camera,
  },
  {
    id: "forecast",
    title: "See when you'll be broke",
    description: "Know in advance if you'll overshoot your budget.",
    icon: TrendingUp,
  },
];

const goalsCards: LandingCardItem[] = [
  {
    id: "goals",
    title: "Simple Goals",
    description: "Set a specific target to save each month.",
    icon: Target,
  },
  {
    id: "budgeting",
    title: "Budgeting",
    description: "Set your spending limits before you overspend.",
    icon: Wallet,
  },
  {
    id: "insights",
    title: "Smart Insights",
    description: "Break down expenses and get personalized tips.",
    icon: Lightbulb,
  },
];

const MODAL_TRANSITION = {
  duration: 0.2,
  ease: "easeOut",
} as const;

type AuthBanner = {
  tone: "success" | "error";
  text: string;
} | null;

function StickyNavbar() {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <motion.header
      variants={pageMotion.navbar(shouldReduceMotion)}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-20 border-b border-slate-200/70 bg-customBg/95 backdrop-blur"
    >
      <div className={CONTAINER_CLASS}>
        <nav className="flex h-20 items-center" aria-label="Finexa">
          <div className="flex flex-col items-start">
            <img
              src={navLogoSrc}
              alt="Finexa"
              className="hidden h-12 w-auto object-contain md:block lg:h-14"
            />
            <img
              src={mobileLogoSrc}
              alt="Finexa mobile"
              className="block h-10 w-auto object-contain md:hidden"
            />
          </div>
        </nav>
      </div>
    </motion.header>
  );
}

export default function WelcomePage() {
  const shouldReduceMotion = Boolean(useReducedMotion());
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
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
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
  }, [isAuthOpen]);

  useEffect(() => {
    if (location.pathname !== "/login") {
      return;
    }

    setAuthMode("login");
    setIsAuthOpen(true);
    setAuthBanner(null);
    setLoginErrors({});
    setRegisterErrors({});
    loginMutation.reset();
    registerMutation.reset();
  }, [location.pathname]);

  const openLoginModal = () => {
    setConfirmationEmail("");
    setAuthMode("login");
    setIsAuthOpen(true);
    setAuthBanner(null);
    setLoginErrors({});
    setRegisterErrors({});
    loginMutation.reset();
    registerMutation.reset();
  };

  const closeAuthModal = () => {
    if (location.pathname === "/login") {
      navigate("/welcome", { replace: true });
    }

    setIsAuthOpen(false);
    setAuthBanner(null);
    setLoginErrors({});
    setRegisterErrors({});
    loginMutation.reset();
    registerMutation.reset();
  };

  const switchToSignup = () => {
    setConfirmationEmail("");
    setAuthMode("signup");
    setAuthBanner(null);
    setLoginErrors({});
    loginMutation.reset();
  };

  const switchToLogin = () => {
    setConfirmationEmail("");
    setAuthMode("login");
    setRegisterErrors({});
    setAuthBanner(null);
  };

  const openCheckEmailModal = (email: string) => {
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
  };

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
      if (message.toLowerCase().includes("confirm")) {
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

  return (
    <motion.main
      variants={pageMotion.page(shouldReduceMotion)}
      initial="hidden"
      animate="visible"
      className="min-h-screen overflow-x-hidden bg-gradient-to-b from-white to-customBg"
    >
      <StickyNavbar />
      <HeroSection
        robotImageSrc={robotImageSrc}
        benefits={heroBenefits}
        onTryFree={openLoginModal}
      />
      <motion.div
        variants={pageMotion.section(shouldReduceMotion, 24)}
        initial="hidden"
        whileInView="visible"
        viewport={pageMotion.viewport}
      >
        <FeatureSection
          title="How Finexa"
          highlighted="prevents running out of money"
          cards={preventionCards}
        />
      </motion.div>
      <motion.div
        variants={pageMotion.sectionDelayed(shouldReduceMotion, { distance: 24, delay: 0.04 })}
        initial="hidden"
        whileInView="visible"
        viewport={pageMotion.viewport}
      >
        <GoalsSection
          title="How Finexa helps you"
          highlighted="save before the end of the month"
          cards={goalsCards}
        />
      </motion.div>
      <motion.div
        variants={pageMotion.section(shouldReduceMotion, 18)}
        initial="hidden"
        whileInView="visible"
        viewport={pageMotion.viewport}
      >
        <CTASection onTryFree={openLoginModal} />
      </motion.div>
      <AnimatePresence>
        {isAuthOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={MODAL_TRANSITION}
            className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm"
            onClick={closeAuthModal}
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="auth-modal-title"
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={MODAL_TRANSITION}
              className={`w-full ${authMode === "check-email" ? "max-w-4xl" : "max-w-2xl"}`}
              onClick={(event) => event.stopPropagation()}
            >
              {authMode === "check-email" ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={closeAuthModal}
                    className="absolute right-5 top-5 z-10 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/70 hover:text-slate-700"
                    aria-label="Close authentication modal"
                  >
                    <X size={18} />
                  </button>
                  <CheckEmailPanel
                    email={confirmationEmail}
                    embedded
                    onGoToLogin={switchToLogin}
                  />
                </div>
              ) : (
                <div className="form relative bg-white">
                  <button
                    type="button"
                    onClick={closeAuthModal}
                    className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/70 hover:text-slate-700"
                    aria-label="Close authentication modal"
                  >
                    <X size={18} />
                  </button>

                  {authMode === "login" ? (
                  <>
                    <div className="text-center mb-6">
                      <h2
                        id="auth-modal-title"
                        className="text-2xl font-semibold text-slate-900"
                      >
                        Sign into your account
                      </h2>
                    </div>

                    <form onSubmit={handleLoginSubmit}>
                      <div className="mb-4">
                        <label htmlFor="modal-login-name" className="block font-medium">
                          email
                        </label>
                        <input
                          type="email"
                          id="modal-login-name"
                          name="email"
                          value={loginData.email}
                          onChange={handleLoginChange}
                          disabled={loginMutation.isPending}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                        {loginErrors.email && (
                          <p className="text-red-500 text-sm">{loginErrors.email}</p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="modal-login-password" className="block font-medium">
                          Password
                        </label>
                        <input
                          type="password"
                          id="modal-login-password"
                          name="password"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          disabled={loginMutation.isPending}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                        {loginErrors.password && (
                          <p className="text-red-500 text-sm">{loginErrors.password}</p>
                        )}
                      </div>

                      <p className="text-gray-500 text-sm mb-3">
                        By submitting your info, you agree to our policy at{" "}
                        <span className="text-primary-600">finexa</span>
                      </p>

                      <p className="text-sm mb-4">
                        Don&apos;t have an account?{" "}
                        <button
                          type="button"
                          onClick={switchToSignup}
                          className="text-primary-600 hover:underline"
                        >
                          Sign up
                        </button>
                      </p>

                      <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full bg-primary-700 hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-primary-400 text-white py-2 rounded-md transition-colors cursor-pointer"
                      >
                        {loginMutation.isPending ? "Signing in..." : "Sign In"}
                      </button>
                    </form>
                  </>
                  ) : (
                  <>
                    <div className="text-center mb-6">
                      <h2
                        id="auth-modal-title"
                        className="text-3xl font-bold text-primary-700 drop-shadow-md"
                      >
                        Create an Account
                      </h2>
                    </div>

                    {authBanner && (
                      <div
                        className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
                          authBanner.tone === "success"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-red-200 bg-red-50 text-red-700"
                        }`}
                        aria-live="polite"
                      >
                        {authBanner.text}
                      </div>
                    )}

                    <form onSubmit={handleRegisterSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="modal-register-username" className="block font-medium">
                            Username
                          </label>
                          <input
                            type="text"
                            id="modal-register-username"
                            name="username"
                            value={registerData.username}
                            onChange={handleRegisterChange}
                            disabled={registerMutation.isPending}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
                          />
                          {registerErrors.username && (
                            <p className="text-red-500 text-sm">{registerErrors.username}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="modal-register-email" className="block font-medium">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="modal-register-email"
                            name="email"
                            value={registerData.email}
                            onChange={handleRegisterChange}
                            disabled={registerMutation.isPending}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
                          />
                          {registerErrors.email && (
                            <p className="text-red-500 text-sm">{registerErrors.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="modal-register-password" className="block font-medium">
                            Password
                          </label>
                          <input
                            type="password"
                            id="modal-register-password"
                            name="password"
                            value={registerData.password}
                            onChange={handleRegisterChange}
                            disabled={registerMutation.isPending}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
                          />
                          {registerErrors.password && (
                            <p className="text-red-500 text-sm">{registerErrors.password}</p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="modal-register-confirm"
                            className="block font-medium"
                          >
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            id="modal-register-confirm"
                            name="confirmPassword"
                            value={registerData.confirmPassword}
                            onChange={handleRegisterChange}
                            disabled={registerMutation.isPending}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
                          />
                          {registerErrors.confirmPassword && (
                            <p className="text-red-500 text-sm">
                              {registerErrors.confirmPassword}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="modal-register-agree"
                          name="agree"
                          checked={registerData.agree}
                          onChange={handleRegisterChange}
                          disabled={registerMutation.isPending}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                        <label htmlFor="modal-register-agree" className="text-sm text-gray-700">
                          I agree to the{" "}
                          <span className="text-primary-600 font-semibold">finexa policy</span>
                        </label>
                      </div>
                      {registerErrors.agree && (
                        <p className="text-red-500 text-sm">{registerErrors.agree}</p>
                      )}
                      

                      <p className="text-sm">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={switchToLogin}
                          className="text-primary-600 hover:underline"
                        >
                          Login
                        </button>
                      </p>

                      <button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="w-full bg-primary-700 hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-primary-400 text-white py-2 rounded-md transition-all cursor-pointer"
                      >
                        {registerMutation.isPending ? "Creating account..." : "Register"}
                      </button>
                    </form>
                  </>
                  )}
                </div>
              )}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
