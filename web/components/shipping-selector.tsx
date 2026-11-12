"use client";

import { useState, useEffect } from "react";
import { Truck, Store, Search, Loader2, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StorePickupSelector } from "@/components/story-selector";
import { PharmacyUnit } from "@/lib/company";

export interface DeliveryQuote {
  available: boolean;
  price: number;
  distanceKm: number;
  estimatedMinutes: number;
  originUnitName: string;
  customerAddress: string;
  message?: string;
}

interface ShippingMethodSelectorProps {
  onSelectDelivery: (quote: DeliveryQuote, cep: string) => void;
  onSelectPickup: (unit: PharmacyUnit) => void;
}

const getZipCookie = () => {
  if (typeof document === "undefined") return "";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; user_zipcode=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || "";
  return "";
};

const setZipCookie = (cep: string) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000);
  document.cookie = `user_zipcode=${cep};expires=${expires.toUTCString()};path=/`;
};

export function ShippingMethodSelector({
  onSelectDelivery,
  onSelectPickup,
}: ShippingMethodSelectorProps) {
  const [mode, setMode] = useState<"delivery" | "pickup">("delivery");
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<DeliveryQuote | null>(null);
  const [selectedPickupId, setSelectedPickupId] = useState<number | null>(null);

  const formatCepInput = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 8);
    if (numbers.length > 5) return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
    return numbers;
  };

  const handleCalculateDelivery = async (cepToSearch: string) => {
    const cleanCep = cepToSearch.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      setError("Informe um CEP válido com 8 dígitos.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const apiUrl = rawApiUrl.replace(/\/api\/?$/, "");
      const response = await fetch(`${apiUrl}/api/shipping/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ cep: cleanCep }),
      });

      const data: DeliveryQuote = await response.json();

      if (!response.ok || !data.available) {
        setQuote(null);
        setError(data.message || "Não entregamos neste endereço no momento. Verifique a opção Retirar na Loja.");
        return;
      }

      setZipCookie(cleanCep);
      setQuote(data);
      onSelectDelivery(data, cleanCep);
    } catch {
      setError("Erro ao comunicar com o servidor de entregas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedCep = getZipCookie();
    if (savedCep && savedCep.replace(/\D/g, "").length === 8) {
      setCep(formatCepInput(savedCep));
    }
  }, []);

  return (
    <div className="space-y-6">

      {/* SELETOR DE ABAS (ENTREGA VS RETIRADA) */}
      <div className="grid grid-cols-2 gap-3 p-1 bg-muted rounded-xl">
        <button
          type="button"
          onClick={() => setMode("delivery")}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
            mode === "delivery"
              ? "bg-background text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Truck className="w-8 h-8" />
          Receber em Casa
        </button>

        <button
          type="button"
          onClick={() => setMode("pickup")}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
            mode === "pickup"
              ? "bg-background text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Store className="w-8 h-8" />
          Retirar na Loja (Grátis)
        </button>
      </div>

      {/* ABA 1: ENTREGA EM DOMICÍLIO (CÁLCULO VIA BACKEND LARAVEL) */}
      {mode === "delivery" ? (
        <div className="space-y-4">
          <div className="bg-muted/30 border rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
              Informe o seu CEP
            </h3>

            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Digite seu CEP (ex: 21625-001)"
                value={cep}
                onChange={(e) => setCep(formatCepInput(e.target.value))}
                maxLength={9}
                className="bg-background sm:max-w-60"
              />
              <Button
                type="button"
                onClick={() => handleCalculateDelivery(cep)}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Calculando rota...
                  </>
                ) : (
                  <>
                    Calcular Frete
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-xs text-destructive font-medium bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* RESULTADO DO FRETE */}
          {quote && quote.available && (
            <div className="border border-primary bg-primary/5 ring-1 ring-primary rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">
                    Entrega Expressa (Motoboy)
                  </span>
                  <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Saída: Unidade {quote.originUnitName} ({quote.distanceKm} km)
                  </span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{quote.customerAddress}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Previsão de chegada: <strong>até {quote.estimatedMinutes} minutos</strong> após aprovação
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-lg font-bold text-primary block">
                  {quote.price === 0
                    ? "Grátis"
                    : quote.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                </span>
                <span className="text-[11px] text-green-600 font-medium flex items-center justify-end gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Selecionado
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ABA 2: RETIRADA NA LOJA (CÁLCULO HAVERSINE NO FRONT-END) */
        <StorePickupSelector
          initialCep={cep}
          selectedUnitId={selectedPickupId}
          onSelectUnit={(unit) => {
            setSelectedPickupId(unit.id);
            onSelectPickup(unit);
          }}
        />
      )}
    </div>
  );
}