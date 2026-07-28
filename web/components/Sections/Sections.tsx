"use client";

import { Header, NavFilters, ProductsCarousel } from "@/components/Sections/Section.components";
import { ProductFilters } from "@/types/ProductFilters.type";
import { useState } from "react";

type SectionProps = {
    title: string;
    className?: string;
}

const defaultStyles = "w-full max-w-6xl mx-auto flex flex-col gap-8 ";


export function SecMostSell({ title, className }: SectionProps) {
    return (
        <section className={defaultStyles + ""}>
            <Header sectionTitle={title} />
            
            <div className="w-full">
                <ProductsCarousel filter="most-sell" />
            </div>

        </section>
    )
}

export function SecFilterProducts({ title, className }: SectionProps) {

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
        <section className={defaultStyles + ""}>
            <Header 
                sectionTitle={title}
                complement={ 
                    <NavFilters 
                        items={filtersSelected}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                    /> 
                }
            />

            <div className="w-full">
                <ProductsCarousel filter={selectedCategory} />
            </div>

        </section>
    )
}

export function SecLaboratory({ title, className }: SectionProps) {
    return (
        <section className={defaultStyles + ""}>
            <Header sectionTitle={title} />

        </section>
    )
}

export function SecDermocosmetics({ title, className }: SectionProps) {
    return (
        <section className={defaultStyles + ""}>
            <Header sectionTitle={title} />

        </section>
    )
}

export function SecForYou({ title, className }: SectionProps) {
    return (
        <section className={defaultStyles + ""}>
            <Header sectionTitle={title} />

        </section>
    )
}

export function SecNews({ title, className }: SectionProps) {
    return (
        <section className={defaultStyles + ""}>
            <Header sectionTitle={title} />

        </section>
    )
}