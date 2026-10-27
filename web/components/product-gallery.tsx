// web/components/product-gallery.tsx

"use client"

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { ProductFavIcon } from "./product-card";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";

import { ShippingMethodSelector } from "@/components/shipping-selector";

interface ProductGalleryProps {
    images?: string[];
}

// 1. COMPONENTE DA BARRA FLUTUANTE (Usado tanto no Mobile quanto no Desktop)
const FloatingActionBar = ({ isVisible }: { isVisible: boolean }) => (
    <div
        className={`fixed bottom-0 left-0 w-full bg-background border-t shadow-[0_-5px_15px_-3px_rgba(0,0,0,0.1)] z-60 transition-transform duration-300 ease-in-out ${isVisible ? "translate-y-0" : "translate-y-full"
            }`}
    >
        <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="hidden md:flex flex-col">
                <span className="font-semibold text-sm text-foreground">TÍTULO DO PRODUTO</span>
                <span className="text-xs text-muted-foreground">Medicamento • 100mg</span>
            </div>

            <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-8">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground line-through">R$ 41,57</span>
                    <span className="text-xl font-bold text-teal-700">R$ 29,90</span>
                </div>
                <Button size="lg" className=" sm:w-auto px-8 shadow-sm">
                    Comprar
                </Button>
            </div>
        </div>
    </div>
);


export function ProductView({ images = [] }: ProductGalleryProps) {
    const placeholderImages = Array.from({ length: 5 }).map(
        (_, i) => `Imagem ${i + 1}`
    );
    const galleryItems = images.length > 0 ? images : placeholderImages;
    const [prodQuantity, setProdQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(galleryItems[0]);

    // 2. ESTADOS E OBSERVER DO DESKTOP
    const buyCardRef = useRef<HTMLDivElement>(null);
    const [showFloating, setShowFloating] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Só exibe a barra se o bloco de compra NÃO estiver na tela 
                // E se ele já tiver ficado para trás (topo da div menor que 0)
                const isPassed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
                setShowFloating(isPassed);
            },
            {
                threshold: 0,
                rootMargin: "-80px 0px 0px 0px" // Opcional: compensa a altura de um possível header fixo
            }
        );

        if (buyCardRef.current) observer.observe(buyCardRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="rounded-xl hidden flex-1 justify-center gap-4 md:flex flex-row mt-4 items-start">
            {/* CAROUSEL */}
            <div className="flex-1 sticky top-20">
                <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center font-bold text-gray-700 transition-all">
                    {selectedImage}
                </div>
                <Carousel opts={{ dragFree: true }} className="w-full max-w-48 sm:max-w-xs md:max-w-sm mt-4">
                    <CarouselContent className="-ml-1">
                        {galleryItems.map((img, index) => {
                            const isSelected = selectedImage === img;
                            return (
                                <CarouselItem
                                    key={index}
                                    className="basis-1/2 pl-1 lg:basis-1/3 cursor-pointer"
                                    onClick={() => setSelectedImage(img)}
                                >
                                    <div className="p-1">
                                        <Card className={`transition-all ${isSelected ? "border-primary ring-2 ring-primary ring-offset-1" : "hover:border-secondary"}`}>
                                            <CardContent className="flex aspect-square items-center justify-center p-6">
                                                <span className="text-sm font-semibold">{img}</span>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            );
                        })}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>

            {/* PRODUCT INFO */}
            <div className="flex-1 flex flex-col gap-4 sticky top-20">
                <div className="flex flex-col gap-4 bg-background py-4 px-4 rounded-md">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold">TÍTULO DO PRODUTO</h2>
                        <ProductFavIcon productId={1} parentStyle="flex" />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
                        <Badge>Medicamento</Badge>
                        <Badge>Laboratório</Badge>
                        <Badge>Comprimido</Badge>
                        <Badge>100mg</Badge>
                    </div>
                    <div className="flex items-center">
                        <Star className="inline-block w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                        <Star className="inline-block w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                        <Star className="inline-block w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                        <Star className="inline-block w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                        <Star className="inline-block w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                        <span className="text-xs text-muted-foreground ml-2">4.5 (200 avaliações)</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4 bg-background py-4 px-4 rounded-md">
                    <h3 className="text-lg font-semibold">Descrição</h3>
                    <p className="text-sm text-muted-foreground">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget ultricies nisl nunc eget nisl.
                    </p>
                </div>
            </div>

            {/* BUY COLUMN & SHIPPING (Rolagem Livre) */}
            <div className="flex-1 flex flex-col gap-4">

                {/* 3. REF ADICIONADA AO BLOCO DE COMPRA */}
                <div ref={buyCardRef} className="flex flex-col gap-4 py-4 px-4 rounded-md bg-background shadow-sm">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground line-through">R$ 41,57</span>
                            <span className="text-3xl font-bold text-teal-700">R$ 29,90</span>
                            <span className="text-xs text-muted-foreground">à vista no Pix ou 1x no cartão</span>
                        </div>
                        <div>
                            <div className="flex items-center border rounded-md bg-accent">
                                <button
                                    type="button"
                                    onClick={() => setProdQuantity((quantity) => Math.max(1, quantity - 1))}
                                    className="px-3 py-1 text-lg font-light hover:bg-muted"
                                >
                                    -
                                </button>
                                <span className="px-3 py-1 text-sm font-semibold">{prodQuantity}</span>
                                <button
                                    type="button"
                                    onClick={() => setProdQuantity((quantity) => quantity + 1)}
                                    className="px-3 py-1 text-lg font-light hover:bg-muted"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Botões de compra adicionados ao Desktop */}
                    <div className="flex flex-col gap-2 pt-2 border-t border-border">
                        <Button size="lg" className="w-full text-base">
                            Comprar agora
                        </Button>
                        <Button variant="secondary" className="w-full">
                            Adicionar ao carrinho
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-4 bg-background py-4 px-4 rounded-md w-full">
                    <ShippingMethodSelector
                        onSelectDelivery={(quote, cep) => {
                            console.log("Cotação:", quote);
                        }}
                        onSelectPickup={(unit) => {
                            console.log("Retirada:", unit);
                        }}
                    />
                </div>
            </div>

            {/* A barra renderiza condicionalmente pelo estado do Observer */}
            <FloatingActionBar isVisible={showFloating} />
        </div>
    );
}

export function ProductViewMobile({ images = [] }: ProductGalleryProps) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);
    const [prodQuantity, setProdQuantity] = useState(1);

    // 4. ESTADOS E OBSERVER DO MOBILE
    const buyCardRef = useRef<HTMLDivElement>(null);
    const [showFloating, setShowFloating] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Só exibe a barra se o bloco de compra NÃO estiver na tela 
                // E se ele já tiver ficado para trás (topo da div menor que 0)
                const isPassed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
                setShowFloating(isPassed);
            },
            { 
                threshold: 0,
                rootMargin: "-80px 0px 0px 0px" // Opcional: compensa a altura de um possível header fixo
            } 
        );

        if (buyCardRef.current) observer.observe(buyCardRef.current);
        return () => observer.disconnect();
    }, []);

    const slides = images.length > 0 ? images : Array.from({ length: 5 });

    useEffect(() => {
        if (!api) return;
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());

        const onSelect = () => setCurrent(api.selectedScrollSnap());
        api.on("select", onSelect);
        api.on("reInit", onSelect);

        return () => {
            api.off("select", onSelect);
            api.off("reInit", onSelect);
        };
    }, [api]);

    return (
        <div className="flex flex-col items-center justify-center gap-4 md:hidden">
            {/* PRODUCT INFO */}
            <div className="flex flex-col gap-4 bg-background py-4 px-4 rounded-md w-full">
                <h2 className="text-2xl font-semibold">TÍTULO DO PRODUTO</h2>
                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
                    <Badge>Medicamento</Badge>
                    <Badge>Laboratório</Badge>
                    <Badge>Comprimido</Badge>
                    <Badge>100mg</Badge>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <Star className="inline-block w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                        <Star className="inline-block w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                        <Star className="inline-block w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                        <Star className="inline-block w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                        <Star className="inline-block w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                        <span className="text-xs text-muted-foreground">4.5 (200 avaliações)</span>
                    </div>
                    <ProductFavIcon productId={1} parentStyle="flex" />
                </div>
            </div>

            {/* CAROUSEL */}
            <div className="w-full flex flex-col items-center gap-4 mb-2">
                <Carousel setApi={setApi} className="w-full">
                    <CarouselContent>
                        {slides.map((_, index) => (
                            <CarouselItem key={index} className="basis-full">
                                <div className="w-full aspect-square flex items-center justify-center p-2">
                                    <div className="w-full h-full bg-gray-50 rounded-2xl flex items-center justify-center text-3xl font-semibold text-gray-500 border border-gray-100 shadow-sm">
                                        {index + 1}
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                {/* DOTS */}
                <div className="flex justify-center items-center gap-2">
                    {Array.from({ length: count }).map((_, index) => (
                        <button
                            key={index}
                            aria-label={`Ir para a imagem ${index + 1}`}
                            onClick={() => api?.scrollTo(index)}
                            className={`rounded-full transition-all duration-300 ${current === index ? "w-2.5 h-2.5 bg-gray-600" : "w-2 h-2 bg-gray-300 hover:bg-gray-400"}`}
                        />
                    ))}
                </div>
            </div>

            {/* 5. REF ADICIONADA AO BLOCO DE COMPRA MOBILE */}
            <div ref={buyCardRef} className="flex flex-col gap-4 bg-background py-4 px-4 rounded-md w-full border-2 border-primary/20">
                <div className="flex flex-col gap-4 rounded-md">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground line-through">R$ 41,57</span>
                            <span className="text-3xl font-bold text-teal-700">R$ 29,90</span>
                            <span className="text-xs text-muted-foreground">à vista no Pix ou 1x no cartão</span>
                        </div>
                        <div>
                            <div className="flex items-center border rounded-md bg-accent">
                                <button
                                    type="button"
                                    onClick={() => setProdQuantity(Math.max(1, prodQuantity - 1))}
                                    className="px-3 py-1 text-lg font-light hover:bg-muted"
                                >
                                    -
                                </button>
                                <span className="px-3 py-1 text-sm font-semibold">{prodQuantity}</span>
                                <button
                                    type="button"
                                    onClick={() => setProdQuantity(prodQuantity + 1)}
                                    className="px-3 py-1 text-lg font-light hover:bg-muted"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button size="lg" className="w-full text-base">
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Comprar agora
                        </Button>
                        <Button variant="secondary">
                            Adicionar ao carrinho
                        </Button>
                    </div>
                </div>
            </div>

            {/* SHIPPING INFO E DESCRIÇÃO */}
            <div className="flex flex-col gap-4 bg-background py-4 px-4 rounded-md w-full">
                <ShippingMethodSelector
                    onSelectDelivery={(quote, cep) => {
                        console.log("Cotação:", quote);
                    }}
                    onSelectPickup={(unit) => {
                        console.log("Retirada:", unit);
                    }}
                />
            </div>

            <div className="flex flex-col gap-4 bg-background py-4 px-4 rounded-md w-full">
                <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                <p className="text-sm text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed efficitur, nisl nec ultricies lacinia, nunc nisl aliquam nunc, nec aliquam nisl nunc nec nisl.
                </p>
            </div>

            <FloatingActionBar isVisible={showFloating} />
        </div>
    );
}