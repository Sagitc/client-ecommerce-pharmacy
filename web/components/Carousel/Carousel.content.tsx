"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export default function CarouselArea() {
    const autoplayPlugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: false })
    )

    return (
        <Carousel 
            className="group relative w-full"
            plugins={[autoplayPlugin.current]}
            onMouseEnter={() => autoplayPlugin.current.stop()}
            onMouseLeave={() => autoplayPlugin.current.play()}
        >
            <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex aspect-video items-center justify-center p-6">
                                    <span className="text-4xl font-semibold">{index + 1}</span>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>

            <CarouselPrevious className="hidden md:inline-flex absolute left-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <CarouselNext className="hidden md:inline-flex absolute right-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Carousel>
    )
}