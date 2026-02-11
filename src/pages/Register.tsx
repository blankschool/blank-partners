import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail } from "lucide-react";

const ALLOWED_DOMAIN = "@blankschool.com.br";

export default function Register() {
  const { user, loading, signUpWithOtp, verifyOtp } = useAuth();
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
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    if (!trimmed.endsWith(ALLOWED_DOMAIN)) {
      toast({
        title: "Domínio não permitido",
        description: `Apenas emails ${ALLOWED_DOMAIN} podem criar conta.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await signUpWithOtp(trimmed);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Código enviado", description: "Verifique seu email para o código de verificação" });
      setStep("verify");
    }
    setIsLoading(false);
  };

  const handleVerifyCode = async () => {
    if (otp.length !== 6) return;
    setIsLoading(true);
    const { error } = await verifyOtp(email.trim().toLowerCase(), otp);
    if (error) {
      toast({ title: "Verificação falhou", description: error.message, variant: "destructive" });
      setOtp("");
    }
    setIsLoading(false);
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    const { error } = await signUpWithOtp(email.trim().toLowerCase());
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Código reenviado", description: "Verifique seu email para o novo código" });
    }
    setIsLoading(false);
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
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-muted-foreground/10" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-foreground/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-muted-foreground/5 blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="rounded-2xl border border-border/50 bg-card/80 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-foreground to-muted-foreground shadow-lg">
              <span className="font-serif text-3xl font-normal text-background">B</span>
            </div>
            <div className="mt-4 flex flex-col items-center">
              <span className="font-serif text-2xl font-normal text-foreground">Blank</span>
              <span className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Agency ERP</span>
            </div>
          </div>

          {step === "email" ? (
            <>
              <div className="mb-8 text-center">
                <h1 className="font-serif text-3xl font-normal text-foreground">Criar conta</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Insira seu email corporativo para criar sua conta
                </p>
              </div>

              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="voce@blankschool.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-full pl-11 pr-4"
                    disabled={isLoading}
                    required
                  />
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  Apenas emails <span className="font-medium text-foreground/70">{ALLOWED_DOMAIN}</span> são aceitos
                </p>
                <Button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="w-full gap-2 rounded-full bg-foreground py-6 text-background transition-all duration-300 hover:bg-foreground/90 hover:shadow-lg"
                >
                  {isLoading && <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />}
                  <span className="text-sm font-medium">{isLoading ? "Enviando..." : "Enviar Código"}</span>
                </Button>
              </form>
            </>
          ) : (
            <>
              <button
                onClick={() => { setStep("email"); setOtp(""); }}
                className="mb-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Usar outro email
              </button>

              <div className="mb-8 text-center">
                <h1 className="font-serif text-3xl font-normal text-foreground">Verificar código</h1>
                <p className="mt-2 text-sm text-muted-foreground">Enviamos um código de 6 dígitos para</p>
                <p className="mt-1 text-sm font-medium text-foreground">{email}</p>
              </div>

              <div className="flex flex-col items-center space-y-6">
                <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={isLoading}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} className="h-12 w-12 rounded-xl border-border text-lg" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>

                <Button
                  onClick={handleVerifyCode}
                  disabled={isLoading || otp.length !== 6}
                  className="w-full gap-2 rounded-full bg-foreground py-6 text-background transition-all duration-300 hover:bg-foreground/90 hover:shadow-lg"
                >
                  {isLoading && <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />}
                  <span className="text-sm font-medium">{isLoading ? "Verificando..." : "Verificar & Entrar"}</span>
                </Button>

                <button
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                >
                  Não recebeu o código? Reenviar
                </button>
              </div>
            </>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Já tem conta?{" "}
              <Link to="/auth" className="font-medium text-foreground/70 transition-colors hover:text-foreground">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
