"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

export default function ChangePasswordPage() {
    const router = useRouter();
    const { changePassword, isChangingPassword } = useAuth();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(null);

        if (newPassword.length < 6) {
            const msg = "A nova senha deve ter pelo menos 6 caracteres.";
            setErrorMessage(msg);
            toast.error(msg);
            return;
        }

        if (newPassword !== confirmPassword) {
            const msg = "A confirmação da nova senha não confere.";
            setErrorMessage(msg);
            toast.error(msg);
            return;
        }

        try {
            await changePassword({
                current_password: currentPassword,
                password: newPassword,
                password_confirmation: confirmPassword,
            });

            toast.success("Senha alterada com sucesso!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            router.push("/profile");
        } catch (err: any) {
            const msg = err?.message || "Não foi possível alterar a senha.";
            setErrorMessage(msg);
            toast.error("Erro ao alterar senha", { description: msg });
        }
    };

    return (
        <div className="bg-background border shadow-sm rounded-lg px-6 pt-6 pb-8 max-w-6xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <LockKeyhole className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Alterar Senha</h1>
                    <p className="text-sm text-muted-foreground">
                        Informe sua senha atual e escolha uma nova senha segura.
                    </p>
                </div>
            </div>

            {errorMessage && (
                <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-sm text-destructive">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <FieldGroup className="gap-5">
                    <Field>
                        <FieldLabel htmlFor="current-password">Senha Atual</FieldLabel>
                        <Input
                            id="current-password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="new-password">Nova Senha</FieldLabel>
                        <div className="relative flex items-center">
                            <Input
                                id="new-password"
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Mínimo 6 caracteres"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword((prev) => !prev)}
                                className="absolute right-3 text-muted-foreground hover:text-foreground"
                            >
                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="confirm-password">Confirmar Nova Senha</FieldLabel>
                        <div className="relative flex items-center">
                            <Input
                                id="confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Repita a nova senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute right-3 text-muted-foreground hover:text-foreground"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </Field>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={isChangingPassword}>
                            {isChangingPassword ? "Salvando..." : "Atualizar Senha"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/profile/edit")}
                        >
                            Cancelar
                        </Button>
                    </div>
                </FieldGroup>
            </form>
        </div>
    );
}
