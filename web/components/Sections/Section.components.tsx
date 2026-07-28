import ProductContainer from "@/components/ProductCard/Product.container";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "../ui/carousel";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "../ui/select";

import { Button } from "../ui/button";
import { ReactNode } from "react";
import { ProductFilters } from "@/types/ProductFilters.type";

type HeaderProps = {
    sectionTitle: string;
    complement?: React.ReactNode;
}
type ProductsCarouselProps = {
    filter: typeof ProductFilters[number]["value"];
    style?: string;
}
type NavFilterProps = {
    items: readonly (typeof ProductFilters[number])[];
    selectedCategory: typeof ProductFilters[number]["value"];
    setSelectedCategory: (category: typeof ProductFilters[number]["value"]) => void;
}

export function Header({ sectionTitle, complement }: HeaderProps) {
    return (
        <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold">
                {sectionTitle}
            </h2>
            {complement && <div>{complement}</div>}
        </div>
    )
}

export function ProductsCarousel({ filter, style }: ProductsCarouselProps) {

    const productIds = [1, 2, 3, 4, 5, 7, 8, 9, 10]; // Simula o request dos produtos com o filtro ${filter}

    return (
        <Carousel
            opts={{
                align: "start",
                loop: true,
                dragFree: true,
            }}
            className="w-full group relative"
        >
            <CarouselContent>

                {/* Simula o request dos produtos com o filtro ${filter} */}
                {productIds.map((productId) => (
                    <CarouselItem key={productId} className={"basis-[90%] min-[450px]:basis-[45%] md:basis-[30%] lg:basis-[22.5%] " + style}>

                        <ProductContainer productId={productId} />

                    </CarouselItem>
                ))}
            </CarouselContent>

            <CarouselPrevious className="hidden md:inline-flex absolute left-4! opacity-0 transition-opacity duration-300 group-hover:opacity-100 disabled:hidden" />

            <CarouselNext className="hidden md:inline-flex absolute right-4! opacity-0 transition-opacity duration-300 group-hover:opacity-100 disabled:hidden" />
        </Carousel>
    )
}

export function NavFilters({ items, selectedCategory, setSelectedCategory }: NavFilterProps) {

    type CategoryType = typeof ProductFilters[number]["value"];

    function SectionFilterBtn({ children, className, onClick }: { children: ReactNode; className?: string; onClick: () => void }) {
        return (
            <Button
                variant="outline"
                className={`flex-1 py-4 hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground ${className || ''}`}
                onClick={onClick}
            >
                {children}
            </Button>
        )
    }

    function handleClick(category: CategoryType) { 
        setSelectedCategory(category); 
    }

    return (
        <>
            <Select items={items} defaultValue={items[0].value}>
                <SelectTrigger className="w-full bg-background md:hidden">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background">
                    <SelectGroup>
                        <SelectLabel>Categorias</SelectLabel>
                        {items.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            <nav className="hidden md:flex gap-4 overflow-scroll scrollbar-none">
                {items.map( category => (
                    <SectionFilterBtn
                        key={category.value}
                        data-key={category.value}
                        onClick={() => handleClick(category.value as CategoryType)}
                        className={selectedCategory === category.value ? "bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground" : ""}
                    >
                        {category.label}
                    </SectionFilterBtn>
                ))}
            </nav>
        </>
    )
}