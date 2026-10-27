// web/app/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/lib/company";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Loga o erro no console (ou futuro serviço como Sentry)
    console.error("Erro capturado pela Error Boundary:", error);
  }, [error]);

  return (
    <div className="container max-w-3xl mx-auto min-h-screen flex items-center justify-center py-12 px-4">
      <div className="bg-background border rounded-2xl p-8 sm:p-10 shadow-sm text-center space-y-6 w-full">
        <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Ops! Algo não saiu como esperado
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Encontramos uma instabilidade temporária ao carregar esta página. 
            Você pode tentar recarregar agora ou concluir seu atendimento pelo nosso WhatsApp.
          </p>
        </div>

        {/* Código de referência técnica discreto caso o cliente tire print */}
        {error.digest && (
          <p className="text-[11px] font-mono text-muted-foreground bg-muted/50 py-1 px-3 rounded-md inline-block">
            Código do erro: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button onClick={() => reset()} className="w-full sm:w-auto">
            <RotateCcw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>

          <Button variant="outline" className="w-full sm:w-auto">
            <Link href="/" className="flex items-center justify-center w-full">
              <Home className="w-4 h-4 mr-2" />
              Ir para o Início
            </Link>
          </Button>
        </div>

        <div className="pt-6 border-t text-xs text-muted-foreground">
          <p className="mb-2">Precisa comprar um medicamento com urgência?</p>
          <a
            href={`https://wa.me/${companyConfig.contact.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline"
          >
            <MessageCircle className="w-4 h-4" />
            Falar com nosso televendas no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}