"use client" // Necessário pois usa useState

import { CardsCarousel } from "@/components/SectionCards/SectionCards.carousel"
import { SectionFilterNavMobile } from "@/components/SectionFilterProducts/SectionFilter.select"
import { SectionFilterNav } from "@/components/SectionFilterProducts/SectionFilter.nav"
import { useState } from "react"

export const categoriesObj = [
    { label: "Vitaminas e Suplementos", value: "suplement" },
    { label: "Anticoncepcionais", value: "contraceptive" },
    { label: "Higiene pessoal", value: "hygiene" },
    { label: "Mundo infantil", value: "infantile" },
    { label: "Lançamentos", value: "release" },
] as const;

export type CategoryType = typeof categoriesObj[number]["value"];

type Props = {
    sectionTitle: string
}

export default function SectionFilter({ sectionTitle }: Props) {
    
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>(categoriesObj[0].value);

    return (
        <section className="flex flex-col gap-8 max-w-6xl mx-auto w-full">
            <div className="@container/header flex flex-col gap-4">
                <h2 className="text-2xl font-bold">{sectionTitle}</h2>

                <SectionFilterNavMobile />
                
                {/* Repassando o estado e a função para o componente filho */}
                <SectionFilterNav 
                    selectedCategory={selectedCategory} 
                    setSelectedCategory={setSelectedCategory} 
                />
            </div>
            <div className="@container/content w-full">
                <CardsCarousel productIds={[1, 2, 3, 4, 5, 7, 8, 9, 10]} />
            </div>
        </section>
    )
}