import { ElementType, ReactNode } from "react";
import { ProductFilters } from "@/types/product-type";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";

type SecHeaderProps = {
    sectionTitle: string;
    complement?: React.ReactNode;
}
type SecAdvantageProps = {
    Icon: ElementType,
    title: string,
    description: string
}
type SecCarouselProps = {
    filter?: typeof ProductFilters[number]["value"];
    style?: string;
    children?: ReactNode;
    loop?: boolean;
}
type SecFiltersProps = {
    items: readonly (typeof ProductFilters[number])[];
    selectedCategory: typeof ProductFilters[number]["value"];
    setSelectedCategory: (category: typeof ProductFilters[number]["value"]) => void;
}

export function SecHeader({ sectionTitle, complement }: SecHeaderProps) {
    return (
        <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold">
                {sectionTitle}
            </h2>
            {complement && <div>{complement}</div>}
        </div>
    )
}

export function SecAdvantageCard({ Icon, title, description }: SecAdvantageProps) {
    return (
        <div className="last:hidden sm:last:flex bg-background dark:bg-gray-800 flex items-center justify-start gap-4 rounded-lg border border-transparent p-4 shadow-md transition-all duration-300 w-full overflow-hidden hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">

            <div className="bg-primary text-primary-foreground rounded-full shrink-0 w-12 h-12 flex items-center justify-center p-2">
                <Icon className="w-6 h-6" />
            </div>

            <div className="flex flex-col gap-0.5 flex-1 text-left overflow-hidden">
                <span className="font-bold text-sm sm:text-base truncate">
                    {title}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground truncate">
                    {description}
                </span>
            </div>
            
        </div>
    )
}

export function SecCarousel({ filter, style, children, loop }: SecCarouselProps) {

    const productIds = [1, 2, 3, 4, 5, 7, 8, 9, 10]; // Simula o request dos produtos com o filtro ${filter}

    return (
        <Carousel
            opts={{
                align: "start",
                loop: loop ?? true,
                dragFree: true,
            }}
            className="w-full group relative"
        >
            <CarouselContent>

                {
                    filter ?
                    productIds.map((productId) => (
                        <CarouselItem key={productId} className={"basis-[90%] min-[450px]:basis-[45%] md:basis-[30%] lg:basis-[22.5%] " + style}>

                            <ProductCard productId={productId} />

                        </CarouselItem>
                    )) :
                    children
                }
                
            </CarouselContent>

            <CarouselPrevious className="hidden md:inline-flex absolute left-4! opacity-0 transition-opacity duration-300 group-hover:opacity-100 disabled:hidden" />

            <CarouselNext className="hidden md:inline-flex absolute right-4! opacity-0 transition-opacity duration-300 group-hover:opacity-100 disabled:hidden" />
        </Carousel>
    )
}

export function SecFilter({ items, selectedCategory, setSelectedCategory }: SecFiltersProps) {

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