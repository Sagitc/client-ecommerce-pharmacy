import Ads1 from "@/components/Ads/Ads1"
import { Ads2 } from "@/components/Ads/Ads2"
import SectionBenefits from "@/components/Benefits/SectionBenefits"
import SectionMainCarousel from "@/components/Carousel/SectionMainCarousel"
import CartContainer from "@/components/Cart/Cart.container"
import { HeaderContainer } from "@/components/Header/Header.container"
import SectionCards from "@/components/SectionCards/SectionCards"
import SectionFilter from "@/components/SectionFilterProducts/SectionFilter"
import { ShoppingBasket } from "lucide-react"

export default function Page() {
  return (
    <div className="bg-accent flex min-h-screen flex-col ">
      
      <CartContainer
        className="md:hidden fixed bottom-4 right-4 z-50 h-10 w-10 flex items-center justify-center rounded-full! bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        icon={<ShoppingBasket className="size-6" />}
      />

      <HeaderContainer />

      <div className="@container/content flex flex-col items-center justify-center gap-10 px-2 py-8 md:px-8 lg:px-16">

        <SectionMainCarousel />

        <SectionBenefits />

        <SectionCards sectionTitle="Mais Vendidos" />

        <Ads1 />

        <SectionFilter sectionTitle="Filtrar por categoria" />

        <Ads2 />

      </div>

    </div>
  )
}
