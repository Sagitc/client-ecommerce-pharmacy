"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/user-context";
import { UserType } from "@/types/user-type";

function CardSkeleton({ PaymentMethods }: { PaymentMethods: NonNullable<UserType["paymentMethods"]> }) {


    return (

        PaymentMethods.length === 0 ? (
            <p className="text-muted-foreground text-center">Nenhum método de pagamento encontrado.</p>
        ) : (
            PaymentMethods.map((paymentMethod) => (
                <div key={paymentMethod.id} className={"border rounded-lg p-4 flex flex-col md:flex-row md:justify-between items-center gap-4 w-full" + (paymentMethod.isDefault ? " border-primary" : " border-muted")}>
                    <div className="flex gap-4 md:gap-8 items-center justify-around w-full md:w-auto">
                        <div className="rounded-full h-16 w-16 bg-muted"></div>
                        <div className="flex flex-col gap-2">
                            <span className="font-semibold">{"*".repeat(12)}{paymentMethod.cardNumber.slice(14)}</span>
                            <div className="flex justify-between items-center w-full">
                                <span>{paymentMethod.expirationDate}</span>
                                <span>{paymentMethod.cvv}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row md:flex-col gap-2">
                        <Button variant={paymentMethod.isDefault ? "default" : "outline"} size="sm" className={"w-38"}>
                            {paymentMethod.isDefault ? "Padrão" : "Definir como padrão"}
                        </Button>
                        <Button variant="destructive" size="sm">
                            Remover
                        </Button>
                    </div>
                </div>
            ))
        )
    );
}

export default function PaymentMethodsPage() {

    const user = useUser();
    const userPaymentMethods = user?.user?.paymentMethods || [];

    return (
        <div className="bg-background shadow-md rounded-lg px-4 pt-6 pb-8">
            <h1 className="text-xl font-bold">Métodos de pagamento</h1>

            <div className="flex flex-col gap-4 mt-6">
                <CardSkeleton PaymentMethods={userPaymentMethods} />
            </div>

            <Button className="mt-6 mx-auto block" variant="default">
                Adicionar novo método de pagamento
            </Button>
        </div>
    );
}