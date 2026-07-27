import { CardsCarousel } from "@/components/SectionCards/SectionCards.carousel"

type Props = {
    sectionTitle: string
}

export default function SectionCards({ sectionTitle }: Props) {
    return (
        <section className="flex flex-col gap-4 max-w-6xl mx-auto w-full mt-8">
            <h2 className="text-2xl font-bold">{sectionTitle}</h2>
            
            <div className="w-full">
                <CardsCarousel />
            </div>
        </section>
    )
}