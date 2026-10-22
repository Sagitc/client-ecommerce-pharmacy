"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Headset,
  Mail,
  Phone,
  MessageCircle,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { companyConfig } from "@/lib/company";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Integração futura com endpoint do Laravel
    setSubmitted(true);
  };

  return (
    <div className="container max-w-6xl bg-background rounded-lg my-6 mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* CABEÇALHO */}
      <div className="mb-10 border-b pb-8">
        <Button variant="ghost" className="mb-4 py-5 text-muted-foreground hover:text-foreground">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a página inicial
          </Link>
        </Button>
        <div className="flex items-center gap-3 mb-2">
          <Headset className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Fale Conosco
          </h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          Nossa equipe de atendimento e nossos farmacêuticos estão prontos para ajudar você.
        </p>
      </div>

      {/* BLOCO PRINCIPAL: CANAIS + FORMULÁRIO */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-14">
        {/* COLUNA ESQUERDA: CANAIS DE ATENDIMENTO */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-muted/30 border rounded-xl p-6 space-y-5">
            <h2 className="text-xl font-bold text-foreground">Canais Diretos (SAC)</h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">WhatsApp e Televendas</p>
                  <p className="text-muted-foreground">{companyConfig.contact.whatsapp}</p>
                  <a
                    href={`https://wa.me/${companyConfig.contact.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary text-xs font-medium hover:underline inline-block mt-1"
                  >
                    Iniciar conversa no WhatsApp →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Telefone Fixo</p>
                  <p className="text-muted-foreground">(21) {companyConfig.contact.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">E-mail de Atendimento</p>
                  <a
                    href={`mailto:${companyConfig.contact.emailAtendimento}`}
                    className="text-muted-foreground hover:text-primary hover:underline"
                  >
                    {companyConfig.contact.emailAtendimento}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Horário de Funcionamento</p>
                  <p className="text-muted-foreground">
                    Segunda a Sábado: 07h às 22h
                    <br />
                    Domingos e Feriados: 08h às 20h
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CANAL DO DPO (LGPD) */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
              <span>Privacidade e Proteção de Dados (LGPD)</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Para solicitações exclusivas sobre seus dados pessoais, fale com nosso Encarregado (DPO):{" "}
              <a
                href={`mailto:${companyConfig.contact.emailAtendimento}`}
                className="font-medium text-primary hover:underline"
              >
                {companyConfig.contact.emailAtendimento}
              </a>
            </p>
          </div>
        </div>

        {/* COLUNA DIREITA: FORMULÁRIO */}
        <div className="lg:col-span-3 bg-background border rounded-xl p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="py-16 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
              <h3 className="text-xl font-bold text-foreground">Mensagem enviada com sucesso!</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Recebemos a sua solicitação. Nossa equipe de atendimento responderá o mais breve possível pelo e-mail ou WhatsApp informado.
              </p>
              <Button variant="outline" onClick={() => setSubmitted(false)}>
                Enviar nova mensagem
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-bold text-foreground mb-4">Envie uma Mensagem</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input id="name" required placeholder="Seu nome" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone / WhatsApp *</Label>
                  <Input id="phone" required placeholder="(21) 90000-0000" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input id="email" type="email" required placeholder="seu@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unidade de Referência (Opcional)</Label>
                  <select
                    id="unit"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="ecommerce">Compras no Site (E-commerce)</option>
                    {companyConfig.units.map((unit) => (
                      <option key={unit.id} value={unit.slug}>
                        Unidade {unit.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Assunto *</Label>
                <select
                  id="subject"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Selecione o motivo do contato...</option>
                  <option value="duvida-pedido">Status de Pedido / Entrega</option>
                  <option value="farmaceutico">Orientação Farmacêutica / Medicamentos</option>
                  <option value="troca">Trocas e Devoluções</option>
                  <option value="elogio-sugestao">Elogios, Sugestões ou Reclamações</option>
                  <option value="outros">Outros Assuntos</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem *</Label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  placeholder="Descreva como podemos ajudar você (se for sobre um pedido, informe o número)..."
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <Button type="submit" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Enviar Solicitação
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* ATALHO RÁPIDO PARA AS UNIDADES */}
      <div className="border-t pt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Atendimento nas Lojas Físicas</h2>
            <p className="text-sm text-muted-foreground">
              Prefere falar diretamente com uma loja específica? Confira os contatos das nossas unidades:
            </p>
          </div>
          <Button variant="outline">
            <Link href="/unidades" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Ver Mapa de Unidades
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companyConfig.units.map((unit) => (
            <div key={unit.id} className="border rounded-xl p-4 bg-muted/20 flex flex-col justify-between gap-3">
              <div>
                <h3 className="font-bold text-foreground text-sm">Unidade {unit.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{unit.address}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t text-xs">
                <span className="text-muted-foreground font-medium">Tel: {unit.phone}</span>
                <a
                  href={`https://wa.me/${unit.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}