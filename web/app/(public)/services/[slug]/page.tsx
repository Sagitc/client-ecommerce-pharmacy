import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  HeartPulse, 
  Pill, 
  Percent, 
  Syringe, 
  Droplet, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  MessageCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/lib/company";

const servicesData: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  detailsTitle: string;
  details: string[];
  requirementsTitle: string;
  requirements: string[];
}> = {
  "afericao-de-pressao": {
    title: "Aferição de Pressão Arterial",
    subtitle: "Monitorização rápida, segura e realizada por profissionais qualificados.",
    description:
      "O controlo regular da pressão arterial é fundamental para a prevenção e acompanhamento da hipertensão e de outras doenças cardiovasculares. Nas nossas unidades, realizamos a medição com equipamentos calibrados e certificados pela ANVISA.",
    icon: HeartPulse,
    detailsTitle: "Como funciona o atendimento?",
    details: [
      "Atendimento realizado em sala de serviços farmacêuticos com total privacidade.",
      "Utilização de aparelhos digitais e analógicos de alta precisão.",
      "Registo dos valores obtidos para que possa apresentar ao seu médico.",
      "Orientação farmacêutica sobre hábitos saudáveis e adesão ao tratamento."
    ],
    requirementsTitle: "Recomendações antes do exame:",
    requirements: [
      "Repousar pelo menos 5 a 10 minutos antes da aferição.",
      "Não ter praticado exercício físico intenso nos últimos 60 minutos.",
      "Não ter ingerido bebidas alcoólicas, café ou fumado nos 30 minutos anteriores.",
      "Estar com a bexiga vazia no momento da medição."
    ]
  },
  "farmacia-popular": {
    title: "Programa Farmácia Popular",
    subtitle: "Medicamentos gratuitos ou com até 90% de desconto pelo Governo Federal.",
    description:
      "A Drogarias Camargo é credenciada no Programa Farmácia Popular do Brasil, garantindo o acesso da população a medicamentos essenciais para tratamentos contínuos como hipertensão, diabetes, asma, osteoporose, rinite, entre outros.",
    icon: Pill,
    detailsTitle: "Benefícios disponíveis no programa:",
    details: [
      "Medicamentos 100% gratuitos para Hipertensão, Diabetes, Asma, Osteoporose e Anticoncepcionais.",
      "Descontos de até 90% em medicamentos para Dislipidemia (colesterol alto), Rinite, Doença de Parkinson e Glaucoma.",
      "Disponibilização de Fraldas Geriátricas com desconto subsidiado.",
      "Absorventes higiénicos gratuitos através do Programa Dignidade Menstrual."
    ],
    requirementsTitle: "Documentos necessários na loja física:",
    requirements: [
      "Documento oficial com foto e número do CPF.",
      "Receita médica válida (da rede pública ou particular) dentro do prazo regulamentar.",
      "Para fraldas geriátricas: o paciente deve ter idade igual ou superior a 60 anos ou ser pessoa com deficiência (com prescrição ou laudo médico).",
      "A presença do titular é obrigatória (exceto em casos de incapacidade comprovada por procuração legal)."
    ]
  },
  "programas-de-desconto": {
    title: "Programas de Desconto (PBM)",
    subtitle: "Parcerias diretas com os maiores laboratórios farmacêuticos do país.",
    description:
      "Trabalhamos com os principais Programas de Benefícios em Medicamentos (PBMs) da indústria farmacêutica. Através deles, obtém descontos expressivos em medicamentos de marca e de uso contínuo prescritos pelo seu médico.",
    icon: Percent,
    detailsTitle: "Vantagens dos Programas de Laboratório:",
    details: [
      "Descontos diretos no balcão ou no atendimento utilizando apenas o seu CPF.",
      "Parceria com dezenas de laboratórios (EMS, Medley, Eurofarma, Pfizer, Novartis, Bayer, entre outros).",
      "Facilidade de adesão: caso ainda não tenha registo no laboratório, a nossa equipa auxilia na inscrição na hora.",
      "Economia garantida para tratamentos de longa duração."
    ],
    requirementsTitle: "Como utilizar o benefício?",
    requirements: [
      "Verifique se o medicamento prescrito participa num programa do fabricante.",
      "Realize o registo prévio no site do laboratório ou diretamente no nosso atendimento.",
      "Apresente o seu CPF e a receita médica no momento da compra."
    ]
  },
  "aplicacao-de-injetaveis": {
    title: "Aplicação de Injetáveis",
    subtitle: "Segurança, higiene rigorosa e profissionais habilitados para a sua medicação.",
    description:
      "A administração de medicamentos injetáveis exige técnica apurada e ambiente esterilizado. Contamos com sala exclusiva e profissionais devidamente treinados e autorizados pelo Conselho Regional de Farmácia.",
    icon: Syringe,
    detailsTitle: "Diferenciais do nosso serviço:",
    details: [
      "Utilização exclusiva de materiais descartáveis e estéreis.",
      "Sala higienizada segundo os padrões da Vigilância Sanitária (RDC 44/2009).",
      "Registo completo da aplicação (lote, validade e profissional responsável).",
      "Acompanhamento pós-aplicação e orientação sobre possíveis reações locais."
    ],
    requirementsTitle: "Regras obrigatórias para aplicação:",
    requirements: [
      "Apresentação obrigatória da receita médica original e dentro da validade.",
      "Identificação do paciente com documento oficial.",
      "Não realizamos aplicação de medicamentos cuja primeira dose exija ambiente hospitalar.",
      "Menores de idade devem estar acompanhados pelos pais ou responsável legal."
    ]
  },
  "teste-de-glicemia": {
    title: "Teste de Glicemia Capilar",
    subtitle: "Controlo rápido do nível de açúcar no sangue em poucos segundos.",
    description:
      "O teste de glicemia capilar permite verificar a taxa de glicose no sangue de forma imediata, auxiliando na triagem e no acompanhamento diário do diabetes tipo 1, tipo 2 e gestacional.",
    icon: Droplet,
    detailsTitle: "Como é realizado o procedimento?",
    details: [
      "Coleta rápida e praticamente indolor de uma pequena gota de sangue na ponta do dedo.",
      "Utilização de lancetas descartáveis de uso único e tiras reagentes de alta precisão.",
      "Resultado entregue na hora em menos de 1 minuto.",
      "Emissão da Declaração de Serviço Farmacêutico com o valor registado."
    ],
    requirementsTitle: "Preparação recomendada:",
    requirements: [
      "Para glicemia de jejum: recomenda-se jejum alimentar de 8 a 12 horas (conforme orientação médica).",
      "Para glicemia pós-prandial: realizar o teste 2 horas após o início da refeição.",
      "O teste também pode ser feito a qualquer momento do dia para verificação de rotina.",
      "Nota: Este teste tem finalidade de acompanhamento e triagem, não substituindo exames laboratoriais."
    ]
  },
  "furo-de-lobulo": {
    title: "Furo de Lóbulo Auricular",
    subtitle: "Procedimento humanizado, rápido e com brincos hipoalergénicos estéreis.",
    description:
      "Realizamos a perfuração do lóbulo da orelha em bebés, crianças e adultos utilizando sistemas modernos, silenciosos e 100% esterilizados, reduzindo o desconforto e garantindo uma cicatrização segura.",
    icon: Sparkles,
    detailsTitle: "Por que fazer na Drogarias Camargo?",
    details: [
      "Utilização de brincos cirúrgicos hipoalergénicos em cápsulas lacradas e estéreis.",
      "Marcação simétrica e cuidadosa aprovada pelo cliente ou pelos pais antes do procedimento.",
      "Sistema silencioso (sem o estalo de pistolas antigas), ideal para recém-nascidos e crianças.",
      "Orientações completas sobre os cuidados de higienização pós-procedimento."
    ],
    requirementsTitle: "Requisitos para o atendimento:",
    requirements: [
      "Uso exclusivo dos brincos estéreis regulamentados pela ANVISA fornecidos na farmácia.",
      "Menores de 18 anos precisam de estar acompanhados pelo pai, mãe ou responsável legal.",
      "Para bebés: recomendamos que tenham as vacinas iniciais em dia e autorização do pediatra.",
      "O procedimento é realizado apenas no lóbulo da orelha (não perfuramos cartilagem)."
    ]
  }
};

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = servicesData[slug];

  if (!service) {
    notFound();
  }

  const IconComponent = service.icon;

  return (
    <div className="container max-w-6xl bg-background rounded-lg my-6 mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* CABEÇALHO */}
      <div className="mb-10 border-b pb-8">
        <Button variant="ghost" className="mb-4 py-5 text-muted-foreground hover:text-foreground">
          <Link className="flex items-center gap-2" href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a página inicial
          </Link>
        </Button>
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <IconComponent className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {service.title}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground mt-2">{service.subtitle}</p>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="space-y-10">
        <section className="text-base text-muted-foreground leading-relaxed bg-muted/30 p-6 rounded-xl border">
          <p>{service.description}</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* COLUNA 1: DETALHES */}
          <div className="bg-background border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {service.detailsTitle}
            </h2>
            <ul className="space-y-3">
              {service.details.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUNA 2: REQUISITOS */}
          <div className="bg-background border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {service.requirementsTitle}
            </h2>
            <ul className="list-disc pl-5 space-y-3 text-sm text-muted-foreground">
              {service.requirements.map((req, idx) => (
                <li key={idx} className="leading-relaxed">
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA: ENCONTRAR UNIDADE OU FALAR NO WHATSAPP */}
        <section className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center space-y-4">
          <h3 className="text-xl font-bold text-foreground">
            Precisa deste serviço hoje?
          </h3>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Dirija-se a uma das unidades da {companyConfig.name} ou fale com o nosso atendimento para confirmar a disponibilidade e horários.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Button size="lg">
              <Link href="/units" className="flex items-center justify-center gap-1">
                <MapPin className="w-4 h-4 mr-2" />
                Ver Nossas Unidades
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              <a
                href={`https://wa.me/${companyConfig.contact.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Tirar Dúvidas no WhatsApp
              </a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}