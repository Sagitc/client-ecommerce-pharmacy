"use client";

import { ReactNode } from "react";
import { SecCarousel } from "./content/section-components";
import { CarouselItem } from "./ui/carousel";

type AdsImageProps = {
    linkUrl?: string;
    imageUrl?: string;
    altText?: string;
    parentStyle?: string;
    childrenStyle?: string;
}

const defaultStyles = "w-full max-w-6xl mx-auto "
const imageTeste = "/bannerTeste.jpg"


function AdsBanner({ linkUrl, imageUrl, altText, parentStyle, childrenStyle}: AdsImageProps) {

    return (
        <div
            className={`bg-gray-200 dark:bg-gray-700 rounded-lg w-full overflow-hidden ${parentStyle ?? ""}`}
            onClick={() => { linkUrl ? window.open(linkUrl, "_blank") : window.open('#', "_blank") }}
        >
            {imageUrl ? 
                <img src={imageUrl} alt={altText} className={` object-contain ${childrenStyle ?? "w-full h-full"}`}/>
                :
                <div className={`flex items-center justify-center cursor-pointer ${childrenStyle ?? "w-full h-full"}`}>
                    <span className="">Propaganda</span>    
                </div>
            }
        </div>
    )
}

export function Ads1() {
    return (
        <section className={defaultStyles + "h-50 flex gap-4"}>
            <AdsBanner
                linkUrl="#"
                altText="Anúncio 1"

            />
        </section>
    )
}

export function Ads2() {
    return (
        <section className={defaultStyles + "h-80 grid grid-cols-1 md:grid-cols-2 gap-4"}>
            <AdsBanner
                linkUrl="#"
                altText="Anúncio 1"
            />
            <AdsBanner
                linkUrl="#"
                altText="Anúncio 2"
            />
        </section>
    )
}

export function Ads3() {
    const defaultStyles = "w-full max-w-6xl mx-auto ";

    return (
        <section className={defaultStyles + ""}>
            <SecCarousel
                loop={false}
                children={
                    Array.from({ length: 6 }).map((_, index) => (
                        <CarouselItem key={index} className="rounded-lg basis-[45%] min-[500px]:basis-[45%] md:basis-[35%] lg:basis-1/6">
                            <AdsBanner
                                key={index}
                                altText={`Anúncio ${index + 1}`}
                                parentStyle="h-40 md:h-60" 
                            />
                        </CarouselItem>
                    ))
                }
            />
        </section>
    );
}

export function Ads4() {

}