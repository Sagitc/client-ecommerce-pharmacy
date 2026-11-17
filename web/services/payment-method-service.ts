// web/services/payment-method-service.ts
// Inativado temporariamente: os pagamentos são processados diretamente via gateway do Mercado Pago.

export interface PaymentMethodPayload {
    label?: string;
    card_number: string;
    card_holder: string;
    expiration_date: string;
    brand?: string;
    is_default?: boolean;
}

export async function fetchPaymentMethodsRequest() {
    return [];
}

export async function createPaymentMethodRequest(_payload: PaymentMethodPayload) {
    throw new Error(
        "O armazenamento de métodos de pagamento está desativado. Os pagamentos são processados diretamente pelo Mercado Pago."
    );
}

export async function setDefaultPaymentMethodRequest(_id: number) {
    throw new Error(
        "O armazenamento de métodos de pagamento está desativado. Os pagamentos são processados diretamente pelo Mercado Pago."
    );
}

export async function deletePaymentMethodRequest(_id: number) {
    throw new Error(
        "O armazenamento de métodos de pagamento está desativado. Os pagamentos são processados diretamente pelo Mercado Pago."
    );
}
