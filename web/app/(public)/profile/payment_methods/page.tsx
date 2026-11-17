"use client";

import Link from "next/link";
import { CreditCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentMethodsPage() {
    return (
        <div className="bg-background border shadow-sm rounded-lg px-6 pt-6 pb-8">
            <div className="flex items-center gap-2 mb-6">
                <CreditCard className="size-6 text-primary" />
                <h1 className="text-2xl font-bold">Métodos de pagamento</h1>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center bg-accent/40 border rounded-lg px-4">
                <ShieldCheck className="size-12 text-primary" />
                <h2 className="text-lg font-semibold">
                    Pagamentos processados via Mercado Pago
                </h2>
                <p className="text-sm text-muted-foreground max-w-md">
                    Para sua segurança, não armazenamos dados de cartões em nosso banco de dados.
                    Todas as transações (Pix, Cartão de Crédito e Cartão de Débito) são realizadas
                    diretamente pelo gateway seguro do Mercado Pago no momento de finalizar a compra.
                </p>
                <Button variant="outline" className="mt-2">
                    <Link href="/profile">Voltar ao resumo da conta</Link>
                </Button>
            </div>
        </div>
    );
}
