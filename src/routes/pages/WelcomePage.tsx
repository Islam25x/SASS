import { ArrowLeft, Camera, Lightbulb, Mail, Mic, Target, TrendingUp, Wallet, X } from "lucide-react";
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
import { useWelcomeAuthFlow } from "../../features/auth/hooks/useWelcomeAuthFlow";
import { CheckEmailPanel } from "./CheckEmailPage";

const CONTAINER_CLASS = "mx-auto max-w-7xl px-6";

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
  const {
    authBanner,
    authMode,
    closeAuthModal,
    confirmationEmail,
    forgotPasswordData,
    forgotPasswordErrors,
    forgotPasswordMutation,
    handleForgotPasswordChange,
    handleForgotPasswordSubmit,
    handleLoginChange,
    handleLoginSubmit,
    handleRegisterChange,
    handleRegisterSubmit,
    isAuthOpen,
    loginData,
    loginErrors,
    loginMutation,
    openLoginModal,
    passwordResetEmail,
    registerData,
    registerErrors,
    registerMutation,
    switchToForgotPassword,
    switchToLogin,
    switchToSignup,
  } = useWelcomeAuthFlow();

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
                    onGoToLogin={() => switchToLogin(confirmationEmail)}
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
                      <div className="mb-6 text-center">
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
                            placeholder="Enter your email"
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                          />
                          {loginErrors.email && (
                            <p className="text-sm text-red-500">{loginErrors.email}</p>
                          )}
                        </div>

                        <div className="mb-2">
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
                            placeholder="Enter your password"
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                          />
                          {loginErrors.password && (
                            <p className="text-sm text-red-500">{loginErrors.password}</p>
                          )}
                        </div>

                        <div className="mb-4 flex justify-end">
                          <button
                            type="button"
                            onClick={switchToForgotPassword}
                            className="text-sm text-primary-600 transition hover:underline"
                          >
                            Forgot password?
                          </button>
                        </div>

                        <p className="mb-3 text-sm text-gray-500">
                          By submitting your info, you agree to our policy at{" "}
                          <span className="text-primary-600">finexa</span>
                        </p>

                        <p className="mb-4 text-sm">
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
                          className="w-full cursor-pointer rounded-md bg-primary-700 py-2 text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-primary-400"
                        >
                          {loginMutation.isPending ? "Signing in..." : "Sign In"}
                        </button>
                      </form>
                    </>
                  ) : authMode === "forgot-password" ? (
                    <>
                      <div className="mb-6 text-center">
                        <h2
                          id="auth-modal-title"
                          className="text-2xl font-semibold text-slate-900"
                        >
                          Reset your password
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          Enter the email associated with your account and we&apos;ll send you a
                          reset link.
                        </p>
                      </div>

                      <form onSubmit={handleForgotPasswordSubmit}>
                        {forgotPasswordErrors.form && (
                          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {forgotPasswordErrors.form}
                          </div>
                        )}

                        <div className="mb-5">
                          <label htmlFor="modal-forgot-password-email" className="block font-medium">
                            email
                          </label>
                          <input
                            type="email"
                            id="modal-forgot-password-email"
                            name="email"
                            value={forgotPasswordData.email}
                            onChange={handleForgotPasswordChange}
                            disabled={forgotPasswordMutation.isPending}
                            placeholder="Enter your email"
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                          />
                          {forgotPasswordErrors.email && (
                            <p className="text-sm text-red-500">{forgotPasswordErrors.email}</p>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={forgotPasswordMutation.isPending}
                          className="w-full cursor-pointer rounded-md bg-primary-700 py-2 text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-primary-400"
                        >
                          {forgotPasswordMutation.isPending
                            ? "Sending reset link..."
                            : "Send Reset Link"}
                        </button>
                      </form>

                      <div className="mt-6 text-center">
                        <button
                          type="button"
                          onClick={() => switchToLogin(forgotPasswordData.email)}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition hover:underline"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back to sign in
                        </button>
                      </div>
                    </>
                  ) : authMode === "forgot-password-check-email" ? (
                    <div className="px-1 py-4 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.22),_rgba(37,99,235,0.08))]">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-[0_18px_40px_rgba(59,130,246,0.18)]">
                          <Mail className="h-6 w-6 text-[#5B8CFF]" strokeWidth={1.8} />
                        </div>
                      </div>

                      <h2
                        id="auth-modal-title"
                        className="mt-5 text-2xl font-semibold text-slate-900"
                      >
                        Check your email
                      </h2>
                      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        If an account exists for{" "}
                        <span className="font-semibold text-slate-900">{passwordResetEmail}</span>,
                        we&apos;ve sent a password reset link to that email address.
                      </p>

                      <button
                        type="button"
                        onClick={() => switchToLogin(passwordResetEmail)}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition hover:underline"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back to sign in
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6 text-center">
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
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                            />
                            {registerErrors.username && (
                              <p className="text-sm text-red-500">{registerErrors.username}</p>
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
                              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                            />
                            {registerErrors.email && (
                              <p className="text-sm text-red-500">{registerErrors.email}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                            />
                            {registerErrors.password && (
                              <p className="text-sm text-red-500">{registerErrors.password}</p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="modal-register-confirm" className="block font-medium">
                              Confirm Password
                            </label>
                            <input
                              type="password"
                              id="modal-register-confirm"
                              name="confirmPassword"
                              value={registerData.confirmPassword}
                              onChange={handleRegisterChange}
                              disabled={registerMutation.isPending}
                              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                            />
                            {registerErrors.confirmPassword && (
                              <p className="text-sm text-red-500">
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
                            className="h-4 w-4 rounded border-gray-300 text-primary-600"
                          />
                          <label htmlFor="modal-register-agree" className="text-sm text-gray-700">
                            I agree to the{" "}
                            <span className="font-semibold text-primary-600">finexa policy</span>
                          </label>
                        </div>
                        {registerErrors.agree && (
                          <p className="text-sm text-red-500">{registerErrors.agree}</p>
                        )}

                        <p className="text-sm">
                          Already have an account?{" "}
                          <button
                            type="button"
                            onClick={() => switchToLogin()}
                            className="text-primary-600 hover:underline"
                          >
                            Login
                          </button>
                        </p>

                        <button
                          type="submit"
                          disabled={registerMutation.isPending}
                          className="w-full cursor-pointer rounded-md bg-primary-700 py-2 text-white transition-all hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-primary-400"
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
