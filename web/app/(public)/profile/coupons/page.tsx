"use client";

import { useState, FormEvent } from "react";
import { toast } from "sonner";
import { Ticket, Plus, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCoupons } from "@/hooks/use-coupons";
import { ValidatedCoupon } from "@/services/coupon-service";

function formatCouponSummary(coupon: ValidatedCoupon) {
    if (coupon.type === "percentage") {
        const maxPart =
            coupon.max_discount !== null
                ? ` (até R$ ${coupon.max_discount.toFixed(2).replace(".", ",")})`
                : "";
        return `${coupon.value}% OFF${maxPart}`;
    }
    return `R$ ${coupon.value.toFixed(2).replace(".", ",")} OFF`;
}

export default function CouponsPage() {
    const {
        myCoupons,
        isLoadingMyCoupons,
        availableCoupons,
        isLoadingAvailableCoupons,
        redeemCoupon,
        isRedeemingCoupon,
    } = useCoupons();

    const [codeInput, setCodeInput] = useState("");

    const handleRedeemByCode = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = codeInput.trim().toUpperCase();
        if (!trimmed) {
            toast.error("Informe um código de cupom para resgatar.");
            return;
        }

        try {
            const res = await redeemCoupon(trimmed);
            toast.success(res.message || "Cupom resgatado com sucesso!");
            setCodeInput("");
        } catch (err: any) {
            toast.error(err?.message || "Não foi possível resgatar o cupom.");
        }
    };

    const handleRedeemAvailable = async (code: string) => {
        try {
            const res = await redeemCoupon(code);
            toast.success(res.message || `Cupom ${code} adicionado ao seu inventário!`);
        } catch (err: any) {
            toast.error(err?.message || "Não foi possível resgatar o cupom.");
        }
    };

    return (
        <div className="bg-background border shadow-sm rounded-lg px-6 pt-6 pb-8 space-y-8">
            <div className="flex flex-wrap justify-between items-center gap-4 border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Ticket className="size-6 text-primary" />
                        Meus cupons
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        Resgate cupons para o seu inventário e utilize-os no checkout antes que expirem.
                    </p>
                </div>

                <form onSubmit={handleRedeemByCode} className="flex gap-2 w-full sm:w-auto">
                    <Input
                        placeholder="Código do cupom (ex: CAMARGO10)"
                        value={codeInput}
                        onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                        disabled={isRedeemingCoupon}
                        className="uppercase sm:w-64"
                    />
                    <Button type="submit" disabled={isRedeemingCoupon || !codeInput.trim()}>
                        <Plus className="size-4 mr-1.5" />
                        {isRedeemingCoupon ? "Resgatando..." : "Resgatar"}
                    </Button>
                </form>
            </div>

            {/* INVENTÁRIO DO USUÁRIO */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-green-600" />
                    Meu Inventário de Cupons
                </h2>

                {isLoadingMyCoupons ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                        Carregando seu inventário de cupons...
                    </div>
                ) : myCoupons.length === 0 ? (
                    <div className="bg-accent/40 border rounded-lg p-8 text-center space-y-2">
                        <Ticket className="size-10 text-muted-foreground/50 mx-auto" />
                        <p className="text-sm text-muted-foreground">
                            Você não possui cupons ativos no seu inventário no momento.
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Resgate um código acima ou escolha um dos cupons disponíveis abaixo.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {myCoupons.map((coupon) => {
                            const expiresFormatted = coupon.expires_at
                                ? new Date(coupon.expires_at).toLocaleDateString("pt-BR")
                                : null;
                            const usesRemaining = coupon.uses_remaining ?? 1;

                            return (
                                <div
                                    key={coupon.id}
                                    className="border border-primary/40 bg-primary/5 rounded-xl p-4 flex flex-col justify-between gap-3"
                                >
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-mono text-base font-bold text-primary">
                                                {coupon.code}
                                            </span>
                                            <Badge variant="default" className="text-xs">
                                                {formatCouponSummary(coupon)}
                                            </Badge>
                                        </div>

                                        {coupon.min_order_value !== null && (
                                            <p className="text-xs text-muted-foreground">
                                                Pedido mínimo: R${" "}
                                                {coupon.min_order_value.toFixed(2).replace(".", ",")}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                                            <span>
                                                Usos restantes:{" "}
                                                <strong className="text-foreground">
                                                    {usesRemaining}x
                                                </strong>
                                            </span>
                                            {expiresFormatted && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="size-3.5" />
                                                    Válido até {expiresFormatted}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* CUPONS DISPONÍVEIS PARA RESGATE */}
            <section className="space-y-4 pt-4 border-t">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="size-5 text-primary" />
                    Cupons Disponíveis para Resgate
                </h2>

                {isLoadingAvailableCoupons ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                        Buscando cupons disponíveis...
                    </div>
                ) : availableCoupons.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        Não há novos cupons públicos disponíveis para resgate no momento.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableCoupons.map((coupon) => {
                            const expiresFormatted = coupon.expires_at
                                ? new Date(coupon.expires_at).toLocaleDateString("pt-BR")
                                : null;
                            const usesPerUser = coupon.max_uses_per_user ?? 1;
                            const remainingRedemptions =
                                coupon.max_redemptions !== null && coupon.max_redemptions !== undefined
                                    ? Math.max(0, coupon.max_redemptions - (coupon.redeemed_count ?? 0))
                                    : null;

                            return (
                                <div
                                    key={coupon.id}
                                    className="bg-card border rounded-xl p-4 flex items-center justify-between gap-4"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-sm font-bold">
                                                {coupon.code}
                                            </span>
                                            <Badge variant="secondary" className="text-xs">
                                                {formatCouponSummary(coupon)}
                                            </Badge>
                                        </div>
                                        {coupon.min_order_value !== null && (
                                            <p className="text-xs text-muted-foreground">
                                                Pedido mínimo: R${" "}
                                                {coupon.min_order_value.toFixed(2).replace(".", ",")}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Direito a <strong>{usesPerUser}x</strong>{" "}
                                            {usesPerUser === 1 ? "uso" : "usos"}
                                            {remainingRedemptions !== null
                                                ? ` • Restam ${remainingRedemptions} resgates`
                                                : ""}
                                            {expiresFormatted ? ` • Expira em ${expiresFormatted}` : ""}
                                        </p>
                                    </div>

                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        disabled={isRedeemingCoupon}
                                        onClick={() => handleRedeemAvailable(coupon.code)}
                                    >
                                        Pegar cupom
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
