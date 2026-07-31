import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type CategoryCardProps = {
    title: string;
    imageUrl?: string;
    linkUrl: string;
};

export default function CategoryCard({ title, imageUrl, linkUrl }: CategoryCardProps) {
    return (
        <div className="flex flex-col gap-1">
            <div className="w-full h-60 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                {/* <img src="/bannerTeste.jpg" alt={title} className="w-full h-full object-cover" /> INCLUIR IMG DEPOIS*/} 
            </div>
            <Button
                className="flex justify-between w-full text-center text-base py-6 px-4 bg-primary/90 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                onClick={() => window.location.href = linkUrl}
            >
                <span>{title}</span>
                <ArrowRight />
            </Button>
        </div>
    )
}