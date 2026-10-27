import Link from "next/link";
import { ArrowLeft, Handshake, Building2, Stethoscope, Truck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/lib/company";

export default function PartnershipsPage() {
  return (
    <div className="container max-w-6xl bg-background mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-12 border-b pb-8">
        <Button variant="ghost" className="mb-4 py-6 text-muted-foreground hover:text-foreground">
          <Link href="/" className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a página inicial
          </Link>
        </Button>
        <div className="flex items-center gap-3 mb-2">
          <Handshake className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Parcerias e Convénios
          </h1>
        </div>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Construímos relações sólidas com empresas, clínicas e fornecedores para ampliar o acesso à saúde e gerar valor conjunto.
        </p>
      </div>

      <div className="space-y-12">
        {/* MODALIDADES DE PARCERIA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-background border rounded-xl p-6 shadow-sm space-y-3">
            <div className="p-3 bg-primary/10 text-primary rounded-lg w-fit">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Convénios Corporativos</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ofereça benefícios exclusivos, descontos em medicamentos e facilidade de pagamento em folha para os colaboradores da sua empresa ou associados da sua instituição.
            </p>
          </div>

          <div className="bg-background border rounded-xl p-6 shadow-sm space-y-3">
            <div className="p-3 bg-primary/10 text-primary rounded-lg w-fit">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Clínicas e Profissionais de Saúde</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Parcerias com consultórios, clínicas médicas e centros de saúde para ações preventivas, campanhas de vacinação/aferição e suporte farmacêutico aos pacientes.
            </p>
          </div>

          <div className="bg-background border rounded-xl p-6 shadow-sm space-y-3">
            <div className="p-3 bg-primary/10 text-primary rounded-lg w-fit">
              <Truck className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Fornecedores e Indústria</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Procuramos distribuidores homologados, laboratórios e marcas de dermocosméticos, higiene e suplementos para expandir o nosso catálogo físico e digital.
            </p>
          </div>
        </div>

        {/* BLOCO DE CONTACTO COMERCIAL */}
        <section className="bg-primary/5 border border-primary/20 rounded-2xl p-8 md:p-10 text-center space-y-4">
          <h3 className="text-2xl font-bold text-foreground">
            Vamos conversar sobre uma parceria?
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Apresente a sua proposta comercial ou solicite uma cotação de convénio para a sua empresa através do nosso canal direto de relacionamento corporativo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg">
              <a href={`mailto:${companyConfig.comercialEmail}?subject=Proposta de Parceria - ${companyConfig.name}`} className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Enviar Proposta por E-mail
              </a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}