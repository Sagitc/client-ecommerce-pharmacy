"use client"

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/Modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/userContext";
import CartItem from "./Cart.item";

type Props = {
    className?: string;
    onClick?: () => void;
    icon: React.ReactNode;
}

export default function CartMain({ className, icon }: Props) {

    const user = useUser();
    const userCart = user?.user?.cart;
    const cartItems = userCart?.items || [];

    return (
        <Sheet>
            <SheetTrigger>
                <Button className={className} variant="ghost" size="icon-lg">
                    {icon}
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader className="flex flex-col gap-1">

                    <SheetTitle className="text-sm font-bold">CARRINHO!!!</SheetTitle>
                    <SheetDescription className="text-sm font-light">{cartItems.length} itens</SheetDescription>

                </SheetHeader>

                <CartItem
                    items={cartItems}
                />

                <SheetFooter>
                    <Button type="submit">Finalizar</Button>
                    <SheetClose render={<Button variant="outline">Adicionar mais itens</Button>} />
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}