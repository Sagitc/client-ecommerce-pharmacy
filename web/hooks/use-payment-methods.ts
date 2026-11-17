// web/hooks/use-payment-methods.ts
// Inativado temporariamente: os pagamentos são processados diretamente via gateway do Mercado Pago.

import { PaymentMethodPayload } from "@/services/payment-method-service";

export function usePaymentMethods() {
    const disabledError = async () => {
        throw new Error(
            "O armazenamento de métodos de pagamento está desativado. Os pagamentos são processados diretamente pelo Mercado Pago."
        );
    };

    return {
        paymentMethods: [],
        isLoadingPaymentMethods: false,
        addPaymentMethod: (_payload: PaymentMethodPayload) => disabledError(),
        isAddingPaymentMethod: false,
        setDefaultPaymentMethod: (_id: number) => disabledError(),
        isSettingDefaultPaymentMethod: false,
        removePaymentMethod: (_id: number) => disabledError(),
        isRemovingPaymentMethod: false,
    };
}
