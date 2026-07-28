import { Ads1, Ads2, Ads3 } from "@/components/Ads/Advertisements"
import SectionBenefits from "@/components/Benefits/SectionBenefits"
import SectionMainCarousel from "@/components/Carousel/SectionMainCarousel"
import CartContainer from "@/components/Cart/Cart.container"
import { HeaderContainer } from "@/components/Header/Header.container"
import SectionCards from "@/components/SectionCards/SectionCards"
import SectionFilter from "@/components/SectionFilterProducts/SectionFilter"
import { SectionLaboratory } from "@/components/SectionLaboratory/SectionLaboratory"
import { SecFilterProducts, SecMostSell } from "@/components/Sections/Sections"
import { ShoppingBasket } from "lucide-react"

export default function Page() {
  return (
    <div className="bg-accent flex min-h-screen flex-col ">

      <CartContainer
        className="md:hidden fixed bottom-4 right-4 z-50 h-10 w-10 flex items-center justify-center rounded-full! bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        icon={<ShoppingBasket className="size-6" />}
      />

      <HeaderContainer />

      <div className="@container/content flex flex-col items-center justify-center gap-20 px-2 py-8 md:px-8 lg:px-16">

        <div className="flex flex-col gap-5 w-full">
          <SectionMainCarousel />
          <SectionBenefits />
        </div>

        <SecMostSell title="Mais vendidos" />

        <Ads1 />

        <SecFilterProducts title="Filtrar por categoria" />

        <Ads2 />

        <SectionLaboratory sectionTitle="Desconto de laboratório" />



      </div>

    </div>
  )
}
