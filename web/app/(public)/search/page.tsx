"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { ReactElement, ReactNode, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/product-card";
import { Pagination, PaginationItem, PaginationContent, PaginationNext, PaginationEllipsis, PaginationLink, PaginationPrevious } from "@/components/ui/pagination";
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
    <div className="container max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Resultados para: "{query}"
      </h1>

      {isLoading ? (
        <p>Buscando...</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">

          <div className="min-w-70">
            <SearchFilters />
          </div>

          {/* produtos.map((p) => <ProductCard key={p.id} {...p} />) */}
          {/* <p className="text-gray-500">Nenhum produto renderizado ainda.</p> */}

          <div className="flex-1 flex flex-col gap-6">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

              <ProductCard productId={1} />
              <ProductCard productId={2} />
              <ProductCard productId={3} />

            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

          </div>

        </div>
      )}
    </div>
  );
}

function SearchFilters() {

  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card>
      <CardContent className="">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="flex flex-1 flex-col gap-2"
        >
          <div className="flex items-center bg-background justify-between border rounded-lg">
            <h4 className="ml-4 text-sm font-semibold">Filtros</h4>
            <CollapsibleTrigger render={<Button variant="ghost" size="icon" className="size-8"><ChevronsUpDown /><span className="sr-only">Toggle details</span></Button>} />
          </div>
          <CollapsibleContent className="flex flex-col gap-2">

            <FilterSquare filterTitle="Ordenar por">
              <div>
                <select
                  name="sort"
                  id="sort"
                  className="border rounded-md px-2 py-1 w-full mt-2"
                  defaultValue={searchParams.get("sort") || ""}
                >
                  <option value="">Selecione</option>
                  <option value="price_asc">Menor para Maior</option>
                  <option value="price_desc">Maior para Menor</option>
                </select>
              </div>
            </FilterSquare>

            {/* FILTROS DINAMICOS */}

            <FilterSquare filterTitle="Preço">
              <div className="flex gap-4 mt-4 flex-1 justify-evenly">
                <div className="flex flex-col">
                  <label htmlFor="minPrice" className="text-sm rounded-md">Mínimo:</label>
                  <input type="number" id="minPrice" name="minPrice" className="border rounded px-2 py-1 w-20" />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="maxPrice" className="text-sm rounded-md">Máximo:</label>
                  <input type="number" id="maxPrice" name="maxPrice" className="border rounded px-2 py-1 w-20" />
                </div>
              </div>
            </FilterSquare>

          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

function FilterSquare({ filterTitle, children, filterStyles }: { filterTitle: string, children: ReactNode, filterStyles?: string }) {
  return (
    <div className={`rounded-md border py-3 px-4 text-sm bg-background flex flex-col gap-3 ${filterStyles || ''}`}>
      <h3 className="font-medium">{filterTitle}</h3>
      {children}
    </div>
  )
}