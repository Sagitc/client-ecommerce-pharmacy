import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Phone, Navigation, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/lib/company";

export default function UnitsPage() {
  return (
    <div className="container max-w-6xl bg-background rounded-lg my-6 mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-10 border-b pb-8">
        <Button variant="ghost" className="mb-4 py-5 text-muted-foreground hover:text-foreground">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a página inicial
          </Link>
        </Button>
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Nossas Unidades
          </h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          Encontre a {companyConfig.name} mais próxima de você e confira os horários e serviços disponíveis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {companyConfig.units.map((unit) => (
          <div
            key={unit.id}
            className="bg-background border rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-foreground">{unit.name}</h2>
                {unit.isEcommerceHub && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    Matriz
                  </span>
                )}
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <span>{unit.address}</span>
                </p>
                <p className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <span>{unit.hours}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span>{unit.phone} / WhatsApp: {unit.whatsapp}</span>
                </p>
              </div>

              {/* Informações regulatórias da unidade */}
              <div className="bg-muted/30 p-3 rounded-lg border text-xs text-muted-foreground space-y-1">
                <p className="flex items-center gap-1.5 font-medium text-foreground">
                  <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
                  Farmacêutico(a): {unit.legal.farmaceutico} ({unit.legal.crf})
                </p>
                <p>
                  CNPJ: {unit.cnpj} | AFE: {unit.legal.afe}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Serviços disponíveis nesta loja:
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {unit.services.map((service, index) => (
                    <span
                      key={index}
                      className="text-xs bg-primary/10 text-primary font-medium px-2.5 py-1 rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button className="flex-1">
                <a
                  href={unit.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1 w-full"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Como Chegar
                </a>
              </Button>
              <Button variant="outline" className="flex-1">
                <a
                  href={`https://wa.me/${unit.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1 w-full"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Falar com a Loja
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}