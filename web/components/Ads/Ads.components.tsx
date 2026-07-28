type AdsImageProps = {
    linkUrl: string;
    imageUrl: string;
    altText: string;
    className?: string;
};

export function AdsCard({ linkUrl, imageUrl, altText, className }: AdsImageProps) {
    return (
        <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center ${className}`}
        >
            <img src={imageUrl} alt={altText} className="max-h-full max-w-full object-contain" />
        </a>
    );
}

export function AdsBanner({ linkUrl, imageUrl, altText, className }: AdsImageProps) {
    return (
        <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center ${className}`}
        >
            <img src={imageUrl} alt={altText} className="max-h-full max-w-full object-contain" />
        </a>
    );
}
