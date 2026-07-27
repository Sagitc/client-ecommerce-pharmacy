"use client"

import { Heart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button"; 
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner"; 
import { useFavorites } from "@/hooks/use-favorites";

type Props = {
    productId: number;
}

export default function ProductFavIcon({ productId }: Props) {
    
    // 2. Consome o estado global e a função de mutação do React Query
    const { favoriteIds, toggleFavorite } = useFavorites();
    const favoriteProducts = favoriteIds.data || []; // Obtém a lista de IDs de produtos favoritos do estado global
    
    // 3. Checa se o ID deste produto está na lista de favoritos
    const isFavorited = favoriteProducts.includes(productId);

    const handleFavorite = () => {
        toggleFavorite(productId, {
            onSuccess: (data) => {
                
                if (data.isFavorited) {
                    toast.success("Adicionado aos favoritos!", {
                        description: "O produto foi salvo na sua lista.",
                        duration: 2500,
                        position: "bottom-left",
                        dismissible: true,
                    });
                } else {
                    toast.info("Removido dos favoritos.", {
                        description: "O produto foi retirado da sua lista.",
                        duration: 2500,
                        position: "bottom-left",
                        dismissible: true,
                    });
                }
            }
        });
    };

    return (
        <div className="absolute top-2 left-2 z-10">
            <Tooltip>
                
                <TooltipTrigger 
                    onClick={handleFavorite}
                    className={buttonVariants({ variant: "ghost", size: "icon" }) + " p-4"}
                >
                    <Heart 
                        className={`size-5 transition-colors duration-300 ${
                            isFavorited ? "fill-red-500 text-red-500" : "text-foreground"
                        }`} 
                    />
                </TooltipTrigger>
                
                <TooltipContent>
                    <p>{isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}</p>
                </TooltipContent>
                
            </Tooltip>
        </div>
    )
}