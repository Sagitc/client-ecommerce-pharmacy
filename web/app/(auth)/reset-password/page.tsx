"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, LockKeyhole, CheckCircle2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { resetPassword, isResettingPassword } = useAuth();

    const tokenParam = searchParams.get("token") || "";
    const emailParam = searchParams.get("email") || "";

    const [token, setToken] = useState(tokenParam);
    const [email, setEmail] = useState(emailParam);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!token.trim()) {
            const msg = "Token de recuperação ausente. Acesse o link enviado para o seu e-mail.";
            setErrorMessage(msg);
            toast.error(msg);
            return;
        }

        if (password.length < 6) {
            const msg = "A nova senha deve ter pelo menos 6 caracteres.";
            setErrorMessage(msg);
            toast.error(msg);
            return;
        }

        if (password !== passwordConfirmation) {
            const msg = "A confirmação de senha não confere.";
            setErrorMessage(msg);
            toast.error(msg);
            return;
        }

        try {
            await resetPassword({
                token: token.trim(),
                email: email.trim(),
                password,
                password_confirmation: passwordConfirmation,
            });
            setIsSuccess(true);
            toast.success("Sua senha foi redefinida com sucesso!");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err: any) {
            const msg = err?.message || "Erro ao redefinir a senha.";
            setErrorMessage(msg);
            toast.error("Falha ao redefinir senha", { description: msg });
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-700" />
                </div>
                <h2 className="text-xl font-bold mb-2">Senha redefinida!</h2>
                <p className="text-sm text-muted-foreground mb-6">
                    Sua senha foi atualizada com sucesso. Redirecionando para o login...
                </p>
                <Button className="w-full" onClick={() => router.push("/login")}>
                    Ir para o Login
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errorMessage && (
                <div className="rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-sm text-destructive">
                    {errorMessage}
                </div>
            )}

            <div>
                <label className="text-sm font-medium">E-mail</label>
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly={Boolean(emailParam)}
                    required
                    placeholder="seu@email.com"
                    className={`mt-1 ${emailParam ? "bg-muted text-muted-foreground" : ""}`}
                />
            </div>

            {!tokenParam && (
                <div>
                    <label className="text-sm font-medium">Código / Token de recuperação</label>
                    <Input
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        required
                        placeholder="Cole o token recebido por e-mail"
                        className="mt-1"
                    />
                </div>
            )}

            <div>
                <label className="text-sm font-medium">Nova Senha</label>
                <div className="relative flex items-center mt-1">
                    <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Mínimo 6 caracteres"
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-muted-foreground hover:text-foreground"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <div>
                <label className="text-sm font-medium">Confirmar Nova Senha</label>
                <div className="relative flex items-center mt-1">
                    <Input
                        type={showPassword ? "text" : "password"}
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        required
                        placeholder="Repita a nova senha"
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-muted-foreground hover:text-foreground"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <Button
                type="submit"
                disabled={isResettingPassword}
                className="w-full h-11 bg-primary text-base mt-4"
            >
                {isResettingPassword ? "Redefinindo..." : "Redefinir senha"}
            </Button>

            <div className="mt-2 text-center">
                <Link
                    href="/login"
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:underline"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para o login
                </Link>
            </div>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="w-full max-w-md bg-card p-6 md:p-8 rounded-xl border shadow-sm">
            <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <LockKeyhole className="w-6 h-6 text-primary" />
                </div>
            </div>

            <h1 className="text-2xl font-bold mb-2 text-center">Criar nova senha</h1>
            <p className="text-sm text-muted-foreground mb-6 text-center">
                Sua nova senha deve ser diferente das senhas utilizadas anteriormente.
            </p>

            <Suspense fallback={<p className="text-center text-sm text-muted-foreground">Carregando formulário...</p>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
