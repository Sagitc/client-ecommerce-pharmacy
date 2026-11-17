"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown, RotateCcw, SearchX, SlidersHorizontal } from "lucide-react";
import { ReactNode, useState, useMemo, useEffect, Suspense } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import {
    Pagination,
    PaginationItem,
    PaginationContent,
    PaginationNext,
    PaginationLink,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { searchProductsRequest } from "@/services/product-service";
import { ProductType, getCategoryLabel } from "@/types/product-type";

const ITEMS_PER_PAGE = 9;

type OrderOption = "" | "price_asc" | "price_desc" | "most_sold" | "newest";

function getEffectivePrice(product: ProductType): number {
    return product.promotionPrice ?? product.price;
}

function getMetadataValues(product: ProductType, key: string): string[] {
    if (!product.metadata) return [];
    const val = product.metadata[key];
    if (Array.isArray(val)) {
        return val.map((v) => String(v).trim()).filter(Boolean);
    }
    if (val !== undefined && val !== null && String(val).trim() !== "") {
        return [String(val).trim()];
    }
    return [];
}

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const query = (searchParams.get("q") || "").trim();
    const initialCategory = searchParams.get("category") || "";
    const initialSubgroup = searchParams.get("subgroup") || "";

    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        initialCategory ? [initialCategory] : []
    );
    const [selectedSubgroups, setSelectedSubgroups] = useState<string[]>(
        initialSubgroup ? [initialSubgroup] : []
    );
    const [selectedMetadata, setSelectedMetadata] = useState<Record<string, string[]>>({});
    const [selectedFabricators, setSelectedFabricators] = useState<string[]>([]);
    const [order, setOrder] = useState<OrderOption>("");
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Sempre que o termo de busca mudar, limpa os filtros específicos da busca anterior
    useEffect(() => {
        setSelectedCategories(initialCategory ? [initialCategory] : []);
        setSelectedSubgroups(initialSubgroup ? [initialSubgroup] : []);
        setSelectedMetadata({});
        setSelectedFabricators([]);
        setCurrentPage(1);
    }, [query, initialCategory, initialSubgroup]);

    const { data: baseProducts = [], isLoading } = useQuery({
        queryKey: ["search-products", query],
        queryFn: () => searchProductsRequest({ q: query, limit: 100 }),
    });

    // Facetas dinâmicas de Categorias (extraídas apenas dos produtos que correspondem à busca)
    const availableCategories = useMemo(() => {
        const counts = new Map<string, number>();
        for (const product of baseProducts) {
            if (!product.category) continue;
            counts.set(product.category, (counts.get(product.category) || 0) + 1);
        }
        return Array.from(counts.entries())
            .map(([value, count]) => ({
                value,
                label: getCategoryLabel(value),
                count,
            }))
            .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
    }, [baseProducts]);

    // Produtos filtrados pela(s) categoria(s) selecionada(s) para derivar os subgrupos válidos daquelas categorias
    const productsMatchingCategories = useMemo(() => {
        if (selectedCategories.length === 0) return baseProducts;
        return baseProducts.filter((p) => selectedCategories.includes(p.category));
    }, [baseProducts, selectedCategories]);

    // Facetas dinâmicas de Subgrupos (pertencentes às categorias presentes/selecionadas)
    const availableSubgroups = useMemo(() => {
        const counts = new Map<string, { count: number; categories: Set<string> }>();
        for (const product of productsMatchingCategories) {
            if (!product.subgroup) continue;
            const entry = counts.get(product.subgroup) || {
                count: 0,
                categories: new Set<string>(),
            };
            entry.count += 1;
            if (product.category) entry.categories.add(getCategoryLabel(product.category));
            counts.set(product.subgroup, entry);
        }
        return Array.from(counts.entries())
            .map(([value, info]) => ({
                value,
                count: info.count,
                categoryLabels: Array.from(info.categories),
            }))
            .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
    }, [productsMatchingCategories]);

    // Produtos filtrados por Categoria + Subgrupo para derivar os Metadados e Fabricantes válidos
    const productsMatchingSubgroups = useMemo(() => {
        if (selectedSubgroups.length === 0) return productsMatchingCategories;
        return productsMatchingCategories.filter(
            (p) => p.subgroup && selectedSubgroups.includes(p.subgroup)
        );
    }, [productsMatchingCategories, selectedSubgroups]);

    // Facetas dinâmicas de Metadados (ex: Forma Farmacêutica, Dosagem, Classificação, FPS, etc.)
    const availableMetadataFacets = useMemo(() => {
        const facetMap = new Map<string, Map<string, number>>();

        for (const product of productsMatchingSubgroups) {
            if (!product.metadata || typeof product.metadata !== "object") continue;

            for (const key of Object.keys(product.metadata)) {
                const values = getMetadataValues(product, key);
                if (values.length === 0) continue;

                if (!facetMap.has(key)) {
                    facetMap.set(key, new Map<string, number>());
                }
                const valueCounts = facetMap.get(key)!;
                for (const val of values) {
                    valueCounts.set(val, (valueCounts.get(val) || 0) + 1);
                }
            }
        }

        return Array.from(facetMap.entries()).map(([key, valueCounts]) => ({
            key,
            options: Array.from(valueCounts.entries())
                .map(([value, count]) => ({ value, count }))
                .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value)),
        }));
    }, [productsMatchingSubgroups]);

    // Facetas dinâmicas de Fabricantes / Laboratórios
    const availableFabricators = useMemo(() => {
        const counts = new Map<string, number>();
        for (const product of productsMatchingSubgroups) {
            if (!product.fabricator) continue;
            counts.set(product.fabricator, (counts.get(product.fabricator) || 0) + 1);
        }
        return Array.from(counts.entries())
            .map(([value, count]) => ({ value, count }))
            .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
    }, [productsMatchingSubgroups]);

    // Remove seleções de subgrupos ou metadados que deixaram de existir após mudar categoria/subgrupo
    useEffect(() => {
        const validSubgroupNames = new Set(availableSubgroups.map((s) => s.value));
        setSelectedSubgroups((prev) => {
            const next = prev.filter((item) => validSubgroupNames.has(item));
            return next.length === prev.length ? prev : next;
        });
    }, [availableSubgroups]);

    useEffect(() => {
        const validMetaMap = new Map<string, Set<string>>(
            availableMetadataFacets.map((f) => [f.key, new Set(f.options.map((o) => o.value))])
        );
        setSelectedMetadata((prev) => {
            let changed = false;
            const next: Record<string, string[]> = {};
            for (const [k, vals] of Object.entries(prev)) {
                const allowed = validMetaMap.get(k);
                if (!allowed) {
                    changed = true;
                    continue;
                }
                const filteredVals = vals.filter((v) => allowed.has(v));
                if (filteredVals.length !== vals.length) changed = true;
                if (filteredVals.length > 0) {
                    next[k] = filteredVals;
                }
            }
            return changed ? next : prev;
        });
    }, [availableMetadataFacets]);

    // Aplica todos os filtros selecionados (Categoria -> Subgrupo -> Metadados -> Fabricante -> Preço -> Ordenação)
    const filteredProducts = useMemo(() => {
        const minVal = minPrice.trim() !== "" ? Number(minPrice) : null;
        const maxVal = maxPrice.trim() !== "" ? Number(maxPrice) : null;

        const list = productsMatchingSubgroups.filter((product) => {
            // Filtro por Fabricante
            if (
                selectedFabricators.length > 0 &&
                !selectedFabricators.includes(product.fabricator)
            ) {
                return false;
            }

            // Filtro por Metadados (AND entre chaves diferentes, OR entre valores da mesma chave)
            for (const [metaKey, selectedVals] of Object.entries(selectedMetadata)) {
                if (!selectedVals || selectedVals.length === 0) continue;
                const prodVals = getMetadataValues(product, metaKey);
                const hasMatch = selectedVals.some((sel) => prodVals.includes(sel));
                if (!hasMatch) return false;
            }

            // Filtro por Preço
            const price = getEffectivePrice(product);
            if (minVal !== null && !Number.isNaN(minVal) && price < minVal) {
                return false;
            }
            if (maxVal !== null && !Number.isNaN(maxVal) && price > maxVal) {
                return false;
            }

            return true;
        });

        if (order === "price_asc") {
            return [...list].sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
        }
        if (order === "price_desc") {
            return [...list].sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
        }
        if (order === "most_sold") {
            return [...list].sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0));
        }
        if (order === "newest") {
            return [...list].sort((a, b) => b.id - a.id);
        }

        return list;
    }, [
        productsMatchingSubgroups,
        selectedFabricators,
        selectedMetadata,
        minPrice,
        maxPrice,
        order,
    ]);

    useEffect(() => {
        setCurrentPage(1);
    }, [
        selectedCategories,
        selectedSubgroups,
        selectedMetadata,
        selectedFabricators,
        minPrice,
        maxPrice,
        order,
    ]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedProducts = filteredProducts.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
    );

    const hasActiveFilters =
        selectedCategories.length > 0 ||
        selectedSubgroups.length > 0 ||
        Object.values(selectedMetadata).some((v) => v.length > 0) ||
        selectedFabricators.length > 0 ||
        minPrice.trim() !== "" ||
        maxPrice.trim() !== "" ||
        order !== "";

    const handleClearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedSubgroups([]);
        setSelectedMetadata({});
        setSelectedFabricators([]);
        setMinPrice("");
        setMaxPrice("");
        setOrder("");
        setCurrentPage(1);
        if (initialCategory || initialSubgroup) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("category");
            params.delete("subgroup");
            const qs = params.toString();
            router.replace(qs ? `${pathname}?${qs}` : pathname);
        }
    };

    const toggleArrayItem = (list: string[], value: string): string[] =>
        list.includes(value) ? list.filter((i) => i !== value) : [...list, value];

    const handleToggleMetadata = (key: string, value: string) => {
        setSelectedMetadata((prev) => {
            const current = prev[key] || [];
            const updated = toggleArrayItem(current, value);
            const next = { ...prev };
            if (updated.length === 0) {
                delete next[key];
            } else {
                next[key] = updated;
            }
            return next;
        });
    };

    return (
        <div className="container max-w-6xl mx-auto p-4 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold">
                        {query ? `Resultados para: "${query}"` : "Catálogo de Produtos"}
                    </h1>
                    {!isLoading && (
                        <p className="text-xs text-muted-foreground mt-1">
                            {filteredProducts.length}{" "}
                            {filteredProducts.length === 1
                                ? "produto encontrado"
                                : "produtos encontrados"}
                        </p>
                    )}
                </div>

                {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={handleClearAllFilters}>
                        <RotateCcw className="size-3.5 mr-1.5" />
                        Limpar filtros
                    </Button>
                )}
            </div>

            {isLoading ? (
                <div className="py-16 text-center text-muted-foreground">
                    Buscando produtos...
                </div>
            ) : baseProducts.length === 0 ? (
                <div className="bg-background border rounded-xl p-12 text-center space-y-3">
                    <SearchX className="size-12 text-muted-foreground/50 mx-auto" />
                    <h2 className="text-lg font-semibold">
                        Nenhum produto encontrado{query ? ` para "${query}"` : ""}
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Verifique a grafia do termo pesquisado ou tente buscar pelo princípio ativo,
                        nome comercial ou laboratório.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <aside className="w-full md:w-72 shrink-0">
                        <SearchFilters
                            order={order}
                            onOrderChange={setOrder}
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            onMinPriceChange={setMinPrice}
                            onMaxPriceChange={setMaxPrice}
                            availableCategories={availableCategories}
                            selectedCategories={selectedCategories}
                            onToggleCategory={(cat) =>
                                setSelectedCategories((prev) => toggleArrayItem(prev, cat))
                            }
                            availableSubgroups={availableSubgroups}
                            selectedSubgroups={selectedSubgroups}
                            onToggleSubgroup={(sub) =>
                                setSelectedSubgroups((prev) => toggleArrayItem(prev, sub))
                            }
                            availableMetadataFacets={availableMetadataFacets}
                            selectedMetadata={selectedMetadata}
                            onToggleMetadata={handleToggleMetadata}
                            availableFabricators={availableFabricators}
                            selectedFabricators={selectedFabricators}
                            onToggleFabricator={(fab) =>
                                setSelectedFabricators((prev) => toggleArrayItem(prev, fab))
                            }
                            hasActiveFilters={hasActiveFilters}
                            onClearFilters={handleClearAllFilters}
                        />
                    </aside>

                    <div className="flex-1 w-full flex flex-col gap-6">
                        {filteredProducts.length === 0 ? (
                            <div className="bg-background border rounded-xl p-10 text-center space-y-3">
                                <SearchX className="size-10 text-muted-foreground/50 mx-auto" />
                                <p className="text-base font-medium">
                                    Nenhum produto corresponde à combinação de filtros selecionada.
                                </p>
                                <Button variant="outline" size="sm" onClick={handleClearAllFilters}>
                                    Limpar filtros aplicados
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {paginatedProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            parentStyle="border shadow-xs"
                                        />
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setCurrentPage((p) => Math.max(1, p - 1));
                                                    }}
                                                />
                                            </PaginationItem>

                                            {Array.from({ length: totalPages }).map((_, idx) => {
                                                const pageNumber = idx + 1;
                                                return (
                                                    <PaginationItem key={pageNumber}>
                                                        <PaginationLink
                                                            href="#"
                                                            isActive={safePage === pageNumber}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setCurrentPage(pageNumber);
                                                            }}
                                                        >
                                                            {pageNumber}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            })}

                                            <PaginationItem>
                                                <PaginationNext
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setCurrentPage((p) =>
                                                            Math.min(totalPages, p + 1)
                                                        );
                                                    }}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function PaginaDeBusca() {
    return (
        <Suspense
            fallback={
                <div className="container max-w-6xl mx-auto p-4">Carregando busca...</div>
            }
        >
            <SearchContent />
        </Suspense>
    );
}

interface SearchFiltersProps {
    order: OrderOption;
    onOrderChange: (value: OrderOption) => void;
    minPrice: string;
    maxPrice: string;
    onMinPriceChange: (value: string) => void;
    onMaxPriceChange: (value: string) => void;
    availableCategories: { value: string; label: string; count: number }[];
    selectedCategories: string[];
    onToggleCategory: (value: string) => void;
    availableSubgroups: { value: string; count: number; categoryLabels: string[] }[];
    selectedSubgroups: string[];
    onToggleSubgroup: (value: string) => void;
    availableMetadataFacets: {
        key: string;
        options: { value: string; count: number }[];
    }[];
    selectedMetadata: Record<string, string[]>;
    onToggleMetadata: (key: string, value: string) => void;
    availableFabricators: { value: string; count: number }[];
    selectedFabricators: string[];
    onToggleFabricator: (value: string) => void;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
}

function SearchFilters({
    order,
    onOrderChange,
    minPrice,
    maxPrice,
    onMinPriceChange,
    onMaxPriceChange,
    availableCategories,
    selectedCategories,
    onToggleCategory,
    availableSubgroups,
    selectedSubgroups,
    onToggleSubgroup,
    availableMetadataFacets,
    selectedMetadata,
    onToggleMetadata,
    availableFabricators,
    selectedFabricators,
    onToggleFabricator,
    hasActiveFilters,
    onClearFilters,
}: SearchFiltersProps) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <Card>
            <CardContent className="pt-4">
                <Collapsible
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    className="flex flex-col gap-3"
                >
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                            <SlidersHorizontal className="size-4 text-primary" />
                            Filtros Dinâmicos
                        </h4>
                        <CollapsibleTrigger
                            render={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8"
                                    type="button"
                                />
                            }
                        >
                            <ChevronsUpDown className="size-4" />
                            <span className="sr-only">Alternar filtros</span>
                        </CollapsibleTrigger>
                    </div>

                    <CollapsibleContent className="space-y-4">
                        {/* ORDENAR POR */}
                        <FilterSquare filterTitle="Ordenar por">
                            <select
                                name="order"
                                id="order"
                                value={order}
                                onChange={(e) => onOrderChange(e.target.value as OrderOption)}
                                className="w-full border rounded-md p-2 text-sm bg-background"
                            >
                                <option value="">Relevância</option>
                                <option value="price_asc">Preço: Menor para Maior</option>
                                <option value="price_desc">Preço: Maior para Menor</option>
                                <option value="most_sold">Mais vendidos</option>
                                <option value="newest">Mais recentes</option>
                            </select>
                        </FilterSquare>

                        {/* CATEGORIAS DINÂMICAS */}
                        {availableCategories.length > 0 && (
                            <FilterSquare filterTitle="Categoria">
                                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                                    {availableCategories.map((cat) => {
                                        const checked = selectedCategories.includes(cat.value);
                                        return (
                                            <label
                                                key={cat.value}
                                                className="flex items-center justify-between gap-2 text-xs cursor-pointer hover:text-primary"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={() => onToggleCategory(cat.value)}
                                                        className="rounded border-input accent-primary"
                                                    />
                                                    <span>{cat.label}</span>
                                                </span>
                                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                                    {cat.count}
                                                </Badge>
                                            </label>
                                        );
                                    })}
                                </div>
                            </FilterSquare>
                        )}

                        {/* SUBGRUPOS DINÂMICOS DA CATEGORIA */}
                        {availableSubgroups.length > 0 && (
                            <FilterSquare filterTitle="Subgrupo">
                                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                                    {availableSubgroups.map((sub) => {
                                        const checked = selectedSubgroups.includes(sub.value);
                                        return (
                                            <label
                                                key={sub.value}
                                                className="flex items-center justify-between gap-2 text-xs cursor-pointer hover:text-primary"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={() => onToggleSubgroup(sub.value)}
                                                        className="rounded border-input accent-primary"
                                                    />
                                                    <span>{sub.value}</span>
                                                </span>
                                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                                    {sub.count}
                                                </Badge>
                                            </label>
                                        );
                                    })}
                                </div>
                            </FilterSquare>
                        )}

                        {/* METADADOS DINÂMICOS DO SUBGRUPO */}
                        {availableMetadataFacets.map((facet) => (
                            <FilterSquare key={facet.key} filterTitle={facet.key}>
                                <div className="flex flex-col gap-2 max-h-44 overflow-y-auto pr-1">
                                    {facet.options.map((opt) => {
                                        const checked = Boolean(
                                            selectedMetadata[facet.key]?.includes(opt.value)
                                        );
                                        return (
                                            <label
                                                key={opt.value}
                                                className="flex items-center justify-between gap-2 text-xs cursor-pointer hover:text-primary"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={() =>
                                                            onToggleMetadata(facet.key, opt.value)
                                                        }
                                                        className="rounded border-input accent-primary"
                                                    />
                                                    <span>{opt.value}</span>
                                                </span>
                                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                                    {opt.count}
                                                </Badge>
                                            </label>
                                        );
                                    })}
                                </div>
                            </FilterSquare>
                        ))}

                        {/* FABRICANTE / LABORATÓRIO */}
                        {availableFabricators.length > 0 && (
                            <FilterSquare filterTitle="Laboratório / Marca">
                                <div className="flex flex-col gap-2 max-h-44 overflow-y-auto pr-1">
                                    {availableFabricators.map((fab) => {
                                        const checked = selectedFabricators.includes(fab.value);
                                        return (
                                            <label
                                                key={fab.value}
                                                className="flex items-center justify-between gap-2 text-xs cursor-pointer hover:text-primary"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={() => onToggleFabricator(fab.value)}
                                                        className="rounded border-input accent-primary"
                                                    />
                                                    <span>{fab.value}</span>
                                                </span>
                                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                                    {fab.count}
                                                </Badge>
                                            </label>
                                        );
                                    })}
                                </div>
                            </FilterSquare>
                        )}

                        {/* PREÇO */}
                        <FilterSquare filterTitle="Faixa de Preço (R$)">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="minPrice" className="text-xs text-muted-foreground">
                                        Mínimo:
                                    </label>
                                    <input
                                        type="number"
                                        id="minPrice"
                                        name="minPrice"
                                        min={0}
                                        step="0.01"
                                        placeholder="0,00"
                                        value={minPrice}
                                        onChange={(e) => onMinPriceChange(e.target.value)}
                                        className="border rounded-md px-2 py-1.5 text-xs w-full bg-background"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="maxPrice" className="text-xs text-muted-foreground">
                                        Máximo:
                                    </label>
                                    <input
                                        type="number"
                                        id="maxPrice"
                                        name="maxPrice"
                                        min={0}
                                        step="0.01"
                                        placeholder="999,00"
                                        value={maxPrice}
                                        onChange={(e) => onMaxPriceChange(e.target.value)}
                                        className="border rounded-md px-2 py-1.5 text-xs w-full bg-background"
                                    />
                                </div>
                            </div>
                        </FilterSquare>

                        {hasActiveFilters && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={onClearFilters}
                            >
                                <RotateCcw className="size-3.5 mr-1.5" />
                                Limpar filtros
                            </Button>
                        )}
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    );
}

function FilterSquare({
    filterTitle,
    children,
    filterStyles,
}: {
    filterTitle: string;
    children: ReactNode;
    filterStyles?: string;
}) {
    return (
        <div
            className={`rounded-md border py-3 px-4 text-sm bg-background flex flex-col gap-2.5 ${
                filterStyles || ""
            }`}
        >
            <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                {filterTitle}
            </h3>
            {children}
        </div>
    );
}
