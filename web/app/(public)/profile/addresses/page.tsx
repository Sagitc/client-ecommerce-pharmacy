"use client";

import { useState, useEffect, FormEvent } from "react";
import { toast } from "sonner";
import { MapPin, Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { useAddresses } from "@/hooks/use-addresses";

function formatCep(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export default function AddressesPage() {
    const {
        addresses,
        isLoadingAddresses,
        addAddress,
        isAddingAddress,
        setDefaultAddress,
        isSettingDefaultAddress,
        removeAddress,
        isRemovingAddress,
    } = useAddresses();

    const [showForm, setShowForm] = useState(false);
    const [label, setLabel] = useState("Casa");
    const [cep, setCep] = useState("");
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [complement, setComplement] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [city, setCity] = useState("Rio de Janeiro");
    const [state, setState] = useState("RJ");
    const [isDefault, setIsDefault] = useState(false);
    const [isLookingUpCep, setIsLookingUpCep] = useState(false);

    useEffect(() => {
        if (!showForm) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setShowForm(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showForm]);

    const handleCepChange = async (rawValue: string) => {
        const formatted = formatCep(rawValue);
        setCep(formatted);

        const cleanDigits = formatted.replace(/\D/g, "");
        if (cleanDigits.length === 8) {
            setIsLookingUpCep(true);
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cleanDigits}/json/`);
                const data = await res.json();
                if (!data.erro) {
                    if (data.logradouro) setStreet(data.logradouro);
                    if (data.bairro) setNeighborhood(data.bairro);
                    if (data.localidade) setCity(data.localidade);
                    if (data.uf) setState(data.uf);
                }
            } catch {
                // Ignora se o ViaCEP falhar e permite preenchimento manual
            } finally {
                setIsLookingUpCep(false);
            }
        }
    };

    const handleCreateAddress = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await addAddress({
                label: label.trim() || "Casa",
                cep: cep.trim(),
                street: street.trim(),
                number: number.trim(),
                complement: complement.trim() || undefined,
                neighborhood: neighborhood.trim(),
                city: city.trim(),
                state: state.trim().toUpperCase() || "RJ",
                is_default: isDefault || addresses.length === 0,
            });

            toast.success("Endereço adicionado com sucesso!");
            setShowForm(false);
            setLabel("Casa");
            setCep("");
            setStreet("");
            setNumber("");
            setComplement("");
            setNeighborhood("");
            setIsDefault(false);
        } catch (err: any) {
            toast.error("Erro ao cadastrar endereço", {
                description: err?.message || "Verifique os campos informados.",
            });
        }
    };

    const handleSetDefault = async (id: number) => {
        try {
            await setDefaultAddress(id);
            toast.success("Endereço definido como padrão!");
        } catch (err: any) {
            toast.error(err?.message || "Erro ao definir endereço padrão.");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await removeAddress(id);
            toast.success("Endereço removido com sucesso.");
        } catch (err: any) {
            toast.error(err?.message || "Erro ao remover endereço.");
        }
    };

    return (
        <div className="bg-background border shadow-sm rounded-lg px-6 pt-6 pb-8">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <MapPin className="size-6 text-primary" />
                    Meus endereços
                </h1>

                {!showForm && (
                    <Button onClick={() => setShowForm(true)}>
                        <Plus className="size-4 mr-1.5" />
                        Adicionar novo endereço
                    </Button>
                )}
            </div>

            {showForm ? (
                <form
                    onSubmit={handleCreateAddress}
                    className="bg-accent/40 border rounded-lg p-5 mb-6 space-y-4"
                >
                    <h2 className="text-lg font-semibold">Novo Endereço</h2>
                    <FieldGroup className="gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="addr-label">Identificação (Ex: Casa, Trabalho)</FieldLabel>
                                <Input
                                    id="addr-label"
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    placeholder="Casa"
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="addr-cep">
                                    CEP {isLookingUpCep && <span className="text-xs text-muted-foreground">(Buscando...)</span>}
                                </FieldLabel>
                                <Input
                                    id="addr-cep"
                                    value={cep}
                                    onChange={(e) => handleCepChange(e.target.value)}
                                    placeholder="00000-000"
                                    required
                                />
                            </Field>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Field className="sm:col-span-2">
                                <FieldLabel htmlFor="addr-street">Rua / Logradouro</FieldLabel>
                                <Input
                                    id="addr-street"
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                    placeholder="Estrada Marechal Alencastro"
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="addr-number">Número</FieldLabel>
                                <Input
                                    id="addr-number"
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value)}
                                    placeholder="291"
                                    required
                                />
                            </Field>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="addr-complement">Complemento (opcional)</FieldLabel>
                                <Input
                                    id="addr-complement"
                                    value={complement}
                                    onChange={(e) => setComplement(e.target.value)}
                                    placeholder="Apto, Bloco, Casa..."
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="addr-neighborhood">Bairro</FieldLabel>
                                <Input
                                    id="addr-neighborhood"
                                    value={neighborhood}
                                    onChange={(e) => setNeighborhood(e.target.value)}
                                    placeholder="Anchieta"
                                    required
                                />
                            </Field>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Field className="sm:col-span-2">
                                <FieldLabel htmlFor="addr-city">Cidade</FieldLabel>
                                <Input
                                    id="addr-city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="addr-state">UF</FieldLabel>
                                <Input
                                    id="addr-state"
                                    value={state}
                                    maxLength={2}
                                    onChange={(e) => setState(e.target.value.toUpperCase())}
                                    required
                                />
                            </Field>
                        </div>

                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isDefault || addresses.length === 0}
                                disabled={addresses.length === 0}
                                onChange={(e) => setIsDefault(e.target.checked)}
                                className="rounded border-input"
                            />
                            Definir como endereço principal
                        </label>

                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={isAddingAddress}>
                                {isAddingAddress ? "Salvando..." : "Salvar endereço"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowForm(false)}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </FieldGroup>
                </form>
            ) : addresses.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                    <MapPin className="size-12 text-muted-foreground/50" />
                    <span className="text-lg text-muted-foreground">
                        Não há endereços cadastrados.
                    </span>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {addresses.map((address: any) => {
                        const isAddrDefault = Boolean(address.is_default ?? address.isDefault);
                        return (
                            <div
                                key={address.id}
                                className={`bg-card border rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                    isAddrDefault ? "border-primary/60" : ""
                                }`}
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-semibold">
                                            {address.label || "Endereço"} — {address.street}, {address.number}
                                        </h2>
                                        {isAddrDefault && (
                                            <Badge variant="default" className="text-xs">
                                                Principal
                                            </Badge>
                                        )}
                                    </div>
                                    {address.complement && (
                                        <p className="text-sm text-muted-foreground">
                                            Complemento: {address.complement}
                                        </p>
                                    )}
                                    <p className="text-sm text-muted-foreground">
                                        {address.neighborhood} — {address.city}/{address.state}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        CEP: {address.cep || address.zipCode}
                                    </p>
                                </div>

                                <div className="flex sm:flex-col gap-2 shrink-0">
                                    {!isAddrDefault && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={isSettingDefaultAddress}
                                            onClick={() => handleSetDefault(address.id)}
                                        >
                                            <Check className="size-4 mr-1.5" />
                                            Definir como padrão
                                        </Button>
                                    )}
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        disabled={isRemovingAddress}
                                        onClick={() => handleDelete(address.id)}
                                    >
                                        <Trash2 className="size-4 mr-1.5" />
                                        Remover
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            { isLoadingAddresses &&
                <div className="py-10 text-center text-muted-foreground">
                    Carregando seus endereços...
                </div>
            }
        
        </div>
    );
}
