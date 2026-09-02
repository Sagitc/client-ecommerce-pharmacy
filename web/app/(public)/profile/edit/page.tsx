"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/user-context";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
    
    const user = useUser();
    const router = useRouter();
    const INPUT_DEFAULT_STYLES = "text-sm text-muted-foreground";

    return (
        <div className="bg-background shadow-md rounded-lg px-4 pt-6 pb-8">
            <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>

            {/* NOME, SOBRENOME, EMAIL, SENHA, BT-SENHA, CPF, CELULAR, NASCIMENTO, GÊNERO */}

            <form className="space-y-2">
                <FieldGroup className="gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel htmlFor="name" className="font-light">Nome</FieldLabel>
                            <Input
                                id="name"
                                type="text"
                                defaultValue={user?.user?.name}
                                className={INPUT_DEFAULT_STYLES}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="lastName" className="font-light">Sobrenome</FieldLabel>
                            <Input
                                id="lastName"
                                type="text"
                                defaultValue={user?.user?.lastName}
                                className={INPUT_DEFAULT_STYLES}
                            />
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="email" className="font-light">Email</FieldLabel>
                        <Input
                            id="email"
                            type="text"
                            defaultValue={user?.user?.email}
                            className={INPUT_DEFAULT_STYLES}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="password" className="font-light">Senha</FieldLabel>
                        <div className="flex items-center gap-4">
                            <Input
                                id="password"
                                type="password"
                                placeholder="********"
                                className={INPUT_DEFAULT_STYLES}
                            />
                            <Button variant="link" className="text-sm" onClick={() => router.push("/profile/change-password")}>
                                Alterar senha
                            </Button>
                        </div>
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel htmlFor="cpf" className="font-light">CPF</FieldLabel>
                            <Input
                                id="cpf"
                                type="text"
                                className={INPUT_DEFAULT_STYLES}
                                defaultValue={user?.user?.cpf}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="cellphone" className="font-light">Celular</FieldLabel>
                            <Input
                                id="cellphone"
                                type="text"
                                className={INPUT_DEFAULT_STYLES}
                                defaultValue={user?.user?.phone}
                            />
                        </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel htmlFor="birthdate" className="font-light">Nascimento</FieldLabel>
                            <Input
                                id="birthdate"
                                type="date"
                                className={INPUT_DEFAULT_STYLES}
                                defaultValue={user?.user?.birthDate?.toISOString().split("T")[0]}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="gender" className="font-light">Gênero</FieldLabel>
                            <Input
                                id="gender"
                                type="text"
                                className={INPUT_DEFAULT_STYLES}
                                defaultValue={user?.user?.gender}
                            />
                        </Field>
                    </div>

                    <Button type="submit" className="w-full mt-4">
                        Salvar Alterações
                    </Button>
                </FieldGroup>
            </form>
        </div>
    );
}