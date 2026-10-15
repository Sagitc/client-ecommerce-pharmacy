import Link from "next/link";
import { ArrowLeft, HeartPulse, ShieldCheck, Clock, Users, Target, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/lib/company"; // Importando nosso arquivo de configuração

export default function AboutUsPage() {
  return (
    <div className="container max-w-6xl bg-background rounded-lg my-6 mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* HEADER / VOLTAR */}
      <div className="mb-12 border-b pb-8">
        <Button variant="ghost" className="mb-4 py-5 text-muted-foreground hover:text-foreground">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a página inicial
          </Link>
        </Button>
        <div className="flex items-center gap-3 mb-2">
            <HeartPulse className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Sobre a {companyConfig.name}
            </h1>
        </div>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          Nossa dedicação vai além de entregar medicamentos. Nosso compromisso diário é 
          oferecer saúde, cuidado e bem-estar para você e sua família.
        </p>
      </div>

      <div className="space-y-16">
        
        {/* SEÇÃO 1: NOSSA HISTÓRIA */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <h2 className="text-2xl font-bold text-foreground mb-4">Nossa História</h2>
            <p>
              A <strong>{companyConfig.name}</strong> nasceu do desejo de criar um ambiente de saúde 
              onde o atendimento humanizado e o rigor técnico andassem lado a lado. Desde a nossa fundação, 
              temos sido um pilar de confiança na comunidade.
            </p>
            <p>
              Com a evolução das necessidades dos nossos clientes e o avanço da tecnologia, decidimos expandir 
              nosso cuidado para o ambiente digital. Nosso e-commerce foi desenhado para levar a mesma atenção, 
              variedade e preços justos da nossa loja física diretamente para o conforto da sua casa.
            </p>
            <p>
              Hoje, combinamos agilidade no atendimento online com o conhecimento de farmacêuticos dedicados, 
              garantindo que você tenha o suporte necessário em cada etapa do seu tratamento.
            </p>
          </div>
          {/* Espaço para uma foto real da farmácia ou da equipe */}
          <div className="bg-muted rounded-xl h-[300px] md:h-full min-h-[300px] flex items-center justify-center border shadow-inner">
            <span className="text-sm text-muted-foreground">
              [ Insira aqui uma foto da fachada da farmácia ou da equipe ]
            </span>
          </div>
        </section>

        {/* SEÇÃO 2: MISSÃO, VISÃO E VALORES */}
        <section className="bg-primary/5 rounded-2xl p-8 md:p-12 border border-primary/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-background rounded-full shadow-sm text-primary">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Nossa Missão</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Prover soluções em saúde e bem-estar com agilidade, segurança e atendimento 
                personalizado, melhorando a qualidade de vida dos nossos clientes.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-background rounded-full shadow-sm text-primary">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Nossa Visão</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Ser reconhecida como a rede de farmácias mais confiável e inovadora da região, 
                sendo a primeira escolha tanto no meio físico quanto no digital.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-background rounded-full shadow-sm text-primary">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Nossos Valores</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Ética profissional, respeito incondicional à vida, transparência nas relações, 
                excelência no atendimento e foco em inovação.
              </p>
            </div>

          </div>
        </section>

        {/* SEÇÃO 3: NOSSOS DIFERENCIAIS */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground">Por que escolher a {companyConfig.name}?</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 border rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow">
              <ShieldCheck className="w-10 h-10 text-primary mb-4" />
              <h4 className="font-semibold text-lg mb-2">Segurança Garantida</h4>
              <p className="text-sm text-muted-foreground">
                Comercializamos apenas produtos certificados e aprovados pela ANVISA. Suas informações 
                financeiras e de saúde são protegidas de acordo com a LGPD.
              </p>
            </div>

            <div className="p-6 border rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow">
              <Clock className="w-10 h-10 text-primary mb-4" />
              <h4 className="font-semibold text-lg mb-2">Agilidade na Entrega</h4>
              <p className="text-sm text-muted-foreground">
                Entendemos que saúde tem pressa. Nossa logística é otimizada para que seu pedido 
                chegue com rapidez e integridade ao seu endereço.
              </p>
            </div>

            <div className="p-6 border rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow">
              <Users className="w-10 h-10 text-primary mb-4" />
              <h4 className="font-semibold text-lg mb-2">Atendimento Especializado</h4>
              <p className="text-sm text-muted-foreground">
                Nossos farmacêuticos estão à disposição para tirar dúvidas sobre seus tratamentos 
                e orientar sobre o uso correto dos medicamentos.
              </p>
            </div>

          </div>
        </section>

        {/* SEÇÃO 4: CTA (CALL TO ACTION) DE CONTATO */}
        <section className="text-center py-8 border-t">
          <h3 className="text-xl font-semibold mb-4">Tem alguma dúvida ou precisa de ajuda?</h3>
          <p className="text-muted-foreground mb-6">
            Nossa equipe de atendimento está pronta para ouvir você.
          </p>
          <div className="flex justify-center gap-4 flex-col sm:flex-row">
            <Button size="lg">
              <Link href="/contato">Fale Conosco</Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link href="/">Navegar na Loja</Link>
            </Button>
          </div>
        </section>

      </div>
    </div>
  );
}