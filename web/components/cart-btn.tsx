import { ShoppingBasket, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import CartContent from "@/components/cart-content";
import { ReactNode } from "react";

type Props = {
    className?: string;
    variant: "default" | "secondary" | "ghost" | "link" | "destructive";
    size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
    icon?: ReactNode;
}

export default function CartBtn({ className, variant, size, icon }: Props) {
    return (
        <Sheet >
            <SheetTrigger>
                <Button
                    size={size || "icon"}
                    className={className}
                    variant={variant}
                >
                    {icon || <ShoppingCart className="size-5" />}
                </Button>
            </SheetTrigger>
            <SheetContent>
            <SheetHeader>
                <SheetTitle>CARRINHO DE COMPRAS ? </SheetTitle>
                <SheetDescription > This action cannot be undone.</SheetDescription>
            </SheetHeader>
        </SheetContent>
        </Sheet>
    )
}