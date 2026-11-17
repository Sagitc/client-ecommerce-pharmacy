import { useState, MouseEvent } from "react";
import { ProductData } from "@/data/product-data";
import { ProductType } from "@/types/product-type";
import { useFavorites } from "@/hooks/use-favorites";
import { useProductDetail } from "@/hooks/use-product";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { buttonVariants } from "@/components/ui/button";
import { Heart, Plus, Check } from "lucide-react";

type Props = {
    product?: ProductType;
    productId?: number;
    parentStyle?: string;
};

export function ProductCard({ product: propProduct, productId, parentStyle }: Props) {
    const { data: fetchedProduct } = useProductDetail(!propProduct && productId ? productId : 0);
    const staticFallback = !propProduct && !fetchedProduct && productId ? ProductData.find((p) => p.id === productId) : undefined;
    const product = propProduct || fetchedProduct || staticFallback;

    if (!product) {
        return null;
    }

    return (
        <a href={`/product/${product.id}`} target="_self" className={"flex flex-col w-full rounded-lg hover:shadow-lg transition-shadow duration-300 ease-in-out bg-background p-3 dark:bg-gray-800" + " " + parentStyle}>
            
            <div className="relative flex items-center justify-center w-full h-45 sm:h-55 md:h-65 rounded-lg overflow-hidden bg-white shrink-0">
                <ProductFavIcon product={product} />
                
                <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf6OM_2iXA5DFquiB_0p0Vr5_0Kv2XoFloY0pvgU-KBA&s=10" 
                    alt="Produto" 
                    className="w-full h-full object-contain p-4" 
                />
                
                <ProductBuyIcon product={product} />
            </div>

            <div className="flex flex-col flex-1 gap-2 mt-4">
                
                <span className="text-sm line-clamp-2">
                    {product.label}<br />
                    (800x800)
                </span>

                <span className="font-medium text-base pb-2 sm:text-md">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
            </div>
            
        </a>
    )
}

export function ProductFavIcon({ product: propProduct, productId, parentStyle }: Props) {
    
    const { favoriteIds, toggleFavorite } = useFavorites();
    const rawId = propProduct?.id ?? productId;
    const id = rawId !== undefined ? Number(rawId) : 0;

    if (!id) return null;

    const isFavorited = Boolean(favoriteIds.data?.some((favId) => Number(favId) === id));

    const handleFavorite = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        toggleFavorite(id, {
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
            },
            onError: () => {
                toast.error("Não foi possível atualizar os favoritos.");
            },
        });
    };

    return (
        <div
            className={parentStyle || "absolute top-2 left-2 z-10"}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <Tooltip>
                
                <TooltipTrigger
                    onClick={handleFavorite}
                    className={buttonVariants({ variant: "ghost", size: "icon" }) + " p-4"}
                >
                    <Heart 
                        className={`size-5 transition-colors duration-300 ${
                            isFavorited ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
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

function ProductBuyIcon({ product }: { product: ProductType }) {

    const { addToCart } = useCart();
    
    const [showSuccess, setShowSuccess] = useState(false);

    const handleBuy = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addToCart(product, {
            onSuccess: () => {
                setShowSuccess(true);
                
                setTimeout(() => {
                    setShowSuccess(false);
                }, 800);

                toast.success("Adicionado ao carrinho!", {
                    description: "O produto foi adicionado à sua cesta.",
                    duration: 1500,
                    position: "bottom-left",
                    dismissible: true,
                });
            }
        });
    };

    return (
        <div
            className="absolute bottom-2 right-2 z-10"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <Tooltip>
                
                <TooltipTrigger 
                    onClick={handleBuy}
                    disabled={showSuccess}
                    className={buttonVariants({ variant: "ghost", size: "icon" }) + ` rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background transition-colors ${
                        showSuccess 
                            ? "bg-green-600 hover:bg-green-700 text-white" 
                            : "bg-primary! text-primary-foreground hover:bg-primary/90"
                    }`}
                >
                    {showSuccess ? <Check className="size-5" /> : <Plus className="size-5"/>}
                </TooltipTrigger>
                
                <TooltipContent>
                    <p>Adicionar ao carrinho</p>
                </TooltipContent>
                
            </Tooltip>
        </div>
    )
}

// Criar o skeleton do card do produto para exibir enquanto os produtos estão sendo carregados.
export function ProductContainerSkeleton() {}
