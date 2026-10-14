"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  
  // Estados dos switches
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já deu algum consentimento antes
    const consent = Cookies.get("cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    Cookies.set("cookie_consent", "all", { expires: 365 });
    Cookies.set("consent_analytics", "true", { expires: 365 });
    Cookies.set("consent_marketing", "true", { expires: 365 });
    
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    Cookies.set("cookie_consent", "custom", { expires: 365 });
    Cookies.set("consent_analytics", analyticsConsent.toString(), { expires: 365 });
    Cookies.set("consent_marketing", marketingConsent.toString(), { expires: 365 });
    
    setIsVisible(false);
    setShowPreferences(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 p-4 pointer-events-none flex justify-center">
      <div className="bg-background border shadow-lg rounded-xl w-full max-w-4xl p-6 pointer-events-auto relative flex flex-col md:flex-row gap-6 items-center">
        
        {!showPreferences ? (
          <>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Cookie className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Nós valorizamos sua privacidade</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Usamos cookies essenciais e, com seu consentimento, cookies de análise e marketing. Leia nossa{" "}
                <Link href="/cookies" className="text-primary hover:underline">Política de Cookies</Link>.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button variant="outline" onClick={() => setShowPreferences(true)} className="whitespace-nowrap">
                Configurar preferências
              </Button>
              <Button onClick={handleAcceptAll} className="whitespace-nowrap">
                Aceitar todos
              </Button>
            </div>
          </>
        ) : (
          
          <div className="w-full">
            <div className="flex justify-between items-center mb-4 border-b pb-4">
              <h3 className="font-bold text-lg">Preferências de Privacidade</h3>
              <button onClick={() => setShowPreferences(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm">Cookies Essenciais</h4>
                  <p className="text-xs text-muted-foreground">Necessários para o site funcionar (carrinho, login).</p>
                </div>
                <Switch checked={true} disabled />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm">Cookies Analíticos</h4>
                  <p className="text-xs text-muted-foreground">Ajudam-nos a entender como os visitantes interagem com o site.</p>
                </div>
                <Switch 
                  checked={analyticsConsent} 
                  onCheckedChange={setAnalyticsConsent} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm">Cookies de Marketing</h4>
                  <p className="text-xs text-muted-foreground">Utilizados para fornecer anúncios mais relevantes.</p>
                </div>
                <Switch 
                  checked={marketingConsent} 
                  onCheckedChange={setMarketingConsent} 
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowPreferences(false)}>
                Voltar
              </Button>
              <Button onClick={handleSavePreferences}>
                Salvar preferências
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}