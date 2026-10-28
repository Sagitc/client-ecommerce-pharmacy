"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { useOrders } from "@/hooks/use-orders";
import { PrescriptionUpload } from "@/components/prescription-upload";
import { Button } from "@/components/ui/button";

export function CheckoutFinalizeSection({
    shippingMethod,
    selectedAddressId,
    selectedUnitId,
    shippingCost,
    paymentMethod,
}: {
    shippingMethod: "delivery" | "pickup";
    selectedAddressId?: number;
    selectedUnitId?: number;
    shippingCost: number;
    paymentMethod: "pix" | "credit_card" | "debit_card" | "cash_on_delivery";
}) {
    const router = useRouter();
    const { cart } = useCart();
    const { createOrder, isCreatingOrder } = useOrders();

    const cartItems = cart.data ?? [];
    const hasRestrictedItems = cartItems.some((item) => item.requiresPrescription);

    const [prescriptionFiles, setPrescriptionFiles] = useState<File[]>([]);
    const [isPrescriptionValid, setIsPrescriptionValid] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const canSubmit = !hasRestrictedItems || isPrescriptionValid;

    const handleFinishOrder = async () => {
        setSubmitError(null);
        try {
            const createdOrder = await createOrder({
                shipping_method: shippingMethod,
                address_id: shippingMethod === "delivery" ? selectedAddressId : null,
                pharmacy_unit_id: shippingMethod === "pickup" ? selectedUnitId : null,
                shipping_cost: shippingCost,
                payment_method: paymentMethod,
                items: cartItems.map((item) => ({
                    id: item.id,
                    quantity: item.quantity,
                })),
                prescriptions: prescriptionFiles,
            });

            // Redireciona para a sua página de sucesso passando o código do pedido
            router.push(`/checkout/sucesso?order=${createdOrder.order_number}`);
        } catch (err: any) {
            setSubmitError(err.message || "Erro ao processar o pedido.");
        }
    };

    return (
        <div className="space-y-6">
            <PrescriptionUpload
                cartItems={cartItems.map((item) => ({
                    id: item.id,
                    name: item.label,
                    requiresPrescription: item.requiresPrescription,
                }))}
                onFilesChange={(files, isValid) => {
                    setPrescriptionFiles(files);
                    setIsPrescriptionValid(isValid);
                }}
            />

            {submitError && (
                <p className="text-sm text-destructive font-medium">{submitError}</p>
            )}

            <Button
                size="lg"
                className="w-full"
                disabled={!canSubmit || isCreatingOrder || cartItems.length === 0}
                onClick={handleFinishOrder}
            >
                {isCreatingOrder ? "Processando pedido..." : "Finalizar Compra"}
            </Button>
        </div>
    );
}