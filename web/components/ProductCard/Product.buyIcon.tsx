"use client"

import { Heart, Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { toast } from "sonner";

export default function ProductBuyIcon() {

    const handleFavorite = () => {
        toast.success("Adicionado ao carrinho!", {
            description: "O produto foi adicionado ao seu carrinho.",
            duration: 2500,
            position: "bottom-left",
            dismissible: true,
        });
    };

    return (
        <div className="absolute bottom-2 right-2 z-10">
            <Tooltip>
                
                <TooltipTrigger 
                    onClick={handleFavorite}
                    className={buttonVariants({ variant: "ghost", size: "icon" }) + " bg-primary! rounded-lg p-2 text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background"}
                >
                    <Plus className="size-5"/>
                </TooltipTrigger>
                
                <TooltipContent>
                    <p>Adicionar ao carrinho</p>
                </TooltipContent>
                
            </Tooltip>
        </div>
    )
}