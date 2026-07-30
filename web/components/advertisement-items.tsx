type AdsImageProps = {
    linkUrl: string;
    imageUrl?: string;
    altText: string;
    className?: string;
};

const defaultStyles = "w-full max-w-6xl mx-auto "

function AdsBanner({ linkUrl, imageUrl, altText, className }: AdsImageProps) {
    return (
        <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center ${className}`}
        >
            { imageUrl ? 
                <img src={imageUrl} alt={altText} className="max-h-full max-w-full object-contain" /> : 
                <span className="text-lg text-center font-semibold text-gray-500 dark:text-gray-400">Promocional</span> 
            }
        </a>
    );
}

export function Ads1() {
    return (
        <section className={defaultStyles + "flex flex-col gap-4"}>
            <AdsBanner 
                linkUrl="#"
                altText="Anúncio 1"
            />
        </section>
    )
}

export function Ads2() {
    return (
        <section className={defaultStyles + "grid grid-cols-1 md:grid-cols-2 gap-4"}>
            <AdsBanner 
                linkUrl="#"
                altText="Anúncio 1"
            />
            <AdsBanner 
                linkUrl="#"
                altText="Anúncio 1"
            />
        </section>
    )   
}

export function Ads3() {
    return (
        <section className={defaultStyles + "flex flex-col gap-4"}>
            <AdsBanner 
                linkUrl="#"
                altText="Anúncio 1"
            />
        </section>
    )
}