import Link from "next/link";
import { CheckCircle2, Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-lg text-center shadow-sm border-none sm:border-solid bg-transparent sm:bg-white">
        <CardHeader className="pt-8 pb-4">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Pedido Confirmado!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-muted-foreground text-base">
            Sua compra foi aprovada e já estamos separando seus produtos.
            Enviamos os detalhes da entrega para o seu e-mail.
          </p>

          <div className="bg-background rounded-lg border p-6 flex flex-col gap-3 text-sm text-left">
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-muted-foreground">Número do pedido</span>
              <span className="font-semibold text-foreground">#CAM-84920</span>
            </div>
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-muted-foreground">Pagamento</span>
              <span className="font-semibold text-foreground">Aprovado (Mercado Pago)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Previsão de entrega</span>
              <span className="font-semibold text-primary">Hoje, até 18:00</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-4 pb-8 justify-center">
          <Button className="w-full sm:w-auto h-12 px-6">
            <Link className="flex items-center justify-center" href="/">
              <Package className="w-4 h-4 mr-2" />
              Continuar Comprando
            </Link>
          </Button>
          
          <Button variant="outline" className="w-full sm:w-auto h-12 px-6 bg-transparent">
            <Link className="flex items-center justify-center" href="/profile/orders">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Acompanhar Pedido
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}