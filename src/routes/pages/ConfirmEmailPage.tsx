import { useEffect, useMemo, useRef } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  LoaderCircle,
  MailCheck,
  Rocket,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useConfirmEmail } from "../../features/auth/hooks/useConfirmEmail";
import {
  clearStoredPendingConfirmationEmail,
  readStoredPendingConfirmationEmail,
  writeStoredPendingConfirmationEmail,
} from "../../infrastructure/auth/auth-storage";
import { readAuthLinkParam } from "../../shared/auth/auth-link-params";
import { Button, Card, useToast } from "../../shared/ui";

const successHighlights = [
  {
    id: "secure",
    title: "Your account is secure",
    description: "Email verification helps keep your account safe.",
    icon: ShieldCheck,
  },
  {
    id: "features",
    title: "Access all features",
    description: "You can now log in and explore everything.",
    icon: UserRound,
  },
  {
    id: "start",
    title: "Let's get started",
    description: "Manage your finances smarter with Finexa.",
    icon: Rocket,
  },
] as const;

function isInvalidOrExpiredConfirmationError(message: string) {
  return (
    message.includes("expire") ||
    message.includes("invalid") ||
    message.includes("not valid") ||
    message.includes("verification token") ||
    message.includes("confirmation token")
  );
}

export default function ConfirmEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const successHandledRef = useRef(false);
  const searchString = searchParams.toString();
  const confirmationEmail =
    readAuthLinkParam(searchString, "email") || readStoredPendingConfirmationEmail() || "";
  const confirmationPayload = useMemo(() => {
    const userId = readAuthLinkParam(searchString, "userId");
    const token = readAuthLinkParam(searchString, "token");

    if (!userId || !token) {
      return null;
    }

    return { userId, token };
  }, [searchString]);

  useEffect(() => {
    if (!confirmationEmail) {
      return;
    }

    writeStoredPendingConfirmationEmail(confirmationEmail);
  }, [confirmationEmail]);

  const confirmationQuery = useConfirmEmail(confirmationPayload);
  const isMissingParams = !confirmationPayload;
  const confirmationErrorMessage = confirmationQuery.error?.message.toLowerCase() ?? "";
  const confirmationErrorStatus = confirmationQuery.error?.status;
  const isInvalidOrExpiredState =
    !isMissingParams &&
    confirmationQuery.isError &&
    (confirmationErrorStatus === 400 ||
      confirmationErrorStatus === 404 ||
      confirmationErrorStatus === 410) &&
    isInvalidOrExpiredConfirmationError(confirmationErrorMessage);
  const isLoading = !isMissingParams && !isInvalidOrExpiredState && confirmationQuery.isPending;
  const isSuccess = !isMissingParams && confirmationQuery.isSuccess;
  const isGenericError = !isMissingParams && confirmationQuery.isError && !isInvalidOrExpiredState;

  useEffect(() => {
    successHandledRef.current = false;
  }, [confirmationPayload?.token, confirmationPayload?.userId]);

  useEffect(() => {
    if (!isSuccess || successHandledRef.current || !confirmationPayload) {
      return;
    }

    successHandledRef.current = true;
    clearStoredPendingConfirmationEmail();
    showToast({
      id: `confirm-email:${confirmationPayload.userId}`,
      message: "Email confirmed successfully",
      tone: "success",
    });
  }, [confirmationPayload, isSuccess, showToast]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8FAFF] px-4 py-10 text-slate-900 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.14),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(125,211,252,0.16),_transparent_32%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-16 h-28 bg-[radial-gradient(circle,_rgba(255,255,255,0.9),_transparent_72%)] blur-3xl" />

      {isLoading && (
        <Card
          variant="elevated"
          padding="lg"
          className="relative z-10 w-full max-w-xl rounded-[30px] border border-white/80 bg-white/92 text-center shadow-[0_30px_90px_rgba(59,130,246,0.14)]"
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#ECF4FF]">
            <LoaderCircle className="h-12 w-12 animate-spin text-[#2C6BFF]" strokeWidth={1.8} />
          </div>
          <h1 className="mt-8 text-3xl font-bold tracking-[-0.03em] text-slate-900">
            Confirming your email...
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-500">
            Please wait while we verify your confirmation link.
          </p>
        </Card>
      )}

      {isSuccess && (
        <Card
          variant="elevated"
          padding="lg"
          className="relative z-10 w-full max-w-[860px] rounded-[34px] border border-white/80 bg-white/95 px-6 py-8 shadow-[0_35px_110px_rgba(59,130,246,0.16)] sm:px-8 sm:py-10"
        >
          <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.2),_rgba(59,130,246,0.07))]">
              <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#E8FFF0] text-[#22A958] shadow-[0_18px_55px_rgba(34,197,94,0.18)]">
                <MailCheck className="h-12 w-12" strokeWidth={1.8} />
              </div>
              <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#22A958] text-white shadow-lg">
                <Check className="h-5 w-5" strokeWidth={3} />
              </div>
            </div>

            <h1 className="mt-8 text-4xl font-bold tracking-[-0.04em] text-slate-900 sm:text-5xl">
              Email Confirmed!
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
              Your email has been successfully verified. You can now log in to your account and
              start using Finexa.
            </p>
          </div>

          <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          <div className="grid gap-4 md:grid-cols-3">
            {successHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  className="rounded-[24px] border border-slate-100 bg-[#FBFDFF] px-5 py-5 text-left shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF4FF] text-[#2C6BFF]">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                </div>
              );
            })}
          </div>

          <Button
            type="button"
            size="lg"
            onClick={() => navigate("/login", { replace: true })}
            className="mt-8 h-14 w-full rounded-2xl bg-[#1D5CE8] text-base font-semibold text-white shadow-[0_18px_45px_rgba(29,92,232,0.3)] hover:bg-[#184CC0]"
          >
            Go to Login
            <ArrowRight className="h-4 w-4" />
          </Button>

          <p className="mt-6 text-center text-sm text-slate-500">
            If you didn&apos;t create an account with Finexa,{" "}
            <span className="font-semibold text-[#2C6BFF]">you can safely ignore this email.</span>
          </p>
        </Card>
      )}

      {isInvalidOrExpiredState && (
        <Card
          variant="elevated"
          padding="lg"
          className="relative z-10 w-full max-w-xl rounded-[30px] border border-white/80 bg-white/92 text-center shadow-[0_30px_90px_rgba(59,130,246,0.14)]"
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#FFF7E8] text-[#D97706]">
            <AlertTriangle className="h-12 w-12" strokeWidth={1.8} />
          </div>
          <h1 className="mt-8 text-3xl font-bold tracking-[-0.03em] text-slate-900">
            Invalid or expired link
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-500">
            This confirmation link is no longer valid. Try the link again, or continue to login if
            your account has already been verified.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => {
                successHandledRef.current = false;
                void confirmationQuery.refetch();
              }}
              className="h-12 rounded-xl border border-slate-200 bg-white px-6 text-slate-700 hover:bg-slate-50"
            >
              Try Again
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={() => navigate("/login", { replace: true })}
              className="h-12 rounded-xl bg-[#1D5CE8] px-6 text-white hover:bg-[#184CC0]"
            >
              Go to Login
            </Button>
          </div>
        </Card>
      )}

      {isMissingParams && (
        <Card
          variant="elevated"
          padding="lg"
          className="relative z-10 w-full max-w-xl rounded-[30px] border border-white/80 bg-white/92 text-center shadow-[0_30px_90px_rgba(59,130,246,0.14)]"
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#FFF4ED] text-[#EA580C]">
            <AlertTriangle className="h-12 w-12" strokeWidth={1.8} />
          </div>
          <h1 className="mt-8 text-3xl font-bold tracking-[-0.03em] text-slate-900">
            Invalid or expired link
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-500">
            This confirmation link is missing required data. Open the latest email and try again,
            or continue to login if your account is already verified.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              type="button"
              size="lg"
              onClick={() => navigate("/login", { replace: true })}
              className="h-12 rounded-xl bg-[#1D5CE8] px-6 text-white hover:bg-[#184CC0]"
            >
              Go to Login
            </Button>
          </div>
        </Card>
      )}

      {isGenericError && (
        <Card
          variant="elevated"
          padding="lg"
          className="relative z-10 w-full max-w-xl rounded-[30px] border border-white/80 bg-white/92 text-center shadow-[0_30px_90px_rgba(59,130,246,0.14)]"
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#FFF4ED] text-[#EA580C]">
            <AlertTriangle className="h-12 w-12" strokeWidth={1.8} />
          </div>
          <h1 className="mt-8 text-3xl font-bold tracking-[-0.03em] text-slate-900">
            We couldn&apos;t confirm your email
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-500">
            A network or server error interrupted the verification request. Please try again in a
            moment.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => {
                successHandledRef.current = false;
                void confirmationQuery.refetch();
              }}
              className="h-12 rounded-xl border border-slate-200 bg-white px-6 text-slate-700 hover:bg-slate-50"
            >
              Try Again
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={() => navigate("/login", { replace: true })}
              className="h-12 rounded-xl bg-[#1D5CE8] px-6 text-white hover:bg-[#184CC0]"
            >
              Go to Login
            </Button>
          </div>
        </Card>
      )}
    </main>
  );
}
