"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { ReactElement, ReactNode, useState, Suspense } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/product-card";
import { Pagination, PaginationItem, PaginationContent, PaginationNext, PaginationEllipsis, PaginationLink, PaginationPrevious } from "@/components/ui/pagination";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data: produtos, isLoading } = useQuery({
    queryKey: ["produtos", query],
    queryFn: async () => {
      if (!query) return [];
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

export default function PaginaDeBusca() {
  return (
    <Suspense fallback={<div className="container max-w-6xl mx-auto p-4">Carregando busca...</div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchFilters() {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card>
      <CardContent className="">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">
              Filtros
            </h4>
            <CollapsibleTrigger>
              <Button variant="ghost" size="icon" className="size-8" type="button">
                <ChevronsUpDown />
                <span className="sr-only">Alternar</span>
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="space-y-4">

            {/* ORDENAR POR */}
            <FilterSquare filterTitle="Ordenar por">
              <div className="mt-2">
                <select name="order" id="order" className="w-full border rounded p-2 text-sm">
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
  );
}

function FilterSquare({ filterTitle, children, filterStyles }: { filterTitle: string, children: ReactNode, filterStyles?: string }) {
  return (
    <div className={`rounded-md border py-3 px-4 text-sm bg-background flex flex-col gap-3 ${filterStyles || ''}`}>
      <h3 className="font-medium">{filterTitle}</h3>
      {children}
    </div>
  );
}
