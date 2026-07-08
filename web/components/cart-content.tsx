import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";

export default function CartContent() {
    return (
        <SheetContent>
            <SheetHeader>
                <SheetTitle>CARRINHO DE COMPRAS ? </SheetTitle>
                <SheetDescription > This action cannot be undone.</SheetDescription>
            </SheetHeader>
        </SheetContent>
    )
}