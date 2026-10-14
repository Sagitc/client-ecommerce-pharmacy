import Link from "next/link";
import { ArrowLeft, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/lib/company";

export default function CookiePolicyPage() {
  return (
    <div className="container bg-background dark:bg-gray-800 max-w-6xl mx-auto mt-6 rounded-lg py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 border-b pb-8">
        <Button variant="ghost" className="mb-4 py-4 text-muted-foreground hover:text-foreground">
          <Link href="/" className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a página inicial
          </Link>
        </Button>
        <div className="flex items-center gap-3 mb-2">
            <Cookie className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Política de Cookies
            </h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {companyConfig.name} - Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>
      </div>

      <div className="space-y-10 text-base text-muted-foreground leading-relaxed">
        
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">1. O que são Cookies?</h2>
          <p>
            Cookies são pequenos arquivos de texto que um site, ao ser visitado, coloca no computador ou 
            dispositivo móvel do usuário através do navegador de internet (browser). A colocação de cookies 
            ajudará o site a reconhecer o seu dispositivo na próxima visita, além de ser essencial para o 
            funcionamento de recursos básicos, como manter itens no seu carrinho de compras.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">2. Como utilizamos os Cookies?</h2>
          <p className="mb-4">A {companyConfig.name} utiliza cookies para diversas finalidades, divididas nas seguintes categorias:</p>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground">A. Cookies Estritamente Necessários (Essenciais)</h3>
              <p className="mt-1">
                São fundamentais para o funcionamento do nosso e-commerce. Eles permitem que você navegue pelo site, 
                faça login com segurança na sua conta, finalize compras e mantenha produtos no carrinho. 
                <strong> Estes cookies não podem ser desativados em nossos sistemas</strong>, pois sem eles o site não funciona.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground">B. Cookies de Funcionalidade</h3>
              <p className="mt-1">
                Permitem que o site memorize as escolhas que você faz (como o seu CEP inserido para cálculo de frete ou 
                preferências de visualização) para proporcionar uma experiência mais personalizada e ágil, evitando que 
                você precise digitar as mesmas informações repetidas vezes.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground">C. Cookies Analíticos e de Desempenho</h3>
              <p className="mt-1">
                Utilizamos estes cookies (como os do Google Analytics) para entender como os visitantes interagem com o nosso site, 
                descobrir quais páginas são mais ou menos visitadas e identificar erros de carregamento. As informações 
                coletadas por esses cookies são agregadas e, portanto, <strong>anônimas</strong>.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground">D. Cookies de Marketing e Publicidade</h3>
              <p className="mt-1">
                Estes cookies podem ser estabelecidos através do nosso site pelos nossos parceiros de publicidade 
                (como Meta e Google). Eles são usados para construir um perfil sobre os seus interesses e mostrar 
                anúncios relevantes em outros sites. 
              </p>
              <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-md mt-3 text-sm text-foreground">
                <strong>Nosso compromisso ético:</strong> Respeitando a privacidade da sua saúde, nós <strong>nunca </strong> 
                utilizamos cookies de rastreamento para criar campanhas publicitárias baseadas na sua busca ou compra de 
                medicamentos controlados ou tratamentos de doenças sensíveis.
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">3. Como gerenciar os seus Cookies</h2>
          <p className="mb-4">
            A qualquer momento, você pode alterar ou retirar o seu consentimento para a utilização de cookies não 
            essenciais através do nosso Banner de Preferências de Privacidade (acessível no rodapé do site).
          </p>
          <p>
            Além disso, a maioria dos navegadores permite controle sobre os cookies através das suas configurações. 
            No entanto, alertamos que ao desativar os cookies essenciais através do seu navegador, você 
            não conseguirá fazer login, adicionar produtos ao carrinho ou finalizar compras em nosso e-commerce.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer" className="text-primary hover:underline">Configurações de cookies no Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/pt-BR/kb/desative-cookies-terceiros-impedir-rastreamento" target="_blank" rel="noreferrer" className="text-primary hover:underline">Configurações de cookies no Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac" target="_blank" rel="noreferrer" className="text-primary hover:underline">Configurações de cookies no Safari</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">4. Dúvidas?</h2>
          <p>
            Caso tenha qualquer dúvida sobre a nossa utilização de cookies, consulte a nossa{" "}
            <Link href="/privacidade" className="font-medium text-primary hover:underline">
              Política de Privacidade
            </Link>{" "}
            ou entre em contato com o nosso Encarregado de Dados (DPO) pelo e-mail:{" "}
            <a href={`mailto:${companyConfig.contact.emailAtendimento}`} className="font-medium text-primary hover:underline">
              {companyConfig.contact.emailAtendimento}
            </a>.
          </p>
        </section>

      </div>
    </div>
  );
}