// web/app/(public)/product/[id]/page.tsx

import { SecDefault } from "@/components/content/section-items";
import { ProductView, ProductViewMobile } from "@/components/product-gallery";
import { fetchProductById } from "@/services/product-service";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  try {
    const product = await fetchProductById(id);

    return (
      <div className="container max-w-6xl mx-auto py-2 px-4 md:px-2">
        <div className="hidden lg:flex gap-8">
          <ProductView product={product} />

          {/* <SecDefault title="Recomendados" filter="most-sell" /> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-8 mt-4">
          <ProductViewMobile product={product} />

          <SecDefault title="Recomendados" filter="most-sell" />
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
