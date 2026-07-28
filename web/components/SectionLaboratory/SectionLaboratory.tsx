import { CardsCarousel } from "@/components/SectionCards/SectionCards.carousel";

type Props = {
    sectionTitle: string;
}

export function SectionLaboratory({ sectionTitle }: Props) {
    return (
        <section className="w-full max-w-6xl mx-auto flex flex-col gap-4">

            <h2 className="text-2xl font-bold">
                {sectionTitle}
            </h2>

            <div className="@container flex flex-col md:flex-row gap-8">
                <div 
                    className="@container/image h-50 bg-gray-200 rounded-lg flex items-center justify-center md:flex-1 md:h-auto dark:bg-gray-700"
                >
                    {/* <img 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf6OM_2iXA5DFquiB_0p0Vr5_0Kv2XoFloY0pvgU-KBA&s=10" 
                        alt="Laboratório" 
                        className="w-full h-full object-contain rounded-lg max-h-40" 
                    /> */}
                    <span className="text-lg text-center font-semibold text-gray-500 dark:text-gray-400">Imagem promocional do laboratório</span>
                </div>
                <div className="@container/content flex-2">
                    <CardsCarousel 
                        productIds={[1, 2, 3, 4, 5, 7, 8, 9, 10]} 
                        className={"lg:basis-[40%]"}
                    />
                </div>
            </div>
        </section>
    )
}