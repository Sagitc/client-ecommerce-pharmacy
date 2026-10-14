import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/lib/company";

export default function PrivacyPolicyPage() {
  return (
    <div className="container bg-background dark:bg-gray-800 rounded-lg max-w-6xl mx-auto mt-6 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 border-b pb-8">
        <Button variant="ghost" className="mb-4 py-6 text-muted-foreground hover:text-foreground">
          <Link href="/" className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a página inicial
          </Link>
        </Button>
        <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Política de Privacidade
            </h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {companyConfig.name} - Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>
      </div>

      <div className="space-y-10 text-base text-muted-foreground leading-relaxed">
        
        <section>
          <p>
            A {companyConfig.name} atua a partir de uma visão integrada entre saúde, tecnologia e segurança técnica e jurídica, adotando as melhores práticas na governança de dados pessoais. Nossa relação com nossos clientes é pautada pelo total respeito à privacidade. 
          </p>
          <p className="mt-4">
            Esta Política foi criada com o objetivo de garantir a transparência de nossas atividades e permitir que nossos clientes obtenham acesso facilitado a informações claras sobre como utilizamos seus dados.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">1. Controlador de Dados Pessoais</h2>
          <p>
            Para as atividades desta Política, o Controlador de Dados Pessoais é a <strong>{companyConfig.name}</strong>, inscrita no CNPJ sob o nº <strong>{companyConfig.cnpj}</strong>, com sede em {companyConfig.address}.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">2. Dados Pessoais e Sensíveis Coletados</h2>
          <p className="mb-4">Podemos coletar ou obter acesso aos seguintes dados:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Dados Cadastrais:</strong> nome completo, CPF, gênero, telefone, data de nascimento, endereço completo e e-mail.</li>
            <li><strong>Dados Sensíveis:</strong> dados relativos às compras de medicamentos, produtos ou serviços de saúde realizados em nossa rede.</li>
            <li><strong>Dados Financeiros:</strong> dados de pagamento protegidos, como nome do titular, número do cartão (tokenizado), bandeira e validade.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">3. Finalidades do Tratamento</h2>
          <p className="mb-4">Seus dados são utilizados para:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Cadastro, identificação e efetivação de pedidos em nossos sistemas.</li>
            <li>Fornecimento de produtos compatíveis com suas preferências e envio de comunicações sobre campanhas de saúde.</li>
            <li>Prevenção à fraude e cumprimento de obrigações legais, fiscais ou regulatórias.</li>
          </ul>
          <p className="mt-4">
            <em>Sobre o CPF:</em> A coleta do CPF é fundamental para cadastro, prevenção a fraudes e cumprimento de obrigações do Ministério da Saúde. O oferecimento de melhores condições de compra básicas não está vinculado obrigatoriamente ao fornecimento do CPF.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">4. Compartilhamento de Dados</h2>
          <p className="mb-4">
            Podemos compartilhar seus dados com empresas de transporte, processadores de pagamento (Mercado Pago), serviços de prevenção à fraude, sistemas de CRM/armazenamento em nuvem e autoridades públicas. 
          </p>
          <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-md mt-4 text-foreground text-sm">
            <strong>Importante:</strong> Em hipótese alguma compartilharemos com parceiros informações ou dados pessoais sensíveis relacionados às suas compras (medicamentos, produtos de saúde) a menos que autorizado por você ou exigido por lei/regulação.
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">5. Armazenamento e Proteção (Prazos Legais)</h2>
          <p className="mb-4">Armazenamos seus dados pelos seguintes prazos, conforme exigências legais:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Código de Defesa do Consumidor:</strong> Dados de cadastro e histórico de compras armazenados por até 5 anos.</li>
            <li><strong>Marco Civil da Internet:</strong> Registros de acesso (logs) armazenados por 6 meses.</li>
            <li><strong>Farmácia Popular:</strong> Dados de dispensação armazenados por 10 anos.</li>
            <li><strong>Portaria n.º 344/1998 (Controlados):</strong> Receitas de medicamentos sujeitos a controle especial armazenadas por 5 anos.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">6. Seus Direitos (LGPD)</h2>
          <p className="mb-4">Você possui o direito de solicitar:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Confirmação e acesso aos dados pessoais tratados.</li>
            <li>Correção de dados incompletos ou desatualizados.</li>
            <li>Eliminação de dados tratados com consentimento (ressalvadas as guardas legais obrigatórias).</li>
            <li>Revogação do consentimento a qualquer momento.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">7. Crianças e Adolescentes</h2>
          <p>
            Adotamos medidas rigorosas no tratamento de dados de menores. Quando necessário, solicitaremos o consentimento do pai, mãe ou responsável legal para tratar os dados da criança ou adolescente.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">8. Contato do Encarregado (DPO)</h2>
          <p>
            Para exercer seus direitos ou tirar dúvidas, entre em contato com nosso Encarregado pelo Tratamento de Dados Pessoais através do e-mail:{" "}
            <a href={`mailto:${companyConfig.contact.emailAtendimento}`} className="font-medium text-primary hover:underline">
              {companyConfig.contact.emailAtendimento}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}