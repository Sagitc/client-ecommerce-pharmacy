import ProductBuyIcon from "@/components/ProductCard/Product.buyIcon";
import ProductFavIcon from "@/components/ProductCard/Product.favIcon";
import { products } from "@/data/Product.data";
import { Product } from "@/types/Product.type";

type Props = {
    productId: number;
};

export default function ProductContainer({ productId }: Props) {

    const productsList: Product[] = products;

    return (
        // O card em si ocupa a largura toda da coluna onde for colocado (w-full)
        <div className="flex flex-col w-full rounded-lg hover:shadow-lg transition-shadow duration-300 ease-in-out bg-background p-3 dark:bg-gray-800">
            
            {/* Altura fixa responsiva no lugar do aspect-square */}
            <div className="relative flex items-center justify-center w-full h-45 sm:h-55 md:h-65 rounded-lg overflow-hidden bg-white shrink-0">
                <ProductFavIcon productId={productId} />
                
                <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf6OM_2iXA5DFquiB_0p0Vr5_0Kv2XoFloY0pvgU-KBA&s=10" 
                    alt="Produto" 
                    className="w-full h-full object-contain p-4" 
                />
                
                <ProductBuyIcon />
            </div>

            <div className="flex flex-col flex-1 justify-between gap-2 mt-4">
                
                {/* Mantivemos a tipografia responsiva e o limite de linhas */}
                <span className="font-bold text-lg sm:text-base line-clamp-2">
                    {productsList[productId - 1]?.label}<br />
                    (800x800)
                </span>

                <span className="font-medium text-base sm:text-md">
                    R$ {productsList[productId - 1]?.price.toFixed(2).replace('.', ',')}
                </span>
            </div>
            
        </div>
    )
}