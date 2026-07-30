"use client";

import { ReactNode } from "react";
import { ProductData } from "@/data/product-data";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { CartItemType } from "@/types/cart-type";
import { 
    Sheet, 
    SheetClose, 
    SheetContent, 
    SheetDescription, 
    SheetFooter, 
    SheetHeader, 
    SheetTitle, 
    SheetTrigger 
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ShoppingBasket, Trash } from "lucide-react";

type CartItemProps = {
    item: CartItemType;
    onRemove: (id: number) => void;
};

type CartProps = {
    className?: string;
    onClick?: () => void;
    icon: ReactNode;
};

function CartItem({ item, onRemove }: CartItemProps) {
    return (
        <div key={item.id} className="flex flex-row gap-3 items-center">
            <img
                src={item.image ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf6OM_2iXA5DFquiB_0p0Vr5_0Kv2XoFloY0pvgU-KBA&s=10"}
                alt={item.label}
                className="w-16 h-16 rounded-md object-cover shrink-0"
            />

            <div className="flex-1 flex flex-col gap-2 min-w-0">
                <span className="text-sm line-clamp-2 overflow-hidden">
                    {item.label}
                </span>
                <span className="text-xs font-medium">
                    R$ {(item.price).toFixed(2).replace('.', ',')}
                    <span className="font-light text-xs text-muted-foreground"> - {item.quantity}un</span>
                </span>
            </div>

            <div>
                <Tooltip>
                    <TooltipTrigger
                        onClick={() => onRemove(item.id)}
                        className={buttonVariants({ variant: "ghost", size: "icon" }) + " p-2 text-destructive hover:text-destructive/80"}
                    >
                        <Trash className="size-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Remover produto</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    );
}

export default function Cart({ className, icon }: CartProps) {

    const { cart, removeFromCart } = useCart();
    const cartData = cart.data || [];

    const cartItems: CartItemType[] = (cartData as Array<{ id: number; quantity: number }>)
        .flatMap((cartItem) => {

            const product = ProductData.find((p) => p.id === cartItem.id);

            if (!product) return [];

            return [{
                id: product.id,
                label: product.label,
                fabricator: product.fabricator,
                price: product.price,
                // Trocamos null por undefined, que é melhor aceito em propriedades opcionais do TS
                image: (product as any).image ?? undefined,
                promotionPrice: (product as any).promotionPrice ?? undefined,
                quantity: cartItem.quantity,
            }];
        });
    
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalProducts = cartData.length;

    return (
        <Sheet>
            <SheetTrigger
                className={cn(buttonVariants({ variant: "ghost", size: "icon-lg" }), "relative", className)}
            >
                {icon}

                {totalProducts > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold">
                        {totalProducts}
                    </span>
                )}
            </SheetTrigger>

            <SheetContent className="flex flex-col px-4">
                <SheetHeader className="flex flex-col gap-1 px-0">
                    <SheetTitle className="text-lg font-bold">Cesta de produtos</SheetTitle>
                    <SheetDescription className="text-sm font-light">
                        {totalQuantity === 1 ? "1 item" : `${totalQuantity} itens`}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 flex flex-col gap-4">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col h-full items-center justify-center py-10 gap-2 max-h-[60vh]">
                            <ShoppingBasket className="size-12 text-muted-foreground opacity-20" />
                            <p className="text-sm font-light text-muted-foreground">Sua cesta está vazia</p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="no-scrollbar overflow-y-auto max-h-[60vh]">
                                <CartItem  item={item} onRemove={removeFromCart} />
                            </div>
                        ))
                    )}
                </div>

                <div className="border-t border-border pt-4 flex flex-col gap-4">
                    {cartItems.length > 0 && (
                        <div className="flex justify-between items-center text-base">
                            <span className="font-semibold">Subtotal:</span>
                            <span className="text-sm">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                        </div>
                    )}

                    <SheetFooter className="flex flex-col gap-2 px-0 sm:flex-col">
                        <Button className="py-4 w-full" type="submit" disabled={cartItems.length === 0}>
                            Finalizar compra
                        </Button>
                        <SheetClose className={buttonVariants({ variant: "outline", size: "default" }) + " w-full"}>
                            Continuar comprando
                        </SheetClose>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}