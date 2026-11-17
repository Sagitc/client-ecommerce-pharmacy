"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, MailCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

function ForgotPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { forgotPassword, isSendingResetLink } = useAuth();

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const token = searchParams.get("token");
        const emailParam = searchParams.get("email");
        if (token) {
            const query = new URLSearchParams();
            query.set("token", token);
            if (emailParam) query.set("email", emailParam);
            router.replace(`/reset-password?${query.toString()}`);
        }
    }, [searchParams, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        try {
            await forgotPassword(email.trim());
            setIsSubmitted(true);
            toast.success("Link de recuperação enviado!");
        } catch (err: any) {
            const msg = err?.message || "Não foi possível enviar o link de recuperação.";
            setErrorMessage(msg);
            toast.error("Erro ao enviar link", { description: msg });
        }
    };

    return (
        <div className="w-full max-w-md bg-card p-8 rounded-xl border shadow-sm">
            {!isSubmitted ? (
                <>
                    <h1 className="text-2xl font-bold mb-2">Esqueceu sua senha?</h1>
                    <p className="text-sm text-muted-foreground mb-6">
                        Digite o e-mail cadastrado e enviaremos um link para você redefinir sua senha.
                    </p>

                    {errorMessage && (
                        <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-sm text-destructive">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label htmlFor="email" className="text-sm font-medium">
                                E-mail
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isSendingResetLink}
                            className="w-full py-5 bg-primary text-base mt-2"
                        >
                            {isSendingResetLink ? "Enviando..." : "Enviar link de recuperação"}
                        </Button>
                    </form>
                </>
            ) : (
                <div className="flex flex-col items-center text-center py-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <MailCheck className="w-8 h-8 text-green-700" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Verifique seu e-mail</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                        Enviamos um link de recuperação para <strong>{email}</strong>.
                        Pode levar alguns minutos para chegar. Verifique também sua caixa de spam.
                    </p>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsSubmitted(false)}
                    >
                        Tentar outro e-mail
                    </Button>
                </div>
            )}

            <div className="mt-6 text-center">
                <Link
                    href="/login"
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:underline"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para o login
                </Link>
            </div>
        </div>
    );
}

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center">Carregando...</div>}>
            <ForgotPasswordContent />
        </Suspense>
    );
}
