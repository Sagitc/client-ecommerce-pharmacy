import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import ProductContainer from "../ProductCard/Product.container"

type Props = {
  productIds: number[]
}

export function CardsCarousel({ productIds }: Props) {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
        dragFree: true,
      }}
      className="w-full group relative"
    >
      <CarouselContent>
        {productIds.map((productId) => (
          <CarouselItem key={productId} className="basis-[90%] min-[450px]:basis-[45%] md:basis-[30%] lg:basis-[22.5%]">

            <ProductContainer productId={productId} />

            {/* <div className="p-2">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-3xl font-semibold">{productId}</span>
                </CardContent>
              </Card>
            </div> */}

          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="hidden md:inline-flex absolute left-4! opacity-0 transition-opacity duration-300 group-hover:opacity-100 disabled:hidden" />
      
      <CarouselNext className="hidden md:inline-flex absolute right-4! opacity-0 transition-opacity duration-300 group-hover:opacity-100 disabled:hidden" />
    </Carousel>
  )
}