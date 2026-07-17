"use client"

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/Modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { useUser } from "@/contexts/userContext";
import CartItem from "./Cart.item";
import { ReactNode } from "react";

type Props = {
    className?: string;
    onClick?: () => void;
    icon: ReactNode;
}

export default function CartMain({ className, icon }: Props) {

    const user = useUser();
    const userCart = user?.user?.cart;
    const cartItems = userCart?.items || [];

    return (
        <Sheet>
            <SheetTrigger
                    className={`${buttonVariants({ variant: "ghost", size: "icon-lg" })} ${className}`}
            >
                {icon}
            </SheetTrigger>
            <SheetContent>
                <SheetHeader className="flex flex-col gap-1">

                    <SheetTitle className="text-lg font-bold">Cesta de produtos</SheetTitle>
                    <SheetDescription className="text-sm font-light">{cartItems.length} itens</SheetDescription>

                </SheetHeader>

                <CartItem
                    items={cartItems}
                />

                <SheetFooter>
                    <Button className="py-4" type="submit">Comprar</Button>
                    <SheetClose render={<Button variant="outline">Adicionar mais itens</Button>} />
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}