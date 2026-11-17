"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Package, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrderDetail } from "@/hooks/use-orders";

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

export default function OrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const { data: order, isLoading, isError } = useOrderDetail(id);

    if (isLoading) {
        return (
            <div className="bg-background border shadow-sm rounded-lg p-8 text-center text-muted-foreground">
                Carregando detalhes do pedido...
            </div>
        );
    }

    if (isError || !order) {
        return (
            <div className="bg-background border shadow-sm rounded-lg p-8 text-center space-y-4">
                <p className="text-muted-foreground">Pedido não encontrado.</p>
                <Button variant="outline">
                    <Link href="/profile/orders">Voltar para Meus Pedidos</Link>
                </Button>
            </div>
        );
    }

    const formattedDate = order.created_at
        ? new Date(order.created_at).toLocaleString("pt-BR")
        : "-";

    return (
        <div className="bg-background border shadow-sm rounded-lg p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                <div>
                    <Link
                        href="/profile/orders"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
                    >
                        <ArrowLeft className="size-4 mr-1.5" />
                        Voltar para Meus Pedidos
                    </Link>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Package className="size-6 text-primary" />
                        Pedido #{order.order_number || order.id}
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        Realizado em {formattedDate}
                    </p>
                </div>
                <Badge className="text-sm px-3 py-4" variant="secondary">
                    {STATUS_LABELS[order.status] || order.status}
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-accent/60 rounded-lg p-4 space-y-1 text-sm">
                    <h2 className="font-semibold flex items-center gap-2 mb-2">
                        {order.shipping_method === "pickup" ? (
                            <>
                                <Store className="size-4 text-primary" />
                                Retirada na Loja
                            </>
                        ) : (
                            <>
                                <MapPin className="size-4 text-primary" />
                                Endereço de Entrega
                            </>
                        )}
                    </h2>
                    {order.shipping_method === "pickup" ? (
                        <p className="text-muted-foreground">
                            {order.pharmacy_unit?.name || "Unidade Farmácia Camargo"}
                            <br />
                            {order.pharmacy_unit?.address}
                        </p>
                    ) : order.address ? (
                        <p className="text-muted-foreground">
                            {order.address.street}, {order.address.number}
                            {order.address.complement ? ` - ${order.address.complement}` : ""}
                            <br />
                            {order.address.neighborhood} - {order.address.city}/{order.address.state}
                            <br />
                            CEP: {order.address.cep}
                        </p>
                    ) : (
                        <p className="text-muted-foreground">Endereço não informado.</p>
                    )}
                </div>

                <div className="bg-accent/60 rounded-lg p-4 space-y-1 text-sm">
                    <h2 className="font-semibold mb-2">Resumo Financeiro</h2>
                    <div className="flex justify-between text-muted-foreground">
                        <span>Forma de pagamento:</span>
                        <span className="font-medium text-foreground">
                            {PAYMENT_LABELS[order.payment_method] || order.payment_method}
                        </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal:</span>
                        <span>R$ {Number(order.subtotal ?? 0).toFixed(2).replace(".", ",")}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                        <span>Frete:</span>
                        <span>R$ {Number(order.shipping_cost ?? 0).toFixed(2).replace(".", ",")}</span>
                    </div>
                    {Number(order.discount ?? 0) > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Desconto{order.coupon_code ? ` (${order.coupon_code})` : ""}:</span>
                            <span>- R$ {Number(order.discount).toFixed(2).replace(".", ",")}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-base pt-2 border-t">
                        <span>Total:</span>
                        <span>R$ {Number(order.total ?? 0).toFixed(2).replace(".", ",")}</span>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="font-semibold text-lg mb-3">Itens Comprados</h2>
                <div className="divide-y border rounded-lg">
                    {(order.items || []).map((item: any) => {
                        const unitPrice = Number(item.unit_price ?? item.price ?? 0);
                        return (
                            <div
                                key={item.id}
                                className="p-4 flex items-center justify-between gap-4"
                            >
                                <div>
                                    <p className="font-medium">
                                        {item.product?.label || `Produto #${item.product_id}`}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Quantidade: {item.quantity}x • Unitário: R${" "}
                                        {unitPrice.toFixed(2).replace(".", ",")}
                                    </p>
                                </div>
                                <span className="font-semibold">
                                    R$ {(unitPrice * Number(item.quantity || 1)).toFixed(2).replace(".", ",")}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
