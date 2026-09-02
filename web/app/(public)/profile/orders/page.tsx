"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/contexts/user-context"
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function OrdersPage() {
    const user = useUser();
    const [selectedFilter, setSelectedFilter] = useState("todos");
    const hasOrders = Array.isArray(user?.user?.orders) && user.user.orders.length > 0;
    const orderYears = Array.from(
        new Set(
            (user?.user?.orders ?? []).map((order) => new Date(order.date).getFullYear())
        )
    ).sort((a, b) => b - a);

    return (
        <div className="bg-background shadow-md rounded-lg px-4 pt-6 pb-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Meus pedidos</h1>

                <div className="relative">
                    <select
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                        className=" appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="todos">Todos</option>
                        <option value="last30days">Últimos 30 dias</option>
                        <option value="last6months">Últimos 6 meses</option>

                        {orderYears.map((year) => (
                            <option key={year} value={String(year)}>
                                {year}
                            </option>
                        ))}
                    </select>

                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 opacity-50 pointer-events-none" />
                </div>
            </div>

            {!hasOrders && (
                <div className="flex flex-col items-center justify-center gap-4 py-10">
                    <span className="text-xl text-muted-foreground text-center">
                        Não há histórico de pedidos
                    </span>
                </div>
            )}

            {hasOrders && (
                <div className="flex flex-col gap-4">
                    {user?.user?.orders?.map((order) => (
                        <div key={order.id} className="bg-card shadow-md rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-lg font-semibold">Pedido #{order.id}</h2>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(order.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">Endereço: {order.address.street}, {order.address.city}</p>
                            <p className="text-sm text-muted-foreground mb-2">Total: R$ {order.total.toFixed(2)}</p>
                            <div className="mt-4">
                                <h3 className="text-md font-semibold mb-2">Itens:</h3>
                                <ul className="list-disc list-inside">
                                    {order.items.map((item) => (
                                        <li key={item.id} className="text-sm text-muted-foreground">
                                            {item.label} - R$ {item.price.toFixed(2)} x {item.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}