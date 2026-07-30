"use client";

import { useRef, useState } from "react";
import { ProductFilters } from "@/types/product-type";
import {
    SecHeader,
    SecFilter,
    SecProdsCarousel,
    SecAdvantageCard
} from "@/components/content/section-components";
import Autoplay from "embla-carousel-autoplay";
import { 
    Carousel, 
    CarouselContent, 
    CarouselItem, 
    CarouselNext, 
    CarouselPrevious 
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Truck } from "lucide-react";

type SectionProps = {
    title?: string;
    className?: string;
}
type SecDefaultProps = {
    title: string;
    filter: typeof ProductFilters[number]["value"];
    style?: string;
}

const defaultStyles = "w-full max-w-6xl mx-auto flex flex-col gap-8 ";

export function SecDefault({ title, filter, style, className }: SecDefaultProps & { className?: string }) {
    return (
        <section className={`${defaultStyles} ${className ?? ""}`}>
            <SecHeader sectionTitle={title} />

            <div className={`w-full ${style ?? ""}`}>
                <SecProdsCarousel filter={filter} />
            </div>

        </section>
    )
}

export function SecCarousel() {

    const autoplayPlugin = useRef(
        Autoplay({ delay: 3000, stopOnInteraction: false })
    )

    return (
        <Carousel
            className="group relative w-full max-w-6xl mx-auto"
            plugins={[autoplayPlugin.current]}
            onMouseEnter={() => autoplayPlugin.current.stop()}
            onMouseLeave={() => autoplayPlugin.current.play()}
        >
            <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index}>
                        <div className="p-0.5">
                            <Card>
                                {/* Removido 'aspect-video' e adicionado controle de altura responsivo */}
                                <CardContent className="flex h-50 sm:h-70 md:h-87.5 w-full items-center justify-center p-6">
                                    <span className="text-2xl font-semibold text-center">
                                        1920x500 - Tablets+<br />
                                        800x800 - Mobile<br /><br />
                                        ({index + 1})

                                        {/* <span className="hidden sm:inline">1920x500 ({index + 1})</span>
                                        <span className="sm:hidden">800x800 ({index + 1})</span> */}
                                    </span>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>

            <CarouselPrevious className="hidden md:inline-flex absolute left-4! opacity-0 transition-opacity duration-300 group-hover:opacity-100 disabled:hidden" />

            <CarouselNext className="hidden md:inline-flex absolute right-4! opacity-0 transition-opacity duration-300 group-hover:opacity-100 disabled:hidden" />
        </Carousel>
    )
}

export function SecAdvantages({ className }: SectionProps) {
    return (
        <section className={`grid grid-cols-1 cursor-default sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl xl:px-0 mx-auto w-full ${className ?? ""}`}>
            <SecAdvantageCard Icon={Truck} title="Benefit 1" description="Description for benefit 1" />
            <SecAdvantageCard Icon={Truck} title="Benefit 2" description="Description for benefit 2" />
            <SecAdvantageCard Icon={Truck} title="Benefit 3" description="Description for benefit 3" />
            <SecAdvantageCard Icon={Truck} title="Benefit 4" description="Description for benefit 4" />
        </section>
    )
}

export function SecMostSell({ title, className }: SectionProps) {
    return (
        <section className={`${defaultStyles} ${className ?? ""}`}>
            <SecHeader sectionTitle={title ?? "Mais Vendidos"} />

            <div className="w-full">
                <SecProdsCarousel filter="most-sell" />
            </div>

        </section>
    )
}

export function SecFilterProd({ title, className }: SectionProps) {

    const selectedCategoriesLabel: typeof ProductFilters[number]["label"][] = [
        "Vitaminas e suplementos",
        "Anticoncepcionais",
        "Higiene pessoal",
        "Infantil",
        "Lançamentos"
    ];

    const filtersSelected = ProductFilters.filter(filter => selectedCategoriesLabel.includes(filter.label));

    const [selectedCategory, setSelectedCategory] = useState<typeof ProductFilters[number]["value"]>(filtersSelected[0].value);

    return (
        <section className={`${defaultStyles} ${className ?? ""}`}>
            <SecHeader
                sectionTitle={title ?? "Filtrar por categoria"}
                complement={
                    <SecFilter
                        items={filtersSelected}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                    />
                }
            />

            <div className="w-full">
                <SecProdsCarousel filter={selectedCategory} />
            </div>

        </section>
    )
}

export function SecLaboratory({ title, className }: SectionProps) {
    return (
        <section className={`${defaultStyles} ${className ?? ""}`}>
            <SecHeader sectionTitle={title ?? "Desconto de laboratório"} />

            <div className="@container flex flex-col md:flex-row gap-8">
                <div className="@container/image h-50 bg-gray-200 rounded-lg flex items-center justify-center md:flex-1 md:h-auto dark:bg-gray-700">
                    <span className="text-lg text-center font-semibold text-gray-500 dark:text-gray-400">
                        Imagem promocional do laboratório
                    </span>
                </div>

                <div className="@container/content flex-2">
                    <SecProdsCarousel filter="laboratory" style="md:basis-[40%] lg:basis-[40%]" />
                </div>
            </div>
        </section>
    )
}

export function SecDermo({ title, className }: SectionProps) {
    return (
        <section className={`${defaultStyles} ${className ?? ""}`}>
            <SecHeader sectionTitle={title ?? "Dermocosméticos"} />

        </section>
    )
}

export function SecForYou({ title, className }: SectionProps) {
    return (
        <section className={`${defaultStyles} ${className ?? ""}`}>
            <SecHeader sectionTitle={title ?? "Selecionados para você"} />

        </section>
    )
}

export function SecNews({ title, className }: SectionProps) {
    return (
        <section className={`${defaultStyles} ${className ?? ""}`}>
            <SecHeader sectionTitle={title ?? "Produtos novos"} />

        </section>
    )
}