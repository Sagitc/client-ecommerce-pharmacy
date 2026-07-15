import CartMain from "@/components/Cart/Index"
import { HeaderMain } from "@/components/Header/Index"
import { ShoppingBasket } from "lucide-react"

export default function Page() {
  return (
    <div className="bg-accent  flex min-h-screen flex-col">
      
      <CartMain
        className="md:hidden fixed bottom-4 right-4 z-50 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        icon={<ShoppingBasket className="size-6" />}
      />
      <HeaderMain />


    </div>
  )
}
