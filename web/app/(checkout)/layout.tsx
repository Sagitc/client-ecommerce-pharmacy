import Link from "next/link";
import { Lock } from "lucide-react";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      
      <header className="bg-primary border-b py-4 shadow-sm dark:bg-gray-800">
        <div className="container max-w-6xl mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold ">
            <img src="/images/logos/camargo-white.svg" alt="Logo" className="w-auto h-auto max-w-42" />
          </Link>
          
          <div className="flex items-center gap-2 text-white">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Pagamento Seguro</span>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-accent">
        {children}
      </main>
      
      <footer className="bg-white py-6">
        <div className="container max-w-5xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Drogarias Camargo. Todos os direitos reservados.</p>
          <p className="mt-1">Ambiente 100% seguro protegido por criptografia de ponta a ponta.</p>
        </div>
      </footer>
      
    </div>
  );
}