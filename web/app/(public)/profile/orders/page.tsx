"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, Package, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/use-orders";

const STATUS_LABELS: Record<string, string> = {
    pending: "Pendente",
    awaiting_prescription_review: "Aguardando Avaliação da Receita",
    processing: "Em separação",
    ready_for_pickup: "Pronto para retirada",
    out_for_delivery: "Saiu para entrega",
    completed: "Entregue / Concluído",
    cancelled: "Cancelado",
};

const PAYMENT_LABELS: Record<string, string> = {
    pix: "PIX",
    credit_card: "Cartão de Crédito",
    debit_card: "Cartão de Débito",
    cash_on_delivery: "Dinheiro na Entrega",
};

export default function OrdersPage() {
    const { orders, isLoadingOrders } = useOrders();
    const [selectedFilter, setSelectedFilter] = useState("todos");

    const orderYears = useMemo<number[]>(() => {
        return Array.from(
            new Set<number>(
                orders.map((order: any) =>
                    new Date(order.created_at || Date.now()).getFullYear()
                )
            )
        ).sort((a, b) => b - a);
    }, [orders]);

    const filteredOrders = useMemo(() => {
        const now = new Date();
        return orders.filter((order: any) => {
            if (selectedFilter === "todos") return true;

            const orderDate = new Date(order.created_at || Date.now());
            if (selectedFilter === "last30days") {
                const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
                return diffDays <= 30;
            }
            if (selectedFilter === "last6months") {
                const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
                return diffDays <= 180;
            }

            return String(orderDate.getFullYear()) === selectedFilter;
        });
    }, [orders, selectedFilter]);

    return (
        <div className="bg-background border shadow-sm rounded-lg px-6 pt-6 pb-8">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Package className="size-6 text-primary" />
                    Meus pedidos
                </h1>

                <div className="relative">
                    <select
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                        className="appearance-none rounded-md border border-input bg-background pl-3 pr-8 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                        <option value="todos">Todos os períodos</option>
                        <option value="last30days">Últimos 30 dias</option>
                        <option value="last6months">Últimos 6 meses</option>

                        {orderYears.map((year) => (
                            <option key={year} value={String(year)}>
                                {year}
                            </option>
                        ))}
                    </select>

                    <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 opacity-50 pointer-events-none" />
                </div>
            </div>

            { orders.length === 0 && 
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                    <Package className="size-12 text-muted-foreground/50" />
                    <span className="text-lg text-muted-foreground">
                        Não há histórico de pedidos.
                    </span>
                    <Button variant="outline">
                        <Link href="/">Ir às compras</Link>
                    </Button>
                </div>
            }

            {isLoadingOrders ? (
                <div className="py-12 text-center text-muted-foreground">
                    Carregando seu histórico de pedidos...
                </div>
            ) : filteredOrders.length === 0 && orders.length !== 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                    <Package className="size-12 text-muted-foreground/50" />
                    <span className="text-lg text-muted-foreground">
                        Não há histórico de pedidos para o filtro selecionado.
                    </span>
                    <Button variant="outline">
                        <Link href="/">Ir às compras</Link>
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filteredOrders.map((order: any) => {
                        const dateStr = order.created_at
                            ? new Date(order.created_at).toLocaleDateString("pt-BR")
                            : "-";
                        const totalValue = Number(order.total ?? 0);

                        return (
                            <div
                                key={order.id}
                                className="bg-card border rounded-lg p-5 shadow-xs flex flex-col gap-3"
                            >
                                <div className="flex flex-wrap justify-between items-center gap-2 border-b pb-3">
                                    <div>
                                        <h2 className="text-lg font-bold">
                                            Pedido #{order.order_number || order.id}
                                        </h2>
                                        <span className="text-xs text-muted-foreground">
                                            Realizado em {dateStr} • Pagamento:{" "}
                                            {PAYMENT_LABELS[order.payment_method] || order.payment_method}
                                        </span>
                                    </div>
                                    <Badge variant="secondary">
                                        {STATUS_LABELS[order.status] || order.status}
                                    </Badge>
                                </div>

                                <div className="text-sm text-muted-foreground">
                                    {order.shipping_method === "pickup" ? (
                                        <p>
                                            <strong>Retirada na loja:</strong>{" "}
                                            {order.pharmacy_unit?.name || "Unidade Farmácia Camargo"}
                                        </p>
                                    ) : order.address ? (
                                        <p>
                                            <strong>Entrega em:</strong> {order.address.street},{" "}
                                            {order.address.number} - {order.address.neighborhood},{" "}
                                            {order.address.city}/{order.address.state}
                                        </p>
                                    ) : null}
                                </div>

                                {Array.isArray(order.items) && order.items.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-semibold mb-1.5">Itens do pedido:</h3>
                                        <ul className="space-y-1">
                                            {order.items.map((item: any) => {
                                                const unitPrice = Number(item.unit_price ?? item.price ?? 0);
                                                const label =
                                                    item.product?.label ||
                                                    item.label ||
                                                    `Produto #${item.product_id}`;
                                                return (
                                                    <li
                                                        key={item.id}
                                                        className="text-sm text-muted-foreground flex justify-between"
                                                    >
                                                        <span>
                                                            {item.quantity}x {label}
                                                        </span>
                                                        <span>
                                                            R${" "}
                                                            {(unitPrice * Number(item.quantity || 1))
                                                                .toFixed(2)
                                                                .replace(".", ",")}
                                                        </span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-2 border-t mt-1">
                                    <span className="text-base font-bold">
                                        Total: R$ {totalValue.toFixed(2).replace(".", ",")}
                                    </span>
                                    <Button variant="outline" size="sm">
                                        <Link href={`/profile/orders/${order.id}`} className="flex items-center">
                                            <FileText className="size-4 mr-1.5" />
                                            Ver detalhes
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
