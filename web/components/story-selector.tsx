"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, CheckCircle2, Store, Search, Loader2, Navigation } from "lucide-react";
import { companyConfig, PharmacyUnit } from "@/lib/company";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StorePickupSelectorProps {
  initialCep?: string;
  selectedUnitId: number | null;
  onSelectUnit: (unit: PharmacyUnit) => void;
}

interface UnitWithDistance extends PharmacyUnit {
  distanceKm?: number;
}

// Fórmula de Haversine para calcular distância em linha reta (km)
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  // Multiplicador 1.25 aproxima a distância linear do trajeto real de rua
  return Number((R * c * 1.25).toFixed(1));
}

// Leitura e gravação nativa do cookie de CEP
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

export function StorePickupSelector({
  initialCep,
  selectedUnitId,
  onSelectUnit,
}: StorePickupSelectorProps) {
  const baseUnits = companyConfig.units.filter((u) => u.allowsPickup);

  const [cep, setCep] = useState(initialCep || "");
  const [customerAddress, setCustomerAddress] = useState<string | null>(null);
  const [sortedUnits, setSortedUnits] = useState<UnitWithDistance[]>(baseUnits);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Busca coordenadas a partir do CEP
  const handleCalculateProximity = async (cepToSearch: string) => {
    const cleanCep = cepToSearch.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      setError("Digite um CEP válido com 8 dígitos.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let lat: number | null = null;
      let lng: number | null = null;
      let formattedAddress = "";

      // 1ª Tentativa: AwesomeAPI (retorna lat e lng precisos por CEP)
      const resAwesome = await fetch(`https://cep.awesomeapi.com.br/json/${cleanCep}`);
      if (resAwesome.ok) {
        const data = await resAwesome.json();
        if (data.lat && data.lng) {
          lat = parseFloat(data.lat);
          lng = parseFloat(data.lng);
          formattedAddress = `${data.address}, ${data.district} - ${data.city}/${data.state}`;
        }
      }

      // 2ª Tentativa (Fallback): BrasilAPI v2
      if (!lat || !lng) {
        const resBrasil = await fetch(`https://brasilapi.com.br/api/cep/v2/${cleanCep}`);
        if (!resBrasil.ok) throw new Error("CEP não encontrado.");
        const data = await resBrasil.json();
        formattedAddress = `${data.street || ""}, ${data.neighborhood || ""} - ${data.city}/${data.state}`;
        if (data.location?.coordinates?.latitude && data.location?.coordinates?.longitude) {
          lat = parseFloat(data.location.coordinates.latitude);
          lng = parseFloat(data.location.coordinates.longitude);
        }
      }

      if (lat && lng) {
        const ranked = baseUnits
          .map((unit) => ({
            ...unit,
            distanceKm: calculateDistanceKm(
              lat!,
              lng!,
              unit.coordinates.lat,
              unit.coordinates.lng
            ),
          }))
          .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));

        setSortedUnits(ranked);
        setCustomerAddress(formattedAddress);
        setZipCookie(cleanCep);

        if (ranked.length > 0) {
          onSelectUnit(ranked[0]);
        }
      } else {
        setError("CEP localizado, mas sem coordenadas exatas. Escolha uma unidade abaixo.");
      }
    } catch {
      setError("Não foi possível localizar o CEP informado.");
    } finally {
      setLoading(false);
    }
  };

  // Se já existir CEP no cookie ou prop inicial, calcula ao montar o componente
  useEffect(() => {
    const savedCep = initialCep || getZipCookie();
    if (savedCep && savedCep.replace(/\D/g, "").length === 8) {
      setCep(savedCep);
      handleCalculateProximity(savedCep);
    }
  }, [initialCep]);

  const formatCepInput = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 8);
    if (numbers.length > 5) {
      return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
    }
    return numbers;
  };

  return (
    <div className="space-y-5">
      {/* BUSCADOR DE CEP */}
      <div className="bg-muted/30 border rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-base text-foreground">
            Encontrar unidade mais próxima para retirada
          </h3>
        </div>

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
            onClick={() => handleCalculateProximity(cep)}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Calculando...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Buscar Lojas Próximas
              </>
            )}
          </Button>
        </div>

        {error && <p className="text-xs text-destructive font-medium">{error}</p>}

        {customerAddress && (
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>
              Unidades ordenadas por proximidade de: <strong className="text-foreground">{customerAddress}</strong>
            </span>
          </p>
        )}
      </div>

      {/* LISTA DE UNIDADES ORDENADAS */}
      <div className="grid grid-cols-1 gap-3">
        {sortedUnits.map((unit, index) => {
          const isSelected = selectedUnitId === unit.id;
          const isClosest = unit.distanceKm !== undefined && index === 0;

          return (
            <div
              key={unit.id}
              onClick={() => onSelectUnit(unit)}
              className={`cursor-pointer border rounded-xl p-4 transition-all flex items-start justify-between gap-4 ${
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-background hover:border-primary/50"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm text-foreground">
                    Unidade {unit.name}
                  </span>

                  {isClosest && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      Mais próxima
                    </span>
                  )}

                  {unit.distanceKm !== undefined && (
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      a ~{unit.distanceKm} km de você
                    </span>
                  )}

                  <span className="text-[11px] font-semibold bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">
                    Retirada Grátis • {unit.pickupReadyTime}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <span>{unit.address}</span>
                </p>

                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{unit.hours}</span>
                </p>
              </div>

              <div className="shrink-0 mt-1">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}