"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
    MapPin,
    ShieldCheck,
    Ticket,
    CreditCard,
    QrCode,
    Wallet,
    Check,
    Plus,
    X,
    Lock,
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PrescriptionUpload } from "@/components/prescription-upload";
import { useCart } from "@/hooks/use-cart";
import { useOrders } from "@/hooks/use-orders";
import { useAuth } from "@/hooks/use-auth";
import { useAddresses } from "@/hooks/use-addresses";
import { useCoupons } from "@/hooks/use-coupons";
import {
    calculateCouponDiscount,
    validateCouponRequest,
    ValidatedCoupon,
} from "@/services/coupon-service";

function formatCpf(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

const MERCADO_PAGO_METHODS = [
    {
        id: "pix" as const,
        label: "Pix",
        subtitle: "Aprovação imediata",
        icon: QrCode,
    },
    {
        id: "credit_card" as const,
        label: "Cartão de Crédito",
        subtitle: "Até 12x pelo Mercado Pago",
        icon: CreditCard,
    },
    {
        id: "debit_card" as const,
        label: "Cartão de Débito",
        subtitle: "Débito online seguro",
        icon: Wallet,
    },
];

export default function CheckoutPage() {
    const router = useRouter();
    const { cart } = useCart();
    const { createOrder, isCreatingOrder } = useOrders();
    const { user, isAuthenticated } = useAuth();
    const { addresses } = useAddresses();
    const { myCoupons } = useCoupons();
    const cartItems = cart.data || [];

    const [selectedAddressId, setSelectedAddressId] = useState<number | undefined>(undefined);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [tempAddressId, setTempAddressId] = useState<number | undefined>(undefined);

    const [cpf, setCpf] = useState("");
    const [phone, setPhone] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<ValidatedCoupon | null>(null);
    const [couponError, setCouponError] = useState<string | null>(null);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"pix" | "credit_card" | "debit_card" | "cash_on_delivery">("pix");

    const hasRestrictedItems = cartItems.some((item) => item.requiresPrescription);
    const [prescriptionFiles, setPrescriptionFiles] = useState<File[]>([]);
    const [isPrescriptionValid, setIsPrescriptionValid] = useState(!hasRestrictedItems);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            if (user.cpf) setCpf(user.cpf);
            if (user.phone) setPhone(user.phone);
        }
    }, [user]);

    useEffect(() => {
        if (addresses.length > 0 && !selectedAddressId) {
            const def = addresses.find((a: any) => a.is_default ?? a.isDefault) || addresses[0];
            if (def) setSelectedAddressId(def.id);
        }
    }, [addresses, selectedAddressId]);

    useEffect(() => {
        setIsPrescriptionValid(!hasRestrictedItems || prescriptionFiles.length > 0);
    }, [hasRestrictedItems, prescriptionFiles.length]);

    useEffect(() => {
        if (!isAddressModalOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                setIsAddressModalOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isAddressModalOpen]);

    const selectedAddress =
        addresses.find((a: any) => a.id === selectedAddressId) ||
        addresses.find((a: any) => a.is_default ?? a.isDefault) ||
        addresses[0];

    const subtotal = cartItems.reduce((acc, item) => {
        const price = item.promotionPrice ?? item.price;
        return acc + price * item.quantity;
    }, 0);
    const shippingCost = cartItems.length > 0 ? 10.0 : 0;
    const meetsMinOrderValue =
        !appliedCoupon ||
        appliedCoupon.min_order_value === null ||
        subtotal >= appliedCoupon.min_order_value;
    const activeCoupon = meetsMinOrderValue ? appliedCoupon : null;
    const minOrderError =
        appliedCoupon && !meetsMinOrderValue && appliedCoupon.min_order_value !== null
            ? `Este cupom exige um pedido mínimo de R$ ${appliedCoupon.min_order_value.toFixed(2).replace(".", ",")}.`
            : null;
    const displayedCouponError = couponError || minOrderError;
    const discountAmount = calculateCouponDiscount(activeCoupon, subtotal);
    const total = Math.max(0, subtotal + shippingCost - discountAmount);

    const handleApplyCoupon = async (overrideCode?: string) => {
        const trimmedCode = (overrideCode ?? couponCode).trim().toUpperCase();
        if (!trimmedCode) {
            setAppliedCoupon(null);
            setCouponError("Informe um código de cupom.");
            return;
        }

        setIsValidatingCoupon(true);
        setCouponError(null);

        try {
            const result = await validateCouponRequest({
                code: trimmedCode,
                subtotal,
            });
            setAppliedCoupon(result.coupon);
            setCouponCode(result.coupon.code);
        } catch (err: unknown) {
            setAppliedCoupon(null);
            const message = err instanceof Error ? err.message : "Não foi possível validar o cupom.";
            setCouponError(message);
        } finally {
            setIsValidatingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
        setCouponError(null);
    };

    const handleOpenAddressModal = () => {
        setTempAddressId(selectedAddress?.id);
        setIsAddressModalOpen(true);
    };

    const handleConfirmAddressModal = () => {
        if (tempAddressId !== undefined) {
            setSelectedAddressId(tempAddressId);
        }
        setIsAddressModalOpen(false);
    };

    const handleGoToAddAddress = () => {
        setIsAddressModalOpen(false);
        router.push("/profile/addresses");
    };

    const handleFinishOrder = async () => {
        setSubmitError(null);

        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        if (!selectedAddress) {
            setSubmitError("Selecione ou cadastre um endereço de entrega para continuar.");
            return;
        }

        try {
            const createdOrder = await createOrder({
                shipping_method: "delivery",
                address_id: selectedAddress.id,
                shipping_cost: shippingCost,
                payment_method: paymentMethod,
                coupon_code: activeCoupon?.code,
                items: cartItems.map((item) => ({
                    id: item.id,
                    quantity: item.quantity,
                })),
                prescriptions: prescriptionFiles,
            });

            router.push(`/checkout/success?order=${createdOrder.order_number}`);
        } catch (err: any) {
            setSubmitError(err.message || "Erro ao processar o pedido com o Mercado Pago.");
        }
    };

    return (
        <div className="container max-w-6xl mx-auto px-4 relative">
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

            {/* CABEÇALHO DO CHECKOUT */}
            <div className="flex items-center justify-between mb-4 border-b pb-3">
                <div>
                    <h1 className="text-2xl font-bold">Finalizar Compra</h1>
                    <p className="text-xs text-muted-foreground">
                        Confira seu endereço e escolha como pagar via Mercado Pago
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1.5 rounded-full">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-semibold">Checkout Seguro • Mercado Pago</span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* COLUNA ESQUERDA: ENDEREÇO E GATEWAY MERCADO PAGO */}
                <div className="flex-1 w-full flex flex-col gap-4">
                    {/* BLOCO DE ENDEREÇO */}
                    <section className="bg-background dark:bg-gray-800 p-5 rounded-xl border shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-base font-semibold flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                Endereço de Entrega
                            </h2>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleOpenAddressModal}
                            >
                                Alterar endereço
                            </Button>
                        </div>

                        {selectedAddress ? (
                            <div className="bg-accent/50 p-3.5 rounded-lg border flex items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-sm">
                                            {selectedAddress.label || "Endereço"} — {selectedAddress.street}, {selectedAddress.number}
                                        </p>
                                        {Boolean(selectedAddress.is_default ?? selectedAddress.isDefault) && (
                                            <Badge variant="default" className="text-[10px] px-2 py-0">
                                                Padrão
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {selectedAddress.complement ? `${selectedAddress.complement} • ` : ""}
                                        {selectedAddress.neighborhood} — {selectedAddress.city}/{selectedAddress.state} • CEP: {selectedAddress.cep}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-accent/50 p-4 rounded-lg border flex items-center justify-between gap-4">
                                <div>
                                    <p className="font-medium text-sm">{user?.name || "Cliente"}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Nenhum endereço cadastrado para entrega do seu pedido.
                                    </p>
                                </div>
                                <Button type="button" size="sm" onClick={handleGoToAddAddress}>
                                    <Plus className="w-4 h-4 mr-1" />
                                    Adicionar
                                </Button>
                            </div>
                        )}
                    </section>

                    {/* BLOCO DE DADOS E PAGAMENTO MERCADO PAGO */}
                    <section className="bg-background dark:bg-gray-800 p-5 rounded-xl border shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-base font-semibold flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-primary" />
                                Pagamento via Mercado Pago
                            </h2>
                            <span className="text-xs font-medium text-sky-600 dark:text-sky-400">
                                Compra Garantida
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">
                                    CPF do Titular / Nota Fiscal
                                </label>
                                <Input
                                    placeholder="000.000.000-00"
                                    value={cpf}
                                    onChange={(e) => setCpf(formatCpf(e.target.value))}
                                    className="mt-1 h-9"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">
                                    Telefone de Contato
                                </label>
                                <Input
                                    placeholder="(21) 90000-0000"
                                    value={phone}
                                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                                    className="mt-1 h-9"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-muted-foreground">
                                Escolha a modalidade no Mercado Pago
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-1.5">
                                {MERCADO_PAGO_METHODS.map((m) => {
                                    const Icon = m.icon;
                                    const isSelected = paymentMethod === m.id;
                                    return (
                                        <button
                                            key={m.id}
                                            type="button"
                                            onClick={() => setPaymentMethod(m.id)}
                                            className={`border rounded-lg p-3 text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                                                isSelected
                                                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                                                    : "hover:bg-muted"
                                            }`}
                                        >
                                            <Icon
                                                className={`w-5 h-5 shrink-0 mt-0.5 ${
                                                    isSelected ? "text-primary" : "text-muted-foreground"
                                                }`}
                                            />
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold leading-tight">{m.label}</p>
                                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                                    {m.subtitle}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-3 rounded-lg bg-primary/5 border border-primary/20 px-3.5 py-2.5 flex items-center gap-2.5 text-xs text-muted-foreground">
                            <Lock className="w-4 h-4 text-primary shrink-0" />
                            <span>
                                Seus dados financeiros são criptografados e processados diretamente pelo{" "}
                                <strong className="text-foreground">Mercado Pago</strong>.
                            </span>
                        </div>
                    </section>
                </div>

                {/* COLUNA DIREITA: RESUMO DO PEDIDO */}
                <aside className="w-full lg:w-96 shrink-0">
                    <div className="bg-background dark:bg-gray-800 p-5 rounded-xl border shadow-sm">
                        <h2 className="text-base font-semibold mb-3">Resumo do Pedido</h2>

                        <div className="flex flex-col gap-2 border-b pb-3 mb-3 max-h-36 overflow-y-auto pr-1">
                            {cartItems.length > 0 ? (
                                cartItems.map((item) => {
                                    const price = item.promotionPrice ?? item.price;
                                    return (
                                        <div key={item.id} className="flex justify-between text-xs gap-2">
                                            <span className="truncate">
                                                {item.label} ({item.quantity}x)
                                            </span>
                                            <span className="shrink-0 font-medium">
                                                R$ {(price * item.quantity).toFixed(2).replace(".", ",")}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-xs text-muted-foreground">Seu carrinho está vazio.</p>
                            )}
                        </div>

                        {/* CUPOM DE DESCONTO */}
                        <div className="border-b pb-3 mb-3">
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="flex items-center gap-1.5 text-xs font-medium">
                                    <Ticket className="w-3.5 h-3.5 text-muted-foreground" />
                                    Cupom de desconto
                                </label>
                                {isAuthenticated && (
                                    <Link
                                        href="/profile/coupons"
                                        className="text-[11px] font-medium text-primary hover:underline"
                                    >
                                        Resgatar cupons
                                    </Link>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Insira o código"
                                    value={couponCode}
                                    onChange={(e) => {
                                        setCouponCode(e.target.value);
                                        if (couponError) setCouponError(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleApplyCoupon();
                                        }
                                    }}
                                    disabled={isValidatingCoupon}
                                    className="flex-1 uppercase h-9 text-xs"
                                />
                                <Button
                                    variant="secondary"
                                    type="button"
                                    size="sm"
                                    className="h-9"
                                    disabled={isValidatingCoupon || !couponCode.trim()}
                                    onClick={() => handleApplyCoupon()}
                                >
                                    {isValidatingCoupon ? "Validando..." : "Aplicar"}
                                </Button>
                            </div>
                            {isAuthenticated && myCoupons.length > 0 && !activeCoupon && (
                                <div className="mt-2 space-y-1">
                                    <span className="text-[11px] text-muted-foreground block">
                                        Seus cupons disponíveis ({myCoupons.length}):
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {myCoupons.map((invCoupon) => (
                                            <button
                                                key={invCoupon.id}
                                                type="button"
                                                disabled={isValidatingCoupon}
                                                onClick={() => {
                                                    setCouponCode(invCoupon.code);
                                                    handleApplyCoupon(invCoupon.code);
                                                }}
                                                className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded border border-primary/40 bg-primary/5 text-primary hover:bg-primary/15 cursor-pointer transition-colors"
                                            >
                                                {invCoupon.code} ({invCoupon.uses_remaining ?? 1}x)
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {displayedCouponError && (
                                <p className="text-xs text-destructive font-medium mt-1.5" role="alert">
                                    {displayedCouponError}
                                </p>
                            )}
                            {activeCoupon && (
                                <div className="mt-2 flex items-center justify-between gap-2 rounded-md bg-green-500/10 border border-green-500/20 px-2.5 py-1.5 text-xs text-green-700 dark:text-green-400">
                                    <span className="font-medium truncate">
                                        Cupom {activeCoupon.code} aplicado
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleRemoveCoupon}
                                        aria-label="Remover cupom"
                                        className="text-green-700 dark:text-green-400 hover:opacity-75 cursor-pointer shrink-0"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5 mb-4">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Subtotal</span>
                                <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Frete</span>
                                <span>R$ {shippingCost.toFixed(2).replace(".", ",")}</span>
                            </div>
                            {activeCoupon && (
                                <div className="flex justify-between text-xs text-green-600">
                                    <span>Desconto ({activeCoupon.code})</span>
                                    <span>- R$ {discountAmount.toFixed(2).replace(".", ",")}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-base font-bold pt-1 border-t mt-1">
                                <span>Total</span>
                                <span className="text-black">
                                    R$ {total.toFixed(2).replace(".", ",")}
                                </span>
                            </div>
                        </div>

                        {submitError && (
                            <p className="text-xs text-destructive font-medium mb-2.5">{submitError}</p>
                        )}

                        <Button
                            disabled={
                                cartItems.length === 0 ||
                                (hasRestrictedItems && !isPrescriptionValid) ||
                                isCreatingOrder
                            }
                            onClick={handleFinishOrder}
                            className="w-full bg-primary text-white text-sm font-semibold h-11"
                        >
                            {isCreatingOrder
                                ? "Processando no Mercado Pago..."
                                : "Pagar com Mercado Pago"}
                        </Button>

                        <p className="text-[11px] text-center text-muted-foreground mt-2.5">
                            Ao finalizar, seu pagamento será processado via Mercado Pago.
                        </p>
                    </div>
                </aside>
            </div>

            {/* MODAL DE SELEÇÃO DE ENDEREÇOS */}
            <Sheet open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
                <SheetContent
                    showCloseButton={false}
                    className="inset-auto! left-1/2! top-1/2! -translate-x-1/2! -translate-y-1/2! w-[calc(100%-2rem)]! max-w-lg! h-auto! rounded-xl! border! shadow-xl! p-6 flex flex-col gap-4"
                >
                    <SheetHeader className="flex flex-row items-center justify-between border-b pb-3 p-0">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            <SheetTitle className="text-lg font-bold">
                                Escolher Endereço de Entrega
                            </SheetTitle>
                        </div>
                        <button
                            type="button"
                            aria-label="Fechar modal"
                            onClick={() => setIsAddressModalOpen(false)}
                            className="text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </SheetHeader>
                    <SheetDescription className="sr-only">
                        Selecione ou adicione um endereço para entrega do seu pedido.
                    </SheetDescription>

                    {addresses.length === 0 ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            Você ainda não possui endereços cadastrados.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
                            {addresses.map((addr: any) => {
                                const isSelected = tempAddressId === addr.id;
                                const isDefaultAddr = Boolean(addr.is_default ?? addr.isDefault);

                                return (
                                    <div
                                        key={addr.id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => setTempAddressId(addr.id)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                setTempAddressId(addr.id);
                                            }
                                        }}
                                        className={`border rounded-lg p-3.5 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                                            isSelected
                                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                : "hover:bg-accent/50"
                                        }`}
                                    >
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm">
                                                    {addr.label || "Endereço"} — {addr.street}, {addr.number}
                                                </span>
                                                {isDefaultAddr && (
                                                    <Badge variant="default" className="text-[10px] px-1.5 py-0">
                                                        Padrão
                                                    </Badge>
                                                )}
                                            </div>
                                            {addr.complement && (
                                                <p className="text-xs text-muted-foreground">
                                                    Complemento: {addr.complement}
                                                </p>
                                            )}
                                            <p className="text-xs text-muted-foreground">
                                                {addr.neighborhood} — {addr.city}/{addr.state} • CEP: {addr.cep}
                                            </p>
                                        </div>

                                        <div
                                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                                                isSelected
                                                    ? "border-primary bg-primary text-primary-foreground"
                                                    : "border-muted-foreground/40"
                                            }`}
                                        >
                                            {isSelected && <Check className="w-3 h-3" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <SheetFooter className="flex flex-row items-center justify-end gap-3 pt-3 border-t p-0 mt-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleGoToAddAddress}
                        >
                            <Plus className="w-4 h-4 mr-1.5" />
                            Adicionar
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmAddressModal}
                        >
                            OK
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
}
