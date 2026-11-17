"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();
    const { login, isLoggingIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(null);

        try {
            await login({ email: email.trim(), password });
            toast.success("Login realizado com sucesso!", {
                description: "Bem-vindo(a) de volta à Farmácia Camargo.",
            });
            router.push("/");
        } catch (err: any) {
            const msg = err?.message || "Não foi possível realizar o login.";
            setErrorMessage(msg);
            toast.error("Falha no login", { description: msg });
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form onSubmit={handleSubmit} className="p-6 md:p-8">
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Bem-vindo(a) de volta</h1>
                                <p className="text-balance text-muted-foreground">
                                    Faça login na sua conta
                                </p>
                            </div>

                            {errorMessage && (
                                <div className="rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-sm text-destructive">
                                    {errorMessage}
                                </div>
                            )}

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Field>

                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                                    <Link
                                        href="/forgot-password"
                                        className="ms-auto text-sm underline-offset-2 hover:underline"
                                    >
                                        Esqueceu a senha?
                                    </Link>
                                </div>
                                <div className="relative flex items-center">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </Field>

                            <Field>
                                <Button type="submit" disabled={isLoggingIn} className="w-full">
                                    {isLoggingIn ? "Entrando..." : "Login"}
                                </Button>
                            </Field>

                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Ou
                            </FieldSeparator>

                            <FieldDescription className="text-center">
                                Não possui uma conta?{" "}
                                <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
                                    Cadastrar
                                </Link>
                            </FieldDescription>
                        </FieldGroup>
                    </form>

                    <div className="relative hidden bg-muted md:flex flex-col justify-center items-center p-8 text-center">
                        <img
                            src="/logo.svg"
                            alt="Farmácia Camargo"
                            className="max-w-48 mb-4 opacity-90"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                        />
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Cuidando da sua saúde e bem-estar com entrega rápida em Anchieta e região.
                        </p>
                    </div>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                Ao continuar, você concorda com nossos <Link href="/terms">Termos de Serviço</Link>{" "}
                e <Link href="/privacity">Política de Privacidade</Link>.
            </FieldDescription>
        </div>
    );
}
