// web/app/(public)/categories/[slug]/page.tsx

import { SecDefault } from "@/components/content/section-items";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const formattedTitle = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 space-y-8">
      <div className="border-b pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {formattedTitle}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Explore nossos produtos selecionados na categoria {formattedTitle}.
        </p>
      </div>

      <SecDefault title="Todos os Produtos" filter="most-sell" />
    </div>
  );
}
