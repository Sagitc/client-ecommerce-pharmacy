import {
  SecDefault,
  SecHero,
  SecAdvantages,
  SecMostSell,
  SecFilterProd,
  SecLaboratory,
  SecCare,
  SecForYou,
  SecNews,
} from "@/components/content/section-items"
import {
  Ads1,
  Ads2,
  Ads3
} from "@/components/advertisement-items"
import Cart from "@/components/cart"
import Header from "@/components/header"
import { ShoppingBasket } from "lucide-react"

export default function Page() {
  return (
    <div className="bg-accent flex min-h-screen flex-col ">


      <div className="@container/content flex flex-col items-center justify-center gap-20 px-2 py-8 md:px-8 lg:px-0 relative">

        <Cart
          className="md:hidden fixed bottom-4 right-4 z-50 h-10 w-10 flex items-center justify-center rounded-full! bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          icon={<ShoppingBasket className="size-6" />}
        />

        <div className="flex flex-col gap-10 w-full">
          <SecHero />
          <SecAdvantages title="Benefícios" />
        </div>

        <SecDefault title="Mais vendidos" filter="most-sell" />

        <Ads1 />

        <SecFilterProd title="Filtrar por categoria" />

        <Ads2 />

        <SecLaboratory title="Desconto de laboratório" />

        <Ads3 />

        <SecCare title="Cuidamos de você" />

      </div>

    </div>
  )
}
