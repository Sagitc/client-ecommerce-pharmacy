"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { companyConfig } from "@/lib/company";

export default function CareersPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aqui pode integrar futuramente com uma rota do Laravel para guardar no banco ou enviar e-mail
    setSubmitted(true);
  };

  return (
    <div className="container max-w-6xl bg-background mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-10 border-b pb-8">
        <Button variant="ghost" className="mb-4 py-6 text-muted-foreground hover:text-foreground">
          <Link href="/" className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a página inicial
          </Link>
        </Button>
        <div className="flex items-center gap-3 mb-2">
          <Briefcase className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trabalhe Conosco
          </h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          Faça parte da equipa da {companyConfig.name} e ajude-nos a levar mais saúde e cuidado às pessoas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* INFORMAÇÕES LATERAIS */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">Por que trabalhar connosco?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Valorizamos profissionais dedicados, éticos e apaixonados pelo atendimento humanizado. Oferecemos um ambiente colaborativo e oportunidades de crescimento.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider">
              Áreas de Atuação
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Farmacêutico(a) Responsável / Clínico</li>
              <li>• Balconista de Medicamentos</li>
              <li>• Operador(a) de Caixa e Atendimento</li>
              <li>• Auxiliar de Estoque e Logística</li>
              <li>• Entregador / Estafeta</li>
              <li>• Administrativo e E-commerce</li>
            </ul>
          </div>

          <div className="bg-muted p-4 rounded-xl text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">Envio direto por e-mail:</p>
            <p>
              Também pode enviar o seu currículo em PDF diretamente para:{" "}
              <a href={`mailto:${companyConfig.rhEmail}`} className="text-primary hover:underline">
                {companyConfig.rhEmail}
              </a>
            </p>
          </div>
        </div>

        {/* FORMULÁRIO DE CANDIDATURA */}
        <div className="md:col-span-3 bg-background border rounded-xl p-6 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
              <h3 className="text-xl font-bold text-foreground">Candidatura enviada com sucesso!</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Recebemos os seus dados no nosso banco de talentos. Caso surja uma vaga compatível com o seu perfil, a nossa equipa de Recursos Humanos entrará em contacto.
              </p>
              <Button variant="outline" onClick={() => setSubmitted(false)}>
                Enviar outra candidatura
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Registe o seu Currículo
              </h2>

              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input id="name" required placeholder="Digite o seu nome completo" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input id="email" type="email" required placeholder="seu@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone / WhatsApp *</Label>
                  <Input id="phone" required placeholder="(00) 90000-0000" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Cargo de Interesse *</Label>
                <select
                  id="role"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Selecione uma área...</option>
                  <option value="farmaceutico">Farmacêutico(a)</option>
                  <option value="balconista">Balconista / Atendimento</option>
                  <option value="caixa">Operador(a) de Caixa</option>
                  <option value="logistica">Estoque / Entregas</option>
                  <option value="administrativo">Administrativo / E-commerce</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cv">Currículo (PDF ou Word) *</Label>
                <Input id="cv" type="file" accept=".pdf,.doc,.docx" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Resumo Profissional / Apresentação</Label>
                <textarea
                  id="message"
                  rows={3}
                  placeholder="Conte brevemente sobre a sua experiência..."
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <Button type="submit" className="w-full mt-2">
                <Send className="w-4 h-4 mr-2" />
                Enviar Currículo
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}