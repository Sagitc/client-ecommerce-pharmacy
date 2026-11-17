"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EditableProfileAvatar } from "@/components/editable-profile-avatar";
import { useUser } from "@/contexts/user-context";
import { useOrders } from "@/hooks/use-orders";
import { useAddresses } from "@/hooks/use-addresses";
import { Edit, HeartCrack, MapPin, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Container({
    children,
    sectionStyle,
    containerStyle,
}: {
    children: React.ReactNode;
    sectionStyle?: string;
    containerStyle?: string;
}) {
    return (
        <section className={`bg-background rounded-lg border shadow-sm p-5 ${sectionStyle || ""}`}>
            <div className={`h-full flex flex-col gap-4 ${containerStyle || ""}`}>
                {children}
            </div>
        </section>
    );
}

const STATUS_LABELS: Record<string, string> = {
    pending: "Pendente",
    awaiting_prescription_review: "Aguardando Receita",
    processing: "Em separação",
    ready_for_pickup: "Pronto p/ retirada",
    out_for_delivery: "Saiu p/ entrega",
    completed: "Concluído",
    cancelled: "Cancelado",
};

function LastOrders({ parentStyle }: { parentStyle?: string }) {
    const { orders, isLoadingOrders } = useOrders();
    const [selectedYear, setSelectedYear] = useState<string>("all");

    const availableYears: number[] = Array.from(
        new Set<number>(
            orders.map((ord: any) =>
                new Date(ord.created_at || Date.now()).getFullYear()
            )
        )
    ).sort((a, b) => b - a);

    const filteredOrders = orders.filter((ord: any) => {
        if (selectedYear === "all") return true;
        const year = new Date(ord.created_at || Date.now()).getFullYear();
        return String(year) === selectedYear;
    });

    return (
        <Container sectionStyle={parentStyle}>
            <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg flex items-center gap-2">
                    <Package className="size-5 text-primary" />
                    Últimas compras
                </h2>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="bg-background border rounded-md px-3 py-1 text-sm"
                >
                    <option value="all">Todos</option>
                    {availableYears.map((yr) => (
                        <option key={yr} value={String(yr)}>
                            {yr}
                        </option>
                    ))}
                </select>
            </div>
            <Separator />
            {isLoadingOrders ? (
                <div className="flex-1 flex items-center justify-center py-8 text-sm text-muted-foreground">
                    Carregando seus pedidos...
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="flex-1 flex flex-col gap-2 items-center justify-center rounded-md bg-accent py-8">
                    <HeartCrack className="size-10 text-muted-foreground" />
                    <p className="text-muted-foreground text-center text-sm">
                        Você ainda não realizou <br />
                        nenhuma compra.
                    </p>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto max-h-80 pr-1">
                    <ul className="space-y-2">
                        {filteredOrders.slice(0, 5).map((order: any) => {
                            const formattedDate = order.created_at
                                ? new Date(order.created_at).toLocaleDateString("pt-BR")
                                : "";
                            const totalFormatted = Number(order.total ?? 0)
                                .toFixed(2)
                                .replace(".", ",");

                            return (
                                <li key={order.id}>
                                    <Link
                                        href={`/profile/orders/${order.id}`}
                                        className="block transition-transform hover:scale-[1.01]"
                                    >
                                        <div className="flex justify-between items-center bg-accent rounded-lg p-4">
                                            <div>
                                                <p className="font-semibold text-foreground">
                                                    Pedido #{order.order_number || order.id}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formattedDate} • {STATUS_LABELS[order.status] || order.status}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-foreground">
                                                    R$ {totalFormatted}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
            <Link href="/profile/orders" className="mt-auto text-sm text-primary font-medium hover:underline">
                Ver todos os pedidos
            </Link>
        </Container>
    );
}

function MainAddress() {
    const { addresses, isLoadingAddresses } = useAddresses();
    const userCtx = useUser();

    const mainAddress =
        addresses.find((a: any) => a.is_default) || addresses[0] || null;

    return (
        <Container containerStyle="gap-3">
            <h2 className="font-bold text-lg flex items-center gap-2">
                <MapPin className="size-5 text-primary" />
                Endereço principal
            </h2>

            {isLoadingAddresses ? (
                <div className="bg-accent p-4 rounded-md text-sm text-muted-foreground">
                    Carregando endereço...
                </div>
            ) : mainAddress ? (
                <div className="flex-1 flex flex-col justify-evenly gap-1 bg-accent p-4 rounded-md">
                    <span className="text-base font-semibold text-foreground">
                        {mainAddress.label || userCtx?.user?.fullName || "Endereço"}
                    </span>
                    <span className="text-muted-foreground text-sm">
                        {mainAddress.street}, {mainAddress.number}
                        {mainAddress.complement ? ` - ${mainAddress.complement}` : ""}
                        <br />
                        {mainAddress.neighborhood} - {mainAddress.city}/{mainAddress.state}
                        <br />
                        CEP: {mainAddress.cep}
                    </span>
                </div>
            ) : (
                <div className="bg-accent p-4 rounded-md text-sm text-muted-foreground">
                    Nenhum endereço cadastrado ainda.
                </div>
            )}

            <Link
                href="/profile/addresses"
                className="inline-flex flex-row items-center text-sm font-medium text-primary hover:underline gap-1.5"
            >
                {mainAddress ? "Gerenciar endereços" : "Cadastrar endereço"}
                <Edit className="size-4" />
            </Link>
        </Container>
    );
}

function AccountInfoSummary() {
    const userCtx = useUser();
    const currentUser = userCtx?.user;

    return (
        <Container containerStyle="gap-3">
            <h2 className="font-bold text-lg">Meus dados</h2>
            <div className="bg-accent p-4 rounded-md space-y-1 text-sm">
                <p>
                    <span className="text-muted-foreground">E-mail: </span>
                    <span className="font-medium">{currentUser?.email || "-"}</span>
                </p>
                <p>
                    <span className="text-muted-foreground">CPF: </span>
                    <span className="font-medium">{currentUser?.cpf || "Não informado"}</span>
                </p>
                <p>
                    <span className="text-muted-foreground">Telefone: </span>
                    <span className="font-medium">{currentUser?.phone || "Não informado"}</span>
                </p>
            </div>
            <div className="flex gap-4 text-sm">
                <Link href="/profile/edit" className="text-primary font-medium hover:underline">
                    Editar dados
                </Link>
                <Link href="/profile/change-password" className="text-primary font-medium hover:underline">
                    Alterar senha
                </Link>
            </div>
        </Container>
    );
}

export default function ResumePage() {
    const userCtx = useUser();
    const currentUser = userCtx?.user;
    const router = useRouter();

    return (
        <div className="container mx-auto flex flex-col gap-6">
            <div className="hidden md:flex justify-between bg-background/80 backdrop-blur-md p-5 rounded-lg border shadow-sm">
                <div className="items-center justify-center md:flex gap-6">
                    <EditableProfileAvatar />
                    <div>
                        <span className="text-2xl">
                            Olá, <br />
                        </span>
                        <span className="font-bold self-center text-3xl">
                            {currentUser?.name} {currentUser?.lastName}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => router.push("/profile/edit")}
                    >
                        Editar perfil
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => router.push("/profile/change-password")}
                    >
                        Trocar senha
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <LastOrders parentStyle="h-full" />
                <div className="flex flex-col gap-6">
                    <MainAddress />
                    <AccountInfoSummary />
                </div>
            </div>
        </div>
    );
}
