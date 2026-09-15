"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
// import ProductCard from "@/components/ui/product-card";

export default function PaginaDeBusca() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data: produtos, isLoading } = useQuery({
    queryKey: ["produtos", query],
    queryFn: async () => {
      if (!query) return [];
      // Substitua pelo seu axios.get() quando o Laravel estiver pronto
      return [];
    },
    enabled: !!query,
  });

  return (
    <div className="container max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        Resultados para: "{query}"
      </h1>

      {isLoading ? (
        <p>Buscando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-2">

          <SearchFilters />

          {/* produtos.map((p) => <ProductCard key={p.id} {...p} />) */}
          <p className="text-gray-500">Nenhum produto renderizado ainda.</p>
        </div>
      )}
    </div>
  );
}

function SearchFilters() {

  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false)
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex w-87.5 flex-col gap-2"
    >
      <div className="flex items-center bg-background justify-between gap-4 pl-4 border rounded-lg">
        <h4 className="text-sm font-semibold">Filtros</h4>
        <CollapsibleTrigger render={<Button variant="ghost" size="icon" className="size-8"><ChevronsUpDown /><span className="sr-only">Toggle details</span></Button>} />
      </div>
      <CollapsibleContent className="flex flex-col gap-2">
        <div className="rounded-md border px-4 py-2 text-sm bg-background">
          
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}