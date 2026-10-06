"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

function ResetPasswordForm() {
    const searchParams = useSearchParams();

    // O Laravel exige que você devolva o token e o e-mail no POST de redefinição
    const token = searchParams.get("token");
    const email = searchParams.get("email") || "";

    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Payload para o Laravel: { token, email, password, password_confirmation }
        console.log("Enviando nova senha...");
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* O campo de e-mail é obrigatório pelo Laravel, muitas vezes é enviado como hidden ou readonly */}
            <div>
                <label className="text-sm font-medium">E-mail</label>
                <Input type="email" value={email} readOnly className="mt-1 bg-background text-muted-foreground" />
            </div>

            <div>
                <label className="text-sm font-medium">Nova Senha</label>
                <div className="relative flex items-center mt-1">
                    <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
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

            <Button type="submit" className="w-full h-11 bg-primary text-base mt-4">
                Redefinir senha
            </Button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl border shadow-sm">

                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <LockKeyhole className="w-6 h-6 text-primary" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-2 text-center">Criar nova senha</h1>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                    Sua nova senha deve ser diferente das senhas utilizadas anteriormente.
                </p>

                {/* O useSearchParams requer um Suspense boundary no Next.js para Client Components */}
                <Suspense fallback={<p className="text-center text-sm text-muted-foreground">Carregando formulário...</p>}>
                    <ResetPasswordForm />
                </Suspense>

            </div>
        </div>
    );
}