"use client"

import { useEffect, useState } from "react";
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
import { Star } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "@base-ui/react";

interface ProductGalleryProps {
    images?: string[];
}

export function ProductView({ images = [] }: ProductGalleryProps) {

    const [zipCode, setZipCode] = useState("");

    const placeholderImages = Array.from({ length: 5 }).map(
        (_, i) => `Imagem ${i + 1}`
    );
    const galleryItems = images.length > 0 ? images : placeholderImages;

    // MAIN IMAGE STATE
    const [selectedImage, setSelectedImage] = useState(galleryItems[0]);

    return (
        <div className="rounded-xl hidden flex-1 justify-center gap-4 md:flex flex-row mt-4">

            {/* CAROUSEL */}
            <div className="flex-1">

                <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center font-bold text-gray-700 transition-all">
                    {selectedImage}
                </div>

                <Carousel
                    opts={{
                        dragFree: true
                    }}
                    className="w-full max-w-48 sm:max-w-xs md:max-w-sm mt-4"
                >
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
                                        <Card
                                            className={`transition-all ${isSelected
                                                ? "border-primary ring-2 ring-primary ring-offset-1"
                                                : "hover:border-secondary"
                                                }`}
                                        >
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
            <div className="flex-1 flex flex-col gap-4">
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
                        <Star className="inline-block w-4 h-4 text-yellow-400 mr-1" />
                        <Star className="inline-block w-4 h-4 text-yellow-400 mr-1" />
                        <Star className="inline-block w-4 h-4 text-yellow-400 mr-1" />
                        <Star className="inline-block w-4 h-4 text-yellow-400 mr-1" />
                        <Star className="inline-block w-4 h-4 text-yellow-400 mr-1" />

                        <span className="text-xs text-muted-foreground ml-2" >4.5 (200 avaliações)</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4 bg-background py-4 px-4 rounded-md">
                    <h3 className="text-lg font-semibold">Descrição</h3>
                    <p className="text-sm text-muted-foreground">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget ultricies nisl nunc eget nisl.
                    </p>
                </div>
            </div>
            <div className="flex-1 flex flex-col gap-4 ">
                <div className="flex justify-between py-4 px-4 rounded-md bg-background border-2 border-primary items-center">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground line-through">R$ 41,57</span>
                        <span className="text-3xl font-bold text-teal-700">R$ 29,90</span>
                        <span className="text-xs text-muted-foreground">à vista no Pix ou 1x no cartão</span>
                    </div>
                    <div>
                        <div className="flex items-center border rounded-md bg-accent">
                            <button
                                type="button"
                                className="px-3 py-1 text-lg font-light hover:bg-muted"
                            >
                                -
                            </button>
                            <span className="px-3 py-1 text-sm font-semibold">1</span>
                            <button
                                type="button"
                                className="px-3 py-1 text-lg font-light hover:bg-muted"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 bg-background py-4 px-4 rounded-md w-full">
                    <h3 className="text-lg font-semibold">Calcule o frete</h3>
                    <div className="flex gap-2">
                        <Input
                            className={"w-full bg-accent px-2 py-2 rounded-md text-sm font-medium text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"}
                            placeholder="00000-000"
                            value={zipCode}
                            maxLength={9}
                            inputMode="numeric"
                            onChange={(e) => setZipCode(e.target.value)}
                        />
                        <Button variant={"default"}>
                            Calcular
                        </Button>
                    </div>

                    <p id="frete-result" className="text-sm font-semibold text-muted-foreground">
                        Frete grátis
                    </p>
                </div>

                <div className="flex flex-col gap-4 bg-background py-4 px-4 rounded-md w-full">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Receba em até 2h</span>
                        <span className="font-bold" >R$ 9,99</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ProductViewMobile({ images = [] }: ProductGalleryProps) {

    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);
    const [prodQuantity, setProdQuantity] = useState(1);
    const [zipCode, setZipCode] = useState("");

    // 5 MOCK IMAGES
    const slides = images.length > 0 ? images : Array.from({ length: 5 });

    useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());

        const onSelect = () => {
            setCurrent(api.selectedScrollSnap());
        };

        api.on("select", onSelect);
        api.on("reInit", onSelect);

        return () => {
            api.off("select", onSelect);
            api.off("reInit", onSelect);
        };
    }, [api]);

    const handleFreteChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const value = e.target.value;
        setZipCode(value);

        // Here you can add logic to calculate shipping based on the zip code
    }

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
                        <Star className="inline-block w-4 h-4 text-yellow-400 mr-1" />
                        <Star className="inline-block w-4 h-4 text-yellow-400 mr-1" />
                        <Star className="inline-block w-4 h-4 text-yellow-400 mr-1" />
                        <Star className="inline-block w-4 h-4 text-yellow-400 mr-1" />
                        <Star className="inline-block w-4 h-4 text-yellow-400 mr-1" />

                        <span className="text-xs text-muted-foreground" >4.5 (200 avaliações)</span>
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
                            className={`rounded-full transition-all duration-300 ${current === index
                                ? "w-2.5 h-2.5 bg-gray-600"
                                : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* PRICE INFO */}
            <div className="flex flex-col gap-4 bg-background py-4 px-4 rounded-md w-full">

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
                        <Button>
                            Comprar agora
                        </Button>
                        <Button variant={"secondary"}>
                            Adicionar ao carrinho
                        </Button>
                    </div>
                </div>

            </div>

            {/* SHIPPING INFO */}
            <div className="flex flex-col gap-4 bg-background py-4 px-4 rounded-md w-full">
                <h3 className="text-lg font-semibold">Calcule o frete</h3>
                <div className="flex gap-2">
                    <Input
                        className={"w-full bg-accent px-2 py-2 rounded-md text-sm font-medium text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"}
                        placeholder="00000-000"
                        value={zipCode}
                        maxLength={9}
                        inputMode="numeric"
                        onChange={(e) => setZipCode(e.target.value)}
                    />
                    <Button variant={"default"}>
                        Calcular
                    </Button>
                </div>

                <p id="frete-result" className="text-sm font-semibold text-muted-foreground">
                    Frete grátis
                </p>


            </div>

            {/* DESCRIPTION */}
            <div className="flex flex-col gap-4 bg-background py-4 px-4 rounded-md w-full">
                <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                <p className="text-sm text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    efficitur, nisl nec ultricies lacinia, nunc nisl aliquam nunc, nec
                    aliquam nisl nunc nec nisl. Sed efficitur, nisl nec ultricies
                    lacinia, nunc nisl aliquam nunc, nec aliquam nisl nunc nec nisl.
                </p>
            </div>

        </div>
    );
}