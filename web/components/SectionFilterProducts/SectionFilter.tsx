import { CardsCarousel } from "@/components/SectionCards/SectionCards.carousel"
import { SectionFilterTabs } from "./SectionFilter.nav"

type Props = {
    sectionTitle: string
}

export default function SectionFilter({ sectionTitle }: Props) {
    return (
        <section className="flex flex-col gap-4 max-w-6xl mx-auto w-full">
            <h2 className="text-2xl font-bold">{sectionTitle}</h2>
            
            <SectionFilterTabs />

            <div className="w-full">
                
            </div>
        </section>
    )
}