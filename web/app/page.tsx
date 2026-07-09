import CartBtn from "@/components/cart-btn"
import { HeaderMain } from "@/components/header-main"
import { Button } from "@/components/ui/button"
import { ShoppingBasket } from "lucide-react"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <CartBtn 
        variant="ghost"
        size="icon-lg"
        className="md:hidden fixed bottom-4 right-4 z-50 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        icon={<ShoppingBasket className="size-6" />}
      />
      <HeaderMain />

      
    </div>
  )
}
