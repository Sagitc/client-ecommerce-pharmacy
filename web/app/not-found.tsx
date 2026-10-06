import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, PackageX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted px-4 text-center py-20">
      
      <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
        <PackageX className="w-12 h-12" />
      </div>
      
      <h1 className="text-4xl font-bold mb-4 text-foreground">
        Página não encontrada
      </h1>
      
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Desculpe, o produto ou a página que você está procurando não existe, foi movida ou está temporariamente indisponível.
      </p>
      
      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button className="h-12 px-8 text-base">
          <Link href="/">
            Voltar para a tela inicial
          </Link>
        </Button>
      </div>
      
    </div>
  );
}