import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/lib/company";

export default function TermsOfUsePage() {
  return (
    <div className="container max-w-6xl rounded-lg my-8 bg-background dark:bg-gray-800 mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 border-b pb-8">
        <Button variant="ghost" className="mb-4 py-4 text-muted-foreground hover:text-foreground">
          <Link className="flex items-center" href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a página inicial
          </Link>
        </Button>
        <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Termos e Condições de Uso
            </h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {companyConfig.name} - Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>
      </div>

      <div className="space-y-10 text-base text-muted-foreground leading-relaxed">
        
        <section>
          <p>
            O presente documento estabelece os Termos e Condições de Uso aplicáveis à utilização do site 
            e serviços de e-commerce da <strong>{companyConfig.razaoSocial}</strong>, inscrita no CNPJ sob o nº
            <strong> {companyConfig.cnpj}</strong>, doravante denominada simplesmente "{companyConfig.name}".
          </p>
          <p className="mt-4">
            Ao acessar, navegar ou realizar compras em nosso site, o usuário ("Cliente") declara ter lido, 
            compreendido e aceitado expressamente todas as condições aqui estabelecidas. Caso não concorde 
            com estes termos, solicitamos que não utilize nossos serviços.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">1. Cadastro e Acesso</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Para realizar compras, o Cliente deverá realizar um cadastro informando dados válidos, exatos e 
              atualizados (como Nome, CPF, E-mail e Endereço).
            </li>
            <li>
              A {companyConfig.name} se reserva o direito de suspender ou cancelar contas que apresentem 
              informações falsas ou que demonstrem indícios de fraude, sem aviso prévio.
            </li>
            <li>
              O Cliente é o único responsável pela confidencialidade de sua senha de acesso. A {companyConfig.name} 
              não se responsabiliza por compras realizadas por terceiros utilizando a conta do Cliente.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">2. Comercialização de Medicamentos (Regras ANVISA)</h2>
          <p className="mb-4">
            A venda de medicamentos pela internet obedece rigorosamente às normativas da ANVISA e do Ministério da Saúde:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Medicamentos com Retenção de Receita:</strong> Antibióticos e medicamentos sujeitos a controle especial 
              (Portaria 344/98) só terão a compra efetivada mediante a apresentação e retenção da receita médica original. 
              No momento da entrega em domicílio, o motoboy/entregador exigirá a receita física. Caso o Cliente não a 
              possua ou a receita esteja inválida, a mercadoria não será entregue e o pedido será cancelado.
            </li>
            <li>
              <strong>Imagens Ilustrativas:</strong> As imagens dos produtos apresentadas no site são meramente 
              ilustrativas. Em caso de medicamentos genéricos, a embalagem pode variar de acordo com o laboratório disponível.
            </li>
            <li>
              <strong>Automedicação:</strong> A {companyConfig.name} não recomenda a automedicação. Ao persistirem os 
              sintomas, um médico deverá ser consultado. O site não substitui, em nenhuma hipótese, o aconselhamento médico.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">3. Preços e Pagamentos</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Os preços e descontos praticados no site podem divergir dos preços praticados nas lojas físicas da {companyConfig.name}. 
              As ofertas são válidas enquanto durarem os estoques destinados ao e-commerce.
            </li>
            <li>
              Os pagamentos são processados em ambiente seguro por instituições parceiras (Mercado Pago). A {companyConfig.name} 
              não armazena os dados completos do seu cartão de crédito.
            </li>
            <li>
              O pedido só será liberado para separação e entrega após a confirmação do pagamento pela instituição financeira.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">4. Entregas</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              O prazo de entrega e o valor do frete variam de acordo com o CEP informado e a modalidade escolhida no momento do checkout.
            </li>
            <li>
              Para garantir o recebimento, é necessário que haja uma pessoa maior de 18 anos no endereço informado para assinar o comprovante.
            </li>
            <li>
              Para entrega de medicamentos controlados, o recebedor deve, obrigatoriamente, ser capaz de fornecer a 
              receita médica original e assinar os termos legais.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">5. Trocas e Devoluções (Direito de Arrependimento)</h2>
          <p className="mb-4">
            Em conformidade com o Código de Defesa do Consumidor (Art. 49), o Cliente tem o direito de se arrepender 
            da compra em até 7 (sete) dias corridos após o recebimento do produto, observando as seguintes exceções 
            regulamentares:
          </p>
          <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-r-md mt-4 mb-4 text-sm text-foreground">
            <strong>Atenção (RDC 20/2011 e Portaria 344/98 - ANVISA):</strong> Por questões de saúde pública e 
            segurança sanitária, <strong>não aceitamos devolução ou troca de medicamentos controlados e antibióticos</strong>. 
            Dúvidas sobre a medicação devem ser sanadas com o médico antes da efetivação da compra.
          </div>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Para produtos de higiene, beleza e medicamentos não controlados (MIPs), a devolução será aceita desde que 
              o produto esteja em sua embalagem original, inviolado, sem indícios de uso e acompanhado da nota fiscal.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">6. Propriedade Intelectual</h2>
          <p>
            O uso comercial da expressão "{companyConfig.name}" como marca, nome empresarial ou nome de domínio, 
            bem como o conteúdo das telas, banco de dados, redes e arquivos do site, são de propriedade exclusiva da empresa. 
            É proibida a reprodução total ou parcial sem autorização prévia por escrito.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">7. Foro e Legislação Aplicável</h2>
          <p>
            Estes Termos são regidos pelas leis da República Federativa do Brasil, em especial o Código de Defesa do 
            Consumidor, a Lei Geral de Proteção de Dados (LGPD) e normativas da ANVISA. Para dirimir eventuais controvérsias, 
            fica eleito o foro da comarca de <strong>Nilópolis / RJ</strong>.
          </p>
        </section>

        <section className="pt-6 border-t mt-10">
          <p>
            Em caso de dúvidas sobre estes Termos, entre em contato através da nossa Central de Atendimento ou pelo 
            e-mail: <a href={`mailto:${companyConfig.contact.emailAtendimento}`} className="font-medium text-primary hover:underline">{companyConfig.contact.emailAtendimento}</a>.
          </p>
        </section>

      </div>
    </div>
  );
}