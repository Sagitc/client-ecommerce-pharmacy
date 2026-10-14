import Link from "next/link";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/lib/company";

export default function ReturnsPolicyPage() {
  return (
    <div className="container bg-background dark:bg-gray-800 max-w-6xl rounded-lg my-6 mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 border-b pb-8">
        <Button variant="ghost" className="mb-4 py-6 text-muted-foreground hover:text-foreground">
          <Link className="flex items-center" href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a página inicial
          </Link>
        </Button>
        <div className="flex items-center gap-3 mb-2">
            <RefreshCcw className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Política de Troca e Devolução
            </h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {companyConfig.name} - Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>
      </div>

      <div className="space-y-10 text-base text-muted-foreground leading-relaxed">
        
        <section>
          <p>
            A {companyConfig.name} tem o compromisso de garantir a sua satisfação em todas as compras realizadas 
            em nosso e-commerce. Para isso, nossa Política de Troca e Devolução foi desenvolvida com base no 
            Código de Defesa do Consumidor (Lei nº 8.078/1990) e nas regulamentações da ANVISA e do Ministério da Saúde.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">1. Medicamentos: Regras da ANVISA</h2>
          <p className="mb-4">
            A comercialização de medicamentos possui regras estritas de saúde pública. Por isso, preste muita 
            atenção às normativas federais:
          </p>
          <div className="bg-destructive/10 border-l-4 border-destructive p-5 rounded-r-md mt-4 mb-4">
            <h3 className="text-destructive font-bold mb-2">PROIBIÇÃO DE TROCA OU DEVOLUÇÃO</h3>
            <p className="text-sm text-foreground">
              Em cumprimento à <strong>Portaria 344/1998</strong> e à <strong>RDC 20/2011 da ANVISA</strong>, 
              <strong> NÃO realizamos trocas ou devoluções de medicamentos sujeitos a controle especial 
              (tarja preta/vermelha com retenção de receita) e antibióticos</strong>. 
              <br /><br />
              Uma vez que o produto sai da farmácia e é entregue, sua rastreabilidade e controle de 
              armazenamento são perdidos, inviabilizando que ele retorne ao estoque por questões de 
              segurança sanitária.
            </p>
          </div>
          <p>
            Dúvidas sobre dosagem, posologia ou interações medicamentosas devem ser esclarecidas com o seu 
            médico ou com nosso farmacêutico responsável <strong>antes</strong> da finalização da compra.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">2. Direito de Arrependimento</h2>
          <p className="mb-4">
            Para <strong>produtos de higiene, perfumaria, cosméticos, conveniência e medicamentos isentos de prescrição (MIPs)</strong>, 
            você tem o direito de desistir da compra online no prazo de até <strong>7 (sete) dias corridos</strong> a 
            contar da data de recebimento do pedido (Art. 49 do CDC).
          </p>
          <p className="mb-2">Para que a devolução por arrependimento seja aceita, o produto deve atender às seguintes condições:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Estar na embalagem original, intacta e inviolada (com lacre original do fabricante).</li>
            <li>Não apresentar nenhum indício de uso, consumo ou teste.</li>
            <li>Estar acompanhado do Cupom Fiscal (NFC-e) ou Nota Fiscal (DANFE) e todos os seus manuais/acessórios.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">3. Produtos com Avaria, Defeito ou Pedido Incorreto</h2>
          <p className="mb-4">
            Caso você receba a sua encomenda com a caixa de papelão aberta, amassada ou com sinais de violação, 
            <strong> recuse o recebimento</strong> imediatamente com o entregador e entre em contato conosco.
          </p>
          <p className="mb-4">
            Se você recebeu o pedido, mas constatou que o produto está avariado (vazando, quebrado), apresenta defeito 
            de fabricação ou é diferente do que foi comprado:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Entre em contato com nossa Central de Atendimento em até <strong>72 horas</strong> após o recebimento.</li>
            <li>Tire fotos do estado da embalagem e do produto recebido para agilizar nossa análise.</li>
            <li>O produto incorreto ou avariado será recolhido e, após a validação em nossa central, enviaremos um novo item ou realizaremos o estorno.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">4. Como solicitar uma Troca ou Devolução</h2>
          <p className="mb-4">
            Para iniciar o processo, entre em contato através de um dos nossos canais informando o número do pedido 
            e o motivo da solicitação:
          </p>
          <div className="bg-muted p-4 rounded-md">
            <p className="font-medium text-foreground">E-mail: <a href={`mailto:${companyConfig.contact.emailAtendimento}`} className="text-primary hover:underline">{companyConfig.contact.emailAtendimento}</a></p>
            <p className="font-medium text-foreground mt-2">WhatsApp: {companyConfig.contact.whatsapp}</p>
            <p className="text-sm mt-2">Horário de atendimento: Segunda a sexta-feira, das 08h às 18h.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">5. Restituição de Valores</h2>
          <p className="mb-4">
            Após o recebimento do produto devolvido em nosso Centro de Distribuição e aprovação da análise de 
            qualidade, a restituição do valor pago será processada das seguintes formas:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Cartão de Crédito:</strong> O estorno será solicitado à administradora do seu cartão (via Mercado Pago). 
              O crédito poderá constar em até 2 (duas) faturas subsequentes, dependendo da data de fechamento e da sua instituição financeira.
            </li>
            <li>
              <strong>Pix:</strong> O reembolso será realizado na mesma conta bancária utilizada para o pagamento original 
              em até 3 (três) dias úteis.
            </li>
          </ul>
          <p className="mt-4 text-sm italic">
            * O valor restituído corresponderá ao valor pago pelo produto. O valor do frete só será reembolsado caso a devolução 
            seja integral (de todos os itens do pedido) por motivo de arrependimento no prazo legal ou erro de nossa parte.
          </p>
        </section>

      </div>
    </div>
  );
}