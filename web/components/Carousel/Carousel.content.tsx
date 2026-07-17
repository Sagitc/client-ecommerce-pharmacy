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
            className="group relative w-full max-w-6xl mx-auto"
            plugins={[autoplayPlugin.current]}
            onMouseEnter={() => autoplayPlugin.current.stop()}
            onMouseLeave={() => autoplayPlugin.current.play()}
        >
            <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                            <Card>
                                {/* Removido 'aspect-video' e adicionado controle de altura responsivo */}
                                <CardContent className="flex h-50 sm:h-70 md:h-87.5 w-full items-center justify-center p-6">
                                    <span className="text-2xl font-semibold text-center">
                                        1920x500 - Tablets+<br/>
                                        800x800 - Mobile<br/><br/>
                                        ({index + 1})

                                        {/* <span className="hidden sm:inline">1920x500 ({index + 1})</span>
                                        <span className="sm:hidden">800x800 ({index + 1})</span> */}
                                    </span>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>

            <CarouselPrevious className="hidden md:inline-flex absolute left-4! opacity-0 transition-opacity duration-300 group-hover:opacity-100 disabled:hidden" />
            
            <CarouselNext className="hidden md:inline-flex absolute right-4! opacity-0 transition-opacity duration-300 group-hover:opacity-100 disabled:hidden" />
        </Carousel>
    )
}