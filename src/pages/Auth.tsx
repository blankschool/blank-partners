import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail } from "lucide-react";

export default function Auth() {
  const { user, loading, signInWithOtp, verifyOtp } = useAuth();
  const [step, setStep] = useState<"email" | "verify">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    const { error } = await signInWithOtp(email);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Code sent",
        description: "Check your email for the verification code",
      });
      setStep("verify");
    }
    setIsLoading(false);
  };

  const handleVerifyCode = async () => {
    if (otp.length !== 8) return;

    setIsLoading(true);
    const { error } = await verifyOtp(email, otp);

    if (error) {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
      setOtp("");
    }
    setIsLoading(false);
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    const { error } = await signInWithOtp(email);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Code resent",
        description: "Check your email for the new verification code",
      });
    }
    setIsLoading(false);
  };

  const handleBack = () => {
    setStep("email");
    setOtp("");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-muted-foreground/10" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-foreground/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-muted-foreground/5 blur-3xl" />

      {/* Sign-in card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="rounded-2xl border border-border/50 bg-card/80 p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo and branding */}
          <div className="mb-8 flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-foreground to-muted-foreground shadow-lg">
              <span className="font-serif text-3xl font-normal text-background">B</span>
            </div>
            <div className="mt-4 flex flex-col items-center">
              <span className="font-serif text-2xl font-normal text-foreground">Blank</span>
              <span className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Agency ERP
              </span>
            </div>
          </div>

          {step === "email" ? (
            <>
              {/* Welcome text */}
              <div className="mb-8 text-center">
                <h1 className="font-serif text-3xl font-normal text-foreground">Welcome back</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter your email to receive a sign-in code
                </p>
              </div>

              {/* Email form */}
              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-full pl-11 pr-4"
                    disabled={isLoading}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="w-full gap-2 rounded-full bg-foreground py-6 text-background transition-all duration-300 hover:bg-foreground/90 hover:shadow-lg"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  ) : null}
                  <span className="text-sm font-medium">
                    {isLoading ? "Sending..." : "Send Code"}
                  </span>
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* Back button */}
              <button
                onClick={handleBack}
                className="mb-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Use different email
              </button>

              {/* Verification text */}
              <div className="mb-8 text-center">
                <h1 className="font-serif text-3xl font-normal text-foreground">Enter code</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  We sent an 8-digit code to
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">{email}</p>
              </div>

              {/* OTP input */}
              <div className="flex flex-col items-center space-y-6">
                <InputOTP
                  maxLength={8}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  disabled={isLoading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="h-10 w-10 rounded-xl border-border text-base" />
                    <InputOTPSlot index={1} className="h-10 w-10 rounded-xl border-border text-base" />
                    <InputOTPSlot index={2} className="h-10 w-10 rounded-xl border-border text-base" />
                    <InputOTPSlot index={3} className="h-10 w-10 rounded-xl border-border text-base" />
                    <InputOTPSlot index={4} className="h-10 w-10 rounded-xl border-border text-base" />
                    <InputOTPSlot index={5} className="h-10 w-10 rounded-xl border-border text-base" />
                    <InputOTPSlot index={6} className="h-10 w-10 rounded-xl border-border text-base" />
                    <InputOTPSlot index={7} className="h-10 w-10 rounded-xl border-border text-base" />
                  </InputOTPGroup>
                </InputOTP>

                <Button
                  onClick={handleVerifyCode}
                  disabled={isLoading || otp.length !== 8}
                  className="w-full gap-2 rounded-full bg-foreground py-6 text-background transition-all duration-300 hover:bg-foreground/90 hover:shadow-lg"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  ) : null}
                  <span className="text-sm font-medium">
                    {isLoading ? "Verifying..." : "Verify & Sign In"}
                  </span>
                </Button>

                <button
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                >
                  Didn't receive a code? Resend
                </button>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              By signing in, you agree to our{" "}
              <span className="text-foreground/70 hover:text-foreground cursor-pointer transition-colors">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-foreground/70 hover:text-foreground cursor-pointer transition-colors">
                Privacy Policy
              </span>
            </p>
          </div>
        </div>

        {/* Help text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Need help?{" "}
            <span className="text-foreground/70 hover:text-foreground cursor-pointer transition-colors">
              Contact support
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
