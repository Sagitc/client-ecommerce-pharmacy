"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
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

function formatCpf(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function getMaxAdultBirthDate(): string {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

function isAtLeast18YearsOld(birthDateStr: string): boolean {
    if (!birthDateStr) return false;
    const [year, month, day] = birthDateStr.split("-").map(Number);
    if (!year || !month || !day) return false;
    const today = new Date();
    let age = today.getFullYear() - year;
    const monthDiff = today.getMonth() + 1 - month;
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
        age--;
    }
    return age >= 18;
}

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();
    const { register, isRegistering } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [cpf, setCpf] = useState("");
    const [phone, setPhone] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(null);

        if (password.length < 6) {
            const msg = "A senha deve ter pelo menos 6 caracteres.";
            setErrorMessage(msg);
            toast.error(msg);
            return;
        }

        if (password !== passwordConfirmation) {
            const msg = "As senhas informadas não coincidem.";
            setErrorMessage(msg);
            toast.error(msg);
            return;
        }

        if (!birthDate) {
            const msg = "Informe sua data de nascimento.";
            setErrorMessage(msg);
            toast.error(msg);
            return;
        }

        if (!isAtLeast18YearsOld(birthDate)) {
            const msg = "É necessário ter pelo menos 18 anos para realizar o cadastro.";
            setErrorMessage(msg);
            toast.error(msg);
            return;
        }

        try {
            await register({
                name: name.trim(),
                email: email.trim(),
                cpf: cpf.trim() || undefined,
                phone: phone.trim() || undefined,
                birth_date: birthDate || undefined,
                password,
                password_confirmation: passwordConfirmation,
            });

            toast.success("Conta criada com sucesso!", {
                description: "Seja bem-vindo(a) à farmácia Camargo.",
            });
            router.push("/");
        } catch (err: any) {
            const msg = err?.message || "Erro ao criar sua conta.";
            setErrorMessage(msg);
            toast.error("Não foi possível cadastrar", { description: msg });
        }
    };

    return (
        <div className={cn("flex flex-col gap-3", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form onSubmit={handleSubmit} className="p-5 md:p-6">
                        <FieldGroup className="gap-3.5">
                            <div className="flex flex-col items-center gap-1 text-center">
                                <h1 className="text-2xl font-bold">Cadastrar</h1>
                                <p className="text-sm text-balance text-muted-foreground">
                                    Preencha seus dados abaixo para criar sua conta
                                </p>
                            </div>

                            {errorMessage && (
                                <div className="rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-sm text-destructive">
                                    {errorMessage}
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="name">Nome completo</FieldLabel>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Maria Silva"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </Field>

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
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Mínimo 6 caracteres"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="confirm-password">Confirmar senha</FieldLabel>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        placeholder="Repita a senha"
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        required
                                    />
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="cpf">CPF</FieldLabel>
                                    <Input
                                        id="cpf"
                                        type="text"
                                        placeholder="000.000.000-00"
                                        value={cpf}
                                        onChange={(e) => setCpf(formatCpf(e.target.value))}
                                        required
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="phone">Celular / WhatsApp</FieldLabel>
                                    <Input
                                        id="phone"
                                        type="text"
                                        placeholder="(21) 99999-9999"
                                        value={phone}
                                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                                    />
                                </Field>
                            </div>

                            <Field>
                                <FieldLabel htmlFor="birthdate">Data de nascimento (apenas maiores de 18 anos)</FieldLabel>
                                <Input
                                    id="birthdate"
                                    type="date"
                                    max={getMaxAdultBirthDate()}
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    required
                                />
                            </Field>

                            <Field>
                                <Button type="submit" disabled={isRegistering} className="mt-2 w-full">
                                    {isRegistering ? "Criando conta..." : "Criar conta"}
                                </Button>
                            </Field>

                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Ou
                            </FieldSeparator>

                            <FieldDescription className="text-center">
                                Possui uma conta?{" "}
                                <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                                    Entrar
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
                            Cadastre-se para acompanhar seus pedidos, salvar endereços e receber ofertas exclusivas.
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
