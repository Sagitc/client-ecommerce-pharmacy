"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, ShieldCheck, Ticket } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function CheckoutPage() {
    const [hasCoupon, setHasCoupon] = useState(false);
    
    // Estados e Ref para o controle da barra flutuante
    const [isMainButtonVisible, setIsMainButtonVisible] = useState(false);
    const mainButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Atualiza o estado informando se o botão principal está visível na tela
                setIsMainButtonVisible(entry.isIntersecting);
            },
            {
                root: null,
                threshold: 0.1, // Dispara quando 10% do botão estiver visível
            }
        );

        if (mainButtonRef.current) {
            observer.observe(mainButtonRef.current);
        }

        return () => {
            if (mainButtonRef.current) {
                observer.unobserve(mainButtonRef.current);
            }
        };
    }, []);

    return (
        // Adicionado pb-24 no mobile para o conteúdo não ficar escondido atrás da barra fixa
        <div className="container max-w-6xl mx-auto py-10 px-4 pb-24 md:pb-10 relative">
            <div className="flex items-center justify-between mb-8 border-b pb-4">
                <h1 className="text-2xl font-bold">Finalizar Compra</h1>
                <div className="flex items-center gap-2 text-green-700">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-sm font-medium">Ambiente Seguro</span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">

                <div className="flex-1 flex flex-col gap-8">
                    <section className="bg-background dark:bg-gray-800 p-6 rounded-xl border shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            Endereço de Entrega
                        </h2>

                        <div className="bg-background p-4 rounded-lg border">
                            <p className="font-medium">Cauã Santos</p>
                            <p className="text-sm text-gray-600 mt-1">Estrada Marechal Alencastro, 291</p>
                            <p className="text-sm text-gray-600">Anchieta - Rio de Janeiro, RJ</p>
                            <p className="text-sm text-gray-600">CEP: 21645-000</p>
                            <button className="text-primary text-sm font-medium mt-3 hover:underline">
                                Alterar endereço
                            </button>
                        </div>
                    </section>

                    <section className="bg-background dark:bg-gray-800 p-6 rounded-xl border shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">Dados do Comprador</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">CPF</label>
                                <Input placeholder="000.000.000-00" className="mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Telefone</label>
                                <Input placeholder="(21) 90000-0000" className="mt-1" />
                            </div>
                        </div>
                    </section>
                </div>

                {/* RESUME AREA */}
                <aside className="w-full lg:w-96 flex flex-col gap-6">
                    <div className="bg-background dark:bg-gray-800 p-6 rounded-xl border shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>

                        <div className="flex flex-col gap-3 border-b pb-4 mb-4">
                            <div className="flex justify-between text-sm">
                                <span>Dipirona 500mg (2x)</span>
                                <span>R$ 15,90</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Benegrip (1x)</span>
                                <span>R$ 14,00</span>
                            </div>
                        </div>

                        {/* COUPON AREA */}
                        <div className="border-b pb-4 mb-4">
                            <label className="flex items-center gap-2 text-sm font-medium mb-2">
                                <Ticket className="w-4 h-4 text-muted-foreground" />
                                Cupom de desconto
                            </label>
                            <div className="flex gap-2">
                                <Input placeholder="Insira o código" className="flex-1 uppercase" />
                                <Button variant="secondary">Inserir</Button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mb-6">
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Subtotal</span>
                                <span>R$ 29,90</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Frete</span>
                                <span>R$ 10,00</span>
                            </div>
                            {hasCoupon && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Desconto</span>
                                    <span>- R$ 0,00</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold mt-2">
                                <span>Total</span>
                                <span>R$ 39,90</span>
                            </div>
                        </div>

                        {/* O botão principal agora recebe a ref */}
                        <Button ref={mainButtonRef} className="w-full bg-primary text-lg h-12">
                            Ir para Pagamento
                        </Button>

                        <p className="text-xs text-center text-muted-foreground mt-4">
                            Você será redirecionado para o ambiente seguro do Mercado Pago.
                        </p>
                    </div>
                </aside>
            </div>

            {/* STICKY BOTTOM BAR (Aparece apenas no mobile e se o botão principal não estiver visível) */}
            {!isMainButtonVisible && (
                <div className="fixed bottom-0 left-0 w-full bg-background border-t p-4 z-50 flex items-center justify-between shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] md:hidden">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Total da compra</span>
                        <span className="text-xl font-bold text-primary">R$ 39,90</span>
                    </div>
                    <Button className="bg-primary text-base h-11 px-6">
                        Ir para Pagamento
                    </Button>
                </div>
            )}
        </div>
    );
}