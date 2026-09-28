import { SecDefault } from "@/components/content/section-items";
import { ProductView, ProductViewMobile } from "@/components/product-gallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  // const product = await fetchProductById(id);

  return (
    <div className="container max-w-6xl mx-auto py-2 px-4 md:px-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">

        <ProductView />
        <ProductViewMobile />

        <SecDefault title="Recomendados" filter="most-sell" />




        <div className="fixed bottom-0 left-0 w-full rounded p-3 flex justify-between items-center bg-background border-t z-50 md:hidden">
          <div>
            <span className="font-medium text-muted-foreground">Subtotal: </span>
            <span className="font-semibold text-sm">R$ 29,90</span>
          </div>
          <Button>
            Comprar
          </Button>
        </div>

      </div>
    </div>
  );
}