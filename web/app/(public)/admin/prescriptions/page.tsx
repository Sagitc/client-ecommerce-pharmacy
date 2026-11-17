// web/app/(public)/admin/receitas/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchAdminPrescriptionsRequest,
    reviewPrescriptionRequest,
    openPrescriptionFile,
} from "@/services/order-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    CheckCircle2,
    XCircle,
    FileText,
    Clock,
    ShieldCheck,
    ExternalLink,
    Loader2,
} from "lucide-react";

export default function AdminPrescriptionsPage() {
    const queryClient = useQueryClient();
    const [statusFilter, setStatusFilter] = useState<string>("pending");
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [rejectionReason, setRejectionReason] = useState<string>("");

    useEffect(() => {
        if (rejectingId === null) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setRejectingId(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [rejectingId]);

    const { data: prescriptions, isLoading, isError } = useQuery({
        queryKey: ["admin-prescriptions", statusFilter],
        queryFn: () => fetchAdminPrescriptionsRequest(statusFilter),
    });

    const reviewMutation = useMutation({
        mutationFn: reviewPrescriptionRequest,
        onSuccess: () => {
            setRejectingId(null);
            setRejectionReason("");
            queryClient.invalidateQueries({ queryKey: ["admin-prescriptions"] });
        },
    });

    const handleApprove = (id: number) => {
        reviewMutation.mutate({ id, status: "approved" });
    };

    const handleConfirmReject = (id: number) => {
        if (!rejectionReason.trim()) return;
        reviewMutation.mutate({
            id,
            status: "rejected",
            rejection_reason: rejectionReason,
        });
    };

    return (
        <div className="max-w-6xl bg-background mx-auto py-10 px-4 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Auditoria Farmacêutica (ANVISA RDC 44)</h1>
                        <p className="text-sm text-muted-foreground">
                            Conferência e retenção digital de receitas médicas para liberação de pedidos
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {[
                        { label: "Pendentes", value: "pending" },
                        { label: "Aprovadas", value: "approved" },
                        { label: "Recusadas", value: "rejected" },
                        { label: "Todas", value: "all" },
                    ].map((tab) => (
                        <Button
                            key={tab.value}
                            variant={statusFilter === tab.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatusFilter(tab.value)}
                        >
                            {tab.label}
                        </Button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : isError ? (
                <Card className="border-destructive/40 bg-destructive/5">
                    <CardContent className="p-6 text-center text-sm text-destructive font-medium">
                        Acesso restrito. Faça login com uma conta de Farmacêutico ou Administrador (ex: farmaceutico@camargo.com.br).
                    </CardContent>
                </Card>
            ) : !prescriptions || prescriptions.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center text-muted-foreground">
                        Nenhuma receita médica encontrada com o filtro selecionado.
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {prescriptions.map((item: any) => (
                        <Card key={item.id} className="overflow-hidden">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2.5">
                                            <span className="font-mono text-sm font-bold text-primary">
                                                Pedido #{item.order?.order_number}
                                            </span>
                                            {item.status === "pending" && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600">
                                                    <Clock className="w-3.5 h-3.5" /> Aguardando Avaliação
                                                </span>
                                            )}
                                            {item.status === "approved" && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Aprovada
                                                </span>
                                            )}
                                            {item.status === "rejected" && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                                                    <XCircle className="w-3.5 h-3.5" /> Recusada
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm font-medium text-foreground">
                                            Paciente/Cliente: {item.order?.user?.name} • CPF: {item.order?.user?.cpf || "Não informado"} • Tel: {item.order?.user?.phone || "N/A"}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openPrescriptionFile(item.id)}
                                        >
                                            <FileText className="w-4 h-4 mr-1.5" />
                                            Visualizar Receita ({item.original_name})
                                            <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-60" />
                                        </Button>

                                        {item.status === "pending" && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                    disabled={reviewMutation.isPending}
                                                    onClick={() => handleApprove(item.id)}
                                                >
                                                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                                    Aprovar e Liberar Pedido
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    disabled={reviewMutation.isPending}
                                                    onClick={() => setRejectingId(item.id)}
                                                >
                                                    <XCircle className="w-4 h-4 mr-1.5" />
                                                    Recusar
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Medicamentos do Pedido */}
                                <div className="bg-muted/40 rounded-lg p-3 text-xs space-y-1">
                                    <span className="font-semibold text-muted-foreground uppercase">
                                        Itens do pedido vinculados a esta receita:
                                    </span>
                                    <ul className="list-disc list-inside space-y-0.5 text-foreground">
                                        {item.order?.items?.map((orderItem: any) => (
                                            <li key={orderItem.id}>
                                                {orderItem.quantity}x {orderItem.product?.label}{" "}
                                                {orderItem.product?.requires_prescription && (
                                                    <span className="text-amber-600 font-semibold">(Retenção Obrigatória)</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Caixa de Justificativa de Recusa */}
                                {rejectingId === item.id && (
                                    <div className="border border-destructive/40 bg-destructive/5 rounded-lg p-4 space-y-3">
                                        <label className="text-xs font-bold text-destructive block">
                                            Informe o motivo técnico da recusa (ex: Receita fora da validade de 10 dias, sem carimbo do CRM ou ilegível):
                                        </label>
                                        <textarea
                                            className="w-full rounded-md border bg-background p-2.5 text-sm"
                                            rows={2}
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="Descreva o motivo para notificar o paciente..."
                                        />
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setRejectingId(null)}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                disabled={!rejectionReason.trim() || reviewMutation.isPending}
                                                onClick={() => handleConfirmReject(item.id)}
                                            >
                                                Confirmar Recusa
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {item.status === "rejected" && item.rejection_reason && (
                                    <p className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-md">
                                        <strong>Motivo da recusa:</strong> {item.rejection_reason}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}