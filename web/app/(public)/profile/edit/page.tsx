"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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

export default function EditProfilePage() {
    const router = useRouter();
    const { user, updateProfile, isUpdatingProfile } = useAuth();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [phone, setPhone] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("");

    useEffect(() => {
        if (user) {
            const parts = String(user.name || "").trim().split(/\s+/);
            setFirstName(parts[0] || "");
            setLastName(parts.slice(1).join(" "));
            setEmail(user.email || "");
            setCpf(user.cpf || "");
            setPhone(user.phone || "");
            setBirthDate(user.birth_date ? String(user.birth_date).slice(0, 10) : "");
            setGender(user.gender || "");
        }
    }, [user]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

        if (!fullName) {
            toast.error("Informe o seu nome.");
            return;
        }

        try {
            await updateProfile({
                name: fullName,
                email: email.trim(),
                cpf: cpf.trim() || null,
                phone: phone.trim() || null,
                birth_date: birthDate || null,
                gender: gender.trim() || null,
            });
            toast.success("Perfil atualizado com sucesso!");
        } catch (err: any) {
            toast.error("Erro ao atualizar perfil", {
                description: err?.message || "Verifique os dados informados.",
            });
        }
    };

    return (
        <div className="bg-background border shadow-sm rounded-lg px-6 pt-6 pb-8">
            <h1 className="text-2xl font-bold mb-6">Editar Perfil</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <FieldGroup className="gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel htmlFor="name">Nome</FieldLabel>
                            <Input
                                id="name"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="lastName">Sobrenome</FieldLabel>
                            <Input
                                id="lastName"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="password">Senha</FieldLabel>
                        <div className="flex items-center gap-4">
                            <Input
                                id="password"
                                type="password"
                                value="********"
                                readOnly
                                className="bg-muted text-muted-foreground"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/profile/change-password")}
                            >
                                Alterar senha
                            </Button>
                        </div>
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel htmlFor="cpf">CPF</FieldLabel>
                            <Input
                                id="cpf"
                                type="text"
                                placeholder="000.000.000-00"
                                value={cpf}
                                onChange={(e) => setCpf(formatCpf(e.target.value))}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="cellphone">Celular</FieldLabel>
                            <Input
                                id="cellphone"
                                type="text"
                                placeholder="(21) 99999-9999"
                                value={phone}
                                onChange={(e) => setPhone(formatPhone(e.target.value))}
                            />
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel htmlFor="birthdate">Data de nascimento</FieldLabel>
                            <Input
                                id="birthdate"
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="gender">Gênero</FieldLabel>
                            <select
                                id="gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="">Selecione</option>
                                <option value="female">Feminino</option>
                                <option value="male">Masculino</option>
                                <option value="other">Outro / Prefiro não informar</option>
                            </select>
                        </Field>
                    </div>

                    <Button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="w-full mt-4"
                    >
                        {isUpdatingProfile ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </FieldGroup>
            </form>
        </div>
    );
}
